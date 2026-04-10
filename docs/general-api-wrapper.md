# 通用 API 封装方式（参考 `src/lib/api/user.ts`）

## 1. 目标

统一前端 API 层写法，做到：
- 类型清晰（请求/响应类型明确）
- 调用一致（统一走 `defHttp`）
- 可切换（本地 mock 与远端请求可快速切换）
- 易维护（按业务域拆分，避免页面直接写请求细节）

## 2. 目录与分层建议

建议在 `src/lib/api` 下保持以下分层：
- `def-http.ts`：统一 HTTP 实例与拦截器
- `*.ts` 业务 API 文件（例如 `user.ts`）
- 页面/业务层只调用 `xxxApi` 暴露的方法，不直接拼 URL

## 3. 参考 `user.ts` 的标准模式

`user.ts` 体现了推荐的封装结构：
1. 定义请求与响应类型
2. 定义可切换开关（如本地登录模式）
3. 拆分远端请求函数（`phoneLoginRemote`）
4. 导出 `xxxApi` 对象统一对外提供方法

示例（精简版）：

```ts
import { defHttp } from './def-http';

export type XxxPayload = {
  a: string;
  b?: string;
};

export type XxxResult = {
  id: string;
  name: string;
};

const LOCAL_MODE = false;

async function fetchRemote(payload: XxxPayload) {
  return defHttp.post<XxxResult>(
    {
      url: '/sys/xxx',
      data: payload,
    },
    { withToken: false },
  );
}

export const xxxApi = {
  async create(payload: XxxPayload) {
    if (LOCAL_MODE) {
      return { id: 'local-id', name: payload.a };
    }
    return fetchRemote(payload);
  },

  async detail(id: string) {
    return defHttp.get<XxxResult>({
      url: '/sys/xxx/detail',
      params: { id },
    });
  },
};
```

## 4. 通用规范（建议作为团队约定）

### 4.1 类型先行

每个 API 文件至少定义：
- `Payload`（请求体）
- `Result`（响应结果）

避免在页面中直接使用 `any`。

### 4.2 统一通过 `defHttp` 发请求

- `GET` 使用 `params`
- `POST/PUT` 使用 `data`
- 泛型明确返回值类型：`defHttp.get<Result>()`

### 4.3 Token 策略显式声明

- 默认带 token（由 `def-http.ts` 统一处理）
- 登录、注册、短信验证码等接口显式设置 `{ withToken: false }`

### 4.4 业务域对象统一导出

使用 `export const userApi = { ... }` 这种对象式导出，避免散落函数。

### 4.5 本地模式能力（可选）

像 `LOCAL_PHONE_LOGIN_MODE` 这种开关建议保留，仅用于：
- 联调前自测
- 后端短时不可用时排查页面逻辑

上线前建议关闭，并通过环境变量控制。

## 5. 新增 API 的推荐模板

新增一个业务域（如 `role.ts`）时，建议按下面顺序实现：
1. 定义 `CreateRolePayload` / `RoleResult` / `RoleListResult`
2. 写远端函数（如 `createRoleRemote`、`listRoleRemote`）
3. 导出 `roleApi` 对象
4. 页面层只调用 `roleApi`，不关心 URL 与 header 细节

## 6. 与当前项目约定对齐点

结合当前 `def-http.ts`，还应遵守：
- 后端成功判定依赖 `success/code`，失败会抛错
- `401` 会自动走刷新 token 重试
- 默认会加时间戳参数防缓存（GET）

因此业务 API 层应保持“薄封装”，把重试、鉴权、错误统一交给底层 `defHttp`。

## 7. 检查清单（提交前）

- 是否已定义请求/响应类型
- 是否统一使用 `defHttp`
- 无 token 接口是否显式 `withToken: false`
- 是否只在 API 层维护 URL
- 页面是否只调用 `xxxApi` 暴露方法