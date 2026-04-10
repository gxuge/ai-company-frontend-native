# 前后端对接状态总表

更新时间：2026-04-10

| 模块/页面 | 前端位置 | 后端接口 | 状态 | 负责人 | 最后更新 | 备注 |
| --- | --- | --- | --- | --- | --- | --- |
| 角色详情 | `src/app/pages/role-detail/index.tsx` | `/sys/ts-roles/detail`、`/sys/ts-roles/author-public` | 进行中 | - | 2026-04-09 | 数量相关接口暂不对接 |
| 声音编辑 | `src/app/pages/sound-edit/index.tsx` | `/sys/ts-voice-profiles`、`/sys/ts-user-voice-config/current`、`/sys/ts-voice-profiles/preview` | 已对接（精确试听完成） | - | 2026-04-09 | 保持原 UI 布局；试听按 `voiceProfileId` 精确生成 |
| 用户设置 | `src/app/pages/user-setting/index.tsx` | `/sys/user/login/setting/getUserData`、`/sys/user/login/setting/userEdit` | 已对接 | - | 2026-04-09 | 完成昵称/性别/生日读取与保存链路，保持原 UI 布局 |
| 创建人物 | `src/app/pages/create-character/index.jsx` | `/sys/ts-roles/one-click-image`、`/sys/ts-user-image-assets`、`/sys/ts-role-image-profiles` | 已对接（本轮完成） | - | 2026-04-09 | 保持原 UI 布局；接入生成、图库与保存链路 |
| 会话列表 | `src/app/pages/session-list/index.tsx` | `/sys/ts-chat-sessions`、`/sys/ts-chat-messages` | 已对接（本轮完成） | - | 2026-04-10 | 保持原 UI 布局；会话与最近消息改为真实接口 |
| 会话详情 | `src/app/pages/conversation-detail/index.tsx` | `/sys/ts-stories/detail`、`/sys/ts-story-chapters`、`/sys/ts-roles/detail` | 已对接（本轮完成） | - | 2026-04-10 | 保持原 UI 布局；标题/描述/章节/角色列表改为真实接口 |

## 待补接口清单

| 业务点 | 建议接口 | 说明 | 是否已与用户确认 |
| --- | --- | --- | --- |
| Mine 顶部统计（关注/粉丝/点赞） | `GET /sys/user/mine-stats`（建议） | 现有接口无稳定同名字段，前端当前回退 `--` | 否 |

## Mine 对接任务文件（2026-04-09）

- 任务记录：`docs/fe-be-integration/task-mine-page-api-integration-20260409-1851.md`
- 状态：已完成前端可用接口对接；统计接口缺口待用户确认是否补充。

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

