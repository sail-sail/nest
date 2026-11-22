---
name: create-menu
description: 新建或调整业务菜单 CSV；涉及分组、排序、隐藏明细路由和权限关联时使用。
---

# 创建菜单

## 位置

- `src/tables/{mod}/base_menu.{mod}.sql.csv`
- 以同模块现有 CSV 表头为准，不要自行增删列。

## 规则

- 按业务使用频率和操作语义组织，不按表名或字母排序。
- 菜单 ID 必须用 `pnpm run uuid [数量]` 生成。
- `parent_id` 为空表示根菜单；`route_path` 为空表示分组菜单。
- `order_by` 保持递增，常用项靠前。
- 空 ID 行只用于视觉分组，导入时会跳过。
- 明细表与主表挂同一父级，并设置 `is_hidden=1`。

## 流程

1. 在 `codegen/` 中运行 `pnpm run uuid <数量>`。
2. 按以上规则写入菜单 CSV。
3. 菜单完成后，由人类运行 `pnpm run importCsv {mod}/base_menu.{mod}`。
4. 页面完成后，按钮权限有变化时，由人类运行 `pnpm run permit`。

## 生成文件

- `importCsv` 会自动生成并导入角色、租户菜单 CSV，不要手写。
- `importCsv` 和 `permit` 都会连接数据库，不要由 Agent 擅自执行。
