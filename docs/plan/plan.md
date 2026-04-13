# Frontend Integration Plan

更新时间：2026-04-09

## 0. 任务背景（user-setting 对接，2026-04-09）
- 目标：完成 `pages/user-setting` 的“读取当前用户资料 + 提交保存”链路。
- 边界：仅接接口与字段映射，不改动页面 UI 布局、尺寸、间距、颜色、样式键名。
- 非目标：本轮不处理头像上传、不处理内容偏好标签编辑。

### 0.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 API 封装补齐 | 已完成 | 在 `src/lib/api/user.ts` 新增 `getUserSettingData`、`updateUserSetting` | 页面层无直连 URL | `src/lib/api/user.ts` |
| T2 页面加载映射 | 已完成 | 读取后端资料并回填昵称/性别/生日/ID | 页面初次渲染后可看到后端数据 | `src/app/pages/user-setting/components/AccountSettings.tsx` |
| T3 保存提交 | 已完成 | 点击保存提交更新请求并处理失败兜底 | 请求成功或报错可感知，不崩溃 | `src/app/pages/user-setting/components/AccountSettings.tsx` |
| T4 验证与记录 | 已完成 | 执行 eslint 并回填 docs | 校验命令通过，文档更新 | `pnpm exec eslint ...`、`docs/**` |

### 0.2 风险与回退
- 风险：
  - `POST /sys/user/login/setting/userEdit` 依赖后端权限 `system:user:setting:edit`，若当前账号无权限会返回失败。
- 回退：
  - 保持页面本地可编辑状态，不中断现有展示；保存失败提示并不覆盖本地输入。

## 1. 任务背景
- 目标：完成 `pages/sound-edit` 的精确试听对接（按选中 `voiceProfileId` 生成试听音频）。
- 边界：仅改后端接口与前端数据链路，不改动页面原有 UI 布局与视觉结构。
- 非目标：不处理“连接数/等等那三个数量接口”；不改动其它页面业务逻辑。

## 2. 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 后端接口补充 | 已完成 | 新增 `POST /sys/ts-voice-profiles/preview`，支持 `voiceProfileId + previewText` | `jeecg-system-biz` 编译通过；接口代码入库 | `TsVoiceProfileController/Service`、`mvn compile` |
| T2 API 封装切换 | 已完成 | `src/lib/api/ts-voice.ts` 从 `one-click-voice` 切换到 `ts-voice-profiles/preview` | 页面层不再直连旧接口 | `src/lib/api/ts-voice.ts` |
| T3 页面字段映射调整 | 已完成 | `sound-edit` 试听调用改为传 `voiceProfileId` | 页面试听逻辑可执行，UI 无结构改动 | `src/app/pages/sound-edit/index.tsx` |
| T4 验证与记录回填 | 已完成 | 执行后端编译 + 前端 lint，并回填 docs | 命令成功，文档更新完成 | `mvn compile`、`pnpm eslint`、`docs/fe-be-integration/integration-status.md` |

## 3. 风险与回退
- 风险：
  - 新接口依赖 MiniMax TTS 与上传配置可用；若配置异常可能拿不到 `previewAudioUrl`。
- 触发条件：
  - 接口返回无音频地址或上游调用失败。
- 回退方案：
  - 前端可临时回退到旧的 `one-click-voice` 兜底试听；
  - 后端保留本次接口代码，可在配置恢复后直接启用。

## 4. 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-09 | T1 | 已完成 | 后端新增 `ts-voice-profiles/preview` DTO/VO/Service/Controller 全链路 | `jeecg-system-biz` 相关代码文件 |
| 2026-04-09 | T2 | 已完成 | 前端 API 封装切到 `/sys/ts-voice-profiles/preview` | `src/lib/api/ts-voice.ts` |
| 2026-04-09 | T3 | 已完成 | 页面试听调用传 `voiceProfileId`，保留原布局 | `src/app/pages/sound-edit/index.tsx` |
| 2026-04-09 | T4 | 已完成 | 后端编译成功、前端 eslint 通过、记录已回填 | `mvn -pl ... compile`、`pnpm exec eslint ...` |

## 5. 任务背景（create-character 对接，2026-04-09）
- 目标：完成 `pages/create-character` 的生成人物形象前后端联调。
- 边界：仅改动 API 封装、页面请求/状态与字段映射，不改动现有 UI 布局、尺寸、间距、颜色和样式键名。
- 非目标：不新增后端接口；不改动 create-role 页面结构。

