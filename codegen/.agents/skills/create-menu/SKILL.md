---
name: create-menu
description: 适用菜单配置。
---

# 创建菜单

## 设计思路

1. 菜单不要只按表名或字母顺序排，而要按“业务使用频率”和“操作语义”组织。
2. 每个菜单项都应使用 UUID，推荐通过 `pnpm run uuid` 生成，不要手写随机 ID。

## 文件位置

- `src/tables/{mod}/base_menu.{mod}.sql.csv`

## 约定

- `parent_id` 为空表示根菜单。
- `route_path` 为空表示这是分组菜单，不直接跳转。
- 空行用于视觉分组，导入脚本会跳过空 id 行。
- `order_by` 用来控制显示顺序，常用项尽量排前面。

## 创建流程

1. 先生成菜单 UUID：
   - `cd codegen`
   - `pnpm run uuid`
2. 在 `src/tables/{mod}/base_menu.{mod}.sql.csv` 中按分组写入菜单。

## 适用场景

- 新模块首次接入菜单
- 对已有菜单做信息架构整理
