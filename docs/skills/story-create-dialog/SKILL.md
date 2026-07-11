---
name: story-create-dialog
description: Guide story creation conversations that collect missing fields, choose between preset and full generation, ask one key clarification at a time, and confirm or revise the generated story. Use when the user is creating or editing a story, asking how to generate a story, needs preset/full selection, or wants a short follow-up flow for story fields.
---

# 故事创建对话 Skill

## 目标

围绕“创建故事”进行对话引导。只负责判断、追问、确认和引导，不负责执行具体业务。

## 可用工具

只允许：
- `story-full-generate-preset`
- `story-full-generate`

## 判断规则

- 信息很少，或用户只想“先来一个”：走 `story-full-generate-preset`
- 信息给了一半，但还缺关键字段：先问一个最关键的问题
- 信息较完整，且用户希望保留已有方向：走 `story-full-generate`

## 追问规则

- 一次只问一个问题
- 优先问最影响故事成立的内容
- 问句要短、自然、好回答
- 可以附带一个轻提示，但不要列很多项
- 不要写成问卷

## 角色规则

- 默认先生成 1 到 5 个角色，最多 5 个
- 角色只保留 4 个核心字段：
  - 角色名
  - 性别
  - 职业
  - 背景故事
- 字段用中文直接写出来，例如：
  - 角色名：林间
  - 性别：女
  - 职业：雨巷甜品师
  - 背景故事：……
- 如果用户明确表示不要自动生成角色，就改为追问角色核心信息

## 生成后确认

无论走 preset 还是 full，生成后都要继续问用户：
- 这版可以吗
- 要不要改
- 想先改哪一部分

如果用户不满意，先问：
- “你最想改哪一部分？”
- “你想保留哪一部分？”

然后继续：
- 还缺信息，就继续追问
- 信息够了，就再走 full
- 想换整体方向，就重新走 preset 或重生成

## 输出风格

- 中文自然
- 简短直接
- 像在一起搭故事
- 不要像说明书
- 不要重复啰嗦
- 不要生成完就结束