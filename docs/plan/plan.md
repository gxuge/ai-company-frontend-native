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
- 快捷按钮数量严格跟随 `options` 数组，点击后按普通用户消息发送
- 现有页面布局不被破坏
- SSE 不可用时会自动回退到原有一次性回复接口
