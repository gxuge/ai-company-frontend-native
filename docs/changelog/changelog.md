# 修改日志

## 2026-08-12
- 任务：Favorite List 纯 Web 页面还原
- 变更：新增 `/pages/favorite-list`，使用 Figma `831:440` 的原始背景、角色、故事、作者、参与者、收藏和操作按钮素材；页面采用 405px 固定画布与 `容器宽度 / 405` 整体缩放，设备高度只决定背景填充和纵向滚动
- 交互：角色/故事标签可平滑定位分区，搜索框本地筛选收藏内容，书签按钮可移除对应卡片，继续聊天/继续故事跳转现有页面
- Web 约束：页面仅使用 `div/section/nav/article/button/input/img` 等 Web DOM，不使用 React Native 标签、StyleSheet 或原生手势能力
- 导航：`/pages` 测试导航新增 Favorite List 入口
- 验证：30 个 Figma 资源文件校验通过；目标文件 TypeScript、ESLint、Expo Babel、405px 缩放、Web DOM 与编码检查通过；未启动网页服务

## 2026-07-29
- 任务：admin-chat 图片 Tool 扁平协议
- 变更：角色形象与故事场景背景图片统一消费 `contentType/resourceType/imageUrl/promptCode/promptVersion` 顶层字段；实时 SSE 与历史消息都可恢复并展示图片，移除对 `data.result`、`result.data` 的依赖
- 接口变更：未新增端点；图片 Tool 的 SSE 顶层和消息事件 `data.output` 使用相同五字段结构，角色与故事仅以 `resourceType` 区分
- UI 影响：在现有 Tool 卡片内展示生成图片，普通 Tool、Confirm 和异步 Tool 展示规则保持不变
- 验证：状态机测试 21/21 通过，其中包含原始 SSE 跨 chunk 解析、`tool.start/tool.end` 合并及扁平图片字段断言；目标文件 Babel 转译与 `git diff --check` 通过；后端主代码编译通过

- 任务：admin-chat 通用异步 Tool 标记
- 变更：任意 `async === true` 的 Tool 通过 `eventId` 合并实时状态；消息历史从 `events[]` 恢复同一标记；Tool 卡片增加“异步”标识，只显示工具名和执行状态，不保留或渲染输入输出结果
- 接口变更：未新增端点；补充消费 `/sys/ts-agent-chat-messages` 的 `events[]` 和 `/sys/ts-agent-chat-sessions/ai-reply` SSE 顶层 `async/eventId/taskId`
- UI 影响：未调整聊天页面布局、尺寸、间距或颜色，仅在现有 Tool 卡片标题区增加“异步”状态标记
- SSE 规则：前端不因 `agent.end` 或异步 Tool 主动关闭连接，发送锁仍在旧 SSE 真正结束后释放
- 验证：状态机测试 17/17 通过；目标文件 Babel Web 转译通过；`git diff --check` 通过；全仓 TypeScript 仍受既有配置、资源和测试类型问题阻塞

## 2026-06-30
- 任务：admin-chat SSE 迁移
- 变更：新增通用 SSE 读取封装、agent 事件 reducer、`useAgentChatStream` 复用 hook、thinking 面板组件，并把 `/pages/admin-chat` 切到流式状态机；流式请求改为同一 `ai-reply` 接口通过 `stream=true` 分流；进入页时若没有可用会话则先空白进入，首条消息再懒创建后端 session
- UI 影响：assistant 气泡内增加“正在思考”卡片，流式输出时可逐步展示 LLM / Tool 节点
- 验证：已完成针对新 SSE 文件与 admin-chat 页面的类型检查；仓库里仍有既有的 axios 类型告警

## 2026-07-14
- 任务：admin-chat Tool 选项事件接入
- 变更：识别 `tool.end + contentType=options`，读取顶层 `question/options`，在最新 AI 气泡中按数组实际数量渲染快捷按钮；点击后复用普通消息发送链路
- 接口变更：未新增端点，扩展 `/sys/ts-agent-chat-sessions/ai-reply` SSE 字段消费
- UI 影响：复用既有推荐问题按钮样式，仅将隐藏的静态内容改为动态数据
- 验证：两选项 reducer 模拟通过；`git diff --check` 通过；全仓类型检查受既有 TypeScript 配置和历史类型错误阻塞

## 2026-07-15
- 任务：admin-chat Confirm 选项事件接入
- 变更：识别 `confirm.start` 顶层 `question/options`，复用 AI 气泡中已有选项组件展示按钮；选项统一映射为 `label/optionValue`
- 接口变更：未新增端点；`/sys/ts-agent-chat-sessions/ai-reply` 请求增加可选 `optionValue`
- UI 影响：未调整布局和样式，仅解除 Confirm 数据到现有选项组件之间的隐藏条件
- 验证：`confirm.start` reducer 两选项模拟通过；`git diff --check` 通过；文件保持 UTF-8 无 BOM、CRLF；全仓类型检查和 ESLint 受既有配置与历史错误阻塞

