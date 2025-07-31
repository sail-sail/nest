# 数据库建表之后的配置规范

- 字段名为 `lbl` 的大概率不需要做配置, 因为已经有默认 `width` 和 `align`
  `require` 默认也已经是 true
  `search` 默认也已经是 true

- `isFluentEditor` 字段的表格不需要配置 `noList`，因为默认就是 `true`

- `*_id`, `*_ids` 的外键关联大概率不需要配置 `foreignKey`, 默认值大部分是满足需求的
  - 外键关联字段, 如果关联表的数据可能会非常多, 则需要配置 `selectType: "selectInput"`，这样可以使用弹框选择代替下拉框, 因为下拉框不适合数据量大的情况, 此时: 如果 `search: true` 那么 `isSearchByLbl: true`

- 数字类型的字段不需要再配置 `align` 和 `width`，因为默认就是 `right` 和 `100`, 除非字段名比较长需要配置 `width`

- 数据库字段备注 `[备注],dict:[数据字典key]` 代表数据字典, 不需要配置 `dict`, 因为已经有默认值, `[备注],dictbiz:[业务字典key]` 也同理

- `date` 和 `datetime` 类型的字段不需要配置 `width`, 因为默认就是 `160`

- 大部分表应该都是要加上这几个字段的, 如果有的话
```ts
{
  COLUMN_NAME: "create_usr_id",
},
{
  COLUMN_NAME: "create_time",
},
{
  COLUMN_NAME: "update_usr_id",
},
{
  COLUMN_NAME: "update_time",
},
```

- 如果确定是 `align: "center"` 的话, 就不需要配置了, 因为默认就是 `center`

- 地址字段时, 如果是 `*_province_code`, `*_city_code`, `*_district_code` 的话, 不需要配置 `isProvinceCode`, `isProvinceLbl`等 因为看到 `_province_code`结尾 就知道是省份编码了, 其他的同理

- 如果外键关联是聚合关系, 比如 `订单` 跟 `订单明细` 表之间明显是聚合关系, 因为 `订单明细` 的数据一旦离开 `订单` 是没有存在意义的, 则一般需要配置 `inlineForeignTabs`
- 表的字段特别多, 或者有 `inlineForeignTabs` 的时候, 大概率是需要配置 `detailCustomDialogType: "medium"`, 否则表单看起来很瘦很高, 不够宽
- `detailFormCols: 3` 是为了让表单在弹框中显示更多的字段, 这样可以更好地利用空间, 如果表单字段比较少, 可以不配置, 默认就是 `2`
```ts
// 订单
ec_order: {
  opts: {
    inlineForeignTabs: [
      {
        mod: "ec",
        table: "order_detail",
        label: "订单明细",
        column: "order_id",
      },
    ],
    detailCustomDialogType: "medium",
    detailFormCols: 3,
  }
}
```

- `rem` 字段默认宽度为 280
- `search` 如果是 fase 大概率不用配置了, 非外键关联字段默认是 false, 如果字段名是 `lbl` 则默认已经是 true
- `decimal` 类型的字段默认 `width` 是 100, 如果需要更宽, 可以配置
