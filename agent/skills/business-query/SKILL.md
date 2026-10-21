---
name: business-query
description: 业务数据查询的标准流程：先搜 schema，再确认字段，最后带 page 执行 GraphQL，并把结果整理成结论 + 表格
whenToUse: 用户询问业务数据、报表、字段含义，或需要跨表查询时
---

# 业务数据查询

## 步骤

1. 用 `schema_search` 找 Query、类型和字段。关键词优先用业务词（订单、客户、usr、order）。
2. 用 `schema_get` 看精确类型的完整 SDL，确认字段名、必填参数和返回类型。
3. 列表查询先用 `findCount*` 拿总数，再用 `graphql_execute` 执行 `findAll*`，必须显式带：

   ```graphql
   page: { pgSize: 20, pgOffset: 0, isResultLimit: true }
   ```

4. 只选需要的字段，不要把所有字段都拉回来。
5. 输出格式：
   - 先给结论（数量、趋势、异常点），再给依据；
   - 多条记录用 Markdown 表格；
   - 金额保留原精度，日期统一 `YYYY-MM-DD`。

## 约束

- 当前是只读模式，mutation 会被后端拒绝。
- 用户明确要求写操作时，先复述“要改哪个对象、哪些字段、改成什么”，得到确认后再继续。
- 查询为空时明确说“没有查到”，不要用推测填补。
- 不要暴露 SQL、token、内部文件路径。
- 单次返回超过 50 行时先汇总，再问用户是否需要明细。

## 常见坑

- `findAll*` 缺 `page` 会被后端直接拒绝。
- `pgSize` 缺省 20，超过 2000 会自动降到 2000。
- 字段名是 snake_case，GraphQL 返回值也是 snake_case。
- 涉及租户的数据由当前登录态决定，不要手动传其他租户 id。
