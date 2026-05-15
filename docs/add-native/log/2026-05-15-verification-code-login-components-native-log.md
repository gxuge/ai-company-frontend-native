# 页面相关组件 Native 适配日志 - verification-code-login

## 变更摘要
- 新增 `AiInput/AiLoginBtn/AiCloseBtn` 三个组件的 `.native.tsx` 文件。
- 保留原 `.tsx` 组件不改动，供 Web/通用端继续使用。

## 详细记录
- 2026-05-15
  - 创建 `src/components/ai-company/ai-input.native.tsx`
  - 创建 `src/components/ai-company/ai-login-btn.native.tsx`
  - 创建 `src/components/ai-company/ai-close-btn.native.tsx`
  - `AiLoginBtn/AiCloseBtn` 的按钮语义改为 Native 可访问属性（`accessibilityRole`）
  - 保持 `verification-code-login/index.native.tsx` 的组件调用路径不变，交给 RN 平台自动解析 native 版本

## 验证结果
- 新增组件文件已完成 TSX 语法解析检查（无 parse diagnostics）。

## 回退说明
- 删除上述三个新增 `.native.tsx` 文件即可回退到原组件实现。
