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

## create-story 场景图片图库选择

### 背景
- 目标：点击场景图片框进入复用的图片选择列表，选择故事背景图后回填创建故事页。
- 边界：复用 `/pages/my-gallery` 和现有用户图片素材接口，不新增后端端点，不丢失创建页草稿。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 跳转与回填 | 已完成 | 通过 `from=create-story` 进入故事图库模式，并用事件回传图片后返回 | `src/app/pages/create-story/index.tsx`、`src/app/pages/my-gallery/index.tsx` |
| T2 保存与加载 | 已完成 | 将 `sceneImageUrl` 纳入故事详情加载和保存请求 | `src/app/pages/create-story/index.tsx` |
| T3 代码验证 | 已完成 | TypeScript 语法、Babel Web、新增行 ESLint和行为断言通过 | 命令验证 |

### 风险与回退
- 用户图片素材当前没有稳定的“角色/故事”业务类型字段约定，因此故事模式先复用素材全集，不按未知 `sourceType` 强制过滤。
- 回传使用事件加 `router.back()`，避免路由替换导致创建故事页已填写内容重置。

## admin-chat 工具确认协议对齐

### 背景
- 目标：将确认交互由旧 `confirm.start/confirm.end` 事件切换为 `tool.end` 中的确认字段，并在用户选择后回传 `interactionId`。
- 边界：前端不声明、不解析、不保存后端运行控制字段；不修改现有消息气泡和选项按钮布局。

### 字段映射
| 后端 `tool.end` 字段 | 前端用途 |
| --- | --- |
| `contentType=options` | 标识选项类型工具结果 |
| `interactionId` | 随 `optionValue` 回传后端 |
| `question` | 选项上方确认问题 |
| `options[].label/value` | 按钮文案与提交值 |

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 协议解析 | 已完成 | 从 `contentType=options` 且包含有效交互标识和选项的 `tool.end` 构建选项状态 | `src/lib/api/ts-agent-chat-stream.ts` |
| T2 请求回传 | 已完成 | 同步提交 `interactionId` 与 `optionValue`，点击后立即消费当前选项 | `src/lib/api/ts-agent-chat.ts`、`src/app/pages/admin-chat/index.tsx` |
| T3 旧事件清理 | 已完成 | 删除页面对 `confirm.*`、`options.*` 事件的依赖 | `src/lib/api/ts-agent-chat-stream.ts` |
| T4 Confirm 展示 | 已完成 | Confirm Tool 不展示工具卡片，只显示一次正文、确认问题和候选按钮；普通 Tool 卡片保持不变 | `src/app/pages/admin-chat/index.tsx`、`src/components/pages/admin-chat/admin-chat-thinking-panel.tsx` |
| T5 验证 | 已完成 | 10 个状态机测试通过，Babel、diff 和编码检查通过；全仓 TypeScript 检查仍受既有错误阻塞 | `src/lib/api/__tests__/ts-agent-chat-stream.test.ts`、命令验证 |

### 风险与回退
- 普通 `tool.end` 不会生成确认按钮；确认字段缺失时仅保留原工具执行轨迹。
- 点击选项后立即隐藏当前选项，避免重复提交；请求失败仍由现有错误消息链路反馈。

### 验收标准
- 仅符合确认协议的 `tool.end` 显示选项。
- 请求同时携带 `interactionId` 和 `optionValue`。
- 旧 `confirm.*`、`options.*` 事件不再改变确认状态。
- 前端确认状态不声明或渲染 `summary`。
- 前端确认状态不包含 `interactionType`、`interactionStatus`、`suspendRun`、`contextRef` 或 `transferData`。
- 不修改现有 UI 布局、尺寸、间距和颜色。

## admin-chat 主 Agent 过渡文案闪现修复

