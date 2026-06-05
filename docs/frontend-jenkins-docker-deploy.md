# 前端 Jenkins + Docker 部署说明

本文档基于 `D:\project_demo\react-monorepo\my-turborepo` 的 Jenkins / Docker 思路，已在当前项目完成可落地配置。

## 1. 已改造内容

已新增/修改以下文件：

- `package.json`  
  新增脚本：`build:web:prod`
- `Jenkinsfile`  
  流水线：拉代码 -> 安装依赖 -> 构建 Web 静态产物 -> Docker Compose 部署
- `Dockerfile`  
  使用 `nginx:1.25-alpine` 托管 `dist` 静态文件
- `docker-compose.yml`  
  启动 `web` 服务，默认映射 `${WEB_PORT:-8081}:80`
- `.dockerignore`  
  减少构建上下文，仅保留必要内容（包含 `dist`）
- `deploy/nginx.default.conf`  
  SPA 路由兜底 `try_files ... /index.html`

当前仓库仅保留“静态 Web 构建 + Nginx 托管”这一条服务器部署链路，历史 SSR 相关 Docker / Compose / 文档已移除。

## 2. 打包方式（Web）

当前项目新增了以下命令：

```bash
pnpm run build:web:prod
```

等价执行：

```bash
EXPO_PUBLIC_APP_ENV=production expo export --platform web --output-dir dist
```

构建成功后产物目录为：

```text
dist/
```

## 3. 服务器手工部署（不走 Jenkins）

在项目根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm run build:web:prod
docker compose up -d --build
```

查看状态：

```bash
docker compose ps
docker compose logs -f web
```

默认访问端口：`8081`  
可通过环境变量改端口：

```bash
WEB_PORT=80 docker compose up -d --build
```

## 4. Jenkins 部署流程

### 4.1 Jenkins 节点要求

- 已安装 Docker + Docker Compose（docker compose 插件）
- Jenkins 全局工具中存在 NodeJS：`node-22.19.0`
- 能访问 npm 镜像（脚本中当前使用 `https://registry.npmjs.org`）

### 4.2 Jenkins 任务配置

1. 新建 Pipeline 任务，源码指向本项目仓库分支
2. 使用仓库内 `Jenkinsfile`
3. 保存并执行构建

流水线阶段：

1. `Checkout`
2. `Clean`
3. `Setup`（corepack + pnpm）
4. `Install`
5. `Build Web`
6. `Deploy`（`docker compose up -d --build`）

## 5. 注意事项

1. 这套配置是 **Web/H5 部署**；移动端 APK/IPA 仍走 EAS 构建流程。
2. 当前 Jenkins 默认注入 `EXPO_PUBLIC_API_URL=/jeecg-boot`，因此前端容器内的 Nginx 必须把 `/jeecg-boot/**` 反向代理到同一 Docker 网络中的后端服务 `http://jeecg-boot-system:8080`。
3. 代理到 Docker 服务名时，建议在 Nginx 中使用 `resolver 127.0.0.11` 配合变量 `proxy_pass`，避免前端容器在后端服务暂未完成 DNS 注册时直接启动失败。
4. 若你不走同域代理，而是让前端直接访问后端公网域名，请把 `EXPO_PUBLIC_API_URL` 改成完整后端地址（例如 `https://api.example.com/jeecg-boot`），并同步检查 HTTPS / CORS。
5. 若线上浏览器仍请求 `http://localhost:8080/jeecg-boot`，说明当前静态产物没有吃到 Jenkins 注入值，而是落回了本地 `.env`，需要优先检查构建产物与部署版本。
6. 若你使用外层反向代理（Nginx/Ingress），建议把外层域名和 HTTPS 放在网关层处理，同时保留容器内 `/jeecg-boot` 到后端容器的转发关系。
