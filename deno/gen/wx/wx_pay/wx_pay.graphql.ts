import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wx_pay.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxPayId


type WxPayModel {
  "ID"
  id: WxPayId!
  "名称"
  lbl: String!
  "开发者ID"
  appid: String!
  "商户号"
  mchid: String!
  "公钥"
  public_key: String!
  "私钥"
  private_key: String!
  "APIv3密钥"
  v3_key: String!
  "支付终端IP"
  payer_client_ip: String!
  "通知地址"
  notify_url: String!
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
type WxPayFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "开发者ID"
  appid: String!
  "商户号"
  mchid: String!
  "公钥"
  public_key: String!
  "私钥"
  private_key: String!
  "APIv3密钥"
  v3_key: String!
  "支付终端IP"
  payer_client_ip: String!
  "通知地址"
  notify_url: String!
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
input WxPayInput {
  "ID"
  id: WxPayId
  "名称"
  lbl: String
  "开发者ID"
  appid: String
  "商户号"
  mchid: String
  "公钥"
  public_key: String
  "私钥"
  private_key: String
  "APIv3密钥"
  v3_key: String
  "支付终端IP"
  payer_client_ip: String
  "通知地址"
  notify_url: String
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
input WxPaySearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxPayId!]
  "ID"
  id: WxPayId
  "名称"
  lbl: String
  lbl_like: String
  "开发者ID"
  appid: String
  appid_like: String
  "商户号"
  mchid: String
  mchid_like: String
  "公钥"
  public_key: String
  public_key_like: String
  "私钥"
  private_key: String
  private_key_like: String
  "APIv3密钥"
  v3_key: String
  v3_key_like: String
  "支付终端IP"
  payer_client_ip: String
  payer_client_ip_like: String
  "通知地址"
  notify_url: String
  notify_url_like: String
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
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
  "根据条件查找微信支付设置总数"
  findCountWxPay(search: WxPaySearch): Int!
  "根据搜索条件和分页查找微信支付设置列表"
  findAllWxPay(search: WxPaySearch, page: PageInput, sort: [SortInput!]): [WxPayModel!]!
  "获取微信支付设置字段注释"
  getFieldCommentsWxPay: WxPayFieldComment!
  "根据条件查找第一个微信支付设置"
  findOneWxPay(search: WxPaySearch, sort: [SortInput!]): WxPayModel
  "根据 id 查找微信支付设置"
  findByIdWxPay(id: WxPayId!): WxPayModel
  "查找 微信支付设置 order_by 字段的最大值"
  findLastOrderByWxPay: Int!
}
type Mutation {
  "创建微信支付设置"
  createWxPay(input: WxPayInput!, unique_type: UniqueType): WxPayId!
  "根据 id 修改微信支付设置"
  updateByIdWxPay(id: WxPayId!, input: WxPayInput!): WxPayId!
  "根据 ids 删除微信支付设置"
  deleteByIdsWxPay(ids: [WxPayId!]!): Int!
  "根据 ids 启用或者禁用微信支付设置"
  enableByIdsWxPay(ids: [WxPayId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁微信支付设置"
  lockByIdsWxPay(ids: [WxPayId!]!, is_locked: Int!): Int!
  "根据 ids 还原微信支付设置"
  revertByIdsWxPay(ids: [WxPayId!]!): Int!
  "根据 ids 彻底删除微信支付设置"
  forceDeleteByIdsWxPay(ids: [WxPayId!]!): Int!
}

`);
