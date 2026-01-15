---
name: create-table
description: 数据库建表规范。创建新表时必须遵循
---

# 建表规范

## 表路径
`codegen/src/tables/{mod}/{mod}.sql`

## 表名格式

`{mod}_{table}` 小写下划线，如 `base_usr`

## 必须字段

```sql
-- 主键
`id` varchar(22) NOT NULL COMMENT 'ID',

-- 显示标签
`lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',

-- 审计字段
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

## 业务字典 dictbiz
```sql
`type` varchar(20) NOT NULL DEFAULT '' COMMENT '类型,dictbiz:{mod}_{table}_type',
```

## 系统字典 dict

```sql
`type` varchar(20) NOT NULL DEFAULT '' COMMENT '类型,dict:{mod}_{table}_type',
```

## 业务字典 跟 系统字典 dict + dictbiz 的 Skills
- [dict/SKILL.md](../dict/SKILL.md)

## 可选系统字段

| 字段 | 用途 |
|------|------|
| `tenant_id` | 租户隔离 |
| `org_id` + `org_id_lbl` | 组织隔离 |
| `is_locked` | 锁定功能 |
| `is_enabled` | 启用/禁用 |
| `order_by` | 手动排序(当聚合表子表时必须要order_by字段,否则子表无法排序)|
| `rem` | 备注 |
| `is_hidden` | 隐藏记录 |
| `parent_id` | 树形结构 |

## 排序字段
```sql
`order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
```

## 启用字段
```sql
`is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
```

- 布尔值字段名 `is_xxx` `is_` 开头, 且 字段类型为 `tinyint unsigned`, 默认值为 `0` 或 `1`

## 特殊字段命名

| 后缀 | 用途 | 长度规则 |
|------|------|----------|
| `img`/`_img` | 图片 | 22*N |
| `att`/`_att` | 附件 | 22*N |
| `icon`/`_icon` | 图标 | - |

## 自动编码字段, 如订单编号, 如果表中已经有 `lbl` 字段, 则自动编码字段命名为 `code_seq` `code`，否则为 `lbl_seq` `lbl`

```sql
`code_seq` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '编码-序列号',
`code` varchar(45) NOT NULL DEFAULT '' COMMENT '编码',
```

## 外键

```sql
`usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
`usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '用户',
```

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

## 自动编码

```sql
`code_seq` int unsigned NOT NULL DEFAULT 0 COMMENT '编码-序列号',
`code` varchar(20) NOT NULL DEFAULT '' COMMENT '编码',
-- 日期序列（可选）
`date_seq` date NOT NULL DEFAULT (CURRENT_DATE) COMMENT '日期-序列号',
```

## 字典引用

```sql
-- 系统字典
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
-- 业务字典
`type` varchar(20) NOT NULL DEFAULT '' COMMENT '类型,dictbiz:example_type',
```

## 表索引
```sql
INDEX (`lbl`, `tenant_id`, `is_deleted`),
```
- 注意通常有唯一性的字段才需要加索引, 但不能是唯一索引

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
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='示例';
```
