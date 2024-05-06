import { defineGraphql } from "/lib/context.ts";

import type { } from "./wx_usr.model.ts";
import * as resolver from "./wx_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxUsrId


type WxUsrModel {
  "ID"
  id: WxUsrId!
  "名称"
  lbl: String!
  "用户"
  usr_id: UsrId!
  "用户"
  usr_id_lbl: String
  "昵称"
  nick_name: String!
  "头像"
  avatar_url: String!
  "手机"
  mobile: String!
  "小程序用户唯一标识"
  openid: String!
  "小程序用户统一标识"
  unionid: String!
  "性别"
  gender: Int!
  "性别"
  gender_lbl: String!
  "城市"
  city: String!
  "省份"
  province: String!
  "国家"
  country: String!
  "语言"
  language: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type WxUsrFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "用户"
  usr_id: String!
  "用户"
  usr_id_lbl: String!
  "昵称"
  nick_name: String!
  "头像"
  avatar_url: String!
  "手机"
  mobile: String!
  "小程序用户唯一标识"
  openid: String!
  "小程序用户统一标识"
  unionid: String!
  "性别"
  gender: String!
  "性别"
  gender_lbl: String!
  "城市"
  city: String!
  "省份"
  province: String!
  "国家"
  country: String!
  "语言"
  language: String!
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
input WxUsrInput {
  "ID"
  id: WxUsrId
  "名称"
  lbl: String
  "用户"
  usr_id: UsrId
  "用户"
  usr_id_lbl: String
  "昵称"
  nick_name: String
  "头像"
  avatar_url: String
  "手机"
  mobile: String
  "小程序用户唯一标识"
  openid: String
  "小程序用户统一标识"
  unionid: String
  "性别"
  gender: Int
  "性别"
  gender_lbl: String
  "城市"
  city: String
  "省份"
  province: String
  "国家"
  country: String
  "语言"
  language: String
  "备注"
  rem: String
}
input WxUsrSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxUsrId!]
  "ID"
  id: WxUsrId
  "名称"
  lbl: String
  lbl_like: String
  "用户"
  usr_id: [UsrId!]
  usr_id_is_null: Boolean
  "昵称"
  nick_name: String
  nick_name_like: String
  "头像"
  avatar_url: String
  avatar_url_like: String
  "手机"
  mobile: String
  mobile_like: String
  "小程序用户唯一标识"
  openid: String
  openid_like: String
  "小程序用户统一标识"
  unionid: String
  unionid_like: String
  "性别"
  gender: [Int!]
  "城市"
  city: String
  city_like: String
  "省份"
  province: String
  province_like: String
  "国家"
  country: String
  country_like: String
  "语言"
  language: String
  language_like: String
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime]
}
type Query {
  "根据条件查找小程序用户总数"
  findCountWxUsr(search: WxUsrSearch): Int!
  "根据搜索条件和分页查找小程序用户列表"
  findAllWxUsr(search: WxUsrSearch, page: PageInput, sort: [SortInput!]): [WxUsrModel!]!
  "获取小程序用户字段注释"
  getFieldCommentsWxUsr: WxUsrFieldComment!
  "根据条件查找第一个小程序用户"
  findOneWxUsr(search: WxUsrSearch, sort: [SortInput!]): WxUsrModel
  "根据 id 查找小程序用户"
  findByIdWxUsr(id: WxUsrId!): WxUsrModel
}
type Mutation {
  "创建小程序用户"
  createWxUsr(input: WxUsrInput!, unique_type: UniqueType): WxUsrId!
  "批量创建小程序用户"
  createsWxUsr(inputs: [WxUsrInput!]!, unique_type: UniqueType): [WxUsrId!]!
  "根据 id 修改小程序用户"
  updateByIdWxUsr(id: WxUsrId!, input: WxUsrInput!): WxUsrId!
  "根据 ids 删除小程序用户"
  deleteByIdsWxUsr(ids: [WxUsrId!]!): Int!
  "根据 ids 还原小程序用户"
  revertByIdsWxUsr(ids: [WxUsrId!]!): Int!
  "根据 ids 彻底删除小程序用户"
  forceDeleteByIdsWxUsr(ids: [WxUsrId!]!): Int!
}

`);