## 2026-07-15
- 任务：角色开场白单字段生成模式对接
- 变更：角色接口类型和创建角色页将 `intro_optimize` 统一改为 `greeting_optimize`
- 接口变更：未新增端点，继续调用 `/sys/ts-roles/one-click-setting`
- UI 影响：未改动布局和样式
- 验证：后端模式名称与前端请求值一致

## 2026-07-15
- 任务：创建角色页背景设定与开场白美化按钮联调
- 变更：确认两个按钮已接入 `generateRoleSetting`；增加请求互斥，背景请求透传当前开场白，开场白响应不再兜底读取背景字段
- 接口变更：未新增端点；分别使用 `background_optimize`、`greeting_optimize`
- UI 影响：未改动布局和样式
- 验证：`git diff --check` 通过；全量 TypeScript 与 ESLint 检查受仓库既有配置和历史错误阻塞

## 2026-07-16
- 任务：admin-chat 新会话本地问候
- 变更：无历史空会话、新建会话及删除当前会话后，在前端消息状态中插入一条 `localOnly` AI 问候；有历史会话保持原样；补齐五套语言资源
- 接口变更：无；问候不调用 `/sys/ts-agent-chat-sessions/ai-reply`，不进入 SSE 请求体和数据库
- UI 影响：未改动布局和样式，复用现有 AI 消息气泡
- 验证：相关 TypeScript 检查通过；五套语言共 61 个键且无缺失；`git diff --check`、UTF-8 无 BOM 和 CRLF 检查通过；`/pages/admin-chat` 返回 HTTP 200 且无 SSR 错误；全页 ESLint 仍受该历史页面既有的 300 余条风格问题影响

## 2026-07-16
- 任务：admin-chat 所有会话统一显示本地问候
- 变更：加载历史会话时同样把 `localOnly` 问候插入消息列表首位，数据库历史消息排列在问候之后
- 接口变更：无；问候仍不进入 SSE、同步回复请求或数据库
- UI 影响：未改动布局和样式，仅统一所有会话的消息列表内容
- 验证：相关 TypeScript、历史消息顶部插入和请求隔离断言通过；`git diff --check` 与编码检查通过；`/pages/admin-chat` 返回 HTTP 200 且无 SSR 错误

## 2026-07-16
- 任务：admin-chat Web 顶部菜单悬停报错修复
- 变更：状态声明再次被其他 Web 改动覆盖后，彻底删除 `menuHovered/setMenuHovered` 依赖；新增纯 HTML `WebMenuIcon`，通过鼠标进入/离开直接切换图标地址
- 接口变更：无
- UI 影响：未改动布局，保留菜单图标原有悬停切图效果和 HTML `textarea`
- 验证：admin-chat 相关 TypeScript 检查通过；Babel Web 转译成功；旧 `menuHovered/setMenuHovered` 残留为 0；纯 Web 菜单组件和鼠标事件接线断言通过；`git diff --check` 通过

## 2026-07-16
- 任务：admin-chat 输入栏安静模式与输入模式
- 变更：输入为空且未聚焦时显示语音、单行文本框、加号同排；聚焦或有内容时文本框独占第一排并自动增高，语音与加号移动到第二排；发送后主动失焦、关闭附件面板并随清空回弹
- 接口变更：无
- UI 影响：仅调整底部输入栏的响应式布局状态，保留原有配色、图标和功能
- 验证：admin-chat TypeScript 无新增诊断；语法转译与 Babel Web 转译通过；状态逻辑断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；按用户要求未进行本地页面交互测试

## 2026-07-16
- 任务：chat 输入栏安静模式与输入模式
- 变更：`ChatInput` 在空闲时保持语音、单行输入、括号、候选回复和加号同排；聚焦或有内容时改为多行输入框第一排、全部按钮第二排；Web 与 Native 均支持自动增高，提交时主动失焦并关闭附件区
- 接口变更：无
- UI 影响：仅调整 `/pages/chat` 底部输入栏的两态布局，保留原按钮、配色和聊天发送逻辑
- 验证：语法和 Babel Web 转译通过；定向 ESLint 通过；状态逻辑断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；全量 TypeScript 仍存在该页面原有 SVG 声明和聊天返回类型错误；按用户要求未进行浏览器互动

## 2026-07-16
- 任务：chat 与 admin-chat 加号/发送图标切换
- 变更：新增纸飞机发送图标；仅在输入框“已聚焦且存在非空文字”时，将加号切换为发送按钮并调用原发送逻辑；其余状态继续显示附件加号；Web 点击发送时阻止提前失焦造成的职责误切换
- 接口变更：无
- UI 影响：仅替换输入栏原加号位置的图标和点击职责，按钮尺寸与两态布局不变
- 验证：语法和 Babel Web 转译通过；ChatInput 定向 ESLint 通过；严格条件与点击职责状态断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；按用户要求未进行浏览器互动