### 背景
- 目标：主 Agent 转交子 Agent 时，不短暂显示主 Agent 的转交流程文案。
- 边界：不增加“子 Agent 正在处理”提示，不修改现有聊天布局。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 事件协议核对 | 已完成 | 确认后端 `agent.end` 构造了 HANDOFF 数据但精简 SSE 未写入 `data` | `AgentEventPublisher.sendOnlyCompact` |
| T2 前后端修复 | 已完成 | 后端补发状态数据；前端在 HANDOFF 或 `subagent.start` 时丢弃主 Agent 过渡正文，并允许空正文覆盖旧消息帧 | 前后端目标文件 |
| T3 代码验证 | 已完成 | 状态机 11/11、Babel、后端主代码编译、diff 与编码检查通过 | 命令验证 |

### 风险与回退
- 后端旧版本可能仍不携带 `data.status`，前端需兼容当前固定的交还事件文案。
- 普通主 Agent 回复必须继续在 SSE 正常结束后显示，不能被子 Agent 清理逻辑误伤。

### 验收标准
- `llm.end → agent.end(HANDOFF) → subagent.start` 过程中不显示主 Agent 过渡正文。
- 收到 `subagent.start` 后，消息内容不保留此前主 Agent 的任何过渡正文。
- 普通不转交的主 Agent 回复仍正常显示。

## create-character 生成选择流程

### 背景
- 目标：创建形象页点击“创建形象”后进入 `/pages/generating-select`，自动生成并保存一张不绑定角色的用户图片。
- 边界：使用 `one-click-image` 且不传 `roleId`；不再创建 `ts_role_image_profile`；保留现有生成选择页视觉主体。

### 字段映射
| 创建页字段 | Zustand 草稿字段 | `one-click-image` 字段 |
| --- | --- | --- |
| 形象提示词 | `promptText` | `backgroundStory` |
| 风格 | `styleName` | `styleName` |
| 已上传参考图 | `referenceImageUrl` | `referenceImageUrl` |

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 创建页跳转 | 已完成 | 上传参考图后将提示词、风格与服务端图片 URL 写入 Zustand，再进入生成选择页 | `src/app/pages/create-character/index.jsx` |
| T2 自动生成与保存 | 已完成 | 页面从 Zustand 读取草稿并调用不带 `roleId` 的 `one-click-image` | `src/app/pages/generating-select/index.tsx` |
| T3 结果交互 | 已完成 | 候选图切换、三行描述、编辑返回上一页、图片下载及底部操作抽屉 | `src/app/pages/generating-select/components/figma-character-screen.tsx` |
| T4 代码验证 | 已完成 | 定向 ESLint、Babel、diff 与编码检查通过；全仓 TypeScript 仍受既有错误阻塞 | 命令验证 |
| T5 多候选生成 | 已完成 | 首次并发生成 4 张候选图；风格名居中显示；候选缩略图使用 13:18 竖向比例并支持切换主图 | 生成选择页目标文件 |

### 风险与回退
- 临时 Zustand Store 不持久化，生成页刷新或直接访问时会返回创建页重新填写。

- `one-click-image` 成功即已写入用户素材表，重新生成会新增一条用户图片素材。