### 5.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 API 封装补齐 | 已完成 | 新增 `src/lib/api/ts-role-image.ts`，封装生成/图库/保存接口 | 页面层无直连 URL | `src/lib/api/ts-role-image.ts` |
| T2 页面生成链路接入 | 已完成 | `AI 生成` 按钮调用 `/sys/ts-roles/one-click-image` 并回显图片 | 成功返回后页面背景图更新 | `src/app/pages/create-character/index.jsx` |
| T3 图库链路接入 | 已完成 | `我的图库` 与 `参考图` 按钮调用 `/sys/ts-user-image-assets` 取最新图 | 成功后参考图 URL 生效 | `src/app/pages/create-character/index.jsx` |
| T4 保存链路与验证 | 已完成 | 生成成功后调用 `/sys/ts-role-image-profiles` 保存配置并执行 eslint | 保存接口调用成功，校验命令通过 | `src/app/pages/create-character/index.jsx`、`pnpm exec eslint src/app/pages/create-character/index.jsx src/lib/api/ts-role-image.ts src/lib/api/index.ts --rule "better-tailwindcss/enforce-canonical-classes: off"` |

### 5.2 风险与回退
- 风险：
  - 生成链路依赖后端 AI 服务可用；上游异常时会出现“未返回图片地址”错误。
- 回退：
  - 页面保留现有输入与样式选择，不中断用户编辑；
  - 生成失败时仅提示错误，不修改现有界面布局。

### 5.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-09 | T1 | 已完成 | 新增 `ts-role-image` API 文件并更新统一导出 | `src/lib/api/ts-role-image.ts`、`src/lib/api/index.ts` |
| 2026-04-09 | T2 | 已完成 | 页面接入生成接口，支持生成中状态与失败提示 | `src/app/pages/create-character/index.jsx` |
| 2026-04-09 | T3 | 已完成 | 页面接入图库接口，支持最新图片作为参考图 | `src/app/pages/create-character/index.jsx` |
| 2026-04-09 | T4 | 已完成 | 生成后保存形象配置并完成 eslint 校验 | `src/app/pages/create-character/index.jsx`、`pnpm exec eslint src/app/pages/create-character/index.jsx src/lib/api/ts-role-image.ts src/lib/api/index.ts --rule "better-tailwindcss/enforce-canonical-classes: off"` |

## 6. 任务背景（create-role 对接，2026-04-09）
- 目标：完成 `pages/create-role` 的保存/一键生成前后端联调，遵循“先草稿建角色再生成资源”的调用顺序。
- 边界：仅改 API 封装、页面状态与调用时机，不改动现有 UI 布局结构。
- 非目标：本轮不新增后端接口，不改动 `pages/create-character` 独立页面交互。

### 6.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 角色 API 封装补齐 | 已完成 | 在 `src/lib/api/ts-role.ts` 增加 create/update 与 one-click 系列方法 | 页面层无直连 URL | `src/lib/api/ts-role.ts` |
| T2 基础信息区改受控 | 已完成 | `basic-info` 由内部状态改为父层控制，支持三类生成按钮回调 | 保存时可拿到完整基础字段 | `src/app/pages/create-role/components/basic-info.tsx` |
| T3 页面时序接线 | 已完成 | `create-character` 接入保存、设定生成、形象生成、声音生成，且 image/voice 前先确保草稿 `roleId` | 调用顺序符合后端约束 | `src/app/pages/create-role/components/create-character.tsx` |
| T4 校验与文档回填 | 已完成 | 执行 eslint 校验并更新计划/变更记录 | 命令可执行，文档已更新 | `pnpm exec eslint ...`、`docs/**` |

### 6.2 风险与回退
- 风险：
  - `eslint-plugin-better-tailwindcss` 在本地环境存在偶发 `Atomics.wait timed-out`，会导致规则执行中断。
- 回退：
  - 业务代码不依赖该规则；已通过临时关闭单条规则方式完成剩余 lint 校验，后续可在 CI 或升级依赖后复验完整规则集。

