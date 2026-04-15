# Session List 系统角色头像切换任务记录

任务文件：`docs/fe-be-integration/task-session-list-system-avatar-20260414-1617.md`  
更新时间：2026-04-14

## 1. 任务目标与边界
- 目标：`pages/session-list` 中“系统”会话头像改为 `pages/quick-login` 使用的 Logo。
- 边界：仅改头像资源与分支逻辑；不改动页面布局、尺寸、间距、颜色和交互结构。
- 非目标：不改动后端接口结构；不改动普通会话头像样式。

## 2. 计划与执行
| 任务 | 状态 | 说明 | 产出 |
| --- | --- | --- | --- |
| T1 后端标识核对 | 已完成 | 核对系统会话标识字段来源与前端类型映射 | 确认可直接使用 `isSystemSession` |
| T2 前端头像分支改造 | 已完成 | 系统会话头像切换为 quick-login logo | `session-list` 显示正确头像 |
| T3 校验与回填 | 已完成 | 执行 eslint 与文档回填 | 证据闭环 |

## 3. 后端标识结论
- 后端返回有系统会话标识：`TsChatSessionVo.isSystemSession`。
- 来源：`TsChatSessionVoConverter` 使用 `systemSessionKey == "DEFAULT_SYSTEM"` 计算得到 `isSystemSession`。
- 前端现有类型已定义：`src/lib/api/ts-chat.ts` 中 `TsChatSession.isSystemSession?: boolean`。

## 4. 页面字段映射
| 页面字段 | 来源字段 | 规则 |
| --- | --- | --- |
| 会话头像 | `conversation.isSystemSession` | `true` 用 `quick-login/logo.png`，否则沿用原头像 |

## 5. 调用时机与回退
- 调用时机：会话列表数据加载完成后渲染列表项时判断 `isSystemSession`。
- 回退策略：若字段缺失/非 `true`，默认走原头像（不影响普通会话）。

## 6. 变更文件
- 前端：
  - `src/app/pages/session-list/index.tsx`
  - `docs/fe-be-integration/task-session-list-system-avatar-20260414-1617.md`
  - `docs/fe-be-integration/integration-status.md`
  - `docs/plan/plan.md`
  - `docs/changelog/changelog.md`
- 后端：
  - 无改动（仅核对）

## 7. 验证证据
- 命令：`pnpm exec eslint src/app/pages/session-list/index.tsx`
- 结果：通过（0 error）