### 验收标准
- 创建页不再直接调用生图和形象档案保存接口。
- 页面跳转 URL 不携带提示词、风格和参考图参数。
- 生成选择页首次进入只自动生成一张图片。
- 图片描述最多显示三行，点击编辑按钮在当前页上拉共享形象编辑器。
- 重新生成继续使用当前编辑后的描述，且不传 `roleId`。
- 默认只显示位于页面底端的操作口和“上滑查看更多操作”提示。
- 点击或上滑操作口展开完整操作卡片，向下滑动可收起；展开后提示消失。
- 上滑提示独立显示在操作口上方；页面顶部复用 `AiHeader`，标题为“形象生成”。
- 首次进入使用相同描述并发调用 4 次生图接口，单次失败不影响其他成功结果。
- 卡片不显示候选数量；风格名使用居中白色粗体，候选图框采用 13:18 竖向比例。
- 候选图片列表从卡片左侧开始排列，右侧恢复原始加号入口，用于生成新的候选图。
- 加号每次并发生成最多 4 张新候选，上一批结束后才能再次触发；总数达到 12 张后隐藏。
- 底部原“重新生成”按钮改为“下载图片”，下载当前选中的候选图；跨域下载失败时打开原图地址。
- 候选列表保持横向滑动但隐藏滚动进度条；每个候选槽独立显示加载、成功或失败状态。
- 主图加载层只由当前选中候选控制；追加生成其他图片时，已选中的成功图片继续正常展示。
- 加号入口保留 13:18 长方形尺寸，视觉恢复为深色圆角底、浅灰虚线边框和居中的 25×25 白色加号。
- 创建形象页与生成选择页复用同一编辑组件，保持提示词、参考图、风格、AI 润色和校验规则一致。
- 编辑抽屉应用后更新 Zustand 草稿，关闭抽屉、清空旧候选并按新内容并发生成首批 4 张。
- 主预览区没有真实生成图片时只显示纯色背景，不再加载默认人物图或默认图片背景。
- 操作卡片中的图片描述标题补回原稿图片图标；风格名称与闪光图标作为一组保持水平居中，不显示下拉箭头。
- 进入形象生成选择页时操作卡片默认处于展开状态，用户仍可向下收起。
- 候选列表末尾的加号图片框使用 2px 浅灰色虚线边框，保留原有 13:18 尺寸、圆角和深色背景。
- 聊天页点击灯泡后建议区域立即预留完整高度并滚动到底部，加载骨架与三个建议原位替换，避免等待接口完成后聊天内容才上移。
- 形象候选生成失败时使用黑灰背景、白色失败图标与状态文案；点击失败候选后，主预览区同步显示完整失败状态。

## AI 生图与角色关联解耦

### 背景
- 目标：生图接口只返回供应商临时原图，不上传、不入库、不关联角色。
- 边界：图片保存与角色关联必须由前端“完成/保存角色”或完整角色 Tool 的明确操作触发。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 通用生图接口 | 已完成 | 生图端点调整为 `/sys/ai-images/generate`，移除 `roleId` 与异步生成参数 | 后端 Controller、DTO、生成服务 |
| T2 图片显式保存 | 已完成 | 新增 `/sys/ts-user-image-assets/import`，负责远程图片转存与资产入库 | 图片资产 Controller、Service |
| T3 角色关联 | 已完成 | 完整角色 Tool 显式保存图片资产后更新角色头像；普通生图不接触角色 | `TsRoleGenerateServiceImpl`、完整角色 Tool |
| T4 前端调用时机 | 已完成 | 生成选择页点击完成时保存；创建角色页最终保存时保存临时生成图 | 两个页面与 API 封装 |
| T5 验证 | 已完成 | 后端模块编译通过；前端定向检查完成，全仓类型检查记录既有问题 | 命令验证 |

### 风险与回退
- AI 原始图片地址可能过期，用户确认保存时必须能够访问该地址。
- 转存成功但后续角色保存失败时，图片资产会保留，避免再次依赖临时地址。

### 验收标准
- 调用生图接口后，对象存储和用户图片资产表不新增记录。
- 生图请求和响应不包含角色 ID、生成记录 ID 或图片资产 ID。
- 只有明确保存操作调用图片转存接口。
- 完整角色 Tool 创建完成后，角色头像使用转存后的永久地址。
- 不修改现有页面布局、尺寸、间距和颜色。

## admin-chat 通用异步 Tool 标记

### 背景
- 目标：`/pages/admin-chat` 对所有 `async === true` 的 Tool 显示通用异步状态标记。
- 边界：不按 `toolName` 写业务判断，不展示 Tool 的输入输出结果，不由前端决定 SSE 关闭时机。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 协议与历史字段 | 已完成 | 补齐消息 `events` 和异步 Tool 元数据类型 | `src/lib/api/ts-agent-chat.ts` |
| T2 实时状态合并 | 已完成 | 按 `eventId` 更新同一异步 Tool，保留 SSE 原生命周期 | `src/lib/api/ts-agent-chat-stream.ts` |
| T3 历史恢复与展示 | 已完成 | 从历史事件恢复异步 Tool 标记，仅显示名称和状态 | `src/app/pages/admin-chat/index.tsx`、thinking panel |
| T4 验证与文档 | 已完成 | 17 个状态机测试、Babel 和 diff 检查通过 | 测试命令；架构说明与修改日志 |

