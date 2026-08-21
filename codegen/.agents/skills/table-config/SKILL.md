---
name: table-config
description: 表字段配置规范。生成或修改 {mod}.ts 时必须读取
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

尤其要检查 lbl、*_id_lbl/modelLabel、审计字段等容易漏掉的配置

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

注意命名陷阱：`xxx_id_lbl` 字段存在时，codegen 只按上述规则报错提示配置 `modelLabel`；但像 `biz_lbl`、`receiver_province_lbl` 这类**不是** `xxx_id_lbl` 命名的冗余标签字段，需要单独写入 `columns`，不享受 modelLabel 推断。

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

### 5. 新表生成前的安全执行顺序

- 禁止执行 `pnpm run initdb`；它会清空并重建全库，风险极高
- 建表和配置表之后, 应等人类来执行代码生成, 禁止连接数据库修改数据

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
| 所有 `is_*` 布尔字段 | `isSwitch` 默认 true，显示文本或只读时要显式 `isSwitch: false` |
| `order_by` | 无需配置 |
| `isFluentEditor` | noList 默认 true |

## 常用 opts 配置

| 配置项 | 用途 |
|--------|------|
| `opts.uniques` | 唯一约束，元素是字段名数组，如 `[["code"], ["lbl"]]`；带 `autoCode` 的编码字段会自动追加，无需手写 |
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
| `opts.isUniApi` | 生成 uni 端 Api；配了 `isUniPage` 时自动为 true，不用重复写；带审核的主表其审核流水表也会自动继承 |

### defaultSort 是全局配置

`opts.defaultSort` 同时影响 PC 和 uni 端。某端需要特殊排序时，不要修改 `opts.defaultSort`，而应在页面代码中通过 `findAll*` 的 sort 参数传入：

```typescript
await findAllXxx(search, page, [
  { prop: "type", order: "ascending" },
  { prop: "create_time", order: "descending" },
]);
```

## 审核流 (audit)

- 主表配置 `opts.audit` 时，必须同时存在对应的审核流水表 `{mod}_{table}_audit`（SQL 与 `{mod}.ts` 都要建）；codegen 找不到审核表会直接报错 `审核表: xxx 不存在`
- 审核流水表不需要 `opts.audit`，只需标准 columns（见下文示例）
- 审核流水表不注册独立菜单，前端通过主表的 `AuditListDialog` 查看流水
- 主表 `audit` 字段在 columns 中只写 `{ COLUMN_NAME: "audit" }`，codegen 会自动置 `readonly: true`

```ts
opts: {
  audit: {
    column: "audit",           // 审核字段，默认 audit
    auditMod: "base",          // 审核模块，默认当前模块
    auditTable: "usr_audit",   // 审核表名，默认 [表名]_audit
    hasReviewed: true,          // 是否启用复核；audit 枚举含 reviewed 时 codegen 会自动推断为 true，可省略
    hasReverse: true,           // 是否生成反审核能力，必须显式写 true，无自动推断
  },
}
```

- `hasReviewed`：SQL 枚举含 `reviewed` 时自动为 true，不写也会生成复核；需要显式写 `false` 的场景是枚举含 `reviewed` 但不想开放复核
- `hasReverse`：不写就不生成反审核按钮与 mutation，需要反审核必须显式 `true`

### 标准状态设计

如果业务有“复核”环节，主表和审核流水表的 `audit` 枚举建议统一为：

```sql
ENUM('unsubmited', 'unaudited', 'audited', 'reviewed', 'rejected')
```

对应配置：

```ts
audit: {
  column: "audit",
  auditMod: "scrm",
  auditTable: "clue_audit",
  hasReviewed: true,
  hasReverse: true,
}
```

如果业务没有“复核”环节，建议枚举改为：

```sql
ENUM('unsubmited', 'unaudited', 'audited', 'rejected')
```

对应配置：

```ts
audit: {
  column: "audit",
  auditMod: "base",
  auditTable: "example_audit",
  hasReviewed: false,
  hasReverse: true,
}
```

### 标准行为约定

- 新增记录时审核字段默认是 `Unsubmited`
- `audit_submit`: `unsubmited` / `rejected` -> `unaudited`
- `audit_pass`: `unaudited` -> `audited`
- `audit_reject`: `unaudited`，以及有复核时的 `audited` -> `rejected`
- `audit_review`: `audited` -> `reviewed`（仅 `hasReviewed: true`）
- `audit_reverse`: 回退到上一状态，不新增新枚举值
  - `reviewed -> audited`
  - `audited -> unaudited`
  - `unaudited -> unsubmited`
  - `unsubmited`、`rejected` 不允许反审核
