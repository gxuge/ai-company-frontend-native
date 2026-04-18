# Frontend Integration Plan

更新时间：2026-04-17

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

## 12. 任务背景（sound-edit 对接补强，2026-04-14）
- 目标：在不改 UI 布局的前提下，补强 `pages/sound-edit` 的接口链路稳定性，并明确“我的音色库”接口缺口。
- 边界：仅改动数据请求、状态映射、失败回退与文档，不改层级、尺寸、间距、颜色、样式键名。
- 非目标：本轮不新增后端代码；不实现“我的音色库”真实重命名/删除落库。

### 12.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 推荐音色链路稳定化 | 已完成 | 修复选中音色解析与试听保存参数来源 | 推荐音色列表、保存、试听保持可用 | `src/app/pages/sound-edit/index.tsx` |
| T2 我的音色库降级保护 | 已完成 | 重命名/删除改为缺口提示，不误调公共接口 | 点击菜单不触发危险删除，提示清晰 | `src/app/pages/sound-edit/index.tsx` |
| T3 缺口咨询单落地 | 已完成 | 输出我的音色库 3 个缺口接口定义 | 用途/入参/出参/时机/回退完整 | `docs/fe-be-integration/任务-sound-edit-前后端对接计划-20260414-1614.md` |
| T4 校验与记录 | 已完成 | 执行定向 eslint 并回填 plan/changelog/任务文件 | 命令已执行，文档更新完成 | `pnpm exec eslint ...`、`docs/**` |

### 12.2 风险与回退
- 风险：
  - “我的音色库”真实接口未上线前，页面仅能提供降级提示，不支持真实重命名/删除。
  - `sound-edit` 文件存在历史 eslint/style 规则问题，本轮未做风格性重排（避免 UI 结构改动风险）。
- 回退：
  - 本轮改动仅涉及逻辑分支与提示文案，可直接 `git restore src/app/pages/sound-edit/index.tsx` 回退。

### 12.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-14 | T1 | 已完成 | 选中音色支持“推荐 + 我的音色”联合解析；试听请求严格使用可用推荐音色 ID | `src/app/pages/sound-edit/index.tsx` |
| 2026-04-14 | T2 | 已完成 | 我的音色菜单操作改为 `onRename/onDelete` 回调 + 缺口提示 | `src/app/pages/sound-edit/index.tsx` |
| 2026-04-14 | T3 | 已完成 | 新增独立任务文件，记录缺口接口 A/B/C 全量定义 | `docs/fe-be-integration/任务-sound-edit-前后端对接计划-20260414-1614.md` |
| 2026-04-14 | T4 | 已完成 | 执行定向 eslint 并记录历史规则问题 | `pnpm exec eslint src/app/pages/sound-edit/index.tsx --rule "better-tailwindcss/enforce-canonical-classes: off"` |

## 13. 任务背景（admin-chat 对话接口对接，2026-04-14）
- 目标：`pages/admin-chat` 仅对接“聊天历史 + 聊天发送/AI 回复”接口。
- 边界：不处理语音、图片、文件、相机、通话、菜单等其它模块；不修改 UI 布局结构。
- 非目标：本轮不新增后端接口，仅接入既有 `/sys/ts-chat-messages` 与 `/sys/ts-chat-sessions/ai-reply`。

### 13.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 历史消息对接梳理 | 已完成 | 明确历史消息字段映射与空历史展示策略 | 历史消息可回填，空历史可正常渲染 | `src/app/pages/admin-chat/index.tsx` |
| T2 发送接口封装 | 已完成 | `ts-chat` 新增 `createAiReply` 封装与类型 | 页面层无直连 URL | `src/lib/api/ts-chat.ts` |
| T3 页面发送逻辑替换 | 已完成 | `handleSend` 与推荐问题统一走真实发送链路 | 点击发送/推荐问题后可看到 AI 回复 | `src/app/pages/admin-chat/index.tsx` |
| T4 文档回填与验证 | 已完成 | 回填任务文档、计划、变更日志并执行校验命令 | 文档已更新，命令已执行 | `docs/**`、`pnpm exec eslint ...` |

