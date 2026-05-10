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
- 能访问 npm 镜像（脚本中已使用 `https://registry.npmmirror.com`）

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
2. 若前端需要连接后端，请确保前端运行时环境变量（如 `EXPO_PUBLIC_*`）在构建阶段已正确注入。
3. 若你使用反向代理（Nginx/Ingress），建议把外层域名和 HTTPS 放在网关层处理。

