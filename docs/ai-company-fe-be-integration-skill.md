---
name: ai-company-fe-be-integration
description: 面向 D:\project_demo\ai-company-backend-spring\jeecg-boot 与 D:\project_demo\ai-company-frontend-native 的前后端对接执行技能。强调先读后端 hardness 约束、统一 API 封装、保护既有 UI 布局，以及上下文压缩后的恢复与注入。
---

## 1. 适用范围
- 后端：`D:\project_demo\ai-company-backend-spring\jeecg-boot`
- 前端：`D:\project_demo\ai-company-frontend-native`
- 场景：页面接口对接、接口新增联调、字段映射调整、前后端联动改造

## 2. 触发与注入（强制）
- 只要任务涉及上述两个项目的前后端对接，必须注入本 Skill。
- 若上下文被压缩或会话重启，继续任务前必须重新注入本 Skill。

## 3. 后端读取规则（强制）
- 启动阶段优先读取：
  - `D:\project_demo\ai-company-backend-spring\jeecg-boot\docs\hardness-writing-spec.md`
- 其余后端文件按任务需要增量读取，不做默认全量扫描。

## 4. API 对接约束（强制）
- 页面层禁止直接写接口 URL，统一走 `src/lib/api/` 封装。
- 封装结构优先采用“业务域单文件”：
  - 例如 `src/lib/api/ts-role.ts`、`src/lib/api/user.ts`
- 统一导出必须同步更新 `src/lib/api/index.ts`。

## 5. 后端接口缺口咨询机制（强制）
- 当判断“后端缺少前端对接所需的必要接口”时，不得直接假设或绕过，必须先向用户咨询是否补充。
- 咨询时必须明确给出以下细节：
  - 接口用途（用于哪个页面/组件、解决什么数据缺口）
  - 请求信息（HTTP 方法、接口路径、是否鉴权、是否公开）
  - 入参定义（query/body/path 字段、类型、是否必填、示例）
  - 出参定义（核心字段、类型、示例、错误码约定）
  - 前端映射关系（页面字段 <- 接口字段）
  - 调用时机（首次加载、分页、点击动作、重试策略）
  - 兼容与回退（接口未上线时前端展示与降级方案）
- 在用户确认之前，不执行依赖该缺口接口的最终联调结论。

## 6. 对接记录目录（强制）
- 前端 `docs/` 下统一维护对接记录目录：
  - `D:\project_demo\ai-company-frontend-native\docs\fe-be-integration`
- 生成 plan 时，必须在 `docs/fe-be-integration/` 下新建“当前任务独立文件”，不得复用公共 plan 文件。
- 文件名必须与当前任务强相关，且包含时间或唯一标识，避免并行任务冲突：
  - 推荐：`任务-<页面或模块>-<YYYYMMDD-HHmm>.md`
  - 示例：`任务-我的页面-接口对接计划-20260409-2130.md`
- 执行前必须先在该任务文件列出计划（任务拆分、初始状态、预期产出）。
- 执行过程中与结束后，必须将执行结果持续回填到同一个任务文件，不得只在对话中口头说明。
- 若需总览，可额外维护汇总文件（如 `integration-status.md`），但不能替代任务独立文件。

## 7. UI 保护规则（强制）
- 对接时禁止修改原有 UI 布局与视觉结构：
  - 禁止改层级、尺寸、间距、颜色、样式键名。
- 允许改动：
  - 数据请求、状态管理、字段映射、错误/加载文案、回退逻辑。
- 若任务确需改 UI，必须先暂停并等待用户确认。

## 8. Hardness 协同
- 前端任务同时参考：
  - `D:\project_demo\ai-company-frontend-native\docs\frontend-hardness.skill`
- 输出中必须包含：
  - 完成项、未完成项、风险、证据索引（文件路径与命令结果）

## 9. 上下文压缩恢复协议（强制）
- 当上下文不足时，恢复顺序：
1. 重新注入本 Skill。
2. 读取 `frontend-hardness.skill`。
3. 读取本轮任务记录文件（`docs/fe-be-integration/任务-*.md`，优先当前任务对应文件）。
4. 读取本轮已改动文件与最新 diff。
5. 再继续编码，不跳过映射与验收步骤。

## 10. 每轮输出要求
- 变更文件清单（前后端分开）
- 页面字段到接口字段映射
- 调用时机与失败回退说明
- 验证结果与未完成项
- 对接记录更新情况：`docs/fe-be-integration/任务-*.md`（计划先列，结果回填同文件，并标注本轮实际文件名）