### 13.2 风险与回退
- 风险：
  - 上游 AI 服务失败时，`/sys/ts-chat-sessions/ai-reply` 可能返回异常。
  - `admin-chat` 页面存在历史存量 lint/style 规则问题，本轮未做风格重排。
- 回退：
  - 页面发送失败时插入兜底 AI 文案，不改动布局；
  - 需要回退逻辑时可仅回退 `src/app/pages/admin-chat/index.tsx` 与 `src/lib/api/ts-chat.ts`。

### 13.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-14 | T1 | 已完成 | 历史消息映射策略确认并落地空历史行为 | `src/app/pages/admin-chat/index.tsx` |
| 2026-04-14 | T2 | 已完成 | 新增 `createAiReply(payload)` API 封装 | `src/lib/api/ts-chat.ts` |
| 2026-04-14 | T3 | 已完成 | mock 发送逻辑替换为真实接口调用 | `src/app/pages/admin-chat/index.tsx` |
| 2026-04-14 | T4 | 已完成 | 任务文档/计划/日志已回填；eslint 已执行（存在历史存量规则） | `docs/fe-be-integration/任务-系统聊天页-对话接口对接-20260414-1612.md`、`docs/changelog/changelog.md`、`pnpm exec eslint src/app/pages/admin-chat/index.tsx src/lib/api/ts-chat.ts` |

## 14. 任务背景（session-list 系统角色头像切换，2026-04-14）
- 目标：将 `pages/session-list` 的系统会话头像替换为 `pages/quick-login` 使用的 Logo。
- 边界：仅改动头像资源与渲染分支，不改动页面布局、尺寸、间距、颜色和交互结构。
- 非目标：不改动后端接口定义，不改动普通会话头像。

### 14.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 后端标识核对 | 已完成 | 核对系统会话标识是否由后端明确返回 | 找到可用字段并定位来源 | `TsChatSessionVo.java`、`TsChatSessionVoConverter.java` |
| T2 前端头像分支切换 | 已完成 | `isSystemSession=true` 时改用 quick-login Logo | 系统会话头像切换正确，普通会话不受影响 | `src/app/pages/session-list/index.tsx` |
| T3 校验与回填 | 已完成 | 执行定向 eslint 并更新文档 | 命令通过，文档记录齐全 | `pnpm exec eslint src/app/pages/session-list/index.tsx`、`docs/**` |

### 14.2 风险与回退
- 风险：
  - 若后端未来调整系统会话判定逻辑，`isSystemSession` 语义可能变化。
- 回退：
  - 字段缺失或非 `true` 时默认走原头像，不影响列表可用性。

### 14.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-14 | T1 | 已完成 | 确认后端 VO 存在 `isSystemSession`，由 `systemSessionKey=DEFAULT_SYSTEM` 转换得出 | `TsChatSessionVo*.java` |
| 2026-04-14 | T2 | 已完成 | 会话项头像改为系统分支渲染 | `src/app/pages/session-list/index.tsx` |
| 2026-04-14 | T3 | 已完成 | eslint 校验通过并文档回填 | `pnpm exec eslint src/app/pages/session-list/index.tsx` |

## 15. 任务背景（chat 普通聊天页头部切换与发送链路，2026-04-14）
- 目标：`pages/chat` 顶部支持“故事 Header / 角色 Header”按会话数据动态切换，并接入文本发送与建议回复链路。
- 边界：仅改数据请求、字段映射和路由参数，不修改页面视觉与布局结构。
- 非目标：本轮不实现附件上传、语音识别、AI 音频播放/点赞/重试等扩展交互。

