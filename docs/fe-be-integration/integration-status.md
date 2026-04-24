# 前后端对接状态总表

更新时间：2026-04-21

| 模块/页面 | 前端位置 | 后端接口 | 状态 | 负责人 | 最后更新 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| 角色详情 | `src/app/pages/role-detail/index.tsx` | `/sys/ts-roles/detail`、`/sys/ts-roles/author-public` | 进行中 | - | 2026-04-09 | 数量相关接口暂不对接 |
| 声音编辑 | `src/app/pages/sound-edit/index.tsx` | `/sys/ts-voice-profiles`、`/sys/ts-user-voice-profiles`、`/sys/ts-user-voice-config/current`、`/sys/ts-voice-profiles/preview` | 已对接（推荐+我的音色+试听+下载缓存播放） | - | 2026-04-21 | 保持原 UI 布局；试听链路改为“接口生成->下载缓存(1天TTL)->播放”，支持参数命中复用与播放结束自动回退 |
| 用户设置 | `src/app/pages/user-setting/index.tsx` | `/sys/user/login/setting/getUserData`、`/sys/user/login/setting/userEdit` | 已对接 | - | 2026-04-09 | 完成昵称/性别/生日读取与保存链路，保持原 UI 布局 |
| 创建人物 | `src/app/pages/create-character/index.jsx` | `/sys/ts-roles/one-click-image`、`/sys/ts-user-image-assets`、`/sys/ts-role-image-profiles` | 已对接（本轮完成） | - | 2026-04-09 | 保持原 UI 布局；接入生成、图库与保存链路 |
| 我的图库 | `src/app/pages/my-gallery/index.tsx` | `/sys/ts-user-image-assets`（`GET`/`DELETE`） | 已对接（本轮完成） | - | 2026-04-17 | 保持原 UI 布局；已接通真实列表加载、管理模式删除与失败回退 |
| 会话列表 | `src/app/pages/session-list/index.tsx` | `/sys/ts-chat-sessions`、`/sys/ts-chat-messages` | 已对接（系统头像切换完成） | - | 2026-04-14 | 保持原 UI 布局；系统会话（`isSystemSession=true`）头像改为 quick-login Logo |
| 浏览图片页 | `src/app/pages/browse-images-list/index.tsx` | `/sys/ts-stories/public`、`/sys/ts-role-image-profiles/public`（回退：`/sys/ts-stories`、`/sys/ts-role-image-profiles`） | 已对接（本轮完成） | - | 2026-04-14 | 保持原 UI 布局；故事/角色 Tab 改为真实接口数据，支持搜索与分页加载 |
| 系统聊天 | `src/app/pages/admin-chat/index.tsx` | `/sys/ts-chat-messages`、`/sys/ts-chat-sessions/ai-reply` | 已对接（历史+发送） | - | 2026-04-14 | 保持原 UI 布局；发送链路由 mock 改为真实接口 |
| 普通聊天 | `src/app/pages/chat/index.tsx` | `/sys/ts-chat-messages`、`/sys/ts-chat-sessions/detail`、`/sys/ts-stories/detail`、`/sys/ts-roles/detail`、`/sys/ts-chat-sessions/ai-reply`、`/sys/ts-chat-sessions/reply-suggestions` | 已对接（历史+头部+发送+推荐） | - | 2026-04-18 | 保持原 UI 布局；ChatTip 推荐改为展开列表模式，支持竞态保护与会话切换重置 |
| 会话详情 | `src/app/pages/conversation-detail/index.tsx` | `/sys/ts-stories/detail`、`/sys/ts-story-chapters`、`/sys/ts-roles/detail` | 已对接（本轮完成） | - | 2026-04-10 | 保持原 UI 布局；标题/描述/章节/角色列表改为真实接口 |
| 创建故事 | `src/app/pages/create-story/index.tsx` | `/sys/ts-stories`、`/sys/ts-stories/story-setting-generate`、`/sys/ts-stories/story--scene-generate`、`/sys/ts-stories/story--outline-generate`、`/sys/ts-story-chapters` | 部分对接（主链路完成） | - | 2026-04-17 | 保持原 UI 布局；已接通保存+一键生成+章节保存，角色选择链路待补 |
| 选择角色 | `src/app/pages/select-role/index.tsx` | `/sys/ts-roles` | 已对接（本轮完成） | - | 2026-04-21 | 保持原 UI 布局；列表由静态数据改为当前用户角色接口数据，支持本地搜索与回传 create-story 参数 |