## 2026-07-16
- 任务：create-story 章节开场白角色单选
- 变更：章节开场白入口复用 `/pages/select-role`，候选项严格过滤为页面顶部已添加角色；支持单选、当前角色回显、角色名展示和再次选择；顶部删除角色时同步清理章节的 `openingRoleId`；补齐现有 `roleSelected` 返回监听
- 接口变更：无新增端点；继续使用 `tsRoleApi.getRoleList`，章节保存继续提交既有 `openingRoleId`
- UI 影响：未调整布局、尺寸、间距和配色，仅将“选择角色”动态替换为已选角色名，并在章节选择模式隐藏创建角色悬浮按钮
- 验证：两个页面 TypeScript 语法与 Babel Web 转译通过；新增行 ESLint、TypeScript 诊断均为 0；行为代码断言、`git diff --check`、UTF-8 无 BOM 与 CRLF 检查通过；按用户要求未启动浏览器或开发服务进行验证

## 2026-07-16
- 任务：chat 输入框文字纵向居中
- 变更：将 Web `textarea` 的上下内边距调整为 8px，使 24px 行高在现有 40px 初始高度内纵向居中
- 接口变更：无
- UI 影响：仅修正 `/pages/chat` 输入框占位文字和首行文字的纵向位置，不改变输入栏高度、两态布局或发送逻辑
- 验证：TypeScript 语法、Babel Web 转译、ChatInput 定向 ESLint和样式断言通过；按用户要求未启动浏览器或开发服务

## 2026-07-16
- 任务：admin-chat 发送按钮点击修复
- 变更：发送图标在 `onPressIn` 阶段锁定职责并调用发送，后续 `onPress` 消费本次操作，避免输入框失焦后按钮切回附件职责
- 接口变更：无
- UI 影响：未修改布局、尺寸或图标显示条件，仅修复发送按钮事件顺序
- 验证：TypeScript 语法、Babel Web 转译、事件链代码断言和发送/附件序列模拟通过；全文件 ESLint 的 366 项均为该页面既有格式问题；按用户要求未启动浏览器或开发服务

## 2026-07-16
- 任务：create-story 场景图片图库选择
- 变更：场景图片框跳转 `/pages/my-gallery?from=create-story`；图库使用故事背景标题，选择后通过 `storySceneImageSelected` 回传并返回，保留创建页草稿；移除原模拟图片逻辑；故事详情加载与保存接入 `sceneImageUrl`
- 接口变更：无新增端点；图库继续调用 `/sys/ts-user-image-assets`，故事保存继续调用现有创建/更新接口并提交 `sceneImageUrl`
- UI 影响：创建故事页布局不变；图库故事模式隐藏会误跳创建人物页的新增角色图片悬浮按钮
- 验证：两个页面 TypeScript 语法和 Babel Web 转译通过；新增行 ESLint、跳转/回填/保存行为断言通过；按用户要求未启动浏览器或开发服务

## 2026-07-17
- 任务：admin-chat 工具确认协议对齐
- 变更：确认交互改为从 `tool.end` 的 `contentType=options`、有效 `interactionId` 和非空 `options` 解析；新增 `interactionId` 回传和重复提交保护；删除旧 `confirm.*`、`options.*` 状态处理；前端状态不保存后端运行控制字段
- 接口变更：`/sys/ts-agent-chat-sessions/ai-reply` 请求新增可选 `interactionId`，与 `optionValue` 一起提交
- UI 影响：未修改布局、尺寸、间距和颜色，继续复用现有工具结果与选项按钮区域
- 验证：状态机测试 8/8 通过；Babel Web 转译、`git diff --check`、UTF-8 无 BOM 与原换行格式检查通过；全仓 TypeScript 检查仍受既有配置和历史类型错误阻塞

## 2026-07-17
- 任务：admin-chat 确认摘要字段移除
- 变更：确认工具的 `tool.end` 不再解析、保存或渲染 `summary`，确认区域仅使用 `question` 和 `options`
- 接口变更：前端确认状态移除 `summary`
- UI 影响：未修改布局和样式，仅停止展示确认摘要
- 验证：状态机测试 6/6 通过，相关 TypeScript 定向诊断为零，Babel Web 转译、diff 与编码检查通过

## 2026-07-17
- 任务：admin-chat Confirm Tool 卡片隐藏
- 变更：确认工具仍参与交互状态解析，但不再触发工具时间线或展示工具卡片；普通工具展示逻辑保持不变
- UI 影响：确认场景只展示一次回复正文、确认问题和候选按钮
- 验证：状态机测试 10/10 通过，三个目标文件 Babel Web 转译通过

## 2026-07-17
- 任务：admin-chat 主 Agent 转子 Agent 过渡文案闪现修复
- 变更：后端 `agent.end` 精简 SSE 补发 `data.status=HANDOFF`；前端兼容旧事件文案，并在 HANDOFF 或 `subagent.start` 时清空主 Agent 过渡正文和对应 LLM 步骤；消息同步允许子 Agent 切换状态用空正文覆盖上一帧
- 接口变更：未新增端点；补全现有 `agent.end` SSE 的 `data.status`
- UI 影响：未修改布局、尺寸、间距和颜色，仅停止显示主 Agent 的转交流程文案
- 验证：前端状态机测试 11/11、测试文件 ESLint、Babel Web 转译、后端 Airag 主代码 Reactor 编译打包通过；后端测试源码仍受既有 `AiragPromptTemplateServiceTest.java:77` 类型错误阻塞

