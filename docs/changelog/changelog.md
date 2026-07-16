# 修改日志

## 2026-06-30
- 任务：admin-chat SSE 迁移
- 变更：新增通用 SSE 读取封装、agent 事件 reducer、`useAgentChatStream` 复用 hook、thinking 面板组件，并把 `/pages/admin-chat` 切到流式状态机；流式请求改为同一 `ai-reply` 接口通过 `stream=true` 分流；进入页时若没有可用会话则先空白进入，首条消息再懒创建后端 session
- UI 影响：assistant 气泡内增加“正在思考”卡片，流式输出时可逐步展示 LLM / Tool 节点
- 验证：已完成针对新 SSE 文件与 admin-chat 页面的类型检查；仓库里仍有既有的 axios 类型告警

## 2026-07-14
- 任务：admin-chat Tool 选项事件接入
- 变更：识别 `tool.end + contentType=options`，读取顶层 `question/options`，在最新 AI 气泡中按数组实际数量渲染快捷按钮；点击后复用普通消息发送链路
- 接口变更：未新增端点，扩展 `/sys/ts-agent-chat-sessions/ai-reply` SSE 字段消费
- UI 影响：复用既有推荐问题按钮样式，仅将隐藏的静态内容改为动态数据
- 验证：两选项 reducer 模拟通过；`git diff --check` 通过；全仓类型检查受既有 TypeScript 配置和历史类型错误阻塞

## 2026-07-15
- 任务：admin-chat Confirm 选项事件接入
- 变更：识别 `confirm.start` 顶层 `question/options`，复用 AI 气泡中已有选项组件展示按钮；选项统一映射为 `label/optionValue`
- 接口变更：未新增端点；`/sys/ts-agent-chat-sessions/ai-reply` 请求增加可选 `optionValue`
- UI 影响：未调整布局和样式，仅解除 Confirm 数据到现有选项组件之间的隐藏条件
- 验证：`confirm.start` reducer 两选项模拟通过；`git diff --check` 通过；文件保持 UTF-8 无 BOM、CRLF；全仓类型检查和 ESLint 受既有配置与历史错误阻塞

## 2026-07-15
- 任务：角色开场白单字段生成模式对接
- 变更：角色接口类型和创建角色页将 `intro_optimize` 统一改为 `greeting_optimize`
- 接口变更：未新增端点，继续调用 `/sys/ts-roles/one-click-setting`
- UI 影响：未改动布局和样式
- 验证：后端模式名称与前端请求值一致

## 2026-07-15
- 任务：创建角色页背景设定与开场白美化按钮联调
- 变更：确认两个按钮已接入 `generateRoleSetting`；增加请求互斥，背景请求透传当前开场白，开场白响应不再兜底读取背景字段
- 接口变更：未新增端点；分别使用 `background_optimize`、`greeting_optimize`
- UI 影响：未改动布局和样式
- 验证：`git diff --check` 通过；全量 TypeScript 与 ESLint 检查受仓库既有配置和历史错误阻塞

## 2026-07-16
- 任务：admin-chat 新会话本地问候
- 变更：无历史空会话、新建会话及删除当前会话后，在前端消息状态中插入一条 `localOnly` AI 问候；有历史会话保持原样；补齐五套语言资源
- 接口变更：无；问候不调用 `/sys/ts-agent-chat-sessions/ai-reply`，不进入 SSE 请求体和数据库
- UI 影响：未改动布局和样式，复用现有 AI 消息气泡
- 验证：相关 TypeScript 检查通过；五套语言共 61 个键且无缺失；`git diff --check`、UTF-8 无 BOM 和 CRLF 检查通过；`/pages/admin-chat` 返回 HTTP 200 且无 SSR 错误；全页 ESLint 仍受该历史页面既有的 300 余条风格问题影响

## 2026-07-16
- 任务：admin-chat 所有会话统一显示本地问候
- 变更：加载历史会话时同样把 `localOnly` 问候插入消息列表首位，数据库历史消息排列在问候之后
- 接口变更：无；问候仍不进入 SSE、同步回复请求或数据库
- UI 影响：未改动布局和样式，仅统一所有会话的消息列表内容
- 验证：相关 TypeScript、历史消息顶部插入和请求隔离断言通过；`git diff --check` 与编码检查通过；`/pages/admin-chat` 返回 HTTP 200 且无 SSR 错误

