import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./option.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `type FindAllOption {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "键"
  key: String!
  "值"
  value: String!
  "备注"
  rem: String!
}
input OptionInput {
  ""
  id: ID
  "名称"
  lbl: String
  "键"
  key: String
  "值"
  value: String
  "备注"
  rem: String
}
input OptionSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lblLike: String
  "键"
  key: String
  keyLike: String
  "值"
  value: String
  valueLike: String
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountOption(search: OptionSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOption(search: OptionSearch, page: PageInput, sort: [SortInput]): [FindAllOption]!
  "根据搜索条件导出"
  exportExcelOption(search: OptionSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneOption(search: OptionSearch): FindAllOption
  "根据id查找一条数据"
  findByIdOption(id: ID!): FindAllOption
}
type Mutation {
  "创建一条数据"
  createOption(model: OptionInput!): ID!
  "根据id修改一条数据"
  updateByIdOption(id: ID!, model: OptionInput!): ID!
  "导入文件"
  importFileOption(id: ID!): String
  "根据ids删除数据"
  deleteByIdsOption(ids: [ID]!): Int!
  "根据ids还原数据"
  revertByIdsOption(ids: [ID]!): Int!
}
`);
