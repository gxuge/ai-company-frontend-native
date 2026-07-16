# admin-chat SSE 迁移计划

## 背景
- 目标页面：`/pages/admin-chat`
- 目标：接入基于 SSE 的 agent 流式事件，补齐“正在思考”样式与状态机处理
- 边界：不破坏现有页面布局，只补充流式封装、状态管理与展示组件

## 任务拆分
| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 计划与日志 | 已完成 | 创建迁移计划与修改日志文件 | `docs/plan/plan.md`、`docs/changelog/changelog.md` |
| T2 通用 SSE 封装 | 已完成 | 新增 fetch stream 读取、SSE 解析、agent 事件 reducer | `src/lib/api/stream.ts`、`src/lib/api/ts-agent-chat-stream.ts` |
| T3 思考面板组件 | 已完成 | 实现“正在思考”样式与步骤展示 | `src/components/pages/admin-chat/admin-chat-thinking-panel.tsx` |
| T4 admin-chat 接入 | 已完成 | 页面接入流式状态机与 fallback 逻辑，流式与同步共用 `/sys/ts-agent-chat-sessions/ai-reply`；无可用会话时先空白进入，首条消息再懒创建 session | `src/app/pages/admin-chat/index.tsx`、`src/lib/api/ts-agent-chat.ts` |
| T5 验证与文档 | 已完成 | 补架构说明、记录验证结果 | `docs/frontend-architecture-overview.md`、`docs/changelog/changelog.md` |
| T6 Tool 选项交互 | 已完成 | 识别 `tool.end + contentType=options`，展示 `question` 与动态快捷选项 | reducer 模拟验证通过；`src/lib/api/ts-agent-chat-stream.ts`、`src/app/pages/admin-chat/index.tsx` |
| T7 Confirm 选项交互 | 已完成 | 识别 `confirm.start`，复用现有隐藏选项组件并回传 `optionValue` | reducer 模拟通过；`src/lib/api/ts-agent-chat-stream.ts`、`src/lib/api/ts-agent-chat.ts`、`src/app/pages/admin-chat/index.tsx` |

## 风险与回退
- 风险：后端流式与同步共用同一路径，调试时要注意请求体里的 `stream=true`
- 回退：在页面中保留原有 `createAiReply` 一次性接口作为 fallback
- 风险：SSE 事件字段与前端预期不完全一致
- 回退：解析器对 `content / status / data` 做宽松兼容，并保留原始 raw 便于调试

## 验收标准
- 页面可在 SSE 可用时展示 agent / llm / tool 的流式状态
- `llm.error` 不会覆盖已存在的失败状态
- `agent.end` 作为整轮完成标记
- `tool.end` 的 `contentType=options` 能展示后端下发的 `question/options`
- `confirm.start` 能复用同一选项组件展示 `{label, optionValue}` 选项
- 快捷按钮数量严格跟随 `options` 数组，点击后发送选项文案并在请求中回传 `optionValue`
- 现有页面布局不被破坏
- SSE 不可用时会自动回退到原有一次性回复接口

## 角色开场白单字段生成

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 模式字段对齐 | 已完成 | 开场白优化模式由 `intro_optimize` 调整为 `greeting_optimize` | `src/lib/api/ts-role.ts` |
| T2 页面调用对齐 | 已完成 | 创建角色页使用后端新增的 `greeting_optimize` 模式 | `src/components/pages/create-role/create-character.tsx` |
| T3 UI 保护 | 已完成 | 仅调整请求字段值，未改动页面布局和样式 | `git diff --check` |

## 创建角色页美化按钮联调

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 调用链核对 | 已完成 | 背景设定与开场白按钮均已绑定 `generateRoleSetting` | `src/components/pages/create-role/basic-info.tsx`、`src/components/pages/create-role/create-character.tsx` |
| T2 交互与字段收紧 | 已完成 | 两个请求互斥执行；开场白只读取 `greeting`，背景只读取 `backgroundStory` | `src/components/pages/create-role/create-character.tsx` |
| T3 UI 保护 | 已完成 | 仅调整请求和状态逻辑，不改布局与样式 | `git diff --check` |

