import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./pay_transactions_jsapi.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PayTransactionsJsapiId

"微信JSAPI下单交易状态"
scalar PayTransactionsJsapiTradeState
"微信JSAPI下单货币类型"
scalar PayTransactionsJsapiCurrency

type PayTransactionsJsapiModel {
  "ID"
  id: String!
  "appid"
  appid: String!
  "商户号"
  mchid: String!
  "商品描述"
  description: String!
  "商户订单号"
  out_trade_no: String!
  "微信支付订单号"
  transaction_id: String!
  "交易状态"
  trade_state: PayTransactionsJsapiTradeState
  "交易状态"
  trade_state_lbl: String!
  "交易状态描述"
  trade_state_desc: String!
  "支付完成时间"
  success_time: NaiveDateTime
  "支付完成时间"
  success_time_lbl: String!
  "交易限制时间"
  time_expire: String!
  "附加数据"
  attach: String!
  "附加数据2"
  attach2: String!
  "通知地址"
  notify_url: String!
  "是否支持发票"
  support_fapiao: Int!
  "是否支持发票"
  support_fapiao_lbl: String!
  "订单金额(分)"
  total_fee: Int!
  "货币类型"
  currency: PayTransactionsJsapiCurrency
  "货币类型"
  currency_lbl: String!
  "用户标识"
  openid: String!
  "预支付交易会话标识"
  prepay_id: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: UsrId
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: UsrId
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type PayTransactionsJsapiFieldComment {
  "ID"
  id: String!
  "appid"
  appid: String!
  "商户号"
  mchid: String!
  "商品描述"
  description: String!
  "商户订单号"
  out_trade_no: String!
  "微信支付订单号"
  transaction_id: String!
  "交易状态"
  trade_state: String!
  "交易状态"
  trade_state_lbl: String!
  "交易状态描述"
  trade_state_desc: String!
  "支付完成时间"
  success_time: String!
  "支付完成时间"
  success_time_lbl: String!
  "交易限制时间"
  time_expire: String!
  "附加数据"
  attach: String!
  "附加数据2"
  attach2: String!
  "通知地址"
  notify_url: String!
  "是否支持发票"
  support_fapiao: String!
  "是否支持发票"
  support_fapiao_lbl: String!
  "订单金额(分)"
  total_fee: String!
  "货币类型"
  currency: String!
  "货币类型"
  currency_lbl: String!
  "用户标识"
  openid: String!
  "预支付交易会话标识"
  prepay_id: String!
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
input PayTransactionsJsapiInput {
  ""
  id: PayTransactionsJsapiId
  "appid"
  appid: String
  "商户号"
  mchid: String
  "商品描述"
  description: String
  "商户订单号"
  out_trade_no: String
  "微信支付订单号"
  transaction_id: String
  "交易状态"
  trade_state: PayTransactionsJsapiTradeState
  "交易状态"
  trade_state_lbl: String
  "交易状态描述"
  trade_state_desc: String
  "支付完成时间"
  success_time: NaiveDateTime
  "支付完成时间"
  success_time_lbl: String
  "交易限制时间"
  time_expire: String
  "附加数据"
  attach: String
  "附加数据2"
  attach2: String
  "通知地址"
  notify_url: String
  "是否支持发票"
  support_fapiao: Int
  "是否支持发票"
  support_fapiao_lbl: String
  "订单金额(分)"
  total_fee: Int
  "货币类型"
  currency: PayTransactionsJsapiCurrency
  "货币类型"
  currency_lbl: String
  "用户标识"
  openid: String
  "预支付交易会话标识"
  prepay_id: String
  "创建人"
  create_usr_id: String
  "创建人"
  create_usr_id_lbl: UsrId
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: UsrId
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input PayTransactionsJsapiSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: PayTransactionsJsapiId
  "appid"
  appid: String
  appid_like: String
  "商户号"
  mchid: String
  mchid_like: String
  "商品描述"
  description: String
  description_like: String
  "商户订单号"
  out_trade_no: String
  out_trade_no_like: String
  "微信支付订单号"
  transaction_id: String
  transaction_id_like: String
  "交易状态"
  trade_state: [String!]
  "交易状态描述"
  trade_state_desc: String
  trade_state_desc_like: String
  "支付完成时间"
  success_time: [NaiveDateTime!]
  "交易限制时间"
  time_expire: String
  time_expire_like: String
  "附加数据"
  attach: String
  attach_like: String
  "附加数据2"
  attach2: String
  attach2_like: String
  "通知地址"
  notify_url: String
  notify_url_like: String
  "是否支持发票"
  support_fapiao: [Int!]
  "订单金额(分)"
  total_fee: [Int!]
  "货币类型"
  currency: [String!]
  "用户标识"
  openid: String
  openid_like: String
  "预支付交易会话标识"
  prepay_id: String
  prepay_id_like: String
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
  findCountPayTransactionsJsapi(search: PayTransactionsJsapiSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPayTransactionsJsapi(search: PayTransactionsJsapiSearch, page: PageInput, sort: [SortInput!]): [PayTransactionsJsapiModel!]!
  "获取字段对应的名称"
  getFieldCommentsPayTransactionsJsapi: PayTransactionsJsapiFieldComment!
  "根据条件查找第一条数据"
  findOnePayTransactionsJsapi(search: PayTransactionsJsapiSearch, sort: [SortInput!]): PayTransactionsJsapiModel
  "根据id查找一条数据"
  findByIdPayTransactionsJsapi(id: String!): PayTransactionsJsapiModel
}

`);
