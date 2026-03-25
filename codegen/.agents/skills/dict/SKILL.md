---
name: dict
description: 系统字典和业务字典配置。建表需要枚举字段或给表添加枚举类字段时使用
---

# 字典配置

## 字段声明

```sql
-- 系统字典
`is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
-- 业务字典, 字典编码格式: {mod}_{table}_{column}
`status` varchar(20) NOT NULL DEFAULT '' COMMENT '状态,dictbiz:ec_order_status',
```

## 添加字典

### 创建 CSV 文件

```
src/tables/{mod}/
├── base_dict.{mod}.sql.csv        # 系统字典
├── base_dict_detail.{mod}.sql.csv # 系统字典明细
├── base_dictbiz.{mod}.sql.csv     # 业务字典
├── base_dictbiz_detail.{mod}.sql.csv # 业务字典明细
```

- 注意 `mod` 代表当前模块, 可从表名中提取, 如 `ec_order` 表对应的模块为 `ec` 

#### `base_dictbiz.{mod}.sql.csv`:
```csv
id,code,lbl,type,order_by,tenant_id,is_sys,is_add
{uuid},exh_booking_order_state,订单-状态,string,1,ZDbZlC1OT8KaDg6soxMCBQ,1,0
```
- `lbl`: `{table_comment}-{column_comment}`
- `type`: `string` / `number`
- `tenant_id`: 固定 `ZDbZlC1OT8KaDg6soxMCBQ`
- `is_sys=1`: 系统记录，禁止修改/删除
- `is_add=0`: 不允许用户新增字典明细条目, `1`为允许用户新增

### 生成 UUID

```bash
nr uuid -- 4  # 生成需要的 UUID 数量
nr importCsv {mod}/base_dictbiz.{mod}
nr importCsv {mod}/base_dictbiz_detail.{mod}
```

#### `base_dictbiz_detail.{mod}.sql.csv`:
```csv
id,dictbiz_id,_dictbiz_lbl,lbl,val,order_by,tenant_id,is_sys
{uuid},{上面的uuid},订单-状态,未支付,unpaid,1,ZDbZlC1OT8KaDg6soxMCBQ,1
{uuid},{上面的uuid},,已支付,paid,2,ZDbZlC1OT8KaDg6soxMCBQ,1
,,,,,,,
{uuid2},{另一个uuid},其他字典-状态,待审批,pending,1,ZDbZlC1OT8KaDg6soxMCBQ,1
```
- `dictbiz_id`: 对应业务字典的 id
- `_dictbiz_lbl`: 同组首行填标签，后续行留空
- CSV 空白行用逗号表示：`,,,,,,,`
- 业务字典和系统字典的`val`值通常为小写英文字母, 多个单词用`_`拼接

## 内置系统字典

| 编码 | 用途 |
|------|------|
| is_deleted | 删除标记 |
| is_locked | 锁定 |
| is_enabled | 启用 |
| is_default | 默认 |
| yes_no | 是否 |

## is_sys 字段

```sql
`is_sys` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '系统记录,dict:is_sys',
```

`is_sys=1` 时：
- 自动生成枚举类型
- 禁止用户修改/删除
