# Mine 页面前后端对接任务记录

任务文件：`docs/fe-be-integration/task-mine-page-api-integration-20260409-1851.md`  
更新时间：2026-04-09

## 1. 任务目标与边界
- 目标：完成 `src/app/pages/mine/index.tsx` 的前后端接口对接，替换页面静态 mock 数据。
- 边界：仅调整 API 封装、数据请求、字段映射、错误/加载文案；不改动页面布局结构与视觉样式。
- 非目标：不新增 UI 结构；不改动其它页面业务逻辑。

## 2. 计划（执行前列出）
| 任务 | 状态 | 说明 | 预期产出 |
| --- | --- | --- | --- |
| T1 API 能力梳理 | 已完成 | 盘点 `mine` 需要的用户信息/故事列表/角色列表接口 | 明确现有可用接口与缺口 |
| T2 API 封装补齐 | 已完成 | 新增故事列表 API，补充角色列表 API | `src/lib/api` 统一调用入口 |
| T3 页面对接改造 | 已完成 | `mine` 页从 mock 切换到真实接口数据，保留原布局 | 页面字段绑定与回退逻辑完成 |
| T4 校验与回填 | 已完成 | 执行 eslint 校验并回填文档记录 | 证据闭环 |

## 3. 页面字段映射
| 页面字段 | 接口字段 | 说明 |
| --- | --- | --- |
| 用户名 | `/sys/user/getUserInfo` -> `userInfo.realname \|\| nickname \|\| username` | 头像下主标题 |
| UID | `/sys/user/getUserInfo` -> `userInfo.id \|\| username \|\| phone` | `UID:` 行 |
| 头像 | `/sys/user/getUserInfo` -> `userInfo.avatar` | 无值回退本地默认头像 |
| 卡片（故事 Tab）封面 | `/sys/ts-stories` -> `records[].coverUrl` | 无值回退本地图 |
| 卡片（故事 Tab）浏览数位 | `/sys/ts-stories` -> `records[].followerCount \|\| dialogueCount` | 无值显示 `--` |
| 卡片（角色 Tab）封面 | `/sys/ts-roles` -> `records[].coverUrl \|\| avatarUrl` | 无值回退本地图 |
| 卡片作者信息 | `/sys/user/getUserInfo` -> 昵称+头像 | `@用户名` + 用户头像 |

## 4. 调用时机与失败回退
- 调用时机：页面首次加载时并发请求
  - `GET /sys/user/getUserInfo`
  - `GET /sys/ts-stories?pageNo=1&pageSize=30`
  - `GET /sys/ts-roles?pageNo=1&pageSize=30`
- 失败回退：
  - 单接口失败不阻断整体渲染，保留已成功数据。
  - 卡片列表无数据时回退到本地占位卡片。
  - 页面展示加载文案与错误文案，不出现空白页。

## 5. 接口缺口评估（需用户确认）
- 当前页面统计项 `关注/粉丝/点赞` 在现有接口中没有稳定同名字段，当前实现为“若接口返回相关字段则展示，否则显示 `--`”。
- 若需要真实统计值，建议补充接口（待用户确认）：
  - 用途：Mine 页顶部三项统计展示。
  - 请求：`GET /sys/user/mine-stats`（鉴权：是）。
  - 入参：无。
  - 出参建议：`followCount`、`fansCount`、`likeCount`（number）。
  - 映射：`关注 <- followCount`，`粉丝 <- fansCount`，`点赞 <- likeCount`。
  - 调用时机：页面首屏加载，与 `getUserInfo` 并发。
  - 回退：接口未上线时前端继续显示 `--`。

## 6. 变更文件
- 前端：
  - `src/app/pages/mine/index.tsx`
  - `src/lib/api/ts-role.ts`
  - `src/lib/api/ts-story.ts`
  - `src/lib/api/index.ts`
  - `docs/fe-be-integration/task-mine-page-api-integration-20260409-1851.md`
  - `docs/fe-be-integration/integration-status.md`
  - `docs/plan/plan.md`
  - `docs/changelog/changelog.md`
- 后端：
  - 无改动

## 7. 验证证据
- 命令：`pnpm exec eslint src/app/pages/mine/index.tsx src/lib/api/ts-role.ts src/lib/api/ts-story.ts src/lib/api/index.ts`
- 结果：通过（0 error）