## 待补接口清单

| 业务点 | 建议接口 | 说明 | 是否已与用户确认 |
| --- | --- | --- | --- |
| Mine 顶部统计（关注/粉丝/点赞） | `GET /sys/user/mine-stats`（建议） | 现有接口无稳定同名字段，前端当前回退 `--` | 否 |
| Sound Edit 我的音色重命名 | `PUT /sys/ts-user-voice-profiles/{id}`（建议） | 菜单“重命名”当前仅提示缺口 | 否 |
| Sound Edit 我的音色删除 | `DELETE /sys/ts-user-voice-profiles/{id}`（建议） | 避免误用公共删除接口导致误删风险 | 否 |
| Chat 消息附件链路 | `POST /sys/ts-chat-message-attachments`（已有，待接前端） | 普通聊天页尚未接入图片/文件发送 | 否 |
| Chat 语音识别链路 | `ASR 转写接口`（待确认） | 当前仅保留麦克风入口，尚无转写接入 | 否 |

## Mine 对接任务文件（2026-04-09）

- 任务记录：`docs/fe-be-integration/task-mine-page-api-integration-20260409-1851.md`
- 状态：已完成前端可用接口对接；统计接口缺口待用户确认是否补充。

## Session List 系统头像任务文件（2026-04-14）

- 任务记录：`docs/fe-be-integration/task-session-list-system-avatar-20260414-1617.md`
- 状态：已完成；后端系统会话标识可用（`isSystemSession`）。

## 系统聊天页对话接口任务文件（2026-04-14）

- 任务记录：`docs/fe-be-integration/任务-系统聊天页-对话接口对接-20260414-1612.md`
- 状态：已完成；仅对接聊天历史与发送回复链路，未改动页面布局。

## 普通聊天页头部切换任务文件（2026-04-14）

- 任务记录：`docs/fe-be-integration/任务-普通聊天页-头部切换与会话链路-20260414-1725.md`
- 状态：已完成 Header 分流、文本发送与建议回复；语音、附件等扩展链路待补。

## 浏览图片页接口对接任务文件（2026-04-14）

- 任务记录：`docs/fe-be-integration/task-browse-images-list-api-integration-20260414-1630.md`
- 状态：已完成；后端已补公共浏览接口，前端已切换真实数据渲染。

## 声音编辑对接计划

- 目标：完成 `pages/sound-edit` 精确试听链路（后端接口补齐 + 前端切换调用）并保持原 UI 布局不变。
- 任务拆分：
  - T1：补充后端 `POST /sys/ts-voice-profiles/preview`。
  - T2：前端 API 封装切换到 `ts-voice-profiles/preview`。
  - T3：页面试听调用改为 `voiceProfileId + previewText`。
  - T4：执行编译/校验并回填对接记录。
- 当前状态：T1-T4 已完成。

## 声音编辑执行结果

- 完成：
  - 后端新增接口：`POST /sys/ts-voice-profiles/preview`（按 `voiceProfileId` 生成试听音频）。
  - 前端 API 已切换：`src/lib/api/ts-voice.ts` 改为调用 `/sys/ts-voice-profiles/preview`。
  - 页面试听已切换：`src/app/pages/sound-edit/index.tsx` 改为传 `voiceProfileId`，不再依赖 one-click 推荐。
  - 保持页面原有布局结构，仅改动数据请求与字段映射。
- 进行中：
  - 无。
- 风险：
  - 新接口依赖 MiniMax TTS 与媒体上传配置（`AIRAG_MINIMAX_UPLOAD_GENERATED_MEDIA`）可用。