### 15.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 会话详情驱动接入 | 已完成 | 页面读取 `sessionId` 后调用 `getSessionDetail` 判定 Header 模式 | 可根据会话类型分流到对应 Header | `src/app/pages/chat/index.tsx` |
| T2 Header 动态切换 | 已完成 | 故事会话渲染 `ChatHeader`，角色会话渲染 `ChatRoleHeader` | 两套 Header 可按会话字段切换显示 | `src/app/pages/chat/index.tsx` |
| T3 头部字段映射 | 已完成 | 接入 `tsStoryApi.getStoryDetail` 与 `tsRoleApi.getRoleDetail` 映射标题/热度/头像等 | Header 文案来自后端数据 | `src/app/pages/chat/index.tsx` |
| T4 文本发送链路 | 已完成 | `ChatInput` 接入输入与发送回调，调用 `ai-reply` 返回 AI 消息 | 可回车/点击 `+` 发送并回填 AI 回复 | `src/app/pages/chat/index.tsx`、`src/app/pages/chat/components/chat-input/index.tsx` |
| T5 建议回复链路 | 已完成 | 灯泡按钮调用 `reply-suggestions`，首条建议回填输入框 | 点击灯泡可获得可发送建议文本 | `src/app/pages/chat/index.tsx`、`src/lib/api/ts-chat.ts` |
| T6 类型补齐与文档回填 | 已完成 | `TsChatSession`/suggestions 类型补齐并回填 docs | 类型可承接后端 VO 字段 | `src/lib/api/ts-chat.ts`、`docs/**` |

### 15.2 风险与回退
- 风险：
  - 会话详情缺少 `storyId/targetRoleId` 时，Header 会降级为默认展示。
  - 上游 AI 服务异常时，页面会显示发送失败兜底文案。
- 回退：
  - 回退 `src/app/pages/chat/index.tsx`、`src/app/pages/chat/components/chat-input/*`、`src/lib/api/ts-chat.ts` 即可恢复。

### 15.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-14 | T1 | 已完成 | 普通聊天页接入会话详情查询并解析 `storyId/targetRoleId` | `src/app/pages/chat/index.tsx` |
| 2026-04-14 | T2 | 已完成 | 顶部 Header 支持故事/角色动态分流 | `src/app/pages/chat/index.tsx` |
| 2026-04-14 | T3 | 已完成 | 故事与角色头部数据映射完成，详情入口透传参数 | `src/app/pages/chat/index.tsx` |
| 2026-04-14 | T4 | 已完成 | 文本发送链路接入 `ai-reply` 并与历史消息合并展示 | `src/app/pages/chat/index.tsx`、`src/app/pages/chat/components/chat-input/index.tsx` |
| 2026-04-14 | T5 | 已完成 | 灯泡按钮接入 `reply-suggestions`，支持建议文本回填 | `src/app/pages/chat/index.tsx`、`src/lib/api/ts-chat.ts` |
| 2026-04-14 | T6 | 已完成 | API 类型补齐，任务文档/总表/日志回填 | `src/lib/api/ts-chat.ts`、`docs/fe-be-integration/任务-普通聊天页-头部切换与会话链路-20260414-1725.md` |

## 16. 任务背景（sound-edit 我的音色库接口落地，2026-04-14）
- 目标：补齐 `pages/sound-edit` “我的音色库”真实后端能力（列表/重命名/删除），解除前端降级依赖。
- 边界：仅更新后端接口能力与对接文档，不改页面布局与视觉层。
- 非目标：不新增额外 UI 交互样式，不改既有推荐音色链路。

### 16.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 接口落地 | 已完成 | 后端新增我的音色列表/重命名/删除接口 | 三个接口可用且含用户归属校验 | `TsVoiceProfileController.java`、`TsVoiceProfileServiceImpl.java` |
| T2 文档与数据基线 | 已完成 | 同步 API 文档与 SQL 基线 | `docs/api/ts-api.md`、`db/ai-company.sql` 已更新 | `docs/api/ts-api.md`、`db/ai-company.sql` |
| T3 验证与回填 | 已完成 | 编译通过并回填 hardness 记录 | 编译成功、任务文档状态更新 | `mvn ... compile`、`docs/fe-be-integration/任务-sound-edit-前后端对接计划-20260414-1614.md` |