### 验收标准
- 任意 Tool 仅在 `async === true` 时显示“异步”标记，不依赖具体工具名。
- `tool.start/tool.end/tool.error` 根据同一 `eventId` 更新同一张 Tool 卡片。
- 异步 Tool 不渲染 input、output、toolData 等结果内容。
- 历史消息可恢复异步 Tool 的执行中、已完成和失败状态。
- 聊天发送锁仍在旧 SSE 真正结束后释放，前端不因 `agent.end` 或异步 Tool 主动关闭 SSE。

## admin-chat 图片 Tool 扁平协议

### 背景
- 目标：角色形象与故事背景图片 Tool 使用统一的扁平媒体字段，前端可按 `contentType=image` 渲染。
- 边界：不改变 Confirm、普通文本 Tool 和异步 Tool 的既有行为；图片仍保持当前临时 URL 与保存时机。

### 字段映射
| 字段 | 角色形象 | 故事背景图片 |
| --- | --- | --- |
| `contentType` | `image` | `image` |
| `resourceType` | `role_image` | `story_scene_image` |
| `imageUrl` | 角色图片临时 URL | 场景图片临时 URL |
| `promptCode` | 角色生图模板编码 | 场景生图模板编码 |
| `promptVersion` | 角色生图模板版本 | 场景生图模板版本 |

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 后端 Tool 协议 | 已完成 | ToolCallResult、SSE 和事件 output 使用统一扁平字段 | 后端 Agent Runtime 与 Tool Registrar |
| T2 前端实时展示 | 已完成 | `contentType=image` 渲染图片 Tool 卡片，原始 SSE 分块按 `eventId` 合并开始与结束事件 | SSE reducer、thinking panel、原始 SSE 测试 |
| T3 历史恢复 | 已完成 | 从 `event.data.output` 恢复图片 Tool 卡片 | admin-chat 消息映射 |
| T4 验证与文档 | 已完成 | 前端状态机测试 21/21 与 Babel 通过，后端主代码编译通过；定向单测受既有测试编译错误阻塞 | 命令验证、架构说明与修改日志 |

### 验收标准
- 图片 Tool 的 SSE 顶层直接提供五个媒体字段，不使用 `data.result` 或 `result.data`。
- 图片 Tool 事件的 `output` 直接提供五个媒体字段，不再嵌套 `result`。
- 角色形象和故事背景图片结构一致，仅 `resourceType` 与业务值不同。
- 实时消息和历史消息均能展示图片；普通 Tool、Confirm 和异步 Tool 无行为回归。

## 统一草稿箱接口对接

### 背景
- 目标：`/pages/draft` 使用统一草稿接口展示角色和故事草稿。
- 数据原则：只保存和返回完整 `content`，不新增或持久化重复的 `cardData`。
- 边界：本轮接入列表、卡片映射、删除和编辑跳转，不修改原有卡片布局与视觉。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 后端列表契约 | 已完成 | 列表返回结构化 `content`，不新增 `cardData` | 草稿 VO、Mapper XML、4 条转换测试 |
| T2 前端 API 封装 | 已完成 | 新增统一草稿类型与五个 CRUD 方法 | `src/lib/api/ts-draft.ts` |
| T3 草稿页数据绑定 | 已完成 | 卡片读取 `content`，支持删除、跳转及创建页详情恢复 | 草稿页、创建角色页、创建故事页 |
| T4 验证与文档 | 已完成 | 后端编译/测试、前端定向 ESLint/Babel、编码和差异检查 | 命令验证与修改日志 |

