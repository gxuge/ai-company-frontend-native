# AIRI VRM 舞台迁移计划

更新时间：2026-07-30

## 任务背景

- 来源：Project AIRI `packages/stage-ui-three`
- 目标项目：`D:\project_demo\ai-company-frontend-native-backup`
- 当前目标：在独立 Web 调试页完整复刻 AIRI 3D 人物运行时，并保持后续接入聊天页所需的组件边界。
- 源码基线：Project AIRI commit `204197b8b453091850bd16673285009a9795ad79`。

## 本轮边界

- 新增 `/pages/vrm-debug` 独立页面。
- 不修改现有聊天、角色创建和业务接口。
- 不接后端模型地址，VRM、VRMA、HDR、wLipSync profile/WASM 均为项目本地资源。
- Android/iOS 本轮只保留平台占位页，不承诺原生 Three.js 渲染。
- AIRI 的 Vue、TresJS、Pinia 实现分别适配为 React、Three.js、Zustand，保留对应运行时语义。

## 任务拆分

| 任务                   | 状态   | 说明                                                     | 验收证据                     |
| ---------------------- | ------ | -------------------------------------------------------- | ---------------------------- |
| T1 方案与依赖确认      | 已完成 | 确认 React/Expo Web 适配边界并安装 Three/VRM 依赖        | 本计划、`package.json`       |
| T2 本地资源准备        | 已完成 | 下载测试 VRM 与 AIRI 待机 VRMA，并改为 Metro 本地资产    | `src/assets/vrm/**`          |
| T3 VRM 渲染内核        | 已完成 | 加载、释放、动画循环、自动取景                           | `src/components/vrm/**`      |
| T4 独立调试页面        | 已完成 | 本地模型、文件选择、重置视角、状态面板                   | `src/app/pages/vrm-debug/**` |
| T5 资源 404 修复       | 已完成 | 注册 `.vrm/.vrma` 扩展并使用 `expo-asset` 生成 Metro URL | 8082 服务资源请求返回 200    |
| T6 AIRI 人物活性第一批 | 已完成 | 随机眨眼、表情过渡、三秒自动复位                         | 调试页表情按钮               |
| T7 AIRI 完整能力迁移   | 已完成 | 视线、口型、交互、环境光照、缓存、事务和诊断             | 调试页与 VRM runtime         |
| T8 NPR 与描边          | 已完成 | SH/IBL Shader 注入及 AIRI MToon 视空间描边 patch         | `airi-vrm-ibl/outline`       |
| T9 生产资源验证        | 已完成 | VRM、VRMA、HDR、WASM 均进入 Expo Web 导出产物            | 静态导出资源清单             |

## 技术方案

- Three.js 负责 WebGL 场景、相机、灯光和渲染循环。
- `@pixiv/three-vrm` 负责 VRM 0.x/1.0 模型加载与运行时更新。
- `@pixiv/three-vrm-animation` 负责加载和播放 `.vrma` 待机动作。
- `wlipsync` 通过浏览器端动态导入和本地 WASM 提供音频口型，避免 SSR 求值 WebAudio 类。
- 模型与动作放在 `src/assets/vrm`，由 Metro 和 `expo-asset` 解析为本地资源 URL。
- 调试页允许选择本机 `.vrm` 文件，并使用临时 Blob URL 加载，不上传文件。
- Zustand 持久化相机、灯光、环境、模型偏移和跟踪模式。
- 模型切换采用 generation + scene transaction，旧实例按 scope 缓存并保留相机状态。
- RenderTarget 区域读取用于透明像素检测，身体碰撞体用于点击交互。

## 风险与回退

- WebGL 或模型加载失败时显示明确错误，不影响其他页面。
- 待机动作与某些模型骨骼不兼容时，模型仍应保持静态可见。
- 模型切换时必须取消旧请求并释放几何体、材质、纹理和动画。
- 运行时默认不请求远程模型、动作、环境或口型资源。
- 若 Expo Web 导出无法处理 Three.js 动态模块，则回退为独立 Web Canvas 入口再接入路由。

## 本轮验收标准

- `/pages/vrm-debug` 可从页面导航 Hub 打开。
- 页面默认加载本地 `.vrm`，不访问远程模型地址。
- 模型加载后自动居中并完整进入相机视野。
- 支持鼠标旋转、滚轮缩放和重置视角。
- 本地 `.vrma` 可播放；动作失败时不阻断模型显示。
- 支持选择本机 `.vrm` 文件临时预览。
- 支持鼠标/相机视线跟踪、空闲眼球扫视、随机眨眼与表情过渡。
- 支持本机音频驱动 wLipSync 口型。
- 支持 HDR/SkyBox、IBL、NPR Shader 与 MToon AIRI 描边。
- 支持身体部位点击、RenderTarget 透明像素检测和性能面板。
- 支持模型缓存、切换事务、相机状态和设置持久化。
- 离开页面或切换模型后不保留旧渲染循环。
- Web 导出或等价的定向构建验证通过。

## 本轮验证结果

- 定向 ESLint：通过。
- TypeScript：全仓被原有 TypeScript 6 `baseUrl` 弃用错误提前阻断；筛选本轮 VRM 路径没有新增错误。
- Expo Web 导出：通过，生成 `/pages/vrm-debug` 静态路由和独立 wLipSync bundle。
- 构建过程仍有项目原有的 SSR 阶段 MMKV 读取警告，但未阻止导出。
- 新启动的 Expo Web 服务中，VRM、VRMA、HDR、WASM 请求均返回 200，文件头分别为 `glTF`、Radiance、WebAssembly。
- 默认 3D 人物使用 AIRI 内置首个 VRM 预设 `AvatarSample_A`；AIRI 整体默认人物 `Hiyori (Pro)` 属于 Live2D，不在本 3D runtime 中。
- 导出产物包含本地 VRM、157,664 字节 VRMA、2,118,350 字节 HDR、12,571 字节 WASM。
- 浏览器可视化自动化因本机浏览器插件资源路径缺失未能截图；页面 SSR、Web bundle、资源端点和生产导出均已验证。

## AIRI 完整性对照

当前为 `packages/stage-ui-three` 核心人物运行时的 React/Three.js 适配复刻。AIRI 的 Vue/TresJS/Pinia 框架代码没有照搬，但用户要求的 3D 行为和状态语义已迁移。

| 能力                                              | 当前状态          |
| ------------------------------------------------- | ----------------- |
| VRM 0.x/1.0 加载、VRMA 待机动作、根骨位移校正     | 已迁移            |
| 自动取景、OrbitControls、基础灯光、网格和资源释放 | 已迁移            |
| AIRI 随机眨眼和基础表情过渡                       | 已迁移            |
| 鼠标/相机视线跟踪与空闲眼球扫视                   | 已迁移            |
| wLipSync 音频口型                                 | 已迁移，本地 WASM |
| HDR/SkyBox、IBL、NPR Shader 和 AIRI 描边          | 已迁移            |
| 身体点击碰撞体与交互事件                          | 已迁移            |
| 模型实例缓存、切换事务和相机状态保留              | 已迁移            |
| 渲染追踪、性能指标、RenderTarget 拾取             | 已迁移            |
| 相机、灯光、环境和模型设置持久化                  | 已用 Zustand 改写 |

## 后续接入

- 将独立 `VrmStage` 接入聊天页，并把语音播放元素传给 `attachAudioElement`。
- 将聊天情绪和动作状态映射到 `setExpression` 与动画切换。
- 增加多模型连续切换、长时间播放和低端设备压力测试。
- 若要求 Android/iOS 原生渲染，再评估 WebView 与 Expo GL 两条路线。