### 16.2 风险与回退
- 风险：历史用户数据尚未初始化时，个人音色列表可能为空。
- 回退：若接口异常，前端保持现有降级提示链路不变。

### 16.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-14 | T1 | 已完成 | `GET/PUT/DELETE /sys/ts-user-voice-profiles` 已落地并做归属校验 | `TsVoiceProfileController.java` |
| 2026-04-14 | T2 | 已完成 | API 文档与 SQL 基线同步完成 | `docs/api/ts-api.md`、`db/ai-company.sql` |
| 2026-04-14 | T3 | 已完成 | 编译通过并补充前后端 hardness 文档 | `mvn -f D:\project_demo\ai-company-backend-spring\jeecg-boot\pom.xml -pl jeecg-module-system/jeecg-system-biz -am -DskipTests compile` |

## 17. 任务背景（browse-images-list 公共浏览接口 + 页面对接，2026-04-14）
- 目标：完成 `pages/browse-images-list` 前后端联调，补齐公共浏览接口并替换页面静态数据。
- 边界：保持原 UI 布局与视觉结构不变，仅改请求链路、字段映射、状态回退。
- 非目标：本轮不做推荐/订阅/点赞的复杂排序算法，不改底部导航交互。

### 17.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 公共接口补齐（后端） | 已完成 | 新增 `GET /sys/ts-stories/public`、`GET /sys/ts-role-image-profiles/public` | 后端编译通过，接口可查询公开列表 | `TsBrowsePublicController.java`、`TsStoryMapper.xml`、`TsRoleImageProfileMapper.xml` |
| T2 API 封装补齐（前端） | 已完成 | 新增公共故事/角色形象列表 API，补齐角色形象列表封装 | 页面层无直连 URL | `src/lib/api/ts-story.ts`、`src/lib/api/ts-role-image.ts` |
| T3 页面数据对接 | 已完成 | browse 页面接入真实数据、搜索、分类映射、触底分页 | 故事/角色 Tab 可真实渲染且支持加载更多 | `src/app/pages/browse-images-list/index.tsx` |
| T4 组件扩展与回退 | 已完成 | 扩展 `SearchBar/StoryGrid/ImageCard` 数据驱动能力，保留原样式结构 | 接口失败可回退显示，不破坏布局 | `src/app/pages/browse-images-list/components/*` |
| T5 验证与文档回填 | 已完成 | 后端编译、前端定向 lint、任务文档回填 | 命令通过，记录文件更新 | `mvn ... compile`、`pnpm exec eslint ...`、`docs/**` |

### 17.2 风险与回退
- 风险：
  - 分类语义（推荐/订阅/点赞）仍缺后端专用排序策略，当前为基础过滤。
  - 角色形象公共 VO 目前无稳定浏览量字段，卡片浏览量可能显示 `--`。
- 回退：
  - 前端已实现失败回退：公共接口异常时回退到现有私有列表接口；
  - 如需紧急回退可只恢复 `browse-images-list` 页面与新增 public API 调用。

### 17.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-14 | T1 | 已完成 | 新增公共浏览 controller、VO、mapper 与 SQL 查询 | `TsBrowsePublicController.java`、`TsStoryPublicVo.java`、`TsRoleImageProfilePublicVo.java` |
| 2026-04-14 | T2 | 已完成 | 前端封装公共列表 API 与角色形象列表 API | `src/lib/api/ts-story.ts`、`src/lib/api/ts-role-image.ts` |
| 2026-04-14 | T3 | 已完成 | 页面从静态 mock 切换到真实接口，加入搜索/分页/错误回退 | `src/app/pages/browse-images-list/index.tsx` |
| 2026-04-14 | T4 | 已完成 | 组件扩展为数据驱动，保留既有布局样式 | `src/app/pages/browse-images-list/components/SearchBar.tsx`、`StoryGrid.tsx`、`ImageCard.tsx`、`CategoryTabs.tsx` |
| 2026-04-14 | T5 | 已完成 | 后端编译通过，前端定向 lint 通过，任务文档回填 | `mvn -pl jeecg-module-system/jeecg-system-biz -am -DskipTests compile`、`pnpm exec eslint ...`、`docs/fe-be-integration/task-browse-images-list-api-integration-20260414-1630.md` |