### 验收标准
- 草稿页不再使用 `MOCK_DRAFT_LIST`。
- 列表只请求一次即可取得卡片所需的 `content`。
- 角色卡片显示角色形象、名称、背景摘要和更新时间。
- 故事卡片显示场景图片、标题、剧情模式、角色数量、角色头像和场景状态。
- 删除成功后列表与总数同步更新，点击卡片携带 `draftId` 跳转对应创建页。
- 不新增 `cardData`，不修改原有卡片布局、尺寸、间距和颜色。

### 风险与回退
- `content` 较大时会增加列表响应体；当前草稿箱按 20 条加载，暂接受该开销。
- 历史草稿字段名称可能不一致，前端使用兼容字段读取并保留占位显示。
- 回退时恢复列表不返回 `content_json`，草稿页恢复静态数据或改为详情按需加载。

### 删除确认弹窗
- 状态：已完成。
- 规则：点击删除图标先显示深色主题确认弹窗；点击遮罩或“取消”关闭，点击红色“删除”才调用接口。
- 请求状态：删除期间禁止关闭和重复提交，按钮显示“删除中...”。

### 创建页返回草稿确认
- 状态：已完成。
- 页面：`/pages/create-role`、`/pages/create-story`。
- 规则：存在有效内容时点击返回，显示“保存当前内容？”主题弹窗，仅提供“不保存”和“保存并退出”；点击遮罩继续编辑。
- 保存：新草稿调用 `POST /sys/ts-drafts`，从草稿箱继续编辑时调用 `PUT /sys/ts-drafts`。
- 排除条件：仅切换普通/章节剧情、仅切换页签、默认章节标题、角色标签和 AI 生成标记不会单独触发弹窗。

### 创建入口草稿数量
- 目标：`/pages/create-page` 右上角草稿箱展示接口实时数量，并缩小整体控件。
- 调用：页面获得焦点时请求 `GET /sys/ts-drafts?pageNo=1&pageSize=1`，使用分页 `total`。
- 交互：数量大于 0 时进入草稿箱；数量为 0 时显示主题提示“草稿箱为空~”；加载失败时显示错误提示。
- 验收：从草稿箱返回后数量自动刷新；加载期间禁止重复点击；不新增后端接口。

## 后端请求语言头

### 背景
- 目标：所有业务接口根据前端当前语言统一发送 `Accept-Language`。
- 边界：不在各业务 API 中增加语言参数，不修改页面布局和语言切换交互。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 请求链路检查 | 已完成 | Axios、Token 刷新和 SSE 原先均未发送语言头 | `def-http.ts`、`stream.ts` |
| T2 统一语言注入 | 已完成 | 每次请求动态读取当前语言并设置 `Accept-Language` | 请求拦截器、刷新请求、SSE Header |
| T3 验证与文档 | 已完成 | 定向 ESLint、Babel、差异和编码检查完成；全仓 TypeScript 被既有配置与历史类型错误阻塞 | 验证命令 |

### 验收标准
- 普通 Axios 请求自动携带当前语言。
- Token 刷新请求自动携带当前语言。
- Agent SSE 请求自动携带当前语言。
- 语言值复用现有 `getLanguage()`，不在业务接口重复传参。

## 设置与声音页面多语言

### 背景
- 目标：完成通用设置、用户设置、语言设置、声音编辑的简体中文、繁体中文、英文和日文翻译。
- 边界：暂不维护阿拉伯语；不修改接口字段、页面结构、尺寸、间距和配色。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 文案盘点 | 已完成 | 覆盖四个页面及设置、试听弹窗等复用组件 | 页面与组件扫描 |
| T2 四语言资源 | 已完成 | 扩展 `settings` 命名空间并限制可选语言 | 四套 `settings.json` |
| T3 页面接入 | 已完成 | 替换标题、按钮、表单、状态与错误提示硬编码 | 四个页面组件 |
| T4 验证与文档 | 已完成 | JSON 键、Babel、新增行 ESLint、差异和编码检查通过 | 验证命令 |

### 验收标准
- 语言设置仅显示简体中文、繁体中文、English、日本語。
- 四个页面可随当前语言切换全部用户可见文案。
- 音色筛选继续使用稳定业务值，不依赖翻译后的文字。
- 历史存储的非支持语言自动回退简体中文。

