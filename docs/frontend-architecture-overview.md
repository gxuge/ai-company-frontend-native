# Frontend Architecture Overview

更新时间：2026-07-17
项目根目录：`D:\project_demo\ai-company-frontend-native-backup`

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
| `src/hooks/` | 页面级可复用 Hook | `use-agent-chat-stream.ts` 等 |
| `src/lib/api/` | 统一 API 封装层 | `ts-role.ts`、`user.ts`、`def-http.ts`、`stream.ts`、`ts-agent-chat-stream.ts` |
| `src/lib/auth/` | token 存取与认证工具 | access/refresh token 工具函数 |
| `src/lib/i18n/` | 国际化配置 | i18n 初始化、类型定义 |
| `src/assets/images/` | 页面资源图目录（按页面分文件夹） | `role-detail/`、`chat/`、`verification-code-login/` |
| `src/locales/` | 模块化文案翻译资源 | 当前界面注册 `zh-CN/`、`zh-TW/`、`en-US/`、`ja/` |
| `src/global.css` | 全局样式入口 | 通用样式变量/规则 |

## 3. 页面目录对应具体界面（`src/app/pages`）

| 界面 | 路由 | 入口文件 | 样式文件/样式位置 | 当前 API 对接 |
| --- | --- | --- | --- | --- |
| 页面导航 Hub | `/pages` | `src/app/pages/index.tsx` | `StyleSheet.create`（页面内） | 无（用于跳转所有页面） |
| 聊天页 | `/pages/chat` | `src/app/pages/chat/index.tsx` | `chat/components/*/styles.ts`（6个子样式） | 已接 `tsChatApi`/`tsAgentChatApi` 消息、回复建议与语音接口；输入框、功能入口、提示弹窗和前端兜底支持四语言，用户消息和 AI 返回内容保持原文 |
| Agent 聊天页 | `/pages/admin-chat` | `src/app/pages/admin-chat/index.tsx` | 页面内样式 + `assets/images/admin-chat/*` | 已接 Agent 会话历史与 SSE；历史记录按助手消息内的 LLM/Tool 事件顺序还原；`async === true` 的 Tool 按 `eventId` 显示通用异步状态标记；`contentType=image` 的图片 Tool 从 `tool.start` 起使用独立生命周期组件，支持生成中、失败、完成图片、下载及按 `eventId` 幂等保存到图库；结构化错误与固定界面文案支持简中、繁中、英文、日文 |
| System 聊天页 | `/pages/system-chat` | `src/app/pages/system-chat/index.tsx` | 页面内样式 + `assets/images/admin-chat/*` | 复制自原始 `admin-chat` 的简单聊天逻辑，需要显式 `agentSessionId` |
| 快捷登录页 | `/pages/quick-login` | `src/app/pages/quick-login/index.tsx` | 页面内样式 | 暂未直接接业务 API |
| 会话列表页 | `/pages/session-list` | `src/app/pages/session-list/index.tsx` | 页面内样式 | 已接 `tsChatApi.getSessionList`、`getMessageList`；页签、分类、空状态和前端兜底支持四语言 |
| 会话详情页 | `/pages/conversation-detail` | `src/app/pages/conversation-detail/index.tsx` | 页面内样式 + `components/StoryDetailModal.jsx` | 已接会话、故事、章节和角色接口；固定标签、加载状态及详情弹窗支持四语言，故事与章节正文保持原文 |
| 浏览图片页 | `/pages/browse-images-list` | `src/app/pages/browse-images-list/index.tsx` | 页面内样式 + `components/*` | 已接故事/角色公开列表接口；页签、分类、搜索、空状态和错误兜底支持四语言 |
| 我的图库页 | `/pages/my-gallery` | `src/app/pages/my-gallery/index.tsx` | 页面内样式 | 已接 `tsRoleImageApi.getUserImageAssets/deleteUserImageAsset`；通过 `from=create-role/create-story` 复用为角色图片或故事背景图片选择器，固定界面文案支持四语言 |
| 创建角色页 | `/pages/create-role` | `src/app/pages/create-role/index.tsx` | 页面内样式 + `components/basic-info.tsx` 等 | 已接 `tsRoleApi.generateRoleSetting`，支持角色背景与开场白单字段美化 |
| 创建角色人物页 | `/pages/create-character` | `src/app/pages/create-character/index.jsx` | 复用 `src/components/pages/create-character/character-generation-editor.jsx` | 已接 `userApi.uploadFile`；共享编辑器负责提示词、参考图、风格、AI 润色与校验，提交后写入临时 Zustand Store 并跳转生成选择页 |
| 形象生成选择页 | `/pages/generating-select` | `src/app/pages/generating-select/index.tsx` | `AiHeader` + `components/figma-character-screen.tsx` + 共享形象编辑器 | 从 Zustand 读取草稿；每批并发生成最多 4 张，累计上限 12 张；点击编辑在当前页上拉共享编辑器，应用后更新草稿、清空旧候选并重新生成首批 4 张 |
| 验证码登录页 | `/pages/verification-code-login` | `src/app/pages/verification-code-login/index.tsx` | 页面内 style 对象 | 已接 `userApi.phoneLogin` |
| 选择角色页 | `/pages/select-role` | `src/app/pages/select-role/index.tsx` | 页面内样式 | 已接 `tsRoleApi.getRoleList`；支持故事角色添加和章节开场白候选角色单选模式，固定界面文案支持四语言 |
| 角色详情页 | `/pages/role-detail` | `src/app/pages/role-detail/index.tsx` | `role-detail/components/role-detail.styles.ts` | 已接 `tsRoleApi.getRoleDetail`、`tsRoleApi.getRoleAuthorPublic`；标签、加载和前端兜底支持四语言，接口内容保持原文 |
| 创建故事页 | `/pages/create-story` | `src/app/pages/create-story/index.tsx` | 页面内样式 | 已接 `tsStoryApi` 故事与章节接口；章节开场白通过顶部角色列表选择并保存 `openingRoleId`；场景图片复用 `/pages/my-gallery` 选择并保存 `sceneImageUrl` |
| 草稿箱页 | `/pages/draft` | `src/app/pages/draft/index.tsx` | 页面内样式 + `assets/images/draft/*` | 已接统一 `tsDraftApi`；列表直接使用 `content` 渲染角色/故事卡片，支持删除及携带 `draftId` 返回创建页恢复 |
| 创建分页页 | `/pages/create-page` | `src/app/pages/create-page/index.tsx` | 页面内样式 + `components/Icons.tsx` | 已接 `tsDraftApi.getDraftList` 获取草稿总数；支持简中、繁中、英文、日文，并为英文/日文应用防溢出字号 |
| 声音编辑页 | `/pages/sound-edit` | `src/app/pages/sound-edit/index.tsx` | 页面内样式 + `components/edit-sound-text.tsx` | 已接音色接口；界面支持简中、繁中、英文、日文 |
| 通用设置页 | `/pages/general-setting` | `src/app/pages/general-setting/index.tsx` | 页面内样式 + `components/settings-page.tsx` | 设置菜单和退出确认支持四语言 |
| 语言设置页 | `/pages/language-setting` | `src/app/pages/language-setting/index.tsx` | 页面内样式 + `components/language-page.tsx` | 仅展示简中、繁中、英文、日文 |
| 用户设置页 | `/pages/user-setting` | `src/app/pages/user-setting/index.tsx` | 页面内样式 + `components/AccountSettings.tsx` | 用户表单支持四语言 |
| 我的页 | `/pages/mine` | `src/app/pages/mine/index.tsx` | 页面内样式 | 已接用户信息、故事、角色及会话接口；统计标签、作品页签、空状态和头像预览提示支持四语言 |