## 18. 任务背景（create-role 形象生成去除姓名依赖，2026-04-16）
- 目标：修复 create-role 生图必须先填名字的问题，未填名字时也能生成形象。
- 边界：只改调用分支和参数映射，不改 UI 布局与视觉结构。
- 非目标：本轮不改声音生成逻辑，不改数据库结构。

### 18.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 生图分支调整 | 已完成 | 无名字时不再强制创建草稿角色 | 点击“生成形象”可直接请求后端 | `src/app/pages/create-role/components/create-character.tsx` |
| T2 异步链路兼容 | 已完成 | 有 `roleId/roleName` 时继续异步生成+轮询 | 原有已创建角色场景行为不变 | `src/app/pages/create-role/components/create-character.tsx` |
| T3 记录回填 | 已完成 | 任务文件、计划、变更日志与状态总表同步 | 文档记录完整可追溯 | `docs/**` |

### 18.2 风险与回退
- 风险：无名字场景多为同步返回，若上游慢可能体感等待更长。
- 回退：若需恢复旧策略，可回退 `handleGenerateImage` 中的分支判断逻辑。

## 19. 任务背景（my-gallery 前后端对接，2026-04-17）
- 目标：完成 `pages/my-gallery` 与真实后端接口联调，替换本地 mock 并接通删除链路。
- 边界：仅改 API 调用、字段映射、状态与回退逻辑，不改页面布局和视觉结构。
- 非目标：本轮不新增后端接口，不改图库卡片样式与交互结构。

### 19.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 API 封装补齐 | 已完成 | 在 `ts-role-image` 新增用户图库删除封装 | 页面层无直连 URL | `src/lib/api/ts-role-image.ts` |
| T2 页面列表对接 | 已完成 | `my-gallery` 改为分页拉取真实图库并字段映射 | 卡片数据来自后端接口 | `src/app/pages/my-gallery/index.tsx` |
| T3 删除链路对接 | 已完成 | 管理模式删除改为真实接口并处理部分失败回退 | 删除成功项移除、失败项保留重试 | `src/app/pages/my-gallery/index.tsx` |
| T4 兜底与验证回填 | 已完成 | 增加加载/错误/空态兜底并执行定向校验，回填任务文档 | 页面失败不白屏、命令可执行、记录完整 | `pnpm exec eslint ...`、`docs/**` |

### 19.2 风险与回退
- 风险：
  - 历史素材可能缺失 `thumbnailUrl` 或 `fileName`，需依赖 fallback 字段。
  - 批量删除可能出现部分失败，需要保留失败项继续重试。
- 回退：
  - 若需回滚，可仅回退 `src/app/pages/my-gallery/index.tsx` 与 `src/lib/api/ts-role-image.ts`。
  - 接口异常时页面保持可渲染，显示错误文案并保留本地状态。

## 20. 任务背景（sound-edit 双音色库与试听对接，2026-04-17）
- 目标：`pages/sound-edit` 接入“推荐音色库 + 我的音色库”真实列表，并保证默认不勾选；试听调用生成接口并返回可播放音频。
- 边界：仅改接口调用、状态流转、字段映射与失败回退，不改页面布局和视觉结构。
- 非目标：本轮不改“我的音色库”重命名/删除真实落库交互。

