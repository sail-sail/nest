import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxo_usr.model.ts";
import * as resolver from "./wxo_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxoUsrId

type WxoUsrModel {
  "ID"
  id: WxoUsrId!
  "昵称"
  lbl: String!
  "头像"
  head_img: String!
  "绑定用户"
  usr_id: UsrId!
  "绑定用户"
  usr_id_lbl: String!
  "公众号用户唯一标识"
  openid: String!
  "用户统一标识"
  unionid: String!
  "性别"
  sex: Int!
  "性别"
  sex_lbl: String!
  "省份"
  province: String!
  "城市"
  city: String!
  "国家"
  country: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type WxoUsrFieldComment {
  "ID"
  id: String!
  "昵称"
  lbl: String!
  "头像"
  head_img: String!
  "绑定用户"
  usr_id: String!
  "绑定用户"
  usr_id_lbl: String!
  "公众号用户唯一标识"
  openid: String!
  "用户统一标识"
  unionid: String!
  "性别"
  sex: String!
  "性别"
  sex_lbl: String!
  "省份"
  province: String!
  "城市"
  city: String!
  "国家"
  country: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: String!
  "更新时间"
  update_time_lbl: String!
}
input WxoUsrInput {
  "ID"
  id: WxoUsrId
  "昵称"
  lbl: String
  "头像"
  head_img: String
  "绑定用户"
  usr_id: UsrId
  "绑定用户"
  usr_id_lbl: String
  "公众号用户唯一标识"
  openid: String
  "用户统一标识"
  unionid: String
  "性别"
  sex: Int
  "性别"
  sex_lbl: String
  "省份"
  province: String
  "城市"
  city: String
  "国家"
  country: String
  "备注"
  rem: String
}
input WxoUsrSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxoUsrId!]
  "ID"
  id: WxoUsrId
  "昵称"
  lbl: String
  lbl_like: String
  "绑定用户"
  usr_id: [UsrId!]
  "绑定用户"
  usr_id_is_null: Boolean
  "绑定用户"
  usr_id_lbl: [String!]
  "绑定用户"
  usr_id_lbl_like: String
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "创建人"
  create_usr_id_lbl_like: String
  "更新人"
  update_usr_id: [UsrId!]
  "更新人"
  update_usr_id_is_null: Boolean
  "更新人"
  update_usr_id_lbl: [String!]
  "更新人"
  update_usr_id_lbl_like: String
}
type Query {
  "根据条件查找公众号用户总数"
  findCountWxoUsr(search: WxoUsrSearch): Int!
  "根据搜索条件和分页查找公众号用户列表"
  findAllWxoUsr(search: WxoUsrSearch, page: PageInput, sort: [SortInput!]): [WxoUsrModel!]!
  "获取公众号用户字段注释"
  getFieldCommentsWxoUsr: WxoUsrFieldComment!
  "根据条件查找第一个公众号用户"
  findOneWxoUsr(search: WxoUsrSearch, sort: [SortInput!]): WxoUsrModel
  "根据 id 查找公众号用户"
  findByIdWxoUsr(id: WxoUsrId!): WxoUsrModel
}
type Mutation {
  "批量创建公众号用户"
  createsWxoUsr(inputs: [WxoUsrInput!]!, unique_type: UniqueType): [WxoUsrId!]!
  "根据 id 修改公众号用户"
  updateByIdWxoUsr(id: WxoUsrId!, input: WxoUsrInput!): WxoUsrId!
  "根据 ids 删除公众号用户"
  deleteByIdsWxoUsr(ids: [WxoUsrId!]!): Int!
  "根据 ids 还原公众号用户"
  revertByIdsWxoUsr(ids: [WxoUsrId!]!): Int!
  "根据 ids 彻底删除公众号用户"
  forceDeleteByIdsWxoUsr(ids: [WxoUsrId!]!): Int!
}

`);
