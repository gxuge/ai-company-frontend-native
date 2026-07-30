# Draft 草稿箱对接待办

## 背景

> 2026-07-30 更新：本文原“正式角色/故事表 status 草稿”方案已废弃。当前使用统一 `/sys/ts-drafts`，列表直接返回完整 `content`；`/pages/draft` 已完成列表、卡片映射、删除和 `draftId` 恢复接入。本文其余内容仅保留为历史分析。

`/pages/draft` 用于展示两类草稿：

- `/pages/create-role` 创建中的角色草稿
- `/pages/create-story` 创建中的故事草稿

当前页面已经完成静态 UI 迁移，但还没有接入真实前后端数据。

## 当前现状

### 1. `/pages/draft`

- 目前仍使用静态 `MOCK_DRAFT_LIST`
- 没有真实接口调用
- 没有编辑跳转、删除、数量统计等联动逻辑

### 2. `/pages/create-role`

- 当前“完成并保存”走 `createRole / updateRole`
- `buildSavePayload()` 里写死了 `status: 1`
- `ensureRoleDraft()` 只在生图前触发，不是通用草稿保存入口
- 页面当前不支持通过 `roleId` 回填已有角色草稿

### 3. `/pages/create-story`

- 当前“完成并保存”走 `createStory / updateStory`
- `handleSaveAndNext` 中写死了 `status: 1`
- 页面支持通过 `storyId` 回填故事与章节
- 但当前没有把 `selectedRoles` 持久化为 `roleBindings`
- 因此重进后故事角色列表无法恢复

### 4. 后端现状

- 角色表：`ts_role_info`
- 故事表：`ts_story_info`
- 章节表：`ts_story_chapters`
- 后端列表接口都支持 `status` 查询
- 后端故事保存已经支持 `roleBindings`

## 已确认的关键问题

### P1. 角色页并未真正实现草稿保存

- `create-role` 当前保存状态为 `1`
- 如果要进入草稿箱，角色草稿应以 `status=0` 保存
- 但后端角色详情/归属查询当前将 `status=0` 排除在外
- 这意味着即使前端切到草稿状态，草稿也可能无法再次打开编辑

### P2. 故事页也未真正实现草稿保存

- `create-story` 当前保存状态为 `1`
- 若要作为草稿箱数据源，故事草稿应以 `status=0` 保存

### P3. 故事字段映射存在错位

- 前端保存时传了 `storySetting`
- 但保存 DTO 真正接的是 `siteSetting`
- 当前“故事设定 / 场景设定”在保存链路上存在字段错位风险

### P4. 故事角色未持久化

- 前端有 `selectedRoles`
- 后端有 `roleBindings`
- 但当前保存故事时没有把 `selectedRoles` 映射到 `roleBindings`
- 结果是草稿恢复时无法还原角色头像堆叠和角色列表

### P5. 草稿页是混合列表，不是单表页面

- 角色草稿来自角色表
- 故事草稿来自故事表
- `/pages/draft` 最终需要的是按更新时间聚合后的混合流

### P6. 故事草稿头像展示需要额外数据

- 故事列表接口返回 `roleBindings`
- 但 `roleBindings` 只有 `roleId / roleType / sortNo / joinSource`
- 没有角色名称和头像
- 如果草稿卡片需要头像堆叠，前端还要继续补查角色详情，或者后端提供聚合返回

## 推荐方案

## 方案 A：MVP，优先落地

直接复用现有表和现有接口，不新增草稿专表。

### 前端改造

- `create-role`
  - 新增“保存草稿”链路，保存时写 `status: 0`
  - 最终完成时再更新为 `status: 1`
  - 支持通过 `roleId` 回填编辑
- `create-story`
  - 新增“保存草稿”链路，保存时写 `status: 0`
  - 最终完成时再更新为 `status: 1`
  - 保存时补齐 `roleBindings`
  - 修正 `storySetting / siteSetting / sceneNameSnapshot` 字段映射
- `draft`
  - 并行请求：
    - `tsRoleApi.getRoleList({ status: 0 })`
    - `tsStoryApi.getStoryList({ status: 0 })`
  - 前端聚合后按 `updatedAt desc` 排序
  - 故事卡片按 `roleBindings` 前 3 个角色补查头像

### 后端改造

- 允许角色 `status=0` 的记录被详情查询与编辑归属查询命中
- 保持故事列表可继续按 `status=0` 查询

## 方案 B：正式版，推荐中长期使用

新增聚合接口：

- `GET /sys/ts-drafts`

由后端统一返回混合草稿列表，字段示例：

- `id`
- `draftType`
- `title`
- `updatedAt`
- `summary`
- `coverUrl`
- `roleAvatars`
- `storyMode`
- `sceneName`
- `routeParams`

优点：

- 前端逻辑更干净
- 不需要故事卡片额外 N+1 查角色头像
- `/pages/draft` 与 `/pages/create-page` 草稿数量角标都可以共用一个接口

## `/pages/draft` 字段映射建议

### 角色草稿卡片

- `name` <- `roleName`
- `coverImg` <- `avatarUrl` 或 `coverUrl`
- `lastEdit` <- `updatedAt`
- `bio` <- 优先 `occupation / backgroundStory / dialoguePreview` 组合摘要
- `draftType` <- `character`

### 故事草稿卡片

- `name` <- `title`
- `coverImg` <- `coverUrl`
- `lastEdit` <- `updatedAt`
- `bio` <- `角色数 + storyMode + sceneNameSnapshot`
- `avatars` <- `roleBindings` 对应角色头像前 3 个
- `draftType` <- `story`

## 跳转与交互建议

- 点击角色草稿卡片：
  - 跳转 `/pages/create-role?roleId=<id>`
- 点击故事草稿卡片：
  - 跳转 `/pages/create-story?storyId=<id>`
- 点击删除：
  - 角色调 `DELETE /sys/ts-roles?id=`
  - 故事调 `DELETE /sys/ts-stories?id=`
- 顶部数量：
  - 使用角色草稿数 + 故事草稿数的总和

## 建议实施顺序

1. 修正 `create-story` 保存字段映射
2. 给 `create-story` 保存补上 `roleBindings`
3. 给 `create-role` 增加 `roleId` 回填能力
4. 为角色 / 故事补“保存草稿 = status: 0”链路
5. 放开后端角色草稿详情查询
6. `/pages/draft` 接角色草稿 + 故事草稿双接口聚合
7. 补删除与数量角标
8. 视性能和复杂度决定是否升级为聚合接口 `GET /sys/ts-drafts`

## 风险

- 若继续沿用 `status: 1` 作为草稿，会把草稿和正式内容混在一起
- 若直接切到 `status: 0`，但后端角色详情不放开，角色草稿将无法恢复编辑
- 若故事不保存 `roleBindings`，草稿页故事卡片将缺少角色信息
- 若不做聚合接口，故事卡头像展示会出现前端 N+1 请求

## 证据索引

- 角色保存链路：`src/components/pages/create-role/create-character.tsx`
- 故事保存链路：`src/app/pages/create-story/index.tsx`
- 草稿页静态数据：`src/app/pages/draft/index.tsx`
- 角色列表/详情查询规则：`TsRoleMapper.xml`
- 故事列表查询规则：`TsStoryMapper.xml`
- 故事保存 DTO：`TsStorySaveDto.java`
- 故事服务角色绑定逻辑：`TsStoryServiceImpl.java`

## 下一步建议

下一步可直接按“方案 A / MVP”开始实施：

- 先改保存链路和恢复链路
- 再接 `/pages/draft`
- 最后视需要抽成后端聚合接口