- 证据：
  - 后端文件：`jeecg-module-system/jeecg-system-biz/src/main/java/org/jeecg/modules/system/controller/TsVoiceProfileController.java`
  - 后端文件：`jeecg-module-system/jeecg-system-biz/src/main/java/org/jeecg/modules/system/service/ITsVoiceProfileService.java`
  - 后端文件：`jeecg-module-system/jeecg-system-biz/src/main/java/org/jeecg/modules/system/service/impl/TsVoiceProfileServiceImpl.java`
  - 后端文件：`jeecg-module-system/jeecg-system-biz/src/main/java/org/jeecg/modules/system/dto/tsvoiceprofile/TsVoiceProfilePreviewDto.java`
  - 后端文件：`jeecg-module-system/jeecg-system-biz/src/main/java/org/jeecg/modules/system/vo/tsvoiceprofile/TsVoiceProfilePreviewVo.java`
  - 前端文件：`src/lib/api/ts-voice.ts`
  - 前端文件：`src/app/pages/sound-edit/index.tsx`
  - 编译命令：`mvn -pl jeecg-module-system/jeecg-system-biz -am -DskipTests compile`
  - 校验命令：`pnpm exec eslint src/app/pages/sound-edit/index.tsx src/lib/api/ts-voice.ts`

## 用户设置对接计划（2026-04-09）

- 目标：完成 `pages/user-setting` 的用户资料读取与保存对接。
- 边界：仅改动 API 封装、字段映射、请求状态与失败回退，不修改页面既有布局与视觉结构。
- 任务拆分：
  - T1：补充 `user-setting` 专用 API 封装（读取/保存）。
  - T2：页面加载时读取用户资料并回填昵称、性别、生日、ID。
  - T3：页面保存时提交更新并处理成功/失败状态。
  - T4：执行前端校验并回填文档记录。
- 当前状态：T1-T4 已完成。

## 用户设置执行结果

- 完成：
  - 前端 API 新增：`GET /sys/user/login/setting/getUserData`、`POST /sys/user/login/setting/userEdit`。
  - 页面加载时回填昵称、性别、生日、ID；保存按钮提交更新并处理失败兜底。
  - 保持页面原有布局结构，仅改动数据请求与字段映射。
- 进行中：
  - 无。
- 风险：
  - 更新接口需权限 `system:user:setting:edit`，无权限会导致保存失败。
- 证据：
  - 前端文件：`src/lib/api/user.ts`
  - 前端文件：`src/app/pages/user-setting/components/AccountSettings.tsx`
  - 校验命令：`pnpm exec eslint src/app/pages/user-setting/components/AccountSettings.tsx src/lib/api/user.ts`（`better-tailwindcss/enforce-canonical-classes` 超时）

## create-character 对接计划（2026-04-09）

- 目标：完成 `pages/create-character` 的形象生成、图库引用、结果保存链路。
- 边界：仅改动 API 封装、请求状态、字段映射与失败回退，不修改页面既有布局与视觉结构。
- 任务拆分：
  - T1：新增角色形象领域 API 封装（生成、图库、形象配置保存）。
  - T2：页面接入生成接口，按钮触发后返回图片并回显。
  - T3：页面接入图库接口，支持从“我的图库/参考图”选择最新图片作为参考。
  - T4：生成成功后写入形象配置保存接口，并执行前端校验与文档回填。
- 当前状态：T1-T4 已完成。

## create-character 执行结果

- 完成：
  - 新增前端 API：`src/lib/api/ts-role-image.ts`，封装
    - `POST /sys/ts-roles/one-click-image`
    - `GET /sys/ts-user-image-assets`
    - `POST /sys/ts-role-image-profiles`
  - 更新统一导出：`src/lib/api/index.ts`。
  - 页面 `src/app/pages/create-character/index.jsx` 已接入：
    - `AI 生成` 按钮 -> 调用 one-click-image；
    - `我的图库`/`参考图` -> 调用用户图库并使用最新图；
    - 生成成功后自动写入形象配置保存接口。
  - 保持页面原有布局结构，仅改动数据请求、状态控制与字段映射。
- 进行中：
  - 无。
- 风险：
  - 生成链路依赖后端 AI 服务与素材存储可用；若后端返回空图片地址会触发页面失败提示。
- 证据：
  - 前端文件：`src/lib/api/ts-role-image.ts`
  - 前端文件：`src/lib/api/index.ts`
  - 前端文件：`src/app/pages/create-character/index.jsx`
  - 校验命令：`pnpm exec eslint src/app/pages/create-character/index.jsx src/lib/api/ts-role-image.ts src/lib/api/index.ts --rule "better-tailwindcss/enforce-canonical-classes: off"`

## 2026-04-10 未对接页面盘点与计划

- 盘点范围：`src/app/pages/**` 全量页面目录。
- 已确认“仍未完成前后端对接”的页面：
  - `browse-images-list`
  - `chat`
  - `create-story`
  - `create-page`
  - `general-setting`
  - `quick-login`
  - `select-role`
