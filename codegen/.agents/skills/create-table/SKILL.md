---
name: create-table
description: 数据库建表规范。创建新表 SQL 时必须遵循
---

# 建表规范

> **重要**：本 skill 只管 SQL 建表。SQL 写完后，**必须继续阅读 `../table-config/SKILL.md`** 来生成对应的 `{mod}.ts` 表配置文件。两者是串联流程，不可跳过。
>
> 按下面顺序执行，避免漏规则：
> 1. 先确认表路径和表名是否符合本页规范。
> 2. 再按业务场景选择字段组：主显示字段、审计字段、软删除、字典字段、外键、地址字段、自动编码字段。
> 3. SQL 写完后逐项自检：字段名不能重复；同一语义不要并存两套命名；字典字段、布尔字段、外键字段必须满足本页的命名和类型规则。
> 4. 如果需求要求本文未覆盖、且仓库里也没有先例的数据类型、默认值或索引写法，先明确指出冲突并等待确认，不要自行猜测。

## 新表落库安全顺序

- 常规验证新表时，禁止把 `pnpm run initdb` 当默认命令；它会清空并重建全库，风险极高
- 默认安全顺序是：先 `pnpm run importCsv` 导入新菜单/字典，再 `pnpm run sql` 执行新增建表 SQL，确认库里已有新表后再 `pnpm run codegen`
- 只有用户明确确认“目标库允许整库重建”时，才可以考虑 `pnpm run initdb`

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

- 创建/修改审计字段（`create_*`、`update_*`）只在需要记录“谁创建/修改、何时创建/修改”时成组添加；纯中间表、一次性临时表、无需追踪责任人的表可以省略
- 软删除字段（`is_deleted`、`delete_*`、`delete_time`）只在记录需要逻辑删除、保留历史或支持恢复时成组添加；允许直接物理删除的表不要添加
- `tenant_id` 只在该表数据需要按租户隔离、过滤或鉴权时添加；单租户表、系统全局表不要添加
- `lbl` 是绝大多数业务主表的基础显示字段；纯中间表、日志表、令牌表这类不面向业务展示的表可以没有 `lbl`
- 如果出现字段重名、字段语义冲突，或现有字段类型与本页规则冲突，先返回明确错误点，不要继续拼接 SQL

## 字典字段

```sql
-- 业务字典: COMMENT 中用 dictbiz: 标注
`status` varchar(20) NOT NULL DEFAULT '' COMMENT '状态,dictbiz:ec_order_status',

-- 系统字典: COMMENT 中用 dict: 标注
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
```

- 有 `dict:` 或 `dictbiz:` 标注的字段，若字典配置了 `is_sys=1`，则该字段必定是 `ENUM` 类型（codegen 会自动生成枚举类型）
- 字典的详细配置规则见 [dict/SKILL.md](../dict/SKILL.md)

## 审核型表设计

如果某个业务主表需要标准“审核/复核/反审核”能力，SQL 层不要只加一个 `audit` 字段，而是要同时设计：

1. 主业务表的审核状态字段
2. 配套的审核流水表 `{mod}_{table}_audit`

### 主业务表

标准字段：

```sql
`audit` ENUM('unsubmited', 'unaudited', 'audited', 'reviewed', 'rejected') NOT NULL DEFAULT 'unsubmited' COMMENT '审核,dict:audit',
```

- `unsubmited`: 待提交
- `unaudited`: 待审核
- `audited`: 已审核
- `reviewed`: 已复核
- `rejected`: 审核拒绝

如果业务没有“复核”环节，可以去掉 `reviewed`，只保留：

```sql
`audit` ENUM('unsubmited', 'unaudited', 'audited', 'reviewed', 'rejected') NOT NULL DEFAULT 'unsubmited' COMMENT '审核,dict:audit',
```

- `audit` 字段属于系统字典字段，必须保持 `dict:audit`
- 标准反审核不需要新增新的枚举值；反审核只是把状态回退到上一步
- 标准反审核规则建议固定为：
  - `reviewed -> audited`
  - `audited -> unaudited`
  - `unaudited -> unsubmited`
  - `unsubmited`、`rejected` 不允许反审核

### 审核流水表

表名固定建议：`{mod}_{table}_audit`

标准结构：

```sql
CREATE TABLE if not exists `{mod}_{table}_audit` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `{table}_id` varchar(22) NOT NULL DEFAULT '' COMMENT '{主表中文名}',
  `{table}_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '{主表中文名}',
  `audit` ENUM('unsubmited', 'unaudited', 'audited', 'reviewed', 'rejected') NOT NULL DEFAULT 'unsubmited' COMMENT '审核,dict:audit',
  `audit_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '审核人',
  `audit_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '审核人',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '所属组织',
  `org_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '所属组织',
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
  INDEX (`tenant_id`, `is_deleted`, `{table}_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs COMMENT='{主表中文名}审核';
```

- 审核流水表的 `audit` 枚举必须和主表 `audit` 枚举保持一致
- `{table}_id_lbl` 必须保留，供 codegen 自动写入审核对象名称
- `audit_usr_id` / `audit_usr_id_lbl` / `audit_time` / `rem` 是标准字段，不要省略
- 如果主表启用了租户、组织、软删除，审核流水表通常也要保持同一套通用字段

### 必做串联

SQL 建好后，必须继续阅读 [table-config/SKILL.md](../table-config/SKILL.md) 的“审核流 (audit)”小节，把 `opts.audit` 和审核流水表 `columns` 配齐，否则 codegen 只能识别 SQL，不能正确生成前后端审核能力。

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
