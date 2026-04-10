# Frontend Architecture Overview

更新时间：2026-04-09  
项目根目录：`D:\project_demo\ai-company-frontend-native`

## 1. 项目目录与职责（根目录）

| 目录/文件 | 主要作用 | 对接关注点 |
| --- | --- | --- |
| `src/` | 主业务源码目录 | 页面、组件、状态、API 封装都在这里 |
| `docs/` | 对接规范、Skill、架构说明文档 | 本文档与 hardness 约束文档在此维护 |
| `assets/` | Expo/工程级静态资源 | 与 `src/assets`（业务资源）区分 |
| `scripts/` | 构建/辅助脚本 | 对接时一般不改，仅按需执行 |
| `cli/` | 项目命令行辅助工具 | 非页面对接主路径 |
| `__mocks__/` | 测试 mock 数据与替身 | 联调阶段可用于兜底数据 |
| `.maestro/` | 自动化测试流（Maestro） | 回归验证可补充场景脚本 |
| `.agents/` | Agent/插件相关配置 | 与业务代码解耦 |
| `app.config.ts` / `env.ts` | 应用配置与环境变量入口 | `EXPO_PUBLIC_API_URL` 影响 API baseURL |

## 2. `src` 目录结构与主要作用

| 目录 | 主要作用 | 典型内容 |
| --- | --- | --- |
| `src/app/` | 路由入口与页面注册（expo-router） | `_layout.tsx`、`pages/**` |
| `src/app/pages/` | 具体业务界面目录 | 聊天、角色详情、登录、设置等页面 |
| `src/components/ai-company/` | 业务定制组件库 | `ai-header`、`ai-login-btn`、`ai-input` |
| `src/components/reusables/` | 通用可复用基础组件 | button/input/dialog 等 |
| `src/components/ui/` | UI 原子组件与主题适配 | text/list/modal/checkbox 等 |
| `src/features/auth/` | 业务状态模块（认证） | `use-auth-store.tsx` |
| `src/lib/api/` | 统一 API 封装层 | `ts-role.ts`、`user.ts`、`def-http.ts` |
| `src/lib/auth/` | token 存取与认证工具 | access/refresh token 工具函数 |
| `src/lib/i18n/` | 国际化配置 | i18n 初始化、类型定义 |
| `src/assets/images/` | 页面资源图目录（按页面分文件夹） | `role-detail/`、`chat/`、`verification-code-login/` |
| `src/translations/` | 文案翻译资源 | `en.json`、`ar.json` |
| `src/global.css` | 全局样式入口 | 通用样式变量/规则 |

## 3. 页面目录对应具体界面（`src/app/pages`）

| 界面 | 路由 | 入口文件 | 样式文件/样式位置 | 当前 API 对接 |
| --- | --- | --- | --- | --- |
| 页面导航 Hub | `/pages` | `src/app/pages/index.tsx` | `StyleSheet.create`（页面内） | 无（用于跳转所有页面） |
| 聊天页 | `/pages/chat` | `src/app/pages/chat/index.tsx` | `chat/components/*/styles.ts`（6个子样式） | 暂未直接接业务 API |
| 快捷登录页 | `/pages/quick-login` | `src/app/pages/quick-login/index.tsx` | 页面内样式 | 暂未直接接业务 API |
| 会话列表页 | `/pages/session-list` | `src/app/pages/session-list/index.tsx` | 页面内样式 | 暂未直接接业务 API |
| 会话详情页 | `/pages/conversation-detail` | `src/app/pages/conversation-detail/index.tsx` | 页面内样式 + `components/StoryDetailModal.jsx` | 暂未直接接业务 API |
| 浏览图片页 | `/pages/browse-images-list` | `src/app/pages/browse-images-list/index.tsx` | 页面内样式 + `components/*` | 暂未直接接业务 API |
| 创建角色页 | `/pages/create-role` | `src/app/pages/create-role/index.tsx` | 页面内样式 + `components/basic-info.tsx` 等 | 暂未直接接业务 API |
| 创建角色人物页 | `/pages/create-character` | `src/app/pages/create-character/index.jsx` | 页面内样式 | 暂未直接接业务 API |
| 验证码登录页 | `/pages/verification-code-login` | `src/app/pages/verification-code-login/index.tsx` | 页面内 style 对象 | 已接 `userApi.phoneLogin` |
| 选择角色页 | `/pages/select-role` | `src/app/pages/select-role/index.tsx` | 页面内样式 | 暂未直接接业务 API |
| 角色详情页 | `/pages/role-detail` | `src/app/pages/role-detail/index.tsx` | `role-detail/components/role-detail.styles.ts` | 已接 `tsRoleApi.getRoleDetail`、`tsRoleApi.getRoleAuthorPublic` |
| 创建故事页 | `/pages/create-story` | `src/app/pages/create-story/index.tsx` | 页面内样式 | 暂未直接接业务 API |
| 创建分页页 | `/pages/create-page` | `src/app/pages/create-page/index.tsx` | 页面内样式 + `components/Icons.tsx` | 暂未直接接业务 API |
| 声音编辑页 | `/pages/sound-edit` | `src/app/pages/sound-edit/index.tsx` | 页面内样式 + `components/edit-sound-text.tsx` | 暂未直接接业务 API |
| 通用设置页 | `/pages/general-setting` | `src/app/pages/general-setting/index.tsx` | 页面内样式 + `components/settings-page.tsx` | 暂未直接接业务 API |
| 用户设置页 | `/pages/user-setting` | `src/app/pages/user-setting/index.tsx` | 页面内样式 + `components/AccountSettings.tsx` | 暂未直接接业务 API |
| 我的页 | `/pages/mine` | `src/app/pages/mine/index.tsx` | 页面内样式 | 暂未直接接业务 API |