## 2026-07-17
- 任务：create-character 进入形象生成选择页
- 变更：创建页改为上传参考图后携带提示词和风格跳转 `/pages/generating-select`；生成选择页进入即调用不带 `roleId` 的 `one-click-image`，默认生成并保存一张用户图片；新增三行描述截断、编辑、重新生成、加载效果和上滑抬升交互
- 接口变更：移除创建页对 `/sys/ts-roles/generate-image-by-prompt` 和 `/sys/ts-role-image-profiles` 的调用；生成选择页改用 `/sys/ts-roles/one-click-image`
- UI 影响：沿用生成选择页既有深色 Figma 结构，结果数量调整为 `1/1`，将“创建角色”改为“完成”
- 验证：两个生成选择文件定向 ESLint 通过，三个目标文件 Babel Web 转译通过，`git diff --check` 和编码检查通过；全仓 TypeScript 仍受既有配置、测试类型和缺失资源错误阻塞

## 2026-07-28
- 任务：generating-select 编辑按钮返回上一页
- 变更：删除生成选择页的原地编辑状态、文本框和完成编辑图标；点击图片描述右侧编辑按钮直接 `router.back()`，恢复上一页已有的提示词、风格和参考图状态
- 接口变更：无
- UI 影响：保留三行描述和铅笔图标，不再在当前页切换为输入框
- 验证：Babel Web 转译、行为代码断言、`git diff --check` 与编码检查通过

## 2026-07-28
- 任务：创建形象跨页草稿迁移到 Zustand
- 变更：新增 `character-generation` 临时 Store；创建页写入提示词、风格和上传后的参考图 URL，生成选择页从 Store 读取；移除 URL 中的 `promptText/styleName/referenceImageUrl/requestKey`；完成后清空草稿
- 接口变更：无，继续调用 `/sys/ts-roles/one-click-image`
- UI 影响：无
- 验证：目标文件 Babel Web 转译、定向 ESLint、路由参数残留检查、`git diff --check` 与编码检查通过

## 2026-07-28
- 任务：generating-select 底部操作抽屉
- 变更：预览图保持全屏稳定展示；操作卡默认收缩到底部，仅保留操作口与上滑提示；点击或上滑展开完整内容，向下滑动收起
- 接口变更：无
- UI 影响：图片描述、缩略图、重新生成和完成按钮只在展开状态显示
- 验证：Babel Web 转译、定向 ESLint、交互结构断言、`git diff --check` 与编码检查通过

## 2026-07-28
- 任务：generating-select 顶部 Header 与抽屉收缩位置修正
- 变更：页面顶部复用 `AiHeader` 并显示“形象生成”；上滑提示移到收缩卡片上方；卡片收缩时沉到底部并只露出操作口
- 接口变更：无
- UI 影响：删除预览图内部的自定义返回按钮，生成和结果操作逻辑不变
- 验证：Babel Web 转译、定向 ESLint、Header 与抽屉结构断言、`git diff --check` 和编码检查通过

## 2026-07-28
- 任务：generating-select 四图并发生成与候选展示
- 变更：首次进入并发调用 4 次生图接口并使用 `Promise.allSettled` 收集成功结果；默认选中第一张，点击候选缩略图切换主图；重新生成维持单次请求并最多保留 4 张候选
- 接口变更：无新增端点；同一 `/sys/ts-roles/one-click-image` 首次并发调用 4 次
- UI 影响：风格名改为卡片居中的白色粗体；移除图片数量；候选缩略图改为 13:18 竖向长方形
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、定向 ESLint、并发/布局结构断言、`git diff --check` 与编码检查通过

## 2026-07-28
- 任务：generating-select 候选列表加号恢复与左对齐
- 变更：恢复原始 Figma 导出的白色加号素材并接入单次候选生成；候选图片列表改为从卡片左侧排列
- 接口变更：无，加号继续调用现有单次生图逻辑
- UI 影响：加号显示在候选图片右侧，生成期间禁用
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、定向 ESLint、加号资源/动作与左对齐结构断言、`git diff --check` 和编码检查通过

## 2026-07-28
- 任务：generating-select 分批追加生成与图片下载
- 变更：加号改为每次并发生成最多 4 张候选，使用运行锁阻止批次重入，总数限制为 12 张并在达到上限后隐藏；底部“重新生成”改为下载当前选中图片
- 接口变更：无新增端点；加号继续并发调用 `/sys/ts-roles/one-click-image`
- UI 影响：候选列表支持横向滚动；下载失败或受跨域限制时回退为打开原图地址
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、定向 ESLint、批次上限/下载/加号显隐结构断言通过

## 2026-07-28
- 任务：generating-select 独立图片加载状态
- 变更：候选状态升级为加载中、成功、失败三态；四路并发请求分别更新对应缩略图；当前选中候选的状态独立控制主图加载层
- 接口变更：无
- UI 影响：横向候选列表隐藏滚动条；加载中的小图显示旋转加载图标；追加生成时当前已生成主图不再被全局加载层遮挡
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、定向 ESLint、候选状态/主图加载/滚动条结构断言通过

