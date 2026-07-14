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