## 4. API 封装结构（`src/lib/api`）

### 4.1 业务 API（当前可直接对接）

| 文件 | 方法 | HTTP | 端点 | 主要参数 | 返回核心字段 | 当前调用界面 |
| --- | --- | --- | --- | --- | --- | --- |
| `src/lib/api/ts-role.ts` | `getRoleDetail(roleId)` | GET | `/sys/ts-roles/detail` | `id` | `roleName`、`coverUrl`、`introText`、`storyText` 等 | 角色详情页 |
| `src/lib/api/ts-role.ts` | `getRoleAuthorPublic(roleId)` | GET | `/sys/ts-roles/author-public` | `roleId` | `displayName`、`avatar`、`verified`、`bio` | 角色详情页 |
| `src/lib/api/user.ts` | `phoneLogin(payload)` | POST | `/sys/phoneLogin` | `mobile`、`captcha` | `token`、`refreshToken`、`userInfo` | 验证码登录页 |
| `src/lib/api/user.ts` | `quickLoginByPhone(mobile)` | POST（复用 phoneLogin） | `/sys/phoneLogin` | `mobile`（固定 `captcha=000000`） | 同 `phoneLogin` | 预留（当前页面未直接调用） |
| `src/lib/api/user.ts` | `getUserInfo()` | GET | `/sys/user/getUserInfo` | 无 | `userInfo` | 预留 |

### 4.2 API 基础设施文件（请求链路）

| 文件 | 主要作用 | 关键说明 |
| --- | --- | --- |
| `src/lib/api/def-http.ts` | 请求总入口与拦截器 | 统一 `baseURL=EXPO_PUBLIC_API_URL`，自动加 token，401 后走 `/sys/refreshToken` 刷新 |
| `src/lib/api/request.ts` | 对 `defHttp.request` 的轻封装 | 统一泛型调用入口 |
| `src/lib/api/axios.ts` | `VAxios` 类封装 | 支撑 get/post/put/delete 等方法 |
| `src/lib/api/client.tsx` | 原始 axios client | 提供基础 axios 实例 |
| `src/lib/api/http-types.ts` | 请求配置与 transform 类型 | 约束 request options |
| `src/lib/api/http-enum.ts` | 枚举常量 | HTTP 方法、content-type、结果码 |
| `src/lib/api/types.ts` | 返回结果类型 | `ApiResult<T>` 等 |
| `src/lib/api/provider.tsx` | React Query Provider | `queryClient` 统一注入 |
| `src/lib/api/utils.tsx` | 分页/queryKey 等工具 | Query 参数与分页辅助 |
| `src/lib/api/index.ts` | API 统一导出 | 页面统一从这里 import |

## 5. 页面与 API 对接矩阵（当前状态）

| 页面 | 已接接口 | 数据映射重点 | 未接/占位说明 |
| --- | --- | --- | --- |
| `role-detail` | `/sys/ts-roles/detail`、`/sys/ts-roles/author-public` | 角色名、封面、作者名、作者头像、认证标识、关于/故事文案 | “连接者/粉丝/对话数”仍为 `--` 占位，不接数量接口 |
| `verification-code-login` | `/sys/phoneLogin` | 手机号+验证码登录，写入 token 后跳转 `/pages/chat` | 验证码发送逻辑目前是前端倒计时模拟 |
| 其余页面 | 暂无直接 API 调用 | 以静态界面和组件布局为主 | 后续按业务逐页补齐 |

## 6. 对接落地约束（执行时必须遵守）

| 约束项 | 执行要求 |
| --- | --- |
| 统一 API 出口 | 页面层禁止手写 URL，必须走 `src/lib/api/**` |
| UI 布局保护 | 对接时不得修改现有 UI 布局/尺寸/间距/配色/层级 |
| 错误处理 | 请求失败要有页面内文案兜底，不能直接抛空白页 |
| Token 规则 | 默认走 token；公开接口显式 `withToken: false` |
| 导出规范 | 新增 API 后必须在 `src/lib/api/index.ts` 统一导出 |

## 7. 对接定位索引（便于快速查）

- 页面路由总入口：`src/app/pages/index.tsx`  
- 角色详情页面：`src/app/pages/role-detail/index.tsx`  
- 角色详情样式：`src/app/pages/role-detail/components/role-detail.styles.ts`  
- 登录页面：`src/app/pages/verification-code-login/index.tsx`  
- 角色 API：`src/lib/api/ts-role.ts`  
- 用户 API：`src/lib/api/user.ts`  
- 请求拦截器：`src/lib/api/def-http.ts`