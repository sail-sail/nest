import { defineGraphql } from "/lib/context.ts";

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
  "小程序openid"
  openid: String!
  "公众号openid"
  gz_openid: String!
  "unionid"
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
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
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
  "小程序openid"
  openid: String!
  "公众号openid"
  gz_openid: String!
  "unionid"
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
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
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
  ""
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
  "小程序openid"
  openid: String
  "公众号openid"
  gz_openid: String
  "unionid"
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
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String
  "创建人"
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: UsrId
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
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
  "小程序openid"
  openid: String
  openid_like: String
  "公众号openid"
  gz_openid: String
  gz_openid_like: String
  "unionid"
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
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找据数总数"
  findCountWxUsr(search: WxUsrSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxUsr(search: WxUsrSearch, page: PageInput, sort: [SortInput!]): [WxUsrModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxUsr: WxUsrFieldComment!
  "根据条件查找第一条数据"
  findOneWxUsr(search: WxUsrSearch, sort: [SortInput!]): WxUsrModel
  "根据id查找一条数据"
  findByIdWxUsr(id: WxUsrId!): WxUsrModel
}
type Mutation {
  "创建一条数据"
  createWxUsr(model: WxUsrInput!, unique_type: UniqueType): WxUsrId!
  "根据id修改一条数据"
  updateByIdWxUsr(id: WxUsrId!, model: WxUsrInput!): WxUsrId!
  "根据 ids 删除数据"
  deleteByIdsWxUsr(ids: [WxUsrId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsWxUsr(ids: [WxUsrId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsWxUsr(ids: [WxUsrId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsWxUsr(ids: [WxUsrId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxUsr(ids: [WxUsrId!]!): Int!
}

`);