## admin-chat 新会话本地问候

### 背景
- 目标：每次进入无历史的新会话时，立即显示一条可爱活跃的角色故事生成问候。
- 边界：问候只存在于前端消息状态，不调用 SSE 或回复接口，不写入数据库。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 本地消息模型 | 已完成 | 增加 `localOnly` 标记和固定本地问候消息 | `src/app/pages/admin-chat/index.tsx` |
| T2 会话接入 | 已完成 | 所有会话均在历史消息顶部显示本地问候，新建和空会话同样显示 | `src/app/pages/admin-chat/index.tsx` |
| T3 多语言资源 | 已完成 | 简中、繁中、英文、日文、阿拉伯文增加问候 | `src/locales/*/admin-chat.json` |
| T4 验证 | 已完成 | 相关 TypeScript、翻译键、diff、编码及请求隔离检查通过 | 命令验证；`docs/changelog/changelog.md` |

### 风险与回退
- 风险：问候不入库，因此每次进入会话都由前端重新生成。
- 预期行为：无论会话是否存在真实历史，问候始终作为消息列表第一条显示，数据库历史紧随其后。

### 验收标准
- 新建、空会话和有历史的旧会话均在顶部显示一条问候。
- 每个消息列表只插入一条本地问候。
- 问候不出现在 `createAiReply` 或 SSE 请求体中。
- 不修改现有聊天气泡布局与样式。

## admin-chat Web 悬停状态修复

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 根因定位 | 已完成 | Web 化输入框改动删除了 `menuHovered` 状态，但顶部图标仍在读取 | `src/app/pages/admin-chat/index.tsx` |
| T2 Web 修复 | 已完成 | 删除 `menuHovered` 状态依赖，改用纯 HTML 菜单按钮和 DOM 悬停切图，不回退 HTML `textarea` | `src/app/pages/admin-chat/index.tsx` |
| T3 验证 | 已完成 | TypeScript、Babel Web 转译、旧变量零残留及 diff 检查通过 | 命令验证 |

## admin-chat 输入栏两态布局

### 背景
- 安静模式：输入为空且未聚焦时，语音、单行输入框、加号保持同一行。
- 输入模式：聚焦或已有内容时，文本框独占第一行并自动增高，语音与加号位于第二行。
- 回弹：发送后清空并失焦；清空内容后点击空白处也恢复安静模式。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 状态梳理 | 已完成 | 展开条件统一为“聚焦或存在非空内容” | `src/app/pages/admin-chat/index.tsx` |
| T2 两态布局 | 已完成 | 同一文本框通过网格位置在安静单行和输入双层布局间切换 | `src/app/pages/admin-chat/index.tsx` |
| T3 回弹与验证 | 已完成 | 发送主动失焦并关闭附件面板；清空失焦恢复单行；代码级检查通过 | TypeScript、Babel Web 转译、状态断言、diff 检查 |

## chat 输入栏两态布局

### 背景
- 复用 admin-chat 的安静模式、输入模式和发送回弹规则。
- 保留 chat 输入栏已有的语音/键盘、括号、候选回复和附件按钮。
- 只做代码级验证，不进行浏览器互动。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 状态与按钮梳理 | 已完成 | 输入栏由独立 `ChatInput` 组件负责，父页面持有文本和发送状态 | `src/app/pages/chat/components/chat-input/index.tsx`、`src/app/pages/chat/index.tsx` |
| T2 两态布局 | 已完成 | 空闲时单行，聚焦或有内容时文本框第一排、全部按钮第二排 | `src/app/pages/chat/components/chat-input/index.tsx`、`styles.ts` |
| T3 回弹与验证 | 已完成 | 发送失焦并关闭附件区，父页面清空后回弹；自动增高和原按钮逻辑检查通过 | 语法、Babel Web 转译、定向 ESLint、状态断言、diff 检查 |

