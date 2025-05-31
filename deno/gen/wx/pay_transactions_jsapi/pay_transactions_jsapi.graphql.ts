import { defineGraphql } from "/lib/context.ts";

import type { } from "./pay_transactions_jsapi.model.ts";
import * as resolver from "./pay_transactions_jsapi.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PayTransactionsJsapiId

"微信JSAPI下单交易状态"
enum PayTransactionsJsapiTradeState {
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

"微信JSAPI下单货币类型"
enum PayTransactionsJsapiCurrency {
  "人民币"
  CNY
}

type PayTransactionsJsapiModel {
  "ID"
  id: PayTransactionsJsapiId!
  "开发者ID"
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
  trade_state: PayTransactionsJsapiTradeState!
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
  "开发票"
  receipt: String!
  "分账"
  profit_sharing: String!
  "订单金额(分)"
  total_fee: Int!
  "货币类型"
  currency: PayTransactionsJsapiCurrency!
  "货币类型"
  currency_lbl: String!
  "用户标识"
  openid: String!
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
type PayTransactionsJsapiFieldComment {
  "ID"
  id: String!
  "开发者ID"
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
  "开发票"
  receipt: String!
  "分账"
  profit_sharing: String!
  "订单金额(分)"
  total_fee: String!
  "货币类型"
  currency: String!
  "货币类型"
  currency_lbl: String!
  "用户标识"
  openid: String!
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
  "ID"
  id: PayTransactionsJsapiId
  "开发者ID"
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
  "支付完成时间"
  success_time_save_null: Boolean
  "交易限制时间"
  time_expire: String
  "附加数据"
  attach: String
  "开发票"
  receipt: String
  "分账"
  profit_sharing: String
  "订单金额(分)"
  total_fee: Int
  "货币类型"
  currency: PayTransactionsJsapiCurrency
  "货币类型"
  currency_lbl: String
  "用户标识"
  openid: String
}
input PayTransactionsJsapiSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [PayTransactionsJsapiId!]
  "ID"
  id: PayTransactionsJsapiId
  "微信支付订单号"
  transaction_id: String
  transaction_id_like: String
  "交易状态"
  trade_state: [PayTransactionsJsapiTradeState!]
  "支付完成时间"
  success_time: [NaiveDateTime]
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
  "根据条件查找微信JSAPI下单总数"
  findCountPayTransactionsJsapi(search: PayTransactionsJsapiSearch): Int!
  "根据搜索条件和分页查找微信JSAPI下单列表"
  findAllPayTransactionsJsapi(search: PayTransactionsJsapiSearch, page: PageInput, sort: [SortInput!]): [PayTransactionsJsapiModel!]!
  "获取微信JSAPI下单字段注释"
  getFieldCommentsPayTransactionsJsapi: PayTransactionsJsapiFieldComment!
  "根据条件查找第一个微信JSAPI下单"
  findOnePayTransactionsJsapi(search: PayTransactionsJsapiSearch, sort: [SortInput!]): PayTransactionsJsapiModel
  "根据 id 查找微信JSAPI下单"
  findByIdPayTransactionsJsapi(id: PayTransactionsJsapiId!): PayTransactionsJsapiModel
  "根据 ids 查找微信JSAPI下单"
  findByIdsPayTransactionsJsapi(ids: [PayTransactionsJsapiId!]!): [PayTransactionsJsapiModel]!
}

`);
