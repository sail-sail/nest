---
name: table-config
description: 表字段配置规范。生成或修改 {mod}.ts 时必须读取，尤其要检查 lbl、*_id_lbl/modelLabel、审计字段等容易漏掉的配置
---

# 表配置规范

## 表配置路径
`codegen/src/tables/{mod}/{mod}.ts`

## 完整类型定义
`codegen/src/config.ts`

---

## 必读：最容易漏掉的规则

| 检查项 | 必要动作 | 例外/备注 |
|--------|----------|-----------|
| `lbl` 字段 | 在 `columns` 中显式写出 | 纯中间表、日志表、或 SQL 本身没有 `lbl` 时除外 |
| `modelLabel` | `xxx_id` 对应存在 `xxx_id_lbl` 时，给 `xxx_id` 配置 `modelLabel` | `xxx_id_lbl` 无需再单独写入 `columns` |
| 审计字段 | 通常补齐 `create_usr_id/create_time/update_usr_id/update_time` | 按表实际用途判断 |
| 配置换行 | `opts` 和 `columns` 维持多行结构 | 不要压成单行 |

### 1. lbl 字段必须在 columns 中显式写出

```ts
{ COLUMN_NAME: "lbl" },
```

`lbl` 的 width/align/require/search 有默认值，但字段本身必须显式写入 `columns`，属性可以省略。除非是纯中间表、日志表、或 SQL 本身没有 `lbl`。

### 2. modelLabel 强制规则

如果 SQL 中某个外键 `xxx_id` 有对应的 `xxx_id_lbl` 冗余字段，则**必须**配置：

```ts
{
  COLUMN_NAME: "xxx_id",
  modelLabel: "xxx_id_lbl",
},
// xxx_id_lbl 无需再单独出现在 columns 中
```

不配置会导致 codegen 报错：`字段 xxx_id 的 modelLabel 未设置, 却有 xxx_id_lbl 字段`

### 3. 审计字段通常需要补齐

```ts
{ COLUMN_NAME: "create_usr_id" },
{ COLUMN_NAME: "create_time" },
{ COLUMN_NAME: "update_usr_id" },
{ COLUMN_NAME: "update_time" },
```

### 4. 配置文件结构需换行

```ts
ec_order: {
  opts: { ... },
  columns: [ ... ],
},
```

---

## 新表最小检查清单

1. 按 SQL 中真实存在且需要生成到前后端的字段，逐一显式写入 `columns`
2. 如果 SQL 有 `lbl`，`columns` 中通常也要显式写 `{ COLUMN_NAME: "lbl" }`
3. 如果有 `xxx_id_lbl`，对应的 `xxx_id` 必须配置 `modelLabel`
4. 大部分表需要补齐审计字段

## 默认属性（写入 columns 后可省略的属性）

下表表示字段已写入 `columns` 后，可不额外再写的属性。**不代表字段本身可以省略。**

| 字段/类型 | 默认行为 |
|-----------|----------|
| `lbl` | width/align/require/search 已有默认 |
| `*_id` / `*_ids` | `foreignKey` 自动推断 |
| `*_id` 非外键字段 | 需设置 `notForeignKeyById: true`（如 `req_id`、`transaction_id`） |
| 数字类型 | align:right, width:100 |
| date/datetime | width:160 |
| decimal | width:100 |
| rem | width:280, align:left |
| `*_province_code` | 自动识别省份 |
| 有 `,dictbiz:` 或 `,dict:` 标注的字段 | 无需配置 `foreignKey` |
| `is_enabled` | `isSwitch` 默认 true |
| `order_by` | 无需配置 |
| `isFluentEditor` | noList 默认 true |

## 常用 opts 配置