- `audit_reject` 操作接收 `auditTableInput` 类型，记录拒绝原因
- 删除/还原/彻底删除时会级联处理审核记录

### 审核流水表配置

审核流水表 `columns` 至少保持以下结构：

```ts
scrm_clue_audit: {
  opts: {
    defaultSort: {
      prop: "audit_time",
      order: "descending",
    },
  },
  columns: [
    {
      COLUMN_NAME: "clue_id",
      modelLabel: "clue_id_lbl",
      isCascadeUpdateModelLabel: true,
      foreignKey: {
        selectType: "selectInput",
      },
    },
    {
      COLUMN_NAME: "audit",
    },
    {
      COLUMN_NAME: "audit_usr_id",
      modelLabel: "audit_usr_id_lbl",
      isCascadeUpdateModelLabel: true,
      foreignKey: {
        mod: "base",
        table: "usr",
        selectType: "selectInput",
      },
    },
    { COLUMN_NAME: "audit_time" },
    { COLUMN_NAME: "rem" },
    { COLUMN_NAME: "create_usr_id" },
    { COLUMN_NAME: "create_time" },
    { COLUMN_NAME: "update_usr_id" },
    { COLUMN_NAME: "update_time" },
  ],
}
```

- 审核流水表的外键字段必须配置 `modelLabel`
- `{table}_id` 推荐配置 `isCascadeUpdateModelLabel: true`，避免主表名称变化后流水表标签不更新
- `audit_usr_id` 也推荐按标准用户外键去配置

### 当前仓库约定

- 如果决定启用标准审核能力，建议在 `opts.audit` 中显式写出 `hasReverse: true`
- 不要为“反审核”额外新增枚举值；标准方案就是回退到上一个已存在状态
- 以后 AI 创建带审核的新表时，优先复用 `scrm_clue` / `scrm_clue_audit` 这一对表的设计，而不是重新发明审核字段或审核流水结构

## 树形结构 (list_tree + parent_id)

```ts
scrm_category: {
  opts: {
    list_tree: true, // 自身是一棵树
  },
  columns: [
    {
      COLUMN_NAME: "parent_id",
      modelLabel: "parent_id_lbl",
      require: false,
      placeholderInForm: "上级类目, 默认为一级类目",
      foreignKey: {
        mod: "scrm",
        table: "category",       // 自引用，指向本表
        lbl: "lbl",
        selectType: "tree" as const, // 树形选择
      },
    },
  ],
}
```

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

### 不以 _id/_ids 结尾的字段不会被推断为外键

如 `notify_usrs` 这类存 id 列表但命名不带 `_ids` 后缀的字段，按普通字符串字段处理；需要外键行为就改字段名以 `_ids` 结尾。

### 跨模块多态外键需 notForeignKeyById

`xxx_id` 字段如果实际引用多个不同模块的表（如 `biz_id` 配合 `biz_type`），要显式配置 `notForeignKeyById: true`，否则 codegen 会按字段名前缀错误推断外键表。

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
      uni_list_page_fields: [ "product_id_lbl", "quantity" ], // 移动端内联表格显示列
    }],
    detailCustomDialogType: "medium",
    detailFormCols: 3,
  }
}
```

- 主表同时有 `isUniPage` 时，inline 子表应配 `uni_list_page_fields`，并且子表自身的 `opts.isUniPage` 配 `hasDetailModal: true`

## 自动编码字段

```ts
// 序列字段名跟随编码字段名: code -> code_seq/code_date_seq, lbl -> lbl_seq/lbl_date_seq
{ COLUMN_NAME: "code_date_seq", onlyCodegenDeno: true }, // 仅 dateSeq 编码需要
{ COLUMN_NAME: "code_seq", onlyCodegenDeno: true },
{
  COLUMN_NAME: "code",
  align: "center", search: false, width: 100,
  readonly: true, readonlyPlaceholder: "(自动生成)",
  autoCode: {
    prefix: "JS", seq: "code_seq", seqPadStart0: 3,
    // suffix: "SN",        // 可选，编码后缀
    // dateSeq: "code_date_seq",  // 可选，日期序列，字段名是 [编码字段]_date_seq
    // dateFormat: "YYYYMMDD",    // 可选，日期格式
  },
  searchByArray: true,
},
```

- `onlyCodegenDeno`: 只生成后端，不生成到前端
- 序列字段必须在 SQL 中建出并在 columns 中写出（配 `onlyCodegenDeno: true`），codegen 会校验存在性，缺失会报错
- 带 `autoCode` 的字段自动追加唯一约束（无 dateSeq 时 `[字段]`，有 dateSeq 时 `[dateSeq, 字段]`），`opts.uniques` 无需再手写该字段

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