## chat 输入栏发送图标切换

### 条件
- 仅当输入框已聚焦并且存在非空文字时，原加号位置切换为发送图标。
- 聚焦但为空、失焦但有文字以及普通空闲状态均继续显示加号。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 图标资源 | 已完成 | 新增 chat 与 admin-chat 共用的发送图标 | `src/assets/images/chat/chat-input/send.svg` |
| T2 admin-chat 接入 | 已完成 | 仅在聚焦且有文字时切换发送按钮，否则保持附件加号 | `src/app/pages/admin-chat/index.tsx` |
| T3 chat 接入 | 已完成 | Web 与 Native 使用相同严格条件切换按钮职责 | `src/app/pages/chat/components/chat-input/index.tsx` |
| T4 代码验证 | 已完成 | 语法、Babel Web 转译、ChatInput 定向 ESLint、状态断言与编码检查通过 | 命令验证 |

## create-story 章节开场白角色单选

### 背景
- 目标：章节式剧情大纲的“开场白”可从页面顶部已添加角色中单选开场角色。
- 边界：复用 `/pages/select-role`，不新增后端接口，不修改现有页面布局。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 返回链路与候选范围 | 已完成 | 补齐创建故事页角色返回监听，章节模式仅接收顶部已选角色 ID | `src/app/pages/create-story/index.tsx`、`src/app/pages/select-role/index.tsx` |
| T2 章节单选与名称回显 | 已完成 | 写入 `openingRoleId`，通过顶部角色列表反查并显示角色名 | 定向代码断言通过 |
| T3 删除联动 | 已完成 | 删除顶部角色时清理章节中的无效 `openingRoleId` | `handleRemoveSelectedRole` |
| T4 验证与日志 | 已完成 | TypeScript 语法、Babel Web 转译、新增行 ESLint/TypeScript、diff 与编码检查通过 | 命令验证；`docs/changelog/changelog.md` |

### 风险与回退
- 风险：选择页当前同时承担“添加故事角色”和“选择章节开场角色”，返回事件需要明确区分目标。
- 回退：保留现有 `roleSelected` 事件用于顶部角色添加，章节选择使用独立事件，不改变其他入口行为。

### 验收标准
- 顶部角色列表为空时点击章节“选择角色”只显示提示，不跳转。
- 候选列表严格限制为顶部已选择角色，且只能单选。
- 已选择时显示具体角色名，再次点击可重新选择并回显当前项。
- 删除顶部角色后，所有引用该角色的章节恢复为“选择角色”。
- 保存章节时继续通过既有 `openingRoleId` 字段提交。

## chat 输入文字纵向居中

### 背景
- 目标：修正 `/pages/chat` Web 输入框的占位文字和首行输入文字偏上的问题。
- 边界：仅调整文本框内部上下留白，不改变输入栏高度、两态布局或发送逻辑。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 样式调整 | 已完成 | 通过上下各 8px 内边距，让 24px 行高在现有 40px 单行高度中纵向居中 | `src/app/pages/chat/components/chat-input/index.tsx` |
| T2 代码验证 | 已完成 | TypeScript 语法、Babel Web、定向 ESLint和样式断言通过 | 命令验证 |

## admin-chat 发送按钮点击修复

### 背景
- 目标：修复点击发送图标后未发送、按钮职责被失焦状态切换覆盖的问题。
- 边界：保持“聚焦且有文字才显示发送图标”的规则，不改变输入栏布局和附件按钮行为。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 事件链修复 | 已完成 | 在按下阶段锁定发送职责，避免失焦后切换为附件按钮 | `src/app/pages/admin-chat/index.tsx` |
| T2 代码验证 | 已完成 | TypeScript 语法、Babel Web、状态断言通过；全文件 ESLint 仍为既有格式问题 | 命令验证 |
