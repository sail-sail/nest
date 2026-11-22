---
name: table-config
description: 表字段配置规范。生成或修改 {mod}.ts 时必须读取
---

# 表配置规范

## 适用范围

- 配置文件：`codegen/src/tables/{mod}/{mod}.ts`
- 完整类型：`codegen/src/config.ts`
- 先读同模块 `{mod}.sql`；SQL 建表规则见 [create-table](../create-table/SKILL.md)
- 地址、经纬度和地图选点见 [address-lnglat](../address-lnglat/SKILL.md)，本文件不重复展开
- 禁止执行 `pnpm run initdb`；AI 不连接数据库、不运行 `codegen`

## 必守规则

1. 所有需要生成到前后端的业务字段，必须在 `columns` 中显式声明。不要假设 SQL 字段会自动出现在页面。
2. SQL 有 `lbl` 时，业务主表必须声明：

```ts
{ COLUMN_NAME: "lbl" },
```

3. SQL 有 `xxx_id_lbl` 时，必须给对应 `xxx_id` 配置 `modelLabel`，且不要再声明 `xxx_id_lbl`：

```ts
{
  COLUMN_NAME: "xxx_id",
  modelLabel: "xxx_id_lbl",
},
```

4. `biz_lbl`、`receiver_province_lbl` 等不符合 `xxx_id_lbl` 命名的标签字段，需要单独写入 `columns`。
5. 表需要审计信息时，显式补齐存在于 SQL 的字段：

```ts
{ COLUMN_NAME: "create_usr_id" },
{ COLUMN_NAME: "create_time" },
{ COLUMN_NAME: "update_usr_id" },
{ COLUMN_NAME: "update_time" },
```

6. `opts`、`columns` 必须多行；每个表块上方写 `// 中文表名`，与 SQL 的 `-- 中文表名` 对应。
7. 不熟悉的属性先查 `config.ts` 或仓库同类表，不要猜属性名。

## 可省略的字段属性

字段必须先写入 `columns`；下列项目只表示写入后可依赖默认值。

| 字段 | 默认行为 |
|---|---|
| `lbl` | 默认宽度、左对齐、必填、可搜索、固定左侧 |
| `*_id` / `*_ids` | 自动推断外键 |
| 字典注释 `dict:` / `dictbiz:` | 自动识别字典，不写 `foreignKey` |
| `is_*` / `tinyint unsigned` | `isSwitch: true` |
| 数字 / `decimal` | 默认右对齐、宽度 100 |
| `date` / `datetime` | 默认宽度 160 |
| `rem` | 默认宽度 280、左对齐 |
| `order_by` | 自动作为默认升序字段 |
| `isFluentEditor: true` | 默认 `noList: true` |
| 省市区字段 | 按 `province_*`、`city_*`、`county_*` 后缀自动识别 |

`is_*` 要显示“是/否”文本或只读文本时，显式配置 `isSwitch: false`。

## 不要手写的自动配置

| 配置 | 规则 |
|---|---|
| `opts.hasSelectInput` | 被 `selectType: "selectInput"` 引用时自动推断；仅强制关闭时显式写 |
| `opts.uniques` 中的自动编码字段 | `autoCode` 自动追加 |
| 字典字段的 `foreignKey` | SQL 注释已有 `dict:` / `dictbiz:` 时自动识别 |
| `opts.defaultSort` | 按 `autoCode`、`order_by`、`create_time` 自动推断 |
| `opts.isUniApi` | `isUniPage` 已包含 Uni API 能力，不重复写 |

## 排序

- `opts.defaultSort` 同时影响 PC 和 Uni
- 未配置时依次使用 `autoCode` 降序、`order_by` 升序、`create_time` 降序
- 仅某页面需要特殊排序时，在 `findAll*` 的 `sort` 参数中覆盖，不改表级配置

## 审核流

SQL 的状态枚举和审核表结构见 [create-table](../create-table/SKILL.md)。

### 主表

- 审核配置中的 `column`、`auditMod`、`auditTable` 要显式写，不能依赖类型注释中的“默认值”
- 主表 `columns` 中保留 `{ COLUMN_NAME: "audit" }`；codegen 会自动设为只读
- 有 `reviewed` 枚举时，codegen 会强制启用 `hasReviewed`
- 不需要复核时，不要保留 `reviewed` 枚举；不要试图用 `hasReviewed: false` 覆盖推断
- 需要反审核时必须显式写 `hasReverse: true`

```ts
"{mod}_{table}": {
  opts: {
    audit: {
      column: "audit",
      auditMod: "{mod}",
      auditTable: "{table}_audit",
      hasReviewed: true,
      hasReverse: true,
    },
  },
  columns: [
    { COLUMN_NAME: "audit" },
  ],
},
```

占位符需替换成真实模块名和表名。

### 审核流水表

- 配置键必须使用完整表名 `{mod}_{table}_audit`
- 审核流水表不配置自己的 `opts.audit`
- 审核流水表不注册独立菜单

```ts
"{mod}_{table}_audit": {
  opts: {
    defaultSort: {
      prop: "audit_time",
      order: "descending",
    },
  },
  columns: [
    {
      COLUMN_NAME: "{table}_id",
      modelLabel: "{table}_id_lbl",
      isCascadeUpdateModelLabel: true,
      foreignKey: { selectType: "selectInput" },
    },
    { COLUMN_NAME: "audit" },
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
},
```

反审核复用现有状态做回退，不新增枚举值。

## 外键与多对多

### 命名推断

- `xxx_id`、`xxx_ids` 才会自动推断外键
- 命名不符合真实关联表时，显式写 `foreignKey.mod/table`
- 多态字段或并非外键的 `*_id`，配置 `notForeignKeyById: true`
- 大数据量选择器用 `selectType: "selectInput"`

