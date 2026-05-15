# 页面 Native 适配日志 - verification-code-login/index

## 变更摘要
- 新增 `src/app/pages/verification-code-login/index.native.tsx`。
- 在不改原 `index.tsx` 的前提下，将页面适配为 App 端可用。

## 详细记录
- 2026-05-15
  - 从 `index.tsx` 复制生成 `index.native.tsx`
  - 将 `div/span/img/button` 替换为 `View/Text/Image/Pressable`
  - 将 `onClick` 替换为 `onPress`
  - 移除 `window` 依赖，改用 `Dimensions` 监听宽度变化计算 `scale`
  - 调整了 Native 不兼容样式写法（如 `px` 字符串尺寸、`transform` 写法、`background` 字段）
  - 保持登录与验证码逻辑不变，仅调整 Native 展示层

## 验证结果
- 使用 TypeScript 解析器校验 `index.native.tsx`，语法诊断为 0。

## 回退说明
- 如需回退，仅删除 `src/app/pages/verification-code-login/index.native.tsx` 并移除本次 plan/log 文档即可。