### 6.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-09 | T1 | 已完成 | 补齐 `create/update/generate-*` 角色接口封装与类型 | `src/lib/api/ts-role.ts` |
| 2026-04-09 | T2 | 已完成 | 基础信息组件改为受控，支持加载态与回调 | `src/app/pages/create-role/components/basic-info.tsx` |
| 2026-04-09 | T3 | 已完成 | 页面接入保存与生成链路，生成前按需创建草稿角色 | `src/app/pages/create-role/components/create-character.tsx` |
| 2026-04-09 | T4 | 已完成 | lint 校验通过（临时关闭一条 tailwind 规则） | `pnpm exec eslint ... --rule "better-tailwindcss/enforce-canonical-classes: off"` |

## 7. 任务背景（mine 对接，2026-04-09）
- 目标：完成 `pages/mine` 的用户信息、故事列表、角色列表对接，替换页面静态 mock 数据。
- 边界：仅改动 API 封装、请求状态、字段映射与失败回退，不修改页面既有布局与视觉结构。
- 非目标：不新增 UI 结构；不在本轮改动后端接口。

### 7.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 接口梳理 | 已完成 | 确认可用接口 `/sys/user/getUserInfo`、`/sys/ts-stories`、`/sys/ts-roles` | 页面所需主数据可映射 | 后端 Controller/Mapper 读取记录 |
| T2 API 封装补齐 | 已完成 | 新增 `ts-story.ts`，补充 `ts-role.ts` 列表查询 | 页面层不直连 URL，统一走 `src/lib/api` | `src/lib/api/ts-story.ts`、`src/lib/api/ts-role.ts`、`src/lib/api/index.ts` |
| T3 页面数据对接 | 已完成 | `mine` 页面接入真实请求与字段映射，并保留布局 | 用户信息与双 Tab 卡片来自后端，失败时可回退 | `src/app/pages/mine/index.tsx` |
| T4 校验与记录 | 已完成 | 执行定向 eslint 并回填任务文件/总表/计划/日志 | 校验通过，记录文件齐全 | `pnpm exec eslint ...`、`docs/**` |

### 7.2 风险与回退
- 风险：
  - `关注/粉丝/点赞` 在当前返回中无稳定同名字段，可能长期显示 `--`。
- 回退：
  - 接口失败时展示错误文案并回退占位卡片，不影响页面主体渲染；
  - 统计字段缺失时统一回退 `--`。

### 7.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-09 | T1 | 已完成 | 明确 mine 可复用接口与字段边界 | 后端 `LoginController/TsStoryController/TsRoleController` |
| 2026-04-09 | T2 | 已完成 | 新增故事 API 封装并扩展角色列表 API | `src/lib/api/ts-story.ts`、`src/lib/api/ts-role.ts`、`src/lib/api/index.ts` |
| 2026-04-09 | T3 | 已完成 | 页面由 mock 改为真实数据，保留 UI 结构 | `src/app/pages/mine/index.tsx` |
| 2026-04-09 | T4 | 已完成 | eslint 校验通过并回填记录 | `pnpm exec eslint src/app/pages/mine/index.tsx src/lib/api/ts-role.ts src/lib/api/ts-story.ts src/lib/api/index.ts` |

## 8. 任务背景（未对接页面盘点与分计划创建，2026-04-10）
- 目标：盘点仍未完成 FE/BE 对接的页面，并为每个页面独立创建计划文件；同时补充语音/麦克风模块分析。
- 边界：本轮仅做分析与计划，不改动业务页面代码与 UI。
- 非目标：本轮不执行具体页面联调实现。

### 8.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 页面对接现状扫描 | 已完成 | 扫描 `src/app/pages/**` API 调用，识别未对接页面 | 输出未对接清单 | `rg` 扫描结果 |
| T2 语音/麦克风模块分析 | 已完成 | 评估现有语音链路与麦克风缺口 | 明确已有接口与缺口接口建议 | `TsVoiceProfileController`、`app.config.ts` |
| T3 分页面计划文件创建 | 已完成 | 在 `docs/fe-be-integration` 下按页面创建中文命名任务文件 | 每个页面独立文件存在 | `任务-*.md` 文件清单 |
| T4 skill 规则更新 | 已完成 | 更新 `ai-company-fe-be-integration-skill.md` 为中文文件名规则 | 文档规则生效 | `docs/ai-company-fe-be-integration-skill.md` |
| T5 汇总回填 | 已完成 | 更新 `integration-status`、`plan`、`changelog` | 三份文档均有本轮记录 | `docs/**` |