```ts
{
  COLUMN_NAME: "usr_id",
  modelLabel: "usr_id_lbl",
  foreignKey: {
    mod: "base",
    table: "usr",
    selectType: "selectInput",
  },
  search: true,
  isSearchByLbl: true,
},
```

### 多对多虚拟字段

`xxx_ids` 是主表虚拟字段，不建在主表 SQL，不单独登记中间表配置。中间表只在 SQL 中创建。

可直接推断的 `usr_ids`、`role_ids`，只需：

```ts
{ COLUMN_NAME: "usr_ids" },
```

带业务前缀、关联表或中间表无法按名推断时，显式配置：

```ts
{
  COLUMN_NAME: "cc_usr_ids",
  COLUMN_COMMENT: "抄送人",
  many2many: {
    mod: "{mod}",
    table: "doc_cc",
    column1: "doc_id",
    column2: "usr_id",
  },
  foreignKey: {
    mod: "base",
    table: "usr",
    selectType: "selectInput",
    isSearchByLbl: true,
  },
},
```

- `many2many.table` 不含模块前缀
- `column1` / `column2` 对应标准 `{主表}_id` / `{关联表}_id` 时可省略
- 中间表必须有 `order_by`，规则见建表规范

### 级联标签

外键有 `modelLabel` 且关联名称变化时必须同步标签：

```ts
{
  COLUMN_NAME: "product_sku_id",
  modelLabel: "product_sku_id_lbl",
  isCascadeUpdateModelLabel: true,
},
```

跨多个字段同步时使用表级 `cascadeUpdateFields`。

## 常用表结构

| 场景 | 配置要点 |
|---|---|
| 树 | `opts.list_tree: true`；`parent_id` 配 `modelLabel`、自引用 `foreignKey` 和 `selectType: "tree"` |
| 内联子表 | `opts.inlineForeignTabs` 写子表 `mod/table/column/label`；需要更大详情弹窗时配 `detailCustomDialogType`、`detailFormCols` |
| Uni 内联子表 | 配 `uni_list_page_fields`；子表 `isUniPage.hasDetailModal: true` |
| Uni 列表 | `isUniPage.list_page` 配 `search_fields/lbl_field/lbl2_fields/right_field/is_export_excel` |
| 关键字搜索 | `searchByKeyword` 配 `prop/fields`；PC 列表显示时加 `showInPcList: true` |

## 自动编码

```ts
{ COLUMN_NAME: "code_seq", onlyCodegenDeno: true },
{
  COLUMN_NAME: "code",
  align: "center",
  search: false,
  width: 100,
  readonly: true,
  readonlyPlaceholder: "(自动生成)",
  autoCode: {
    prefix: "JS",
    seq: "code_seq",
    seqPadStart0: 3,
    // dateSeq: "code_date_seq",
    // dateFormat: "YYYYMMDD",
    // suffix: "SN",
  },
  searchByArray: true,
},
```

- 序列字段必须存在于 SQL 和 `columns`
- `onlyCodegenDeno` 表示只生成后端；`onlyCodegenDenoButApi` 同时保留前端 API 字段
- `autoCode` 自动追加唯一约束、搜索、排序和默认排序
- 日期序列唯一约束为 `[dateSeq, 编码字段]`
- `code_date_seq` 仅 dateSeq 场景需要

## 默认值与校验

动态默认值通过 `COLUMN_DEFAULT` 配置：

| 值 | 含义 |
|---|---|
| `CURRENT_USR_ID` / `CURRENT_USERNAME` | 当前用户 ID / 用户名 |
| `CURRENT_ORG_ID` | 当前组织 ID |
| `CURRENT_TENANT_ID` | 当前租户 ID |
| `CURRENT_DATE` / `CURRENT_DATETIME` | 当前日期 / 时间 |
| `start_of_day` ～ `end_of_second` | dayjs 时间边界 |

- 普通 `0`、日期等默认值由 SQL 默认值提供；不要虚构 `defaultValue`
- 数字 `require: true` 允许 `0`；要求大于 0 时加 `validators: [{ minimum: 1 }]`
- 数字默认 `isHideZero: true`；业务中 `0` 有意义时配置 `isHideZero: false`

## 唯一约束

```ts
opts: {
  uniques: [ [ "mod", "code" ] ],
},
```

`Options::set_unique_type()` 决定冲突行为：

- `Ignore`：跳过
- `Update`：转更新
- `Throw`：整批报错

唯一约束只在应用层校验，不能替代数据库并发保证。

## 特殊行为速查

| 配置 | 行为 |
|---|---|
| `sys_fields` | `is_sys=1` 时禁止修改指定字段 |
| `filterDataByCreateUsr` | 普通用户仅查询自己创建的数据，admin 不受限 |
| `hasOrgId` | SQL 有 `org_id` 时自动启用，查询注入当前用户可访问组织 |
| `dataPermit` | 启用行级数据权限 |
| `is_with_auth_optional` | 允许未登录查询，但会跳过生成权限检查；业务层必须自行鉴权 |
| `isRealData` | 启用 WebSocket；表有 `version` 时自动启用 |
| `is_hidden` | 默认只查询 `0`，隐藏记录不进入列表 |
| `isPassword` | 密码字段不进入前端查询结果或 API 字段 |
| `fieldPermit` | 启用字段级查询、修改权限 |
| `noImport` / `noExport` | 跳过 PC Excel 导入或导出 |
| `noAdd: true` + `noEdit: true` | 生成 `noAddNoEdit<Table>()` 占位 mutation，属正常行为 |
