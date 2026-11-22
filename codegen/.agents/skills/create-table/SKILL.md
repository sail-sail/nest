---
name: create-table
description: 数据库建表规范。创建新表 SQL 时必须遵循
---

# 建表规范

> 本 skill 只负责建表 SQL。完成后**必须继续读取 `../table-config/SKILL.md`**，生成对应 `{mod}.ts`。
>
> 顺序：确认路径和表名 → 选择字段组 → 自检命名、类型、注释和索引 → 未覆盖且仓库无先例时先确认，不猜。

## 交付与落库

- AI 只改文件并产出 SQL；不连接数据库、不执行 `initdb`、`importCsv` 或 `codegen`
- 人类落库顺序：菜单/字典 CSV → 表结构；现有表可用 `sql-alter` 生成 ALTER，新表必须手工执行 `CREATE TABLE` 段
- **不能用 `sql-alter` 生成新表**：index 中没有基版时脚本会跳过
- 明细表菜单必须配置 `is_hidden=1`

## 表路径
`codegen/src/tables/{mod}/{mod}.sql`

- 同目录下的 `*.sql.csv` 是**数据导入文件**(菜单/字典/初始化数据)，不是表结构；表结构只在 `{mod}.sql`
- 模块已存在时只改 `{mod}.sql` 和 `{mod}.ts`，**不要动** `src/tables/tables.ts`

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

- 创建/修改审计字段（`create_*`、`update_*`）按责任追踪需求成组添加；无需追踪的表可省略
- 软删除字段（`is_deleted`、`delete_*`、`delete_time`）只在记录需要逻辑删除、保留历史或支持恢复时成组添加；允许直接物理删除的表不要添加
- `tenant_id` 只在该表数据需要按租户隔离、过滤或鉴权时添加；单租户表、系统全局表不要添加
- `lbl` 是绝大多数业务主表的基础显示字段；纯中间表、日志表、令牌表这类不面向业务展示的表可以没有 `lbl`
- 多对多中间表只按专用小节建，不机械套用完整业务审计字段
- 出现字段重名、语义冲突或类型冲突时，先报告错误，不继续拼 SQL
- 每列必须写 `COMMENT`
- 表也必须写 `COMMENT='中文表名'`，codegen 用它当表标签/页面标题

## 字典字段

```sql
-- 业务字典: COMMENT 中用 dictbiz: 标注
`status` varchar(20) NOT NULL DEFAULT '' COMMENT '状态,dictbiz:ec_order_status',

-- 系统字典: COMMENT 中用 dict: 标注
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
```

- 字典字段的 SQL 类型由字典配置决定，不要一律用 `varchar`，也不要一律用 `ENUM`：
  - 字符串字典成员冻结（`is_sys=1,is_add=0`）：字段必须写成 `ENUM`，枚举值与字典成员逐一对应，DEFAULT 必须是其中一个成员
  - 字符串普通字典（`is_sys=0`）或允许新增成员（`is_add=1`）：字段用 `varchar`
  - `number` / `boolean` 使用数值类型；布尔值用 `tinyint unsigned`，不用 `ENUM`
- 写字典字段前先在 COMMENT 上方用行注释列出字典成员，格式：`-- 标签 val, 标签 val (is_sys=0, is_add=1)`，方便对照维护
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

如果业务没有“复核”环节，可以去掉 `reviewed`，只保留 4 个值：

```sql
`audit` ENUM('unsubmited', 'unaudited', 'audited', 'rejected') NOT NULL DEFAULT 'unsubmited' COMMENT '审核,dict:audit',
```

- `audit` 字段属于系统字典字段，必须保持 `dict:audit`
- `audit` 枚举必须与审核流水表完全一致；状态流转与反审核由 table-config 规定

### 审核流水表

表名固定建议：`{mod}_{table}_audit`

标准结构（含组织、租户、软删除字段的完整示例；主表没有这些通用字段时按需裁剪）：