- 已补充模块分析：
  - 语音能力：已接入音色列表/试听/配置；
  - 麦克风能力：未接入录音与 ASR，需补接口与前端权限依赖。

## 本轮新建任务文件（中文命名）

- `docs/fe-be-integration/任务-会话列表页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-聊天页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-会话详情页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-选择角色页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-快捷登录页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-浏览图片页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-创建故事页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-创建分页页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-通用设置页-前后端对接计划-20260410-1021.md`
- `docs/fe-be-integration/任务-语音与麦克风模块-前后端对接计划-20260410-1021.md`

## 接口缺口待确认（本轮只做分析不落地）

- 麦克风语音转文本（ASR）接口缺口：
  - 建议接口：`POST /sys/ts-chat-sessions/asr-draft`
  - 详细入参与回退策略已写入：
    - `docs/fe-be-integration/任务-语音与麦克风模块-前后端对接计划-20260410-1021.md`


## 2026-04-13 更新（会话分流 + 历史回填）
- 后端：`/sys/ts-chat-sessions` 出参新增 `isSystemSession`（用于前端系统会话分流）。
- 会话列表：点击会话按 `isSystemSession` 分流。
  - `true` -> `/pages/admin-chat?sessionId=...`
  - `false` -> `/pages/chat?sessionId=...`
- 系统聊天页：按 `sessionId` 从 `/sys/ts-chat-messages` 回填历史消息。
- 普通聊天页：按 `sessionId` 从 `/sys/ts-chat-messages` 回填历史消息。
- 任务记录文件：
  - `docs/fe-be-integration/任务-会话列表页-系统分流对接-20260413-1945.md`
  - `docs/fe-be-integration/任务-系统聊天页-历史消息回填-20260413-1945.md`
  - `docs/fe-be-integration/任务-普通聊天页-历史消息回填-20260413-1945.md`

## 2026-04-16 更新（create-role 形象生成去除姓名依赖）
- 页面：`src/app/pages/create-role/components/create-character.tsx`
- 调整：点击“形象生成”时，若无 `roleId` 且无名字，不再先创建角色草稿，直接调用 `/sys/ts-roles/one-click-image`。
- 保留：有 `roleId` 或有名字时继续使用异步生成+轮询链路。
- UI：未改动布局，仅修改请求分支与参数映射。
- 任务记录文件：
  - `docs/fe-be-integration/任务-create-role-形象生成去除姓名依赖-20260416-1035.md`

## 2026-04-17 更新（my-gallery 前后端对接）
- 页面：`src/app/pages/my-gallery/index.tsx`
- 调整：移除本地 mock，改为分页读取 `/sys/ts-user-image-assets`；管理模式删除改为调用 `DELETE /sys/ts-user-image-assets?id=...` 并处理部分失败回退。
- 保留：页面布局、卡片样式、底部操作结构保持不变。
- UI：仅补充加载/错误文案与空态回退，不改视觉结构。
- 任务记录文件：
  - `docs/fe-be-integration/任务-my-gallery-前后端对接计划-20260417-1105.md`

## 2026-04-17 更新（sound-edit 双音色库与试听对接）
- 页面：`src/app/pages/sound-edit/index.tsx`
- 调整：
  - 推荐音色库接入 `/sys/ts-voice-profiles` 真实列表。
  - 我的音色库接入 `/sys/ts-user-voice-profiles` 真实列表。
  - 默认取消首项自动勾选，进入页面时不预选音色。
  - 试听统一调用 `/sys/ts-voice-profiles/preview` 生成并播放。
- 后端：
  - `/sys/ts-voice-profiles/preview` 新增无上传配置时的数据 URL 回退，避免依赖 R2/对象存储上传。
- UI：未改动布局与视觉结构，仅改数据链路和状态行为。
- 任务记录文件：
  - `docs/fe-be-integration/任务-sound-edit-双音色库与试听对接-20260417-1705.md`

## 普通聊天页 ChatTip 推荐回复任务文件（2026-04-18）

- 任务记录：`docs/fe-be-integration/任务-chat页-ChatTip推荐回复对接-20260418-1049.md`
- 状态：已完成；ChatTip 推荐回复支持展开加载、请求竞态保护与失败回退。