## 2026-07-16
- 任务：admin-chat Web 顶部菜单悬停报错修复
- 变更：状态声明再次被其他 Web 改动覆盖后，彻底删除 `menuHovered/setMenuHovered` 依赖；新增纯 HTML `WebMenuIcon`，通过鼠标进入/离开直接切换图标地址
- 接口变更：无
- UI 影响：未改动布局，保留菜单图标原有悬停切图效果和 HTML `textarea`
- 验证：admin-chat 相关 TypeScript 检查通过；Babel Web 转译成功；旧 `menuHovered/setMenuHovered` 残留为 0；纯 Web 菜单组件和鼠标事件接线断言通过；`git diff --check` 通过

## 2026-07-16
- 任务：admin-chat 输入栏安静模式与输入模式
- 变更：输入为空且未聚焦时显示语音、单行文本框、加号同排；聚焦或有内容时文本框独占第一排并自动增高，语音与加号移动到第二排；发送后主动失焦、关闭附件面板并随清空回弹
- 接口变更：无
- UI 影响：仅调整底部输入栏的响应式布局状态，保留原有配色、图标和功能
- 验证：admin-chat TypeScript 无新增诊断；语法转译与 Babel Web 转译通过；状态逻辑断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；按用户要求未进行本地页面交互测试

## 2026-07-16
- 任务：chat 输入栏安静模式与输入模式
- 变更：`ChatInput` 在空闲时保持语音、单行输入、括号、候选回复和加号同排；聚焦或有内容时改为多行输入框第一排、全部按钮第二排；Web 与 Native 均支持自动增高，提交时主动失焦并关闭附件区
- 接口变更：无
- UI 影响：仅调整 `/pages/chat` 底部输入栏的两态布局，保留原按钮、配色和聊天发送逻辑
- 验证：语法和 Babel Web 转译通过；定向 ESLint 通过；状态逻辑断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；全量 TypeScript 仍存在该页面原有 SVG 声明和聊天返回类型错误；按用户要求未进行浏览器互动

## 2026-07-16
- 任务：chat 与 admin-chat 加号/发送图标切换
- 变更：新增纸飞机发送图标；仅在输入框“已聚焦且存在非空文字”时，将加号切换为发送按钮并调用原发送逻辑；其余状态继续显示附件加号；Web 点击发送时阻止提前失焦造成的职责误切换
- 接口变更：无
- UI 影响：仅替换输入栏原加号位置的图标和点击职责，按钮尺寸与两态布局不变
- 验证：语法和 Babel Web 转译通过；ChatInput 定向 ESLint 通过；严格条件与点击职责状态断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；按用户要求未进行浏览器互动

## 2026-07-16
- 任务：create-story 章节开场白角色单选
- 变更：章节开场白入口复用 `/pages/select-role`，候选项严格过滤为页面顶部已添加角色；支持单选、当前角色回显、角色名展示和再次选择；顶部删除角色时同步清理章节的 `openingRoleId`；补齐现有 `roleSelected` 返回监听
- 接口变更：无新增端点；继续使用 `tsRoleApi.getRoleList`，章节保存继续提交既有 `openingRoleId`
- UI 影响：未调整布局、尺寸、间距和配色，仅将“选择角色”动态替换为已选角色名，并在章节选择模式隐藏创建角色悬浮按钮
- 验证：两个页面 TypeScript 语法与 Babel Web 转译通过；新增行 ESLint、TypeScript 诊断均为 0；行为代码断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；按用户要求未启动浏览器或开发服务进行验证

## 2026-07-16
- 任务：chat 输入框文字纵向居中
- 变更：将 Web `textarea` 的上下内边距调整为 8px，使 24px 行高在现有 40px 初始高度内纵向居中
- 接口变更：无
- UI 影响：仅修正 `/pages/chat` 输入框占位文字和首行文字的纵向位置，不改变输入栏高度、两态布局或发送逻辑
- 验证：TypeScript 语法、Babel Web 转译、ChatInput 定向 ESLint和样式断言通过；按用户要求未启动浏览器或开发服务

## 2026-07-16
- 任务：admin-chat 发送按钮点击修复
- 变更：发送图标在 `onPressIn` 阶段锁定职责并调用发送，后续 `onPress` 消费本次操作，避免输入框失焦后按钮切回附件职责
- 接口变更：无
- UI 影响：未修改布局、尺寸或图标显示条件，仅修复发送按钮事件顺序
- 验证：TypeScript 语法、Babel Web 转译、事件链代码断言和发送/附件序列模拟通过；全文件 ESLint 的 366 项均为该页面既有格式问题；按用户要求未启动浏览器或开发服务
