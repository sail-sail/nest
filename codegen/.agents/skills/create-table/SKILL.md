---
name: create-table
description: 数据库建表规范。创建新表 SQL 时必须遵循；SQL 建完后必须继续阅读 table-config skill 来生成 {mod}.ts 配置
---

# 建表规范

> **重要**：本 skill 只管 SQL 建表。SQL 写完后，**必须继续阅读 `../table-config/SKILL.md`** 来生成对应的 `{mod}.ts` 表配置文件。两者是串联流程，不可跳过。

## 表路径
`codegen/src/tables/{mod}/{mod}.sql`

## 表名格式

`{mod}_{table}` 小写下划线，如 `base_usr`

## 部分约定字段

```sql
-- 主键
`id` varchar(22) NOT NULL COMMENT 'ID',

-- 显示标签
`lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',

-- 审计字段（按需选用，非全部必须）
`create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
`create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
`create_time` datetime DEFAULT NULL COMMENT '创建时间',
`update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
`update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
`update_time` datetime DEFAULT NULL COMMENT '更新时间',

-- 软删除
`is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
`delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
`delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
`delete_time` datetime DEFAULT NULL COMMENT '删除时间',
```

- 审计字段**按业务需要选择性添加**，不需要全部照抄。例如：不需要租户隔离就不写 `tenant_id`，不需要软删除就不写 `is_deleted` 相关字段
- `lbl` 是绝大多数业务主表的基础显示字段；纯中间表、日志表、令牌表这类不面向业务展示的表可以没有 `lbl`

## 字典字段

```sql
-- 业务字典: COMMENT 中用 dictbiz: 标注
`status` varchar(20) NOT NULL DEFAULT '' COMMENT '状态,dictbiz:ec_order_status',

-- 系统字典: COMMENT 中用 dict: 标注
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
```

- 有 `dict:` 或 `dictbiz:` 标注的字段，若字典配置了 `is_sys=1`，则该字段必定是 `ENUM` 类型（codegen 会自动生成枚举类型）
- 字典的详细配置规则见 [dict/SKILL.md](../dict/SKILL.md)

## 可选系统字段

| 字段 | 用途 |
|------|------|
| `tenant_id` | 租户隔离 |
| `org_id` + `org_id_lbl` | 组织隔离 |
| `is_locked` | 锁定功能 |
| `is_enabled` | 启用/禁用 |
| `order_by` | 手动排序（聚合表子表时必须要有，否则子表无法排序）|
| `rem` | 备注 |
| `is_hidden` | 隐藏记录 |
| `parent_id` | 树形结构 |

## 布尔字段

```sql
`is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
```

- 命名必须以 `is_` 开头，如 `is_xxx`
- 类型必须为 `tinyint unsigned`
- 默认值为 `0` 或 `1`

## 外键

```sql
`usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
`usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '用户',
```

- 外键命名：`{foreignTable}_id`（**不带**模块名 `{mod}_` 前缀），如 `usr_id`
- 冗余标签命名：`{foreignTable}_id_lbl`，如 `usr_id_lbl`
- 冗余标签字段按需添加，一般业务表都需要

## 多对多中间表

```sql
-- 表名: {mod}_{table1}_{table2}
CREATE TABLE `base_usr_role` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `role_id` varchar(22) NOT NULL DEFAULT '' COMMENT '角色',
  -- ... 审计字段
);
```

## 表索引

```sql
INDEX (`tenant_id`, `is_deleted`, `lbl`),
```

- 通常有唯一性或查询过滤需求的字段才需要加索引
- 注意不要建唯一索引，而是普通索引

## 城市地址字段

地址字段固定一组，命名规则为 `*_province_code`、`*_province_lbl`、`*_city_code`、`*_city_lbl`、`*_county_code`、`*_county_lbl`、`*_address`。无前缀的 `province_code` 等也可识别。

```sql
`province_code` varchar(10) NOT NULL DEFAULT '' COMMENT '省份编码',
`province_lbl` varchar(10) NOT NULL DEFAULT '' COMMENT '省份',
`city_code` varchar(15) NOT NULL DEFAULT '' COMMENT '城市编码',
`city_lbl` varchar(15) NOT NULL DEFAULT '' COMMENT '城市',
`county_code` varchar(20) NOT NULL DEFAULT '' COMMENT '区县编码',
`county_lbl` varchar(20) NOT NULL DEFAULT '' COMMENT '区县',
`address` varchar(100) NOT NULL DEFAULT '' COMMENT '详细地址',
```

## 自动编码字段

```sql
`code_seq` int unsigned NOT NULL DEFAULT 0 COMMENT '编码-序列号',
`code` varchar(45) NOT NULL DEFAULT '' COMMENT '编码',
-- 日期序列（可选）
`date_seq` date NOT NULL DEFAULT (CURRENT_DATE) COMMENT '日期-序列号',
```

- 如果表中已有 `lbl` 字段，序列字段命名为 `code_seq` / `code`；否则为 `lbl_seq` / `code`

## 完整示例

```sql
DROP TABLE IF EXISTS `base_example`;
CREATE TABLE `base_example` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '用户',
  `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`tenant_id`, `is_deleted`, `lbl`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs COMMENT='示例';
```