## 4. API 封装结构（`src/lib/api`）

### 4.1 业务 API（当前可直接对接）

| 文件 | 方法 | HTTP | 端点 | 主要参数 | 返回核心字段 | 当前调用界面 |
| --- | --- | --- | --- | --- | --- | --- |
| `src/lib/api/ts-role.ts` | `getRoleDetail(roleId)` | GET | `/sys/ts-roles/detail` | `id` | `roleName`、`coverUrl`、`introText`、`storyText` 等 | 角色详情页 |
| `src/lib/api/ts-role.ts` | `getRoleAuthorPublic(roleId)` | GET | `/sys/ts-roles/author-public` | `roleId` | `displayName`、`avatar`、`verified`、`bio` | 角色详情页 |
| `src/lib/api/ts-role.ts` | `generateRoleSetting(payload)` | POST | `/sys/ts-roles/one-click-setting` | 角色设定字段、`templateMode` | `backgroundStory`、`greeting` 等 | 创建角色页，`background_optimize` 美化背景，`greeting_optimize` 美化开场白 |
| `src/lib/api/ts-role.ts` | `optimizeImagePrompt(payload)` | POST | `/sys/ts-roles/optimize-image-prompt` | `promptText` | `visualPrompt`、`negativePrompt`、`renderedPrompt`、`snapshotKey` | 角色形象提示词优化，后端按 `role_image_prompt_optimize::v1` 模板渲染 |
| `src/lib/api/ts-role-image.ts` | `importGeneratedImage(payload)` | POST | `/sys/ts-user-image-assets/import` | `sourceImageUrl`、`sourceType`、`sourceKey` | 图片素材、`alreadySaved` | 生成选择页、角色保存、Admin Chat 图片保存 |
| `src/lib/api/ts-image.ts` | `downloadImage(payload)` | POST | `/sys/ts-images/download` | `sourceImageUrl`、可选 `fileName` | 图片 Blob、响应文件名 | Admin Chat 图片下载 |
| `src/lib/api/ts-draft.ts` | `getDraftList/getDraftDetail/createDraft/updateDraft/deleteDraft` | GET/POST/PUT/DELETE | `/sys/ts-drafts` | `draftType`、`draftName`、`sourceId`、`content` | 草稿分页、详情及完整页面状态 | 草稿箱、创建角色页、创建故事页 |
| `src/lib/api/ts-chat.ts` | `getSessionList / getSessionDetail / createSession / createAiReply / createTemplateAiReply / createReplySuggestions` | GET/POST | `/sys/ts-chat-sessions` 及子接口 | 会话、角色、故事、用户输入相关参数 | 会话列表、会话详情、AI 回复、候选建议 | 聊天页 / 我的页 |
| `src/lib/api/ts-agent-chat.ts` | `getSessionList(params)` | GET | `/sys/ts-agent-chat-sessions` | `pageNo`、`pageSize`、`keyword`、`agentCode`、`sessionStatus` | `records`、`total`、`sessionTitle`、`sessionSummary`、`lastMessageAt` 等 | Agent 聊天页/会话列表 |
| `src/lib/api/ts-agent-chat.ts` | `getSessionDetail(sessionId)` | GET | `/sys/ts-agent-chat-sessions/detail` | `id` | `sessionTitle`、`sessionSummary`、`agentCode`、`memoryJson` 等 | Agent 聊天页 |
| `src/lib/api/ts-agent-chat.ts` | `getMessageList(params)` | GET | `/sys/ts-agent-chat-messages` | `sessionId`、`pageNo`、`pageSize`、`roleType`、`messageStatus`、`keyword` | 消息字段及按消息归属的 `events[]` | Agent 聊天页 |
| `src/lib/api/ts-agent-chat.ts` | `createAiReply(payload)` | POST | `/sys/ts-agent-chat-sessions/ai-reply` | `sessionId`、`userInput`、`interactionId`、`optionValue`、`historyCount`、`stream`（可选） | `contentText`、`assistantMessageId`、`promptCode` 等 | Agent 聊天页 |
| `src/lib/api/ts-agent-chat.ts` | `createAiReplyStream(payload, signal?)` | POST | `/sys/ts-agent-chat-sessions/ai-reply` | `sessionId`、`userInput`、`interactionId`、`optionValue`、`historyCount`、`stream=true` | SSE 事件流；确认交互和通用异步 Tool 状态 | Agent 聊天页 |
| `src/lib/api/user.ts` | `phoneLogin(payload)` | POST | `/sys/phoneLogin` | `mobile`、`captcha` | `token`、`refreshToken`、`userInfo` | 验证码登录页 |
| `src/lib/api/user.ts` | `quickLoginByPhone(mobile)` | POST（复用 phoneLogin） | `/sys/phoneLogin` | `mobile`（固定 `captcha=000000`） | 同 `phoneLogin` | 预留（当前页面未直接调用） |
| `src/lib/api/user.ts` | `getUserInfo()` | GET | `/sys/user/getUserInfo` | 无 | `userInfo` | 预留 |

