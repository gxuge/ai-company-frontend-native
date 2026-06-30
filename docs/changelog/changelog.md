# 修改日志

## 2026-06-30
- 任务：admin-chat SSE 迁移
- 变更：新增通用 SSE 读取封装、agent 事件 reducer、`useAgentChatStream` 复用 hook、thinking 面板组件，并把 `/pages/admin-chat` 切到流式状态机；流式请求改为同一 `ai-reply` 接口通过 `stream=true` 分流；进入页时若没有可用会话则先空白进入，首条消息再懒创建后端 session
- UI 影响：assistant 气泡内增加“正在思考”卡片，流式输出时可逐步展示 LLM / Tool 节点
- 验证：已完成针对新 SSE 文件与 admin-chat 页面的类型检查；仓库里仍有既有的 axios 类型告警