| 配置项 | 用途 |
|--------|------|
| `opts.uniques` | 唯一约束，如 `[["mod", "code"]]` |
| `opts.defaultSort` | 默认排序，不配置则为 `create_time` 降序 |
| `opts.cache` | 是否缓存 |
| `opts.log` | 操作日志，开启后增改自动记录到 `operation_record` 表 |
| `opts.audit` | 审核流 |
| `opts.history_table` | 历史表名，配置后增改自动写入历史表 |
| `opts.sys_fields` | 系统保护字段，`is_sys=1` 时禁止修改 |
| `opts.dataPermit` | 行级数据权限 |
| `opts.filterDataByCreateUsr` | 非 admin 只能看自己的数据 |
| `opts.hasOrgId` | 组织维度过滤 |
| `opts.inlineForeignTabs` | 内联关联表 |
| `opts.cascadeUpdateFields` | 级联更新冗余字段 |
| `opts.is_with_auth_optional` | 可选认证，跳过 permit 检查 |
| `opts.isRealData` | 实时数据推送 |
| `opts.searchByKeyword` | 统一关键字搜索 |

### defaultSort 是全局配置

`opts.defaultSort` 同时影响 PC 和 uni 端。某端需要特殊排序时，不要修改 `opts.defaultSort`，而应在页面代码中通过 `findAll*` 的 sort 参数传入：

```typescript
await findAllXxx(search, page, [
  { prop: "type", order: "ascending" },
  { prop: "create_time", order: "descending" },
]);
```

## 审核流 (audit)

```ts
opts: {
  audit: {
    column: "audit",           // 审核字段，默认 audit
    auditMod: "base",          // 审核模块，默认当前模块
    auditTable: "usr_audit",   // 审核表名，默认 [表名]_audit
    hasReviewed: true,         // 是否启用复核（第4种状态 Reviewed）
  },
}
```

- 新增记录时审核字段自动设为 `Unsubmited`（未提交）
- `audit_reject` 操作接收 `auditTableInput` 类型，记录拒绝原因
- 删除/还原/彻底删除时会级联处理审核记录

## 系统记录保护 (sys_fields)

```ts
opts: {
  sys_fields: ["name", "type"],  // is_sys=1 时这些字段不可改
}
```

## filterDataByCreateUsr 创建人数据过滤

- 非 admin 用户只能看到自己创建的记录
- admin 不受限制
- 自动在 resolver 层注入 `search.create_usr_id` 过滤

## hasOrgId 组织维度过滤

- 非 admin 查询时自动将 `org_id` 过滤为用户所属组织 ID 列表

## is_with_auth_optional 可选认证

- GraphQL 层使用 `.with_auth_optional()?` 替代 `.with_auth()?`
- mutation 不再调用 `use_permit()` 进行权限检查
- 需要自行在业务层处理权限

## isRealData 实时数据推送

- `opts.isRealData: true` 或 `opts.hasVersion: true` 时启用
- 自动生成 WebSocket 实时推送

## searchByKeyword 统一关键字搜索

```ts
opts: {
  searchByKeyword: {
    prop: "keyword",
    fields: ["name", "code", "rem"],
    lbl: "关键字",
    placeholder: "请输入名称或编号",
    showInPcList: true,
  },
}
```

## 外键相关

### 外键数据量大时用 selectInput

```ts
{
  COLUMN_NAME: "usr_id",
  foreignKey: { selectType: "selectInput" },
  search: true,
  isSearchByLbl: true,
}
```

### isCascadeUpdateModelLabel 级联更新标签

```ts
{
  COLUMN_NAME: "product_sku_id",
  modelLabel: "product_sku_id_lbl",
  isCascadeUpdateModelLabel: true,  // lbl 变化自动更新引用它的表
},
```

或表级别配置更灵活的级联：

```ts
opts: {
  cascadeUpdateFields: [{
    watchColumn: "lbl",
    mod: "base", table: "usr",
    idColumn: "usr_id",
    column: "usr_id_lbl",
  }],
}
```

## 聚合关系 (inlineForeignTabs)

```ts
ec_order: {
  opts: {
    inlineForeignTabs: [{
      mod: "ec", table: "order_detail",
      label: "订单明细", column: "order_id",
    }],
    detailCustomDialogType: "medium",
    detailFormCols: 3,
  }
}
```

## 自动编码字段

