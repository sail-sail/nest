import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wx_pay_notice.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type WxPayNoticeModel {
  "ID"
  id: String!
  "appid"
  appid: String!
  "商户号"
  mchid: String!
  "用户标识"
  openid: String!
  "商户订单号"
  out_trade_no: String!
  "微信支付订单号"
  transaction_id: String!
  "交易类型"
  trade_type: String!
  "交易类型"
  trade_type_lbl: String
  "交易状态"
  trade_state: String!
  "交易状态"
  trade_state_lbl: String
  "交易状态描述"
  trade_state_desc: String!
  "付款银行"
  bank_type: String!
  "附加数据"
  attach: String!
  "支付完成时间"
  success_time: NaiveDateTime
  "支付完成时间"
  success_time_lbl: String!
  "总金额"
  total: Int!
  "用户支付金额"
  payer_total: Int!
  "货币类型"
  currency: String!
  "货币类型"
  currency_lbl: String
  "用户支付币种"
  payer_currency: String!
  "用户支付币种"
  payer_currency_lbl: String
  "商户端设备号"
  device_id: String!
  "备注"
  rem: String!
  "原始数据"
  raw: String
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type WxPayNoticeFieldComment {
  "appid"
  appid: String!
  "商户号"
  mchid: String!
  "用户标识"
  openid: String!
  "商户订单号"
  out_trade_no: String!
  "微信支付订单号"
  transaction_id: String!
  "交易类型"
  trade_type: String!
  "交易类型"
  trade_type_lbl: String!
  "交易状态"
  trade_state: String!
  "交易状态"
  trade_state_lbl: String!
  "交易状态描述"
  trade_state_desc: String!
  "付款银行"
  bank_type: String!
  "附加数据"
  attach: String!
  "支付完成时间"
  success_time: String!
  "支付完成时间"
  success_time_lbl: String!
  "总金额"
  total: String!
  "用户支付金额"
  payer_total: String!
  "货币类型"
  currency: String!
  "货币类型"
  currency_lbl: String!
  "用户支付币种"
  payer_currency: String!
  "用户支付币种"
  payer_currency_lbl: String!
  "商户端设备号"
  device_id: String!
  "备注"
  rem: String!
  "原始数据"
  raw: String!
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
input WxPayNoticeInput {
  ""
  id: String
  "appid"
  appid: String
  "商户号"
  mchid: String
  "用户标识"
  openid: String
  "商户订单号"
  out_trade_no: String
  "微信支付订单号"
  transaction_id: String
  "交易类型"
  trade_type: String
  "交易类型"
  trade_type_lbl: String
  "交易状态"
  trade_state: String
  "交易状态"
  trade_state_lbl: String
  "交易状态描述"
  trade_state_desc: String
  "付款银行"
  bank_type: String
  "附加数据"
  attach: String
  "支付完成时间"
  success_time: NaiveDateTime
  "支付完成时间"
  success_time_lbl: String
  "总金额"
  total: Int
  "用户支付金额"
  payer_total: Int
  "货币类型"
  currency: String
  "货币类型"
  currency_lbl: String
  "用户支付币种"
  payer_currency: String
  "用户支付币种"
  payer_currency_lbl: String
  "商户端设备号"
  device_id: String
  "备注"
  rem: String
  "原始数据"
  raw: String
  "创建人"
  create_usr_id: String
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input WxPayNoticeSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "appid"
  appid: String
  appid_like: String
  "商户号"
  mchid: String
  mchid_like: String
  "用户标识"
  openid: String
  openid_like: String
  "商户订单号"
  out_trade_no: String
  out_trade_no_like: String
  "微信支付订单号"
  transaction_id: String
  transaction_id_like: String
  "交易类型"
  trade_type: [String!]
  "交易状态"
  trade_state: [String!]
  "交易状态描述"
  trade_state_desc: String
  trade_state_desc_like: String
  "付款银行"
  bank_type: String
  bank_type_like: String
  "附加数据"
  attach: String
  attach_like: String
  "支付完成时间"
  success_time: [NaiveDateTime!]
  "总金额"
  total: [Int!]
  "用户支付金额"
  payer_total: [Int!]
  "货币类型"
  currency: [String!]
  "用户支付币种"
  payer_currency: [String!]
  "商户端设备号"
  device_id: String
  device_id_like: String
  "备注"
  rem: String
  rem_like: String
  "原始数据"
  raw: String
  raw_like: String
  "创建人"
  create_usr_id: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找据数总数"
  findCountWxPayNotice(search: WxPayNoticeSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxPayNotice(search: WxPayNoticeSearch, page: PageInput, sort: [SortInput!]): [WxPayNoticeModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxPayNotice: WxPayNoticeFieldComment!
  "根据条件查找第一条数据"
  findOneWxPayNotice(search: WxPayNoticeSearch, sort: [SortInput!]): WxPayNoticeModel
  "根据id查找一条数据"
  findByIdWxPayNotice(id: String!): WxPayNoticeModel
}

`);
