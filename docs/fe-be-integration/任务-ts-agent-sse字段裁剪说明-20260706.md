# TS Agent SSE 字段裁剪说明

## 前端实际收到的统一外层字段

- `event`
- `type`
- `name`
- `content`
- `status`
- `data`

## 当前裁剪规则

### 1. `llm.start`

前端 `data` 仅保留：

- `promptCode`
- `summary`
- `status`

### 2. `llm.delta`

前端收到的是**纯文本增量**：

- 直接使用 `content`
- 不再包 JSON

### 3. `llm.error`

前端收到的是**纯文本错误信息**：

- 直接使用 `content`
- 不再包 JSON

### 4. `llm.end`

前端 `data` 仅保留：

- `promptCode`
- `summary`
- `status`

### 5. `tool.start`

前端 `data` 仅保留：

- `toolName`
- `summary`
- `contentType = progress`

### 6. `tool.end`

前端 `data` 仅保留：

- `toolName`
- `summary`
- `status`
- `contentType`
- `result`

### 7. `tool.error`

前端 `data` 仅保留：

- `toolName`
- `summary`
- `contentType = error`
- `error`

### 8. `agent.start`

前端 `data` 仅保留：

- `agentName`

### 9. `agent.end`

前端 `data` 仅保留：

- `agentName`
- `error`（仅失败时）

### 10. `subagent.start`

前端 `data` 仅保留：

- `subAgentName`

### 11. `subagent.end`

前端 `data` 仅保留：

- `subAgentName`
- `handoffReason`
- `error`

### 12. `subagent.error`

前端 `data` 仅保留：

- `subAgentName`
- `error`

## 说明

- `buildEventData(...)` 是发送前的完整事件整理层，偏落库。
- `buildCompactXxx(...)` 是给前端 SSE 用的精简层。
- 最终顺序应为：

  `完整业务结果 -> 分叉 -> 一路落库 -> 一路按事件类型裁剪后发 SSE`
