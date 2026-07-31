---
name: create-menu
description: 为模块或业务页面创建并组织菜单树。适用于常用业务菜单、记录、设置三类分组。
---

# 创建菜单

## 设计思路

1. 菜单不要只按表名或字母顺序排，而要按“业务使用频率”和“操作语义”组织。
2. 常用业务入口放前面，历史/记录类放在“记录”分组，配置/维护类放在“设置”分组。
3. 根菜单负责表达模块，子菜单负责表达具体业务场景。
4. 每个菜单项都应使用 UUID，推荐通过 `pnpm run uuid` 生成，不要手写随机 ID。

## 文件位置

- `src/tables/{mod}/base_menu.{mod}.sql.csv`

## 推荐结构

```csv
id,parent_id,lbl,route_path,is_home_hide,is_enabled,is_hidden,order_by
{uuid},,模块名称,,0,1,0,6000
{uuid},{parent_uuid},业务菜单A,/{mod}/table_a,0,1,0,6001
{uuid},{parent_uuid},业务菜单B,/{mod}/table_b,0,1,0,6002
,,,,,,,
{uuid},{parent_uuid},记录,,0,1,0,6007
{uuid},{parent_uuid},记录项,/{mod}/table_c,0,1,0,6008
,,,,,,,
{uuid},,设置,,0,1,0,6011
{uuid},{parent_uuid},配置项,/{mod}/table_d,0,1,0,6012
```

## 约定

- `parent_id` 为空表示根菜单。
- `route_path` 为空表示这是分组菜单，不直接跳转。
- 空行用于视觉分组，导入脚本会跳过空 id 行。
- `order_by` 用来控制显示顺序，常用项尽量排前面。
- 业务菜单、记录、设置三类可以分别作为独立分组，便于后续扩展。

## 创建流程

1. 先生成菜单 UUID：
   - `cd codegen`
   - `pnpm run uuid`
2. 在 `src/tables/{mod}/base_menu.{mod}.sql.csv` 中按分组写入菜单。
3. 执行导入：
   - `pnpm importCsv -- {mod}/base_menu.{mod}.sql.csv`
4. 如需同步权限，导入脚本会自动生成对应的角色菜单和租户菜单关联。

## 适用场景

- 新模块首次接入菜单
- 对已有菜单做信息架构整理
- 需要把“业务常用、记录、设置”做成清晰分层
