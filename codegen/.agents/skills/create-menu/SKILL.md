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

## 放哪里(scrm 实例)

- 主表菜单挂业务分组，如"售前售后"分组 `RPvxoJxySJe9ZFO4xlJGfg`
- 明细表(子表)同父级、`is_hidden=1`，例如 `订单明细,/scrm/order_item,…,6016`
- `order_by` 在该分组内连续递增，不要跳段：SCRM 6001~6029、财务 6030~6034、售前售后 6037~6041、日志 6050+
- `importCsv` 会顺带生成 `base_role_menu.{mod}.sql.csv` / `base_tenant_menu.{mod}.sql.csv`，不要手写
- 页面和菜单就绪后再按需跑 `pnpm run permit` 同步按钮权限(会连库，由人类执行)

## 适用场景

- 新模块首次接入菜单
- 对已有菜单做信息架构整理
