import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxw_usr.model.ts";
import * as resolver from "./wxw_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxwUsrId

type WxwUsrModel {
  "ID"
  id: WxwUsrId!
  "姓名"
  lbl: String!
  "用户ID"
  userid: String!
  "备注"
  rem: String!
  "已删除"
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
  "ID"
  id: WxwUsrId
  "姓名"
  lbl: String
  "用户ID"
  userid: String
  "备注"
  rem: String
}
input WxwUsrSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxwUsrId!]
  "ID"
  id: WxwUsrId
  "姓名"
  lbl: String
  lbl_like: String
}
type Query {
  "根据条件查找企微用户总数"
  findCountWxwUsr(search: WxwUsrSearch): Int!
  "根据搜索条件和分页查找企微用户列表"
  findAllWxwUsr(search: WxwUsrSearch, page: PageInput, sort: [SortInput!]): [WxwUsrModel!]!
  "获取企微用户字段注释"
  getFieldCommentsWxwUsr: WxwUsrFieldComment!
  "根据条件查找第一个企微用户"
  findOneWxwUsr(search: WxwUsrSearch, sort: [SortInput!]): WxwUsrModel
  "根据 id 查找企微用户"
  findByIdWxwUsr(id: WxwUsrId!): WxwUsrModel
}
type Mutation {
  "批量创建企微用户"
  createsWxwUsr(inputs: [WxwUsrInput!]!, unique_type: UniqueType): [WxwUsrId!]!
  "根据 id 修改企微用户"
  updateByIdWxwUsr(id: WxwUsrId!, input: WxwUsrInput!): WxwUsrId!
  "根据 ids 删除企微用户"
  deleteByIdsWxwUsr(ids: [WxwUsrId!]!): Int!
  "根据 ids 还原企微用户"
  revertByIdsWxwUsr(ids: [WxwUsrId!]!): Int!
  "根据 ids 彻底删除企微用户"
  forceDeleteByIdsWxwUsr(ids: [WxwUsrId!]!): Int!
}

`);