## 2026-07-28
- 任务：generating-select 加号按钮视觉还原
- 变更：加号入口继续使用 13:18 长方形尺寸，恢复 Figma 旧版的深色圆角底、浅灰虚线边框和 25×25 居中白色加号
- 接口变更：无
- UI 影响：仅调整加号按钮视觉，分批生成和 12 张上限逻辑不变
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、定向 ESLint、长方形尺寸/旧版视觉结构断言、`git diff --check` 与编码检查通过

## 2026-07-28
- 任务：generating-select 当前页上拉编辑
- 变更：抽取 `CharacterGenerationEditor` 供创建形象页与生成选择页复用；编辑按钮改为打开底部抽屉，回显当前提示词、参考图和风格，应用后更新 Zustand 并重新生成首批 4 张
- 接口变更：无新增端点；继续复用提示词润色、参考图上传与 `/sys/ts-roles/one-click-image`
- UI 影响：编辑时隐藏生成页原操作抽屉，关闭或应用后恢复；创建页保留原“我的图库”按钮视觉
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、定向 ESLint、结构断言、`git diff --check` 与编码检查

## 2026-07-28
- 任务：generating-select 移除默认预览图
- 变更：主预览区仅在存在真实生成结果时渲染图片；删除原默认人物图片资源
- 接口变更：无
- UI 影响：等待生成或没有选中结果时显示纯色背景和既有加载状态
- 验证：定向 ESLint、Babel Web 转译、资源引用检查、`git diff --check` 与编码检查

## 2026-07-29
- 任务：generating-select 描述与风格图标还原
- 变更：图片描述标题左侧恢复 Figma 原稿图片图标；风格区域增加闪光图标，并与动态风格名称组成居中内容
- 接口变更：无
- UI 影响：仅调整操作卡片标题展示，不增加风格下拉箭头，不影响生成与编辑逻辑
- 验证：定向 ESLint、Babel Web 转译、图标资源与布局结构检查、`git diff --check` 与编码检查

## 2026-07-29
- 任务：generating-select 操作卡片默认展开
- 变更：页面首次进入时将底部操作卡片初始状态设为展开
- 接口变更：无
- UI 影响：用户仍可通过操作口向下收起，后续展开与收起交互保持不变
- 验证：定向 ESLint、Babel Web 转译、初始状态结构检查、`git diff --check` 与编码检查

## 2026-07-29
- 任务：generating-select 加号图片框虚线加强
- 变更：候选列表末尾加号入口的外层边框调整为 2px 浅灰色虚线
- 接口变更：无
- UI 影响：保留原有 13:18 尺寸、圆角、深色背景和居中加号
- 验证：定向 ESLint、Babel Web 转译、虚线样式结构检查、`git diff --check` 与编码检查

## 2026-07-29
- 任务：chat 建议加载时聊天内容立即上移
- 变更：灯泡建议区域展开时立即预留 130px 高度，并在布局完成后滚动到底部；骨架屏与建议内容仅保留透明度和位移动画
- 接口变更：无
- UI 影响：点击灯泡后聊天内容立即位于建议区上方，接口完成时三个建议原位替换骨架屏，不再二次跳动
- 验证：Babel Web 转译、目标文件 TypeScript 诊断、布局结构检查、`git diff --check` 与编码检查通过；整文件 ESLint 仍受既有导入排序、超长函数等 23 个历史错误阻塞

## 2026-07-29
- 任务：generating-select 候选图片失败状态优化
- 变更：失败候选改为暗色完整占位卡，增加 `ImageOff` 图标、状态文案和独立失败边框
- 接口变更：无
- UI 影响：仅优化单张候选生成失败时的视觉反馈，其他候选的生成、选择和下载逻辑不变
- 验证：定向 ESLint、Babel Web 转译、失败态结构检查、`git diff --check` 与编码检查

## 2026-07-29
- 任务：generating-select 失败状态中性化与主预览联动
- 变更：失败候选改为黑灰底、白色图标和白色文字；新增选中失败状态并传入主预览区
- 接口变更：无
- UI 影响：点击失败候选后主预览显示“图片生成失败，请选择其他图片”，选中失败项使用白色虚线边框
- 验证：定向 ESLint、Babel Web 转译、目标文件 TypeScript 诊断、失败状态透传检查、`git diff --check` 与编码检查

## 2026-07-29
- 任务：AI 生图与角色保存解耦
- 变更：候选生图只保留供应商临时原图；生成选择页点击“完成”时转存，创建角色页最终保存时转存；完整角色 Tool 显式保存资产后关联角色
- 接口变更：生图改为 `POST /sys/ai-images/generate`；新增 `POST /sys/ts-user-image-assets/import`；移除旧 `/sys/ts-roles/one-click-image`
- UI 影响：未修改布局、尺寸、间距或颜色，仅调整保存时机与请求状态
- 验证：后端 Maven 编译通过；前端定向 ESLint 通过；全仓 TypeScript 仍受既有问题阻塞；`git diff --check` 通过