## 创作入口多语言

### 背景
- 目标：完成 `/pages/create-page` 的简体中文、繁体中文、英文和日文翻译。
- 边界：不修改路由、草稿接口、卡片结构、位置和动画。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 文案盘点 | 已完成 | 标题、卡片、草稿状态、AI 助手和提示弹窗 | 页面扫描 |
| T2 四语言资源 | 已完成 | 新增独立 `createPage` 命名空间 | 四套 JSON |
| T3 页面接入 | 已完成 | 替换硬编码并为英文/日文收紧字号 | `create-page/index.tsx` |
| T4 验证与文档 | 已完成 | JSON、Babel、新增行 ESLint、差异和编码检查通过 | 验证命令 |

### 验收标准
- 页面用户可见文案全部读取 `createPage` 翻译资源。
- 草稿数量加载、空状态和失败提示支持四语言。
- 英文和日文在固定宽度标题、卡片和按钮中不发生明显溢出。

## 内容浏览页面多语言

### 背景
- 目标：完成浏览列表、角色详情、角色选择和我的图库的简体中文、繁体中文、英文和日文翻译。
- 边界：不翻译接口返回的角色名、作者名、故事内容和图片文件名，不修改接口参数与页面布局。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 文案盘点 | 已完成 | 覆盖四个页面和浏览分类子组件 | 页面与组件扫描 |
| T2 四语言资源 | 已完成 | 新增独立 `contentBrowse` 命名空间 | 四套 JSON，各 62 个一致键 |
| T3 页面接入 | 已完成 | 替换固定标签、空状态和错误兜底 | 页面与分类组件 |
| T4 验证与文档 | 已完成 | JSON、Babel、新增行 ESLint、差异和编码检查通过 | 验证命令与修改日志 |

### 验收标准
- 四个页面的固定用户可见文案随当前语言切换。
- 分类翻译不改变分类索引、故事模式筛选值或接口参数。
- 接口返回的业务内容保持原文。
- 不修改原页面层级、尺寸、间距、颜色和交互。

## 聊天与个人功能多语言

### 背景
- 目标：完成聊天页、会话列表、会话详情、故事详情弹窗和我的页的简体中文、繁体中文、英文和日文翻译。
- 边界：用户消息、AI 回复、会话标题、故事内容、角色名称和用户昵称保持接口原文；不修改接口和页面布局。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 文案盘点 | 已完成 | 覆盖聊天主页面、输入组件、会话页面和我的页 | 页面与组件扫描 |
| T2 四语言资源 | 已完成 | 新增 `chat`、`profile` 命名空间 | `chat` 各 61 键、`profile` 各 14 键 |
| T3 页面接入 | 已完成 | 替换固定标签、空状态、弹窗和错误兜底 | 页面与组件 |
| T4 验证与文档 | 已完成 | JSON、Babel、新增行 ESLint、差异和编码检查通过 | 验证命令与修改日志 |

### 验收标准
- 聊天及个人页面固定界面文案随语言切换。
- 会话内容与接口业务内容不被翻译或改写。
- 会话筛选和导航继续使用稳定业务值，不依赖翻译文本。
- 不修改现有页面层级、尺寸、间距、颜色和交互。

## TS 接口结构化消息与 Agent Chat 四语言

### 背景
- 目标：backup 前端对接后端 `messageCode/errorCode/errorCategory/retryable/errorArgs`，并完成 Agent Chat 固定界面文案的简中、繁中、英文和日文适配。
- 边界：不注册或发送阿拉伯语；动态 AI 内容和 Confirm 文案保持后端原文；不修改页面布局、尺寸、间距或配色。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 API 响应模型 | 已完成 | 扩展 `ApiResult`，新增保留结构化字段的 `ApiError` | `src/lib/api/types.ts`、`api-error.ts` |
| T2 消息解析 | 已完成 | 根据后端 code 和 args 解析四语言文案，后端 message 作为兜底 | `src/lib/i18n/api-message.ts`、四套语言资源 |
| T3 SSE 与历史事件 | 已完成 | Tool/LLM/Run 错误保留错误码、分类、重试标记和参数 | `ts-agent-chat-stream.ts` |
| T4 Admin Chat | 已完成 | 会话操作、输入框、弹窗和 Tool 状态迁入四语言资源 | admin-chat 页面与组件 |
| T5 验证与文档 | 已完成 | 24 项定向测试、Babel、定向 ESLint、差异与编码检查 | 验证命令与修改日志 |

