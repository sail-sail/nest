---
name: table-config
description: 表字段配置规范。配置 {mod}.ts、给表添加/修改字段配置、建表后配置时必须先读取此技能
---

# 表配置规范

## 表配置路径
`codegen/src/tables/{mod}/{mod}.ts`

## 表配置结构详细文档和类型
`codegen/src/config.ts`

## 常用配置
- `opts.uniques`: 唯一约束, 需要唯一性的字段组合, 否则无需配置
- `opts.defaultSort`: 需要默认排序的字段, 否则无需配置, 不配置则默认创建时间降序 `create_time` `descending`
- `opts.cache`: 是否缓存, 需要缓存时配置
- `opts.inlineForeignTabs`: 内联关联表配置, 需要内联展示关联表时配置, 主表从表聚合关系使用

### defaultSort 是全局配置
`opts.defaultSort` 会同时影响 PC 和 uni 所有端的默认排序。当某个端需要特殊排序（如 uni 列表按 type 分组展示, `type` 配置 `canSortInApi: true`），不要修改 `opts.defaultSort`，而应在该端的页面代码中通过 `findAll*` 的 sort 参数传入自定义排序：

```typescript
// uni 页面中自定义排序，不影响 PC 端的默认排序
function getSortXxx(): Sort[] {
  return [
    {
      prop: "type",
      order: "ascending",
    },
    {
      prop: "create_time",
      order: "descending",
    },
  ] as Sort[];
}

// 调用时传入第三个参数
await findAllXxx(
  search,
  page,
  getSortXxx(),
);
```

## 默认值（无需配置）

| 字段/类型 | 默认行为 |
|-----------|----------|
| `lbl` | width/align/require/search 已有默认 |
| `*_id`/`*_ids` | foreignKey 自动推断 |
| `*_id` 非外键字段 | 需设置 `notForeignKeyById: true` 阻止自动外键推断，如 `req_id`、`transaction_id` 等业务ID |
| 数字类型 | align:right, width:100 |
| date/datetime | width:160 |
| decimal | width:100 |
| rem | width:280 |
| `*_province_code` | 自动识别省份 |
| `isFluentEditor` | noList 默认 true |
| `建表语句中的 COMMENT '状态,dictbiz:{mod}_{table}_{column}' ` | `,dictbiz:` 表示业务字典,`:`后面的是业务字典编码,所以业务字典和系统字典都无需配置`foreignKey` |

## 需要配置的情况

### 外键数据量大

```ts
{
  COLUMN_NAME: "usr_id",
  foreignKey: {
    selectType: "selectInput",  // 弹框选择
  },
  search: true,
  isSearchByLbl: true,  // 按标签搜索
}
```

### 聚合关系

```ts
ec_order: {
  opts: {
    inlineForeignTabs: [{
      mod: "ec",
      table: "order_detail",
      label: "订单明细",
      column: "order_id",
    }],
    detailCustomDialogType: "medium",  // 字段多时用
    detailFormCols: 3,  // 表单列数
  }
}
```

## 自动编码字段

```ts
{
  COLUMN_NAME: "code_seq",
  onlyCodegenDeno: true,
},
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
  },
  searchByArray: true,
},
```
- onlyCodegenDeno: 代表此字段不生成到前端, 只生成后端
- autoCode: 自动编码配置
- autoCode.prefix: 编码前缀
- autoCode.seq: 关联的序列号字段
- autoCode.seqPadStart0: 序列号左侧补0到多少位

- rem: 备注, 默认已经是 align: "left"
- is_enabled: 默认已经是 isSwitch: true,
- order_by: 无需配置, 默认值即可

- date/datetime类型的字段: 默认已经是 width: 160, align: "center", 无需配置 width 和 align
- decimal类型的字段: 默认已经是 width: 100, align: "right", require: true,
- 配置了 `modelLabel` 冗余字段的, 就不需要再配置 `modelLabel` 这个字段了, 比如:
```ts
{
  COLUMN_NAME: "product_sku_id",
  modelLabel: "product_sku_id_lbl",
},
```
中: `product_sku_id_lbl` 就不需要再出现在字段配置里了

## 审计字段

大部分表需要：
```ts
{ COLUMN_NAME: "create_usr_id" },
{ COLUMN_NAME: "create_time" },
{ COLUMN_NAME: "update_usr_id" },
{ COLUMN_NAME: "update_time" },
```

## 配置文件结构需换行
```ts
ec_order: {
  opts: {
    ...
  },
  columns: [
    {
      COLUMN_NAME: "create_usr_id",
      ...
    },
  ],
},
```