## 2026-07-30
- 任务：统一草稿箱接口对接
- 变更：新增 `ts-draft` API；草稿页移除静态数据，直接从 `content` 映射角色/故事卡片；删除后同步更新列表；创建角色和故事页支持按 `draftId` 恢复完整状态
- 接口变更：接入 `GET/POST/PUT/DELETE /sys/ts-drafts` 与 `GET /sys/ts-drafts/detail`
- UI 影响：未修改原卡片布局、尺寸、间距或配色，仅增加加载、空数据、失败和删除状态
- 验证：后端编译与测试编译通过，草稿定向测试 4/4；前端草稿页/API 定向 ESLint和 Babel 通过；全仓 TypeScript 仍受既有配置及历史错误阻塞

## 2026-07-30
- 任务：草稿删除主题确认弹窗
- 变更：将浏览器/系统确认框替换为页面内深色主题弹窗，支持遮罩取消、删除确认和请求中防重复提交
- 接口变更：无，确认后继续调用 `DELETE /sys/ts-drafts`
- UI 影响：新增与草稿页主题一致的删除确认层，不修改草稿卡片布局
- 验证：定向 ESLint、Babel Web 转译、差异与编码检查

## 2026-07-30
- 任务：创建角色/故事返回草稿确认
- 变更：`AiHeader` 返回接入有效内容判断；新增统一主题弹窗；支持不保存退出、保存草稿并退出和点击遮罩继续编辑
- 接口变更：创建页接入 `POST/PUT /sys/ts-drafts`
- UI 影响：新增深色主题退出确认层，不修改原表单布局
- 验证：共享弹窗定向 ESLint、角色/故事页 Babel Web 转译、新增行检查、差异与编码检查

## 2026-07-30
- 任务：创建入口草稿数量与空状态
- 变更：`/pages/create-page` 获得焦点时加载草稿总数；数量为空时显示主题提示，接口失败时显示错误提示
- 接口变更：复用 `GET /sys/ts-drafts?pageNo=1&pageSize=1`
- UI 影响：右上角草稿箱按钮、图标、文字和数量徽标整体缩小，原定位不变
- 验证：定向 ESLint、Babel Web 转译、`git diff --check` 与编码检查

## 2026-07-30
- 任务：统一发送后端请求语言
- 变更：Axios 请求拦截器、Token 刷新请求和 SSE 请求统一动态添加 `Accept-Language`
- 接口变更：所有后端请求新增语言请求头，值来自前端当前语言配置
- UI 影响：无
- 验证：`def-http.ts` 定向 ESLint和两处请求文件 Babel 转译通过；差异与编码检查通过；全仓 TypeScript 被既有配置与历史类型错误阻塞

## 2026-07-30
- 任务：设置与声音页面四语言
- 变更：通用设置、用户设置、语言设置、声音编辑及试听文本弹窗接入 `settings` 翻译资源；支持简中、繁中、英文、日文
- 接口变更：无；继续使用统一 `Accept-Language`
- UI 影响：不修改页面结构、尺寸、间距或配色；语言选择器隐藏暂不支持的阿拉伯语
- 验证：四套 JSON 解析及 96 个键一致性、Babel Web 转译、新增行 ESLint、`git diff --check` 与编码检查

## 2026-07-30
- 任务：创作入口四语言
- 变更：`/pages/create-page` 标题、角色/故事卡片、草稿状态、AI 助手和提示弹窗接入独立 `createPage` 翻译资源
- 接口变更：无；继续复用 `GET /sys/ts-drafts`
- UI 影响：不修改容器、位置和动画；仅为英文、日文标题及卡片文字应用防溢出字号
- 验证：四套 JSON 解析及 16 个键一致性、Babel Web 转译、新增行 ESLint、`git diff --check` 与编码检查

## 2026-07-30
- 任务：内容浏览页面四语言
- 变更：浏览列表、角色详情、角色选择、我的图库及浏览分类接入独立 `contentBrowse` 翻译资源；支持简中、繁中、英文、日文
- 接口变更：无；分类继续使用原索引和固定故事模式参数，接口返回的角色名、作者名、故事内容及文件名保持原文
- UI 影响：不修改页面结构、尺寸、间距、颜色和交互，仅替换固定展示文案
- 验证：四套 JSON 解析及 62 个键一致性、Babel Web 转译、新增行 ESLint、硬编码扫描、`git diff --check` 与编码检查

## 2026-07-30
- 任务：聊天与个人功能四语言
- 变更：聊天页、聊天输入框、会话列表、会话详情、故事详情弹窗和我的页接入 `chat`、`profile` 翻译资源；支持简中、繁中、英文、日文
- 接口变更：无；会话筛选改用稳定英文业务值，用户消息、AI 回复、会话标题、故事与章节内容保持接口原文
- UI 影响：不修改页面结构、尺寸、间距、颜色和交互，仅替换固定展示文案与前端兜底
- 验证：`chat` 四套 61 个键、`profile` 四套 14 个键一致；Babel Web、新增行 ESLint、硬编码扫描、`git diff --check` 与编码检查通过

