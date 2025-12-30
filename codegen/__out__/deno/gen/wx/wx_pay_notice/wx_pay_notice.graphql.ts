import { defineGraphql } from "/lib/context.ts";

import type { } from "./wx_pay_notice.model.ts";
import * as resolver from "./wx_pay_notice.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxPayNoticeId

"微信支付通知交易类型"
enum WxPayNoticeTradeType {
  "小程序支付"
  JSAPI
  "Native支付"
  NATIVE
  "app支付"
  APP
  "扫码支付"
  MICROPAY
  "H5支付"
  MWEB
  "刷脸支付"
  FACEPAY
}

"微信支付通知交易状态"
enum WxPayNoticeTradeState {
  "支付成功"
  SUCCESS
  "转入退款"
  REFUND
  "未支付"
  NOTPAY
  "已关闭"
  CLOSED
  "已撤销"
  REVOKED
  "用户支付中"
  USERPAYING
  "支付失败"
  PAYERROR
}

"微信支付通知货币类型"
enum WxPayNoticeCurrency {
  "人民币"
  CNY
}

"微信支付通知用户支付币种"
enum WxPayNoticePayerCurrency {
  "人民币"
  CNY
}

type WxPayNoticeModel {
  "ID"
  id: WxPayNoticeId!
  "开发者ID"
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
  trade_type: WxPayNoticeTradeType!
  "交易类型"
  trade_type_lbl: String!
  "交易状态"
  trade_state: WxPayNoticeTradeState!
  "交易状态"
  trade_state_lbl: String!
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
  "总金额(分)"
  total: Int!
  "用户支付金额(分)"
  payer_total: Int!
  "货币类型"
  currency: WxPayNoticeCurrency!
  "货币类型"
  currency_lbl: String!
  "用户支付币种"
  payer_currency: WxPayNoticePayerCurrency!
  "用户支付币种"
  payer_currency_lbl: String!
  "商户端设备号"
  device_id: String!
  "备注"
  rem: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type WxPayNoticeFieldComment {
  "ID"
  id: String!
  "开发者ID"
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
  "总金额(分)"
  total: String!
  "用户支付金额(分)"
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
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input WxPayNoticeInput {
  "ID"
  id: WxPayNoticeId
  "开发者ID"
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
  trade_type: WxPayNoticeTradeType
  "交易类型"
  trade_type_lbl: String
  "交易状态"
  trade_state: WxPayNoticeTradeState
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
  "支付完成时间"
  success_time_save_null: Boolean
  "总金额(分)"
  total: Int
  "用户支付金额(分)"
  payer_total: Int
  "货币类型"
  currency: WxPayNoticeCurrency
  "货币类型"
  currency_lbl: String
  "用户支付币种"
  payer_currency: WxPayNoticePayerCurrency
  "用户支付币种"
  payer_currency_lbl: String
  "商户端设备号"
  device_id: String
  "备注"
  rem: String
}
input WxPayNoticeSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxPayNoticeId!]
  "ID"
  id: WxPayNoticeId
  "用户标识"
  openid: String
  openid_like: String
  "微信支付订单号"
  transaction_id: String
  transaction_id_like: String
  "支付完成时间"
  success_time: [NaiveDateTime]
}
type Query {
  "根据条件查找微信支付通知总数"
  findCountWxPayNotice(search: WxPayNoticeSearch): Int!
  "根据搜索条件和分页查找微信支付通知列表"
  findAllWxPayNotice(search: WxPayNoticeSearch, page: PageInput, sort: [SortInput!]): [WxPayNoticeModel!]!
  "获取微信支付通知字段注释"
  getFieldCommentsWxPayNotice: WxPayNoticeFieldComment!
  "根据条件查找第一个微信支付通知"
  findOneWxPayNotice(search: WxPayNoticeSearch, sort: [SortInput!]): WxPayNoticeModel
  "根据 id 查找微信支付通知"
  findByIdWxPayNotice(id: WxPayNoticeId!): WxPayNoticeModel
  "根据 ids 查找微信支付通知"
  findByIdsWxPayNotice(ids: [WxPayNoticeId!]!): [WxPayNoticeModel]!
}

`);