### 4.2 API 基础设施文件（请求链路）

| 文件 | 主要作用 | 关键说明 |
| --- | --- | --- |
| `src/lib/api/def-http.ts` | 请求总入口与拦截器 | 统一 `baseURL=EXPO_PUBLIC_API_URL`，自动添加 token 与 `Accept-Language`，401 后走 `/sys/refreshToken` 刷新；业务失败保留并翻译结构化错误 |
| `src/lib/api/api-error.ts` | 结构化接口错误模型 | 保留 `errorCode`、`errorCategory`、`retryable`、`errorArgs`，兼容普通 Result 与 Axios 错误 |
| `src/lib/api/request.ts` | 对 `defHttp.request` 的轻封装 | 统一泛型调用入口 |
| `src/lib/api/axios.ts` | `VAxios` 类封装 | 支撑 get/post/put/delete 等方法 |
| `src/lib/api/client.tsx` | 原始 axios client | 提供基础 axios 实例 |
| `src/lib/api/http-types.ts` | 请求配置与 transform 类型 | 约束 request options |
| `src/lib/api/http-enum.ts` | 枚举常量 | HTTP 方法、content-type、结果码 |
| `src/lib/api/types.ts` | 返回结果类型 | `ApiResult<T>` 及结构化成功/错误消息字段 |
| `src/lib/api/provider.tsx` | React Query Provider | `queryClient` 统一注入 |
| `src/lib/api/utils.tsx` | 分页/queryKey 等工具 | Query 参数与分页辅助 |
| `src/lib/api/stream.ts` | 通用 SSE 读取封装 | `fetch` + `ReadableStream` + SSE block 解析，自动添加 `Accept-Language`；HTTP 错误解析为结构化 `ApiError` |
| `src/lib/api/ts-agent-chat-stream.ts` | Agent SSE 状态机 reducer | 归并 Agent/LLM/Tool 事件；确认 Tool 提取选项；任意 `async === true` 的 Tool 按 `eventId` 合并状态；实时与历史错误统一保留结构化错误字段 |
| `src/lib/api/index.ts` | API 统一导出 | 页面统一从这里 import |