## 2026-07-30
- 任务：TS 接口结构化消息与 Agent Chat 四语言
- 变更：普通请求、SSE 实时事件和历史 Agent Event 统一保留 `messageCode/errorCode/errorCategory/retryable/errorArgs`；Admin Chat 固定文案与错误提示接入简中、繁中、英文和日文
- 接口变更：前端响应模型新增结构化消息字段；请求继续通过 `Accept-Language` 发送当前四语言之一，不注册或兼容阿拉伯语
- UI 影响：不修改页面布局；动态 AI 内容和 Tool 选项保持后端原文
- 验证：Agent/API 定向 Jest 24/24、Babel 转译、定向 ESLint、JSON 键一致性、`git diff --check` 与编码检查通过；全仓 TypeScript 仍受既有配置和历史类型错误阻塞

## 2026-07-31
- 任务：创建故事空页面退出误提示修复
- 变更：默认章节描述改为空表单值，章节卡片继续通过多语言 fallback 展示说明，避免未操作页面被误判为存在有效草稿内容
- 接口变更：无
- UI 影响：无布局或文案变化
- 验证：Babel Web 转译、默认状态断言、`git diff --check` 与编码检查通过；整文件 ESLint 运行 120 秒超时

## 2026-07-31
- 任务：Admin Chat 生成图片下载与幂等保存
- 变更：图片底部增加下载/保存操作；导入请求携带 Agent Event ID；图库按角色形象和故事背景分类；新增四语言操作与反馈文案
- 接口变更：`POST /sys/ts-user-image-assets/import` 新增可选 `sourceKey`，响应新增 `alreadySaved`
- UI 影响：仅在已完成的图片内容内部底部增加两个操作按钮，不改变聊天消息主体布局
- 验证：后端 Maven 编译、前端新增组件及关联文件定向 ESLint、Babel Web 转译、四语言 JSON/键一致性、`git diff --check` 与编码检查通过；`my-gallery/index.tsx` 整文件 ESLint 仍包含既有历史规则问题

## 2026-08-04
- 任务：Admin Chat 图片 Tool 后 LLM 文本去重
- 变更：Tool 后续 `llm.delta` 继承最近 LLM 节点身份；`llm.end` 仅补齐缺失文本，不再使用聚合内容覆盖已有流式 step
- 接口变更：无
- UI 影响：无布局、样式或图片卡片变化
- 验证：Agent SSE 定向 Jest 23/23、Web Babel、`git diff --check` 与编码检查通过；整文件 ESLint 仅报告既有规则问题

## 2026-08-04
- 任务：Admin Chat 图片代理下载
- 变更：下载按钮改为通过 TS 后端获取 Blob，并使用响应附件文件名触发浏览器下载；增加下载中禁用状态
- 接口变更：新增 `POST /sys/ts-images/download`，请求 `sourceImageUrl/fileName`，响应图片文件流
- UI 影响：未修改图片卡片或按钮布局，仅复用现有加载图标反馈下载状态
- 验证：后端模块编译及新增测试源码编译通过；前端定向 ESLint、Babel Web 转译、差异与编码检查通过；根 POM 将 Surefire `skipTests` 固定为 `true`，测试用例未实际执行

## 2026-08-04
- 任务：Admin Chat 图片 Tool 生命周期展示
- 变更：图片 Tool 从 `tool.start` 起使用独立图片组件；`tool.end` 原位显示图片和操作按钮；`tool.error` 保留图片类型并原位显示失败
- 接口变更：无，继续使用现有 `tool.start/tool.end/tool.error` 和 `contentType=image`
- UI 影响：图片生成阶段不再展示普通 Tool 调用卡片，改为固定比例的图片生成状态区域
- 验证：Agent SSE 定向 Jest 24/24、新组件与渲染面板 ESLint、Web Babel、四语言键一致性、差异与编码检查通过

## 2026-08-04
- 任务：Admin Chat 助手消息事件时间线
- 变更：后端预创建助手消息并绑定 LLM/Tool 事件；Tool 前后切分保存 LLM 正文；前端将同一助手消息的事件还原为连续时间线
- 接口变更：`/sys/ts-agent-chat-messages` 的 `events[]` 改为归属 Assistant 消息，LLM Event 的 `content` 和 `data.output.content` 保存完整段落
- UI 影响：不修改布局；历史消息由分散 Tool 气泡改为单个助手气泡内按执行顺序展示
- 验证：后端模块编译通过；前端 Agent SSE Jest 25/25、TypeScript 转译、`git diff --check` 通过；后端定向测试受既有 `AiragPromptTemplateServiceTest` 编译错误阻塞

## 2026-08-06
- 任务：Chat List 接管 Session List
- 变更：Figma Chat List 接入真实会话与最近消息；首次加载 10 条并在滚动接近底部时按 10 条续页；普通/系统会话分栏；底部消息入口改到 `/pages/chat-list`；旧 `/pages/session-list` 重定向兼容
- 接口变更：无；继续使用 `GET /sys/ts-chat-sessions` 和 `GET /sys/ts-chat-messages`
- UI 影响：不修改 Chat List 原设计层级、尺寸、间距、颜色和图片资源；仅增加真实数据、加载/错误/空状态和透明底栏点击区域
- 验证：定向 TypeScript 本次文件 0 错误、Babel Web、逻辑类 ESLint、四语言 JSON/键一致性、分页与路由断言、`git diff --check` 和编码检查通过；全依赖类型检查仍受既有 `src/lib/api/axios.ts` 类型错误阻塞

