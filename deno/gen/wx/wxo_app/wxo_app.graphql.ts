import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxo_app.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxoAppId


type WxoAppModel {
  "ID"
  id: WxoAppId!
  "原始ID"
  code: String!
  "名称"
  lbl: String!
  "开发者ID"
  appid: String!
  "开发者密码"
  appsecret: String!
  "令牌"
  token: String!
  "消息加解密密钥"
  encoding_aes_key: String!
  "网页授权域名"
  domain_id: DomainId!
  "网页授权域名"
  domain_id_lbl: String
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: Int!
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
type WxoAppFieldComment {
  "ID"
  id: String!
  "原始ID"
  code: String!
  "名称"
  lbl: String!
  "开发者ID"
  appid: String!
  "开发者密码"
  appsecret: String!
  "令牌"
  token: String!
  "消息加解密密钥"
  encoding_aes_key: String!
  "网页授权域名"
  domain_id: String!
  "网页授权域名"
  domain_id_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
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
input WxoAppInput {
  "ID"
  id: WxoAppId
  "原始ID"
  code: String
  "名称"
  lbl: String
  "开发者ID"
  appid: String
  "开发者密码"
  appsecret: String
  "令牌"
  token: String
  "消息加解密密钥"
  encoding_aes_key: String
  "网页授权域名"
  domain_id: DomainId
  "网页授权域名"
  domain_id_lbl: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input WxoAppSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxoAppId!]
  "ID"
  id: WxoAppId
  "原始ID"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "开发者ID"
  appid: String
  appid_like: String
  "网页授权域名"
  domain_id: [DomainId!]
  domain_id_is_null: Boolean
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int]
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
  "根据条件查找公众号设置总数"
  findCountWxoApp(search: WxoAppSearch): Int!
  "根据搜索条件和分页查找公众号设置列表"
  findAllWxoApp(search: WxoAppSearch, page: PageInput, sort: [SortInput!]): [WxoAppModel!]!
  "获取公众号设置字段注释"
  getFieldCommentsWxoApp: WxoAppFieldComment!
  "根据条件查找第一个公众号设置"
  findOneWxoApp(search: WxoAppSearch, sort: [SortInput!]): WxoAppModel
  "根据 id 查找公众号设置"
  findByIdWxoApp(id: WxoAppId!): WxoAppModel
  "查找 公众号设置 order_by 字段的最大值"
  findLastOrderByWxoApp: Int!
}
type Mutation {
  "创建公众号设置"
  createWxoApp(input: WxoAppInput!, unique_type: UniqueType): WxoAppId!
  "根据 id 修改公众号设置"
  updateByIdWxoApp(id: WxoAppId!, input: WxoAppInput!): WxoAppId!
  "根据 ids 删除公众号设置"
  deleteByIdsWxoApp(ids: [WxoAppId!]!): Int!
  "根据 ids 启用或者禁用公众号设置"
  enableByIdsWxoApp(ids: [WxoAppId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁公众号设置"
  lockByIdsWxoApp(ids: [WxoAppId!]!, is_locked: Int!): Int!
  "根据 ids 还原公众号设置"
  revertByIdsWxoApp(ids: [WxoAppId!]!): Int!
  "根据 ids 彻底删除公众号设置"
  forceDeleteByIdsWxoApp(ids: [WxoAppId!]!): Int!
}

`);