```sql
CREATE TABLE if not exists `{mod}_{table}_audit` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `{table}_id` varchar(22) NOT NULL DEFAULT '' COMMENT '{主表中文名}',
  `{table}_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '{主表中文名}',
  `audit` ENUM('unsubmited', 'unaudited', 'audited', 'reviewed', 'rejected') NOT NULL DEFAULT 'unsubmited' COMMENT '审核,dict:audit',
  `audit_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '审核人',
  `audit_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '审核人',
  `audit_time` datetime DEFAULT NULL COMMENT '审核时间',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '所属组织',
  `org_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '所属组织',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
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
- 审核流水表的通用字段必须和主表对齐：主表有 `org_id`/`tenant_id`/软删除，流水表就也要有；主表没有，流水表也不要加

审核表 SQL 写完后，继续读取 [table-config/SKILL.md](../table-config/SKILL.md) 的“审核流 (audit)”小节，配置 `opts.audit` 和审核流水表 `columns`。

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
- 冗余标签字段按需添加，一般业务表都需要；长度允许大于 45（如主表 `lbl` 是 varchar(50/100) 时对齐）
- 字段名一般等于「被引用表名去掉模块前缀」：`tech_id` → `{mod}_tech`，codegen 靠这个自动推断外键。对不上时（带业务前缀的 `biz_usr_id`、多态的 `biz_id` 这类）必须在 `{mod}.ts` 里显式写 `foreignKey` 或 `notForeignKeyById: true`，否则 codegen 报 `table2_name not found`
- `{foreignTable}_id_lbl` 的 varchar 长度一般对齐被引用表的 `lbl`

## 多对多中间表

表名 `{mod}_{table1}_{table2}`。纯多对多表只存关系，不单独登记 `{mod}.ts`；主表通过 `_ids` 虚拟字段引用。

```sql
CREATE TABLE if not exists `{mod}_{table1}_{table2}` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `{table1}_id` varchar(22) NOT NULL DEFAULT '' COMMENT '{表1中文}',
  `{table2}_id` varchar(22) NOT NULL DEFAULT '' COMMENT '{表2中文}',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`{table1}_id`, `is_deleted`, `order_by`),
  INDEX (`{table2}_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs COMMENT='{关系中文名}';
```

- `id`、两端 `_id`、`order_by`、`tenant_id`、`create_usr_id`、`create_time`、`is_deleted`、`delete_time` 是运行时必需字段
- `org_id`、组织隔离或额外审计字段只按业务需要添加
- 纯关系表不要加 `_id_lbl`：生成器只写关系 ID，显示标签直接关联目标表读取
- `_ids` 字段和显式 `many2many` 配置见 [table-config/SKILL.md](../table-config/SKILL.md) 多对多小节

## 表索引

```sql
INDEX (`tenant_id`, `is_deleted`, `org_id`, `lbl`),
```

- 索引按表实际包含的通用字段组合：无 `org_id` 时去掉该项，无 `tenant_id` 时同理
- 有唯一性或查询过滤需求的字段才加索引；唯一性约束在 `{mod}.ts` 的 `opts.uniques` 配置，不要在 SQL 里建唯一索引

## 地址与经纬度字段

地址字段必须成组：`province_code`、`province_lbl`、`city_code`、`city_lbl`、`county_code`、`county_lbl`、`address`。允许统一加业务前缀，如 `receiver_address`。

```sql
`province_code` varchar(10) NOT NULL DEFAULT '' COMMENT '省份编码',
`province_lbl` varchar(10) NOT NULL DEFAULT '' COMMENT '省份',
`city_code` varchar(15) NOT NULL DEFAULT '' COMMENT '城市编码',
`city_lbl` varchar(15) NOT NULL DEFAULT '' COMMENT '城市',
`county_code` varchar(20) NOT NULL DEFAULT '' COMMENT '区县编码',
`county_lbl` varchar(20) NOT NULL DEFAULT '' COMMENT '区县',
`address` varchar(100) NOT NULL DEFAULT '' COMMENT '详细地址',
```

- 需要地图定位时必须同时加 `longitude`、`latitude`，类型均为 `decimal(10,6)`
- PC 选点必须继续读取 [address-lnglat/SKILL.md](../address-lnglat/SKILL.md)

## 自动编码字段

```sql
`code_seq` int unsigned NOT NULL DEFAULT 0 COMMENT '编码-序列号',
`code` varchar(45) NOT NULL DEFAULT '' COMMENT '编码',
-- 日期序列（可选，需要"前缀+日期+序号"编码时加，字段名跟随编码字段名）
`code_date_seq` date NOT NULL DEFAULT (CURRENT_DATE) COMMENT '日期-序列号',
```

- 序列字段命名跟随编码字段：编码字段是 `code` 就用 `code_seq`/`code_date_seq`；是 `lbl` 就用 `lbl_seq`/`lbl_date_seq`
- 编码字段（`code` 或 `lbl`）与序列字段都要在 `{mod}.ts` 的 `columns` 中写出，序列字段配 `onlyCodegenDeno: true`，并在编码字段上配 `autoCode`

## 完整示例

```sql
CREATE TABLE if not exists `base_example` (
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
