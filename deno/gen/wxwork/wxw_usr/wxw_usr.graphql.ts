import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxw_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxwUsrId


type WxwUsrModel {
  "ID"
  id: String!
  "姓名"
  lbl: String!
  "用户ID"
  userid: String!
  "备注"
  rem: String!
  "是否已删除"
  is_deleted: Int!
}
type WxwUsrFieldComment {
  "ID"
  id: String!
  "姓名"
  lbl: String!
  "用户ID"
  userid: String!
  "备注"
  rem: String!
}
input WxwUsrInput {
  ""
  id: WxwUsrId
  "姓名"
  lbl: String
  "用户ID"
  userid: String
  "备注"
  rem: String
}
input WxwUsrSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: WxwUsrId
  "姓名"
  lbl: String
  lbl_like: String
  "用户ID"
  userid: String
  userid_like: String
  "备注"
  rem: String
  rem_like: String
}
type Query {
  "根据条件查找据数总数"
  findCountWxwUsr(search: WxwUsrSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxwUsr(search: WxwUsrSearch, page: PageInput, sort: [SortInput!]): [WxwUsrModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxwUsr: WxwUsrFieldComment!
  "根据条件查找第一条数据"
  findOneWxwUsr(search: WxwUsrSearch, sort: [SortInput!]): WxwUsrModel
  "根据id查找一条数据"
  findByIdWxwUsr(id: String!): WxwUsrModel
}
type Mutation {
  "创建一条数据"
  createWxwUsr(model: WxwUsrInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdWxwUsr(id: String!, model: WxwUsrInput!): String!
  "根据 ids 删除数据"
  deleteByIdsWxwUsr(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsWxwUsr(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxwUsr(ids: [String!]!): Int!
}

`);
