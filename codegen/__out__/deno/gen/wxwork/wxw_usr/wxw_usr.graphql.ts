import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxw_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type WxwUsrModel {
  "ID"
  id: String!
  "姓名"
  lbl: String!
  "用户ID"
  userid: String!
  "手机号"
  mobile: String!
  "性别"
  gender: String!
  "邮箱"
  email: String!
  "企业邮箱"
  biz_email: String!
  "直属上级"
  direct_leader: String!
  "职位"
  position: String!
  "头像"
  avatar: String!
  "头像缩略图"
  thumb_avatar: String!
  "个人二维码"
  qr_code: String!
  "备注"
  rem: String!
  "是否已删除"
  is_deleted: Int!
}
type WxwUsrFieldComment {
  "姓名"
  lbl: String!
  "用户ID"
  userid: String!
  "备注"
  rem: String!
}
input WxwUsrInput {
  ""
  id: String
  "姓名"
  lbl: String
  "用户ID"
  userid: String
  "手机号"
  mobile: String
  "性别"
  gender: String
  "邮箱"
  email: String
  "企业邮箱"
  biz_email: String
  "直属上级"
  direct_leader: String
  "职位"
  position: String
  "头像"
  avatar: String
  "头像缩略图"
  thumb_avatar: String
  "个人二维码"
  qr_code: String
  "备注"
  rem: String
}
input WxwUsrSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "姓名"
  lbl: String
  lbl_like: String
  "用户ID"
  userid: String
  userid_like: String
  "手机号"
  mobile: String
  mobile_like: String
  "性别"
  gender: String
  gender_like: String
  "邮箱"
  email: String
  email_like: String
  "企业邮箱"
  biz_email: String
  biz_email_like: String
  "直属上级"
  direct_leader: String
  direct_leader_like: String
  "职位"
  position: String
  position_like: String
  "头像"
  avatar: String
  avatar_like: String
  "头像缩略图"
  thumb_avatar: String
  thumb_avatar_like: String
  "个人二维码"
  qr_code: String
  qr_code_like: String
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
