---
name: dict
description: "字典字段或字典 CSV 配置。SQL 含 dict: / dictbiz: 时使用"
---

# 字典配置

## 执行顺序

1. 判断使用 `dict`、`dictbiz`，或已有内置系统字典。
2. 在 SQL 字段 `COMMENT` 中标注字典编码。
3. 新字典同时创建主表、明细 CSV。
4. 只生成文件和导入命令；默认不连接数据库执行 `importCsv`。

## SQL 字段

```sql
-- 系统字典：跨租户共享
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',

-- 业务字典：按租户使用
-- 未支付 unpaid, 已支付 paid (is_sys=1, is_add=0)
`status` ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid' COMMENT '状态,dictbiz:ec_order_status',
```

- `dict:` 使用 `base_dict` / `base_dict_detail`。
- `dictbiz:` 使用 `base_dictbiz` / `base_dictbiz_detail`。
- 字典字段无需在 `{mod}.ts` 配置 `foreignKey`。
- `type` 取 `string`、`number`、`date`、`datetime`、`time`、`boolean`。
- 字符串字典固定成员（`is_sys=1,is_add=0`）时，SQL 字段用 `ENUM`，成员和 `DEFAULT` 必须与 CSV 一致。
- 可新增成员（`is_add=1`）或普通字典使用 `varchar`。
- `number` / `boolean` 使用数值类型；布尔值用 `tinyint unsigned`，不用 `ENUM`。

## CSV 文件

放在 `src/tables/{mod}/`；只创建当前需要的主表和明细文件：

```text
base_dict.{mod}.sql.csv           # 系统字典主表
base_dict_detail.{mod}.sql.csv    # 系统字典明细
base_dictbiz.{mod}.sql.csv        # 业务字典主表
base_dictbiz_detail.{mod}.sql.csv # 业务字典明细
```

`mod=base` 时省略模块后缀，例如 `base_dict.sql.csv`。

### 系统字典

```csv
id,code,lbl,type,order_by,is_sys,is_add
{dict_id},cron_job_log_exec_state,定时任务-执行状态,string,1,1,0
```

```csv
id,dict_id,_dict_lbl,lbl,val,order_by,is_sys
{item_id_1},{dict_id},定时任务-执行状态,执行中,running,1,1
{item_id_2},{dict_id},,成功,success,2,1
```

### 业务字典

```csv
id,code,lbl,type,order_by,tenant_id,is_sys,is_add
{dict_id},ec_order_status,订单-状态,string,1,ZDbZlC1OT8KaDg6soxMCBQ,1,0
```

```csv
id,dictbiz_id,_dictbiz_lbl,lbl,val,order_by,tenant_id,is_sys
{item_id_1},{dict_id},订单-状态,未支付,unpaid,1,ZDbZlC1OT8KaDg6soxMCBQ,1
{item_id_2},{dict_id},,已支付,paid,2,ZDbZlC1OT8KaDg6soxMCBQ,1
```

## CSV 规则

- ID 使用 `pnpm run uuid {数量}` 生成，禁止自编或重复；同一个字典的主表 ID 必须被明细引用。
- `code` 通常使用 `{mod}_{table}_{column}`；复用旧编码前先确认语义完全一致。
- `_dict_lbl` / `_dictbiz_lbl` 只在每组首行填写，后续行留空；以 `_` 开头的列不会导入数据库。
- `val` 必须稳定；字符串值通常使用小写下划线。
- 每组 `order_by` 从 `1` 连续递增。
- 固定字典要求主表、明细的 `is_sys=1`；可新增普通字典通常使用 `is_sys=0,is_add=1`。
- 业务字典主表和明细的 `tenant_id` 必须为 `ZDbZlC1OT8KaDg6soxMCBQ`；缺失或不同都视为错误。
- 多组数据可用全空字段行分隔；空行的列数必须与 CSV header 一致。

## 内置系统字典

已有 `dict:` 编码直接使用，不创建 CSV。常用编码包括：

```text
is_deleted, is_locked, is_enabled, is_default, yes_no, is_sys
```

完整编码以 `src/tables/base/base_dict.sql.csv` 为准。

## 导入命令

```bash
pnpm run uuid 4
pnpm run importCsv ec/base_dictbiz.ec
pnpm run importCsv ec/base_dictbiz_detail.ec
```

系统字典分别替换为 `base_dict.{mod}` 和 `base_dict_detail.{mod}`。参数省略 `.sql.csv`，并先导主表、再导明细；未经用户明确要求不得执行。