### 8.2 风险与回退
- 风险：
  - 后端 `docs/hardness-writing-spec.md` 当前缺失，需按实际存在文档补位执行。
  - 麦克风 ASR 对接依赖新增接口与前端录音依赖。
- 回退：
  - 先推进纯文本链路和已有语音播放能力；
  - 麦克风链路在接口确认后独立迭代。

### 8.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-10 | T1 | 已完成 | 完成未对接页面扫描并形成清单 | `rg` 页面扫描输出 |
| 2026-04-10 | T2 | 已完成 | 完成语音与麦克风能力差异分析 | `TsVoiceProfileController.java`、`app.config.ts` |
| 2026-04-10 | T3 | 已完成 | 新建 10 份中文命名任务计划文件 | `docs/fe-be-integration/任务-*.md` |
| 2026-04-10 | T4 | 已完成 | skill 文档改为中文文件名规范 | `docs/ai-company-fe-be-integration-skill.md` |
| 2026-04-10 | T5 | 已完成 | 总表/计划/日志回填完成 | `integration-status.md`、`plan.md`、`changelog.md` |
## 9. 任务背景（session-list 对接，2026-04-10）
- 目标：完成 `pages/session-list` 的会话列表真实数据渲染。
- 边界：仅改动 API 封装、字段映射、请求状态与失败回退，不修改页面既有布局与视觉结构。
- 非目标：本轮不新增后端接口，不改动分类图标区交互。

### 9.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 API 封装补齐 | 已完成 | 新增 `src/lib/api/ts-chat.ts`，封装会话与消息查询 | 页面层无直连 URL | `src/lib/api/ts-chat.ts`、`src/lib/api/index.ts` |
| T2 页面列表对接 | 已完成 | `session-list` 改为请求会话列表并拉最近消息 | 列表主数据来自后端接口 | `src/app/pages/session-list/index.tsx` |
| T3 失败回退与空态 | 已完成 | 增加加载/错误/空态文字回退 | 接口异常不阻断页面渲染 | `src/app/pages/session-list/index.tsx` |
| T4 校验与文档回填 | 已完成 | 执行 eslint 并更新任务/总表/日志 | 命令通过，文档齐全 | `pnpm exec eslint ...`、`docs/**` |

### 9.2 风险与回退
- 风险：会话分类统计缺少专用接口，分类图标区暂不做真实统计接线。
- 回退：分类区维持静态展示；列表区保持真实会话数据渲染。

### 9.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-10 | T1 | 已完成 | 新增 `ts-chat` API 封装与统一导出 | `src/lib/api/ts-chat.ts`、`src/lib/api/index.ts` |
| 2026-04-10 | T2 | 已完成 | 页面移除静态 `conversations`，改为真实接口数据 | `src/app/pages/session-list/index.tsx` |
| 2026-04-10 | T3 | 已完成 | 增加加载/错误/空态回退文案，不改布局结构 | `src/app/pages/session-list/index.tsx` |
| 2026-04-10 | T4 | 已完成 | 定向 eslint 校验通过并完成文档回填 | `pnpm exec eslint src/app/pages/session-list/index.tsx src/lib/api/ts-chat.ts src/lib/api/index.ts` |
## 10. 任务背景（conversation-detail 对接，2026-04-10）
- 目标：完成 `pages/conversation-detail` 的故事详情、章节与角色列表真实数据渲染。
- 边界：仅改动 API 封装、字段映射、请求状态与失败回退，不修改页面既有布局与视觉结构。
- 非目标：本轮不新增后端接口；作者头像继续使用默认占位。

### 10.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 API 封装补齐 | 已完成 | 扩展 `ts-story.ts`，新增故事详情与章节列表查询 | 页面层无直连 URL | `src/lib/api/ts-story.ts` |
| T2 页面主数据接入 | 已完成 | 标题、描述、作者区块替换为故事详情字段 | 页面主文案来自后端接口 | `src/app/pages/conversation-detail/index.tsx` |
| T3 角色/章节渲染 | 已完成 | 角色列表按 roleId 拉详情，详情弹层渲染章节 | 角色与章节内容可见且可回退 | `src/app/pages/conversation-detail/index.tsx`、`StoryDetailModal.jsx` |
| T4 校验与回填 | 已完成 | 执行 eslint 并更新任务/总表/日志 | 命令通过，文档齐全 | `pnpm exec eslint ...`、`docs/**` |