## 5. 页面与 API 对接矩阵（当前状态）

| 页面 | 已接接口 | 数据映射重点 | 未接/占位说明 |
| --- | --- | --- | --- |
| `role-detail` | `/sys/ts-roles/detail`、`/sys/ts-roles/author-public` | 角色名、封面、作者名、作者头像、认证标识、关于/故事文案 | “连接者/粉丝/对话数”仍为 `--` 占位，不接数量接口 |
| `create-role` | `/sys/ts-roles/one-click-setting` | `background_optimize` 仅回填角色背景，`greeting_optimize` 仅回填开场白 | 两个美化请求互斥执行，保留现有 UI 布局 |
| `admin-chat` | `/sys/ts-agent-chat-sessions/detail`、`/sys/ts-agent-chat-messages`、`/sys/ts-agent-chat-sessions/ai-reply` | 会话标题、摘要、消息列表、用户输入、Agent 回复 | 当前已切换到 Agent 会话链路，不再走旧聊天接口；进入页时先取最近会话，若列表为空则空白进入，首条消息发送时懒创建 session |
| `admin-chat`（流式） | `/sys/ts-agent-chat-sessions/ai-reply`（`stream=true`） | SSE 事件流、Agent/SubAgent/LLM/Tool 片段、确认选项、异步 Tool 状态、图片 Tool | `contentType=options` 显示动态选项；`contentType=image` 读取扁平图片字段并提供下载/保存；保存时映射 `eventId -> sourceKey`、`resourceType -> sourceType`；`async === true` 显示通用 Tool 标记且不展示结果 |
| `system-chat` | `/sys/ts-agent-chat-sessions/detail`、`/sys/ts-agent-chat-messages`、`/sys/ts-agent-chat-sessions/ai-reply` | 简单 Agent 聊天、消息列表、用户输入、AI 回复 | 原始 admin-chat 逻辑的独立复制页 |
| `verification-code-login` | `/sys/phoneLogin` | 手机号+验证码登录，写入 token 后跳转 `/pages/chat` | 验证码发送逻辑目前是前端倒计时模拟 |
| `create-character` / `generating-select` | `/sys/ai-images/generate`、`/sys/ts-user-image-assets/import` | Zustand 临时草稿保存提示词、风格和参考图；生图只返回临时原图；生成选择页点击“完成”或创建角色页最终保存时，才转存图片资产 | Store 不持久化；未确认的候选图不会写入用户图片素材 |
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

