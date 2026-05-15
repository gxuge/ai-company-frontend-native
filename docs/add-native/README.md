# add-native 使用说明

本文档用于规范：在保留原有 `.tsx` 文件不变的前提下，在其同级目录生成对应的 `.native.tsx` 页面文件，用于 App 端展示兼容；并通过 `plan` 与 `log` 目录沉淀计划与修改记录。

## 1. 目标与原则

1. 原有 `xxx.tsx` 文件必须保留，不做删除。
2. 新增 `xxx.native.tsx` 与原文件同级，文件名同名仅后缀不同。
3. 优先复用原页面逻辑（数据请求、状态、业务方法），按需替换 UI 展示层。
4. 每次新增/改造都要同步维护计划与日志。
5. 页面调用的子组件若无对应 `.native.tsx`，也需在组件同级新增 `.native.tsx`；原 `组件名.tsx` 必须保留且不修改删除策略不变。

## 2. 文件放置规则

以 `src/app/home/index.tsx` 为例：

```text
src/app/home/
  index.tsx
  index.native.tsx
```

说明：

1. `index.tsx`：保留原实现（通常为 H5/通用实现）。
2. `index.native.tsx`：新增 App 端实现，供 React Native 平台自动解析加载。

## 3. 推荐实施步骤

1. 找到目标页面 `xxx.tsx`。
2. 在同级创建 `xxx.native.tsx`。
3. 先复制原页面结构，再替换不兼容的 Web 组件/样式。
4. 保持导出接口一致（默认导出组件名、入参类型）。
5. 本地验证 App 端路由可正常打开，核心功能可用。
6. 补充 `plan` 与 `log` 文档。

## 4. 兼容实现建议

1. 尽量抽离公共逻辑到 `hooks`/`services`，让 `.tsx` 与 `.native.tsx` 共享。
2. UI 层差异放在各自文件中处理，避免在单文件中大量平台判断。
3. 若必须平台分支，优先局部处理，避免影响主流程可读性。
4. 样式优先采用 RN 可用能力，避免依赖仅 Web 生效的样式属性。

## 5. `.native.tsx` 书写规则（iOS/Android）

### 5.1 组件替换

1. `div` -> `View`
2. `span`/`p`/`h1~h6` -> `Text`
3. `button` -> `Pressable`
4. `input`/`textarea` -> `TextInput`
5. `img` -> `Image`
6. 可滚动长列表优先 `FlatList`，短内容可用 `ScrollView`

### 5.2 事件与输入

1. `onClick` 改 `onPress`。
2. 输入监听优先 `onChangeText`。
3. 移动端默认无 hover，去掉 `onMouseEnter/onMouseLeave` 逻辑。

### 5.3 样式与布局

1. 样式用 JS 对象（`style`），属性名 camelCase。
2. 不写 `px/rem/em`，尺寸一般用数字。
3. RN 与 Web 的 Flex 默认值不同，建议显式写 `flexDirection`、`alignItems`、`justifyContent`、`flexShrink`。
4. 避免直接依赖 Web 专属样式：`position: fixed`、`:hover`、`:before/:after`、`overflowX/overflowY` 等。

### 5.4 图片与资源

1. 本地图片优先 `require(...)`。
2. 远程图片使用 `source={{ uri: '...' }}`。
3. 图片要有明确尺寸或容器约束，避免不显示。

### 5.5 平台差异

1. 小差异：`Platform.OS` / `Platform.select` 局部处理。
2. 大差异：拆分 `.ios.tsx` / `.android.tsx`。
3. 只做 Web 与 App 分离时用 `.native.tsx`。

### 5.6 详细改造清单（可执行）

1. 先新建 `index.native.tsx`，保留 `index.tsx`。
2. 先迁移逻辑层（状态、接口、提交），再替换 UI 标签。
3. 替换 Web 事件名、输入事件、滚动容器。
4. 补齐键盘处理（必要时 `KeyboardAvoidingView`）。
5. 加安全区（`SafeAreaView` 或项目封装）。
6. 真机/模拟器分别验证 iOS/Android。
7. 回填 `plan` 与 `log` 文档。

## 6. plan 与 log 目录约定

- `docs/add-native/plan`：记录计划与进展
- `docs/add-native/log`：记录修改日志

### 6.1 plan 记录模板（建议）

文件命名：`YYYY-MM-DD-页面名-native-plan.md`

```md
# 页面 Native 适配计划 - home/index

## 目标
- 为 `home/index.tsx` 增加 `home/index.native.tsx`，保证 App 端可展示。

## 拆解任务
- [ ] 对齐原页面路由与参数
- [ ] 完成 Native UI 骨架
- [ ] 接入数据与交互
- [ ] 真机/模拟器验证

## 进展
- 2026-05-13 15:40：完成文件创建与基础结构迁移

## 风险与备注
- 某些 Web 组件需替换为 RN 组件
```

### 6.2 log 记录模板（建议）

文件命名：`YYYY-MM-DD-页面名-native-log.md`

```md
# 页面 Native 适配日志 - home/index

## 变更摘要
- 新增 `src/app/home/index.native.tsx`

## 详细记录
- 2026-05-13 15:40
  - 创建 `index.native.tsx`
  - 迁移基础状态与接口调用

## 验证结果
- App 端页面可打开
- 主要交互通过
```

## 7. 快速检查清单

1. 是否保留了原 `xxx.tsx`。
2. 是否在同级新增 `xxx.native.tsx`。
3. Native 页面是否能在 App 端正常展示。
4. 是否已更新 `plan` 与 `log` 文档。