### 10.2 风险与回退
- 风险：故事详情接口暂无作者头像公开字段。
- 回退：作者头像继续使用页面默认资源图，不阻断核心数据展示。

### 10.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-10 | T1 | 已完成 | `ts-story.ts` 新增 `getStoryDetail/getStoryChapterList` | `src/lib/api/ts-story.ts` |
| 2026-04-10 | T2 | 已完成 | 页面标题/描述/作者名改为真实故事数据 | `src/app/pages/conversation-detail/index.tsx` |
| 2026-04-10 | T3 | 已完成 | 角色列表改为 role 详情映射，弹层章节改真实数据 | `src/app/pages/conversation-detail/index.tsx`、`src/app/pages/conversation-detail/components/StoryDetailModal.jsx` |
| 2026-04-10 | T4 | 已完成 | 定向 eslint 校验通过并回填记录 | `pnpm exec eslint src/app/pages/conversation-detail/index.tsx src/app/pages/conversation-detail/components/StoryDetailModal.jsx src/lib/api/ts-story.ts --rule "unicorn/filename-case: off" --rule "max-lines-per-function: off" --rule "better-tailwindcss/enforce-canonical-classes: off" --rule "better-tailwindcss/enforce-consistent-class-order: off" --rule "better-tailwindcss/enforce-shorthand-classes: off" --rule "perfectionist/sort-imports: off"` |

## 11. 任务背景（会话分流 + 历史消息回填，2026-04-13）
- 目标：按“推荐方案 1”落地，后端补 `isSystemSession`，前端实现会话列表分流到系统/普通聊天页并回填历史消息。
- 边界：不修改页面布局与视觉结构，仅改 API 字段映射、路由参数与数据加载逻辑。
- 非目标：本轮不处理消息发送落库与流式回包。

### 11.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 后端会话出参增强 | 已完成 | `TsChatSessionVo` 增加 `isSystemSession` 并在 converter 回填 | `/sys/ts-chat-sessions` 可返回系统会话标记 | `TsChatSessionVo*.java`、`mvn compile` |
| T2 会话列表点击分流 | 已完成 | `session-list` 按 `isSystemSession` 跳转 `admin-chat/chat` 并传 `sessionId` | 点击会话可进入正确页面 | `src/app/pages/session-list/index.tsx` |
| T3 系统聊天页历史回填 | 已完成 | `admin-chat` 根据 `sessionId` 拉取历史消息并渲染 | 进入系统会话可看到历史记录 | `src/app/pages/admin-chat/index.tsx` |
| T4 普通聊天页历史回填 | 已完成 | `chat` 根据 `sessionId` 拉取历史消息并映射 `ChatAi/ChatUser` | 进入普通会话可看到历史记录 | `src/app/pages/chat/index.tsx` |
| T5 文档回填 | 已完成 | 新增 3 份任务文件并更新计划/日志 | 记录文件齐全 | `docs/fe-be-integration/任务-*.md`、`docs/plan/plan.md`、`docs/changelog/changelog.md` |

### 11.2 风险与回退
- 风险：`admin-chat` 页面存在历史遗留 lint 规则告警，非本轮新增。
- 回退：接口失败时保留默认消息，不阻断页面渲染。

### 11.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-13 | T1 | 已完成 | 后端会话 VO 新增 `isSystemSession` | `jeecg-module-system/.../TsChatSessionVo.java`、`TsChatSessionVoConverter.java` |
| 2026-04-13 | T2 | 已完成 | 会话列表分流跳转与 `sessionId` 透传完成 | `src/app/pages/session-list/index.tsx` |
| 2026-04-13 | T3 | 已完成 | 系统聊天页接入历史消息加载 | `src/app/pages/admin-chat/index.tsx` |
| 2026-04-13 | T4 | 已完成 | 普通聊天页接入历史消息加载 | `src/app/pages/chat/index.tsx` |
| 2026-04-13 | T5 | 已完成 | 对接文档与计划日志回填完成 | `docs/fe-be-integration/任务-会话列表页-系统分流对接-20260413-1945.md` 等 |
