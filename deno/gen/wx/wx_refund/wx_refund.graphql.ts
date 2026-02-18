import { defineGraphql } from "/lib/context.ts";

import type { } from "./wx_refund.model.ts";
import * as resolver from "./wx_refund.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxRefundId

"微信退款申请退款渠道"
enum WxRefundChannel {
  "原路退款"
  ORIGINAL
  "退回到余额"
  BALANCE
  "原账户异常退到其他余额账户"
  OTHER_BALANCE
  "原银行卡异常退到其他银行卡(发起异常退款成功后返回)"
  OTHER_BANKCARD
}

"微信退款申请退款状态"
enum WxRefundStatus {
  "未退款"
  NO_REFUND
  "退款成功"
  SUCCESS
  "退款关闭"
  CLOSED
  "退款处理中"
  PROCESSING
  "退款异常"
  ABNORMAL
}

"微信退款申请资金账户"
enum WxRefundFundsAccount {
  "未结算资金"
  UNSETTLED
  "可用余额"
  AVAILABLE
  "不可用余额"
  UNAVAILABLE
  "运营账户"
  OPERATION
  "基本账户"
  BASIC
  "数字人民币基本账户"
  ECNY_BASIC
}

"微信退款申请退款币种"
enum WxRefundAmountCurrency {
  "人民币"
  CNY
}

type WxRefundModel {
  "ID"
  id: WxRefundId!
  "开发者ID"
  appid: String!
  "商户号"
  mchid: String!
  "商户订单号"
  out_trade_no: String!
  "微信支付订单号"
  transaction_id: String!
  "商户退款单号"
  out_refund_no: String!
  "微信退款单号"
  refund_id: String!
  "退款原因"
  reason: String!
  "退款渠道"
  channel: WxRefundChannel!
  "退款渠道"
  channel_lbl: String!
  "退款入账账户"
  user_received_account: String!
  "退款成功时间"
  success_time: NaiveDateTime
  "退款成功时间"
  success_time_lbl: String!
  "退款状态"
  status: WxRefundStatus!
  "退款状态"
  status_lbl: String!
  "资金账户"
  funds_account: WxRefundFundsAccount!
  "资金账户"
  funds_account_lbl: String!
  "订单金额(分)"
  amount_total: Int!
  "退款金额(分)"
  amount_refund: Int!
  "用户实际支付金额(分)"
  amount_payer_total: Int!
  "用户退款金额(分)"
  amount_payer_refund: Int!
  "应结退款金额(分)"
  amount_settlement_refund: Int!
  "优惠退款金额(分)"
  amount_discount_refund: Int!
  "退款币种"
  amount_currency: WxRefundAmountCurrency!
  "退款币种"
  amount_currency_lbl: String!
  "手续费退款金额(分)"
  amount_refund_fee: Int!
  "备注"
  rem: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
}
type WxRefundFieldComment {
  "ID"
  id: String!
  "开发者ID"
  appid: String!
  "商户号"
  mchid: String!
  "商户订单号"
  out_trade_no: String!
  "微信支付订单号"
  transaction_id: String!
  "商户退款单号"
  out_refund_no: String!
  "微信退款单号"
  refund_id: String!
  "退款原因"
  reason: String!
  "退款渠道"
  channel: String!
  "退款渠道"
  channel_lbl: String!
  "退款入账账户"
  user_received_account: String!
  "退款成功时间"
  success_time: String!
  "退款成功时间"
  success_time_lbl: String!
  "退款状态"
  status: String!
  "退款状态"
  status_lbl: String!
  "资金账户"
  funds_account: String!
  "资金账户"
  funds_account_lbl: String!
  "订单金额(分)"
  amount_total: String!
  "退款金额(分)"
  amount_refund: String!
  "用户实际支付金额(分)"
  amount_payer_total: String!
  "用户退款金额(分)"
  amount_payer_refund: String!
  "应结退款金额(分)"
  amount_settlement_refund: String!
  "优惠退款金额(分)"
  amount_discount_refund: String!
  "退款币种"
  amount_currency: String!
  "退款币种"
  amount_currency_lbl: String!
  "手续费退款金额(分)"
  amount_refund_fee: String!
  "备注"
  rem: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input WxRefundInput {
  "ID"
  id: WxRefundId
  "开发者ID"
  appid: String
  "商户号"
  mchid: String
  "商户订单号"
  out_trade_no: String
  "微信支付订单号"
  transaction_id: String
  "商户退款单号"
  out_refund_no: String
  "微信退款单号"
  refund_id: String
  "退款原因"
  reason: String
  "退款渠道"
  channel: WxRefundChannel
  "退款渠道"
  channel_lbl: String
  "退款入账账户"
  user_received_account: String
  "退款成功时间"
  success_time: NaiveDateTime
  "退款成功时间"
  success_time_lbl: String
  "退款成功时间"
  success_time_save_null: Boolean
  "退款状态"
  status: WxRefundStatus
  "退款状态"
  status_lbl: String
  "资金账户"
  funds_account: WxRefundFundsAccount
  "资金账户"
  funds_account_lbl: String
  "订单金额(分)"
  amount_total: Int
  "退款金额(分)"
  amount_refund: Int
  "用户实际支付金额(分)"
  amount_payer_total: Int
  "用户退款金额(分)"
  amount_payer_refund: Int
  "应结退款金额(分)"
  amount_settlement_refund: Int
  "优惠退款金额(分)"
  amount_discount_refund: Int
  "退款币种"
  amount_currency: WxRefundAmountCurrency
  "退款币种"
  amount_currency_lbl: String
  "手续费退款金额(分)"
  amount_refund_fee: Int
  "备注"
  rem: String
}
input WxRefundSearch {
  "ID列表"
  ids: [WxRefundId!]
  "ID"
  id: WxRefundId
  "微信支付订单号"
  transaction_id: String
  transaction_id_like: String
  "商户退款单号"
  out_refund_no: String
  out_refund_no_like: String
  "微信退款单号"
  refund_id: String
  refund_id_like: String
  "退款成功时间"
  success_time: [NaiveDateTime]
  "退款状态"
  status: [WxRefundStatus!]
}
type Query {
  "根据条件查找微信退款申请总数"
  findCountWxRefund(search: WxRefundSearch): Int!
  "根据搜索条件和分页查找微信退款申请列表"
  findAllWxRefund(search: WxRefundSearch, page: PageInput, sort: [SortInput!]): [WxRefundModel!]!
  "获取微信退款申请字段注释"
  getFieldCommentsWxRefund: WxRefundFieldComment!
  "根据条件查找第一个微信退款申请"
  findOneWxRefund(search: WxRefundSearch, sort: [SortInput!]): WxRefundModel
  "根据 id 查找微信退款申请"
  findByIdWxRefund(id: WxRefundId!): WxRefundModel
  "根据 ids 查找微信退款申请"
  findByIdsWxRefund(ids: [WxRefundId!]!): [WxRefundModel]!
}

`);