```ts
{ COLUMN_NAME: "code_seq", onlyCodegenDeno: true },
{
  COLUMN_NAME: "code",
  align: "center", search: false, width: 100,
  readonly: true, readonlyPlaceholder: "(自动生成)",
  autoCode: {
    prefix: "JS", seq: "code_seq", seqPadStart0: 3,
    // suffix: "SN",        // 可选，编码后缀
    // dateSeq: "code_date_seq",  // 可选，日期序列
    // dateFormat: "YYYYMMDD",    // 可选，日期格式
  },
  searchByArray: true,
},
```

- `onlyCodegenDeno`: 只生成后端，不生成到前端

## COLUMN_DEFAULT 特殊默认值

建表时 `COLUMN_DEFAULT` 支持以下特殊值，codegen 会在新增时自动替换：

| 特殊值 | 含义 |
|--------|------|
| `CURRENT_USR_ID` | 当前登录用户 ID |
| `CURRENT_ORG_ID` | 当前用户所属组织 ID |
| `CURRENT_TENANT_ID` | 当前租户 ID |
| `CURRENT_USERNAME` | 当前用户名 |
| `CURRENT_DATE` / `CURRENT_DATETIME` | 当前日期/时间 |
| `start_of_day` ~ `end_of_second` | dayjs 时间范围 |

## 密码字段 (isPassword)

- 列字段配置 `isPassword: true` 后，所有查询返回自动清空该字段
- 密码字段永远不会发送到前端

## is_hidden 字段自动过滤

- 表有 `is_hidden` 字段时，所有查询自动过滤 `search.is_hidden = Some(vec![0])`
- **隐藏记录默认不出现在任何查询结果中**

## 唯一约束 (uniques)

```ts
opts: {
  uniques: [["mod", "code"]],  // 组合唯一
}
```

- 冲突处理通过后端 `Options::set_unique_type()` 控制：
  - `Ignore`: 静默跳过
  - `Update`: 自动转为更新
  - `Throw`: 抛出错误

## noAdd + noEdit 占位 mutation

- `opts.noAdd === true` 且 `opts.noEdit === true` 时，codegen 生成占位 mutation `noAddNoEdit<Table>()`
- 目的是让 Input 类型在 GraphQL schema 中保持有效，这是正常行为

## 字段权限 (fieldPermit)

- 列字段配置 `fieldPermit: true` 后启用字段级权限控制
- 查询和修改时自动进行权限检查

## isHideZero

- `isHideZero: true`: CustomInputNumber 值为 0 时隐藏显示，默认 true
- 需要显示 0 时显式配置 `:is-hide-zero="false"`

## uni 手机端页面 (isUniPage)

```ts
opts: {
  isUniPage: {
    list_page: {
      search_fields: ["name", "status"],
      lbl_field: "lbl",
      lbl2_fields: ["code", "rem"],
      right_field: "create_time",
      is_export_excel: false,
    },
    hasDetailModal: true,
  },
}
```

## PC Excel 导入

- 列表页自动生成 Excel 导入功能
- 列字段配置 `noImport: true` 可跳过该字段的导入

## 关于城市地址

- 地址固定有多个字段, 如果 `province_code` 或者 `*_province_code` 则自动识别为身份, codegen 会自动识别是省份编码无需其它配置, `province_lbl` 则是省份中文
- `city_code`, `city_lbl`, `county_code`, `county_lbl` 同理, 剩下的详细地址则是 `address` 或者 `*_address`

```ts
{
  COLUMN_NAME: "contact_name",
  width: 120,
  search: true,
},
{
  COLUMN_NAME: "contact_phone",
  width: 120,
  search: true,
},
{
  COLUMN_NAME: "province_code",
},
{
  COLUMN_NAME: "province_lbl",
},
{
  COLUMN_NAME: "city_code",
},
{
  COLUMN_NAME: "city_lbl",
},
{
  COLUMN_NAME: "county_code",
},
{
  COLUMN_NAME: "county_lbl",
  COLUMN_COMMENT: "省市区",
},
{
  COLUMN_NAME: "address",
  isTextarea: false,
},
```