### 验收标准
- 普通 TS 接口失败不丢失结构化错误字段。
- SSE 实时错误和历史 Tool Event 使用相同错误结构。
- 前端优先按 code 翻译，缺少翻译时显示后端英文 message。
- `retryable=true` 保留给页面决定是否展示重试入口。
- 前端仅支持并发送 `zh-CN`、`zh-TW`、`en-US`、`ja`。
- Admin Chat 固定文案支持四语言，动态 AI 内容和选项 label 不被二次翻译。

## 创建故事空页面退出误提示

### 背景
- 目标：新进入 `/pages/create-story` 且未进行任何操作时，返回不弹出保存草稿提示。
- 边界：不修改页面布局、展示文案或已有草稿保存接口。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 判断条件排查 | 已完成 | 默认章节描述被误判为有效编辑内容 | `createDefaultChapter`、`hasEffectiveContent` |
| T2 默认数据修复 | 已完成 | 默认章节描述仅作为 UI fallback，不写入表单状态 | `create-story/index.tsx` |
| T3 验证与记录 | 已完成 | Babel、默认状态断言、差异与编码检查通过；整文件 ESLint 运行 120 秒超时 | 验证命令与修改日志 |

### 验收标准
- 新建故事页未操作时返回，直接离开页面。
- 用户填写章节内容或其他故事字段后返回，仍显示草稿提示。
- 章节描述提示文案的视觉展示保持不变。

## Admin Chat 图片下载与图库保存

### 背景
- 目标：Agent 生成的角色形象和故事背景图片支持直接下载、幂等保存到用户图库。
- 边界：不改变 Agent 图片事件结构；下载失败不打开原图兜底；同一用户按 Agent Event ID 只保存一次。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 字段映射 | 已完成 | `eventId -> sourceKey`，`resourceType -> sourceType`，`imageUrl -> sourceImageUrl` | `ts-agent-chat-stream.ts`、`ts-role-image.ts` |
| T2 后端幂等导入 | 已完成 | 导入前查询、软删除恢复、唯一索引并发兜底，返回 `alreadySaved` | 图片素材 Service、Mapper、SQL |
| T3 图片操作 UI | 已完成 | 图片底部增加下载和保存按钮，保存状态在卡片内反馈 | `admin-chat-image-actions.tsx` |
| T4 图库分类 | 已完成 | 角色图库和故事背景图库分别识别新来源类型 | `my-gallery/index.tsx` |
| T5 验证与记录 | 已完成 | 后端编译、前端 Babel/ESLint、四语言键一致性、差异与编码检查通过 | 验证命令 |

### 验收标准
- 下载成功时保存图片文件，失败时仅提示下载失败。
- 同一用户重复保存同一 `eventId` 时不新增素材，并提示已保存。
- `role_image` 进入角色图库，`story_scene_image` 进入故事背景图库。
- 实时 SSE 与历史消息中的图片均可执行相同操作。

## Admin Chat 图片代理下载

### 背景
- 目标：将 Admin Chat 的跨域原图下载改为 TS 后端代理下载，避免 OSS CORS 导致浏览器 `fetch` 失败。
- 边界：下载不保存图片、不关联角色或故事，不改变现有图片卡片布局与“保存”按钮逻辑。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 后端下载接口 | 已完成 | 新增 `POST /sys/ts-images/download`，校验远程图片并输出附件流 | 后端 Controller/Service/DTO |
| T2 前端 API 接入 | 已完成 | API 层接收 Blob，Admin Chat 使用接口下载 | `ts-image.ts`、图片操作组件 |
| T3 验证与文档 | 已完成 | 后端编译、测试源码编译、前端转译/Lint、差异与编码检查 | 验证命令与修改日志 |

