# 页面 Native 适配计划 - verification-code-login/index

## 目标
- 为 `src/app/pages/verification-code-login/index.tsx` 增加 `index.native.tsx`，保证 App 端可展示与可交互。

## 拆解任务
- [x] 复制原页面并创建同级 `index.native.tsx`
- [x] 替换 Web 标签与事件为 RN 组件与事件
- [x] 保留业务逻辑（登录、验证码、勾选协议）并适配 Native 运行环境
- [x] 进行语法可解析性校验

## 进展
- 2026-05-15：完成 `index.native.tsx` 创建与关键兼容改造，TSX 解析通过。

## 风险与备注
- 原文件包含较多中文文案，终端显示存在编码差异；本次改造尽量只调整 App 端兼容相关代码段，避免改动页面结构。