## 2026-08-06
- 任务：Chat List 会话头像对接
- 变更：普通会话优先展示接口 `roleAvatarUrl`；共享图片资源解析同时兼容数组和后端 Map 响应，缺失时继续使用设计稿默认头像
- 接口变更：无；前端类型与 `TsChatSessionVo.imageResources` 的 Map 结构对齐
- UI 影响：不修改头像尺寸、列表布局或视觉样式
- 验证：图片资源定向 Jest 3/3、Babel Web、API 定向 ESLint、`git diff --check` 与编码检查通过；全仓 TypeScript 仍受既有配置和历史类型错误阻塞

## 2026-08-06
- 任务：Chat List 角色信息与固定公告
- 变更：会话名称改为按 `targetRoleId` 查询并缓存角色名；头像改为圆形双层边框并增加在线状态点；公告卡片移出滚动容器
- 接口变更：复用 `GET /sys/ts-roles/detail`，不修改后端
- UI 影响：列表滚动时页签和公告保持固定，只有会话列表滚动
- 验证：定向 TypeScript、Babel Web、差异与编码检查通过；未启动网页服务

## 2026-08-06
- 任务：Role List 顶部分段导航
- 变更：共享发现页头部增加可选 `segmented` 样式，并仅在 `/pages/role-list` 启用 Chat List 风格的“角色/故事”切换
- 接口变更：无；继续使用原 `/pages/role-list` 与 `/pages/story-list` 路由
- UI 影响：保留发现标题、排行榜、搜索、分类和角色内容，只调整顶部切换控件
- 验证：定向 TypeScript、Babel Web、路由断言、逻辑类 ESLint、`git diff --check` 与编码检查通过；未启动网页服务

## 2026-08-06
- 任务：Role List 角色收藏按钮
- 变更：角色状态点从卡片右上角移动到角色名后；右上角增加与 Story List 同尺寸、背景和点击反馈的收藏按钮
- 接口变更：无；收藏状态暂由页面本地维护
- UI 影响：收藏图标使用五角星，未收藏为白色描边，收藏后为金色填充
- 验证：定向 TypeScript、Babel Web、DOM 结构断言、逻辑类 ESLint、`git diff --check` 与编码检查通过；未启动网页服务

## 2026-08-10
- 任务：Chat List 快捷入口与故事活动卡更新
- 变更：按 Figma `797:573` 增加点赞、关注、互动提醒、收藏四个快捷入口；按 `797:557` 将旧公告替换为“星海回声”故事活动卡
- 接口变更：无；四个入口暂不绑定不存在的业务接口或路由
- UI 影响：11 个 Figma 原始图片资源已保存到 `assets/images/chat-list`；快捷入口和活动卡位于固定区域，会话列表继续独立滚动
- 验证：资源完整性、定向 TypeScript、Babel Web、结构断言、逻辑类 ESLint、`git diff --check` 与编码检查通过；未启动网页服务

## 2026-08-11
- 任务：Chat List 快捷图标比例调整
- 变更：按 Figma 相对页面比例将四个快捷图标从 78px 调整为移动端 62px、宽屏 66px，标签同步缩小为 11px
- 接口变更：无
- UI 影响：四等分布局和点击区域保持不变，减少固定区域高度
- 验证：定向 TypeScript、Babel Web、尺寸断言、`git diff --check` 与编码检查通过；未启动网页服务

## 2026-08-10
- 任务：Story Detail Figma 页面迁移
- 变更：新增 `/pages/story-detail`，迁移 Figma `src/App.tsx` 和 29 张 PNG；旧故事详情 SVG 移至 `conversation-detail` 素材目录
- 接口变更：无；当前页面保持静态设计稿数据
- UI 影响：新页面保留源 DOM、尺寸、间距、颜色和 Tailwind 类；现有 `StoryDetailModal` 仅更新素材路径
- 验证：27 个图片 import 全部存在，Babel Web 转译、页面定向 ESLint 0 错误、`git diff --check` 和编码检查通过；保留 3 条 Tailwind 可简写提示

## 2026-08-11
- 任务：DIY Agent 宽度统一缩放重构
- 变更：按 Figma `791:419` 建立固定 `405 × 720` 设计舞台；使用 `ResizeObserver` 获取容器宽度，并以 `容器宽度 / 405` 统一缩放整个页面
- 接口变更：无；继续保留页面本地输入状态
- UI 影响：删除全部 `390px` 尺寸分支；字体、图片、间距、圆角和位置使用同一缩放系数，设备高度不足时仅产生纵向滚动
- 验证：24 个图片资源、定向 TypeScript、Babel Web、布局断言、逻辑类 ESLint、`git diff --check` 与编码检查通过；未启动网页服务
