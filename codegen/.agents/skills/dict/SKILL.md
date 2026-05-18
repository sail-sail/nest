---
name: dict
description: 系统字典和业务字典配置。SQL 中有 dict: 或 dictbiz: 标注的字段时使用
---

# 字典配置

## 使用顺序

1. 先在 SQL 字段注释里声明 `dict:` 或 `dictbiz:`。
2. 再按字典类型补充对应 CSV 数据。
3. 最后执行导入命令。

## 字段声明（SQL 中）

```sql
-- 系统字典：内置、跨租户共享
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',

-- 业务字典：按模块独立
`status` varchar(20) NOT NULL DEFAULT '' COMMENT '状态,dictbiz:ec_order_status',
```

1. `dict:` = 系统字典，`dictbiz:` = 业务字典。
2. 有字典标注的字段在 `.ts` 配置中**无需配置** `foreignKey`。
3. 若字典配置了 `is_sys=1`，则对应字段严格要求为 `ENUM` 类型。

## 添加字典数据

### 创建 CSV 文件

```
src/tables/{mod}/
├── base_dict.{mod}.sql.csv              # 系统字典
├── base_dict_detail.{mod}.sql.csv       # 系统字典明细
├── base_dictbiz.{mod}.sql.csv           # 业务字典
├── base_dictbiz_detail.{mod}.sql.csv    # 业务字典明细
```

1. `mod` 代表当前模块名，从表名中提取，如 `ec_order` 表的模块为 `ec`。
2. 按字典类型只创建当前需要的 CSV 文件，不要额外补无关文件。

### 业务字典主表 `base_dictbiz.{mod}.sql.csv`

```csv
id,code,lbl,type,order_by,tenant_id,is_sys,is_add
{uuid},exh_booking_order_state,订单-状态,string,1,ZDbZlC1OT8KaDg6soxMCBQ,1,0
```

| 列 | 说明 |
|----|------|
| `id` | 用 `npm run uuid` 生成，**不要自己编 UUID** |
| `code` | 字典编码，格式 `{mod}_{table}_{column}` |
| `lbl` | 格式 `{table_comment}-{column_comment}` |
| `type` | `string` 或 `number` |
| `tenant_id` | **固定值** `ZDbZlC1OT8KaDg6soxMCBQ`，禁止替换为生成的 UUID |
| `is_sys` | `1` = 系统保护（自动生成枚举类型，禁止用户修改/删除）；`0` = 普通记录 |
| `is_add` | `0` = 不允许用户新增字典明细；`1` = 允许 |

1. `tenant_id` 缺失时，直接判定该 CSV 无效，不要导入。
2. `tenant_id` 不是固定值 `ZDbZlC1OT8KaDg6soxMCBQ` 时，直接按错误处理并改回固定值后再导入。

### 业务字典明细 `base_dictbiz_detail.{mod}.sql.csv`

```csv
id,dictbiz_id,_dictbiz_lbl,lbl,val,order_by,tenant_id,is_sys
{uuid},{上面的uuid},订单-状态,未支付,unpaid,1,ZDbZlC1OT8KaDg6soxMCBQ,1
{uuid},{上面的uuid},,已支付,paid,2,ZDbZlC1OT8KaDg6soxMCBQ,1
,,,,,,,
{uuid2},{另一个uuid},其他字典-状态,待审批,pending,1,ZDbZlC1OT8KaDg6soxMCBQ,1
```

| 列 | 说明 |
|----|------|
| `dictbiz_id` | 对应上面业务字典主表的 `id` |
| `_dictbiz_lbl` | 同组首行填分组标签，后续行留空 |
| `lbl` | 字典项显示名称 |
| `val` | 字典项值，通常为小写英文字母，多单词用 `_` 拼接 |
| `tenant_id` | **固定值** `ZDbZlC1OT8KaDg6soxMCBQ`，禁止替换 |

1. `tenant_id` 缺失时，直接判定该 CSV 无效，不要导入。
2. `tenant_id` 不是固定值 `ZDbZlC1OT8KaDg6soxMCBQ` 时，直接按错误处理并改回固定值后再导入。
3. CSV 中的空白行用空逗号表示：`,,,,,,,`，用于分隔不同字典组。

### 导入

```bash
npm run uuid -- 4  # 生成需要的 UUID 数量
npm run importCsv -- {mod}/base_dictbiz.{mod}
npm run importCsv -- {mod}/base_dictbiz_detail.{mod}
```

## 内置系统字典

| 编码 | 用途 |
|------|------|
| is_deleted | 删除标记 |
| is_locked | 锁定 |
| is_enabled | 启用 |
| is_default | 默认 |
| yes_no | 是否 |
| is_sys | 系统记录 |

系统字典不需要手动创建 CSV，直接使用即可。

## is_sys 字段

建表时如需标记"系统保护记录"：

```sql
`is_sys` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '系统记录,dict:is_sys',
```

`is_sys=1` 时：
- 自动生成枚举类型（配合 dict/dictbiz 使用）
- 禁止用户修改/删除该记录
