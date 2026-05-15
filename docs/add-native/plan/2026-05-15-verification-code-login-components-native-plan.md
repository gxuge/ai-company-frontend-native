# 页面相关组件 Native 适配计划 - verification-code-login

## 目标
- 为 `verification-code-login` 页面依赖组件提供同级 `.native.tsx` 实现。
- 保持原组件文件不删除、不覆盖，App 端自动解析 native 版本。

## 拆解任务
- [x] 新增 `src/components/ai-company/ai-input.native.tsx`
- [x] 新增 `src/components/ai-company/ai-login-btn.native.tsx`
- [x] 新增 `src/components/ai-company/ai-close-btn.native.tsx`
- [x] 保持组件 props 接口与现有页面调用兼容
- [x] 完成语法检查

## 进展
- 2026-05-15：完成组件 native 文件创建与基础兼容改造。

## 风险与备注
- 本次仅处理 `verification-code-login` 直接依赖组件，未扩展到其他页面组件链路。