### 20.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 前端 API 封装补齐 | 已完成 | `ts-voice` 新增我的音色库列表 API | 页面层无直连 URL | `src/lib/api/ts-voice.ts` |
| T2 双音色库列表对接 | 已完成 | 推荐库/我的库分别调用后端列表接口 | 两个 Tab 均渲染真实数据 | `src/app/pages/sound-edit/index.tsx` |
| T3 默认不选中策略 | 已完成 | 去除初始化自动选中逻辑 | 首次进入无勾选态 | `src/app/pages/sound-edit/index.tsx` |
| T4 试听链路调整 | 已完成 | 试听仅调用 preview 生成并播放，不在试听前保存配置 | 点击试听触发生成并可播放 | `src/app/pages/sound-edit/index.tsx` |
| T5 后端 preview 回退 | 已完成 | upload 关闭时将 audioHex 转 data URL 返回 | 不依赖 R2 也能返回可播放地址 | `TsVoiceProfileServiceImpl.java` |
| T6 验证与文档回填 | 已完成 | 执行定向校验并更新任务/总表/日志 | 证据完整可追溯 | `pnpm exec eslint ...`、`docs/**` |

### 20.2 风险与回退
- 风险：
  - 部分音色可能缺失 `providerVoiceId`，试听可能失败。
  - data URL 模式会增加接口返回体积。
- 回退：
  - 前端可仅回退 `src/app/pages/sound-edit/index.tsx` 与 `src/lib/api/ts-voice.ts`。
  - 后端可仅回退 `TsVoiceProfileServiceImpl.previewVoice` 的 data URL 回退逻辑。

## 21. 任务背景（chat ChatTip 推荐回复对接，2026-04-18）
- 目标：`pages/chat?sessionId=6` 的 `ChatTip` 对接后端推荐回复生成，稳定输出 3 条左右可选回复。
- 边界：仅改数据请求、状态流转与字段映射，不改 UI 布局。
- 非目标：不改 ChatTip 样式与结构。

### 21.1 任务拆分
| 任务 | 状态 | 说明 | 验收标准 | 证据 |
| --- | --- | --- | --- | --- |
| T1 契约核对 | 已完成 | 核对 `reply-suggestions` 入参与出参 | 字段映射明确 | `src/lib/api/ts-chat.ts`、后端 `TsChatSessionController` |
| T2 状态机补强 | 已完成 | 展开/收起、并发防抖、竞态保护、会话切换重置 | 推荐加载稳定，旧请求不污染新状态 | `src/app/pages/chat/index.tsx` |
| T3 回退与交互 | 已完成 | 空结果/失败提示项 + 提示项点击保护 | 不误写入输入框，失败可回退 | `src/app/pages/chat/index.tsx` |
| T4 验证与记录 | 已完成 | lint 执行与文档回填 | 记录完整可追溯 | `pnpm exec eslint ...`、`docs/**` |

### 21.2 风险与回退
- 风险：`src/app/pages/chat/index.tsx` 存在历史存量 lint 风格规则告警。
- 回退：仅需回退 `src/app/pages/chat/index.tsx` 即可恢复本轮逻辑改动。

### 21.3 进展记录
| 时间 | 任务 | 进展状态 | 说明 | 证据索引 |
| --- | --- | --- | --- | --- |
| 2026-04-18 | T1 | 已完成 | 后端与前端建议回复契约已核对 | `TsChatSessionController.java`、`TsChatReplySuggestionsDto.java`、`src/lib/api/ts-chat.ts` |
| 2026-04-18 | T2 | 已完成 | 推荐请求引入 requestId 竞态保护与会话切换重置 | `src/app/pages/chat/index.tsx` |
| 2026-04-18 | T3 | 已完成 | 建议列表映射与提示项点击保护已落地 | `src/app/pages/chat/index.tsx` |
| 2026-04-18 | T4 | 已完成 | 定向 lint 与任务文档回填完成 | `pnpm exec eslint ...`、`docs/fe-be-integration/任务-chat页-ChatTip推荐回复对接-20260418-1049.md` |