### 验收标准
- 可直接访问但不允许浏览器跨域读取的图片，可通过 Admin Chat 下载。
- 接口仅代理公网 HTTP/HTTPS 图片，不写入用户素材表。
- 下载期间禁止重复点击，失败时保留现有四语言提示。
- 不修改图片卡片的尺寸、间距、颜色和按钮布局。

## Admin Chat 图片 Tool 后 LLM 文本去重

### 背景
- 目标：修复图片 Tool 完成后，`llm.end` 聚合文本覆盖旧 LLM step，导致同一内容在 Tool 前后重复显示。
- 边界：不改变后端 SSE 协议，不修改 Admin Chat 页面布局和图片卡片样式。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 Reducer 修复 | 已完成 | Tool 后续 delta 关联最近 LLM 节点，`llm.end` 不覆盖已有流式文本 | `ts-agent-chat-stream.ts` |
| T2 回归测试 | 已完成 | 覆盖 Tool 失败、重试成功、图片返回及聚合 `llm.end` | `ts-agent-chat-stream.test.ts` |
| T3 代码级验证 | 已完成 | Jest 23/23、Web Babel、差异及编码检查通过；整文件 ESLint 仅报告既有规则问题 | 验证命令 |

### 验收标准
- Tool 前后的真实 LLM 文本按顺序各显示一次。
- `llm.end` 的聚合内容不再重复覆盖已有 delta 文本。
- 图片 Tool 的失败、成功、图片地址和操作按钮逻辑保持不变。

## Admin Chat 图片 Tool 生命周期组件

### 背景
- 目标：图片 Tool 从 `tool.start` 开始即展示图片生成组件，不再先显示普通 Tool 调用卡片。
- 边界：沿用现有 SSE 事件，不新增 `running/done/error` 业务字段，不影响普通 Tool。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 状态归并 | 已完成 | 保留 `tool.start` 声明的图片类型，避免 `tool.error` 覆盖 | `ts-agent-chat-stream.ts` |
| T2 图片组件 | 已完成 | start 显示加载，end 显示图片操作，error 显示失败 | `admin-chat-image-tool-card.tsx` |
| T3 验证与记录 | 已完成 | Jest 24/24、Babel、ESLint、四语言键一致性与编码检查通过 | 验证命令 |

### 验收标准
- `tool.start + contentType=image` 立即显示图片加载组件。
- `tool.end` 在原组件中显示图片、下载和保存按钮。
- `tool.error` 在原组件中显示图片生成失败。
- 普通 Tool 继续使用原有 Tool 卡片。

## Admin Chat 助手事件时间线

### 背景
- 目标：LLM 与 Tool 事件统一归属助手消息，历史消息按真实执行顺序还原文字和 Tool。
- 边界：Tool 完整事件结构保持不变；不保存逐字 `llm.delta`；不修改聊天页面布局。

| 任务 | 状态 | 说明 | 证据 |
| --- | --- | --- | --- |
| T1 后端消息归属 | 已完成 | 预创建 streaming 助手消息，事件改为关联助手消息 | Agent Reply、Message Service |
| T2 LLM 段落事件 | 已完成 | Tool 前切分并保存 LLM 完整段落，节点结束保存尾段 | AgentEventPublisher |
| T3 前端历史回放 | 已完成 | 同一助手消息内按顺序回放 LLM 与 Tool | admin-chat、stream reducer |
| T4 验证与记录 | 已完成 | 后端编译、前端 Jest/TS 转译、编码与差异检查 | 验证命令 |

### 验收标准
- User 消息的 `events` 为空，LLM/Tool 事件归属对应 Assistant 消息。
- Tool 的 `input/output/error/metrics` 保存结构保持不变。
- 历史消息按 `LLM 文本 -> Tool -> LLM 文本` 顺序展示。
- 有完整事件时间线时不重复显示聚合助手正文。
