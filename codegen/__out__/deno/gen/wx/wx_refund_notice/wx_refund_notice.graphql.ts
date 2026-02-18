import { defineGraphql } from "/lib/context.ts";

import type { } from "./wx_refund_notice.model.ts";
import * as resolver from "./wx_refund_notice.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxRefundNoticeId

"微信退款通知退款状态"
enum WxRefundNoticeRefundStatus {
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

type WxRefundNoticeModel {
  "ID"
  id: WxRefundNoticeId!
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
  "退款状态"
  refund_status: WxRefundNoticeRefundStatus!
  "退款状态"
  refund_status_lbl: String!
  "退款成功时间"
  success_time: NaiveDateTime
  "退款成功时间"
  success_time_lbl: String!
  "退款入账账户"
  user_received_account: String!
  "订单金额(分)"
  amount_total: Int!
  "退款金额(分)"
  amount_refund: Int!
  "用户实际支付金额(分)"
  amount_payer_total: Int!
  "用户退款金额(分)"
  amount_payer_refund: Int!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
}
type WxRefundNoticeFieldComment {
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
  "退款状态"
  refund_status: String!
  "退款状态"
  refund_status_lbl: String!
  "退款成功时间"
  success_time: String!
  "退款成功时间"
  success_time_lbl: String!
  "退款入账账户"
  user_received_account: String!
  "订单金额(分)"
  amount_total: String!
  "退款金额(分)"
  amount_refund: String!
  "用户实际支付金额(分)"
  amount_payer_total: String!
  "用户退款金额(分)"
  amount_payer_refund: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input WxRefundNoticeInput {
  "ID"
  id: WxRefundNoticeId
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
  "退款状态"
  refund_status: WxRefundNoticeRefundStatus
  "退款状态"
  refund_status_lbl: String
  "退款成功时间"
  success_time: NaiveDateTime
  "退款成功时间"
  success_time_lbl: String
  "退款成功时间"
  success_time_save_null: Boolean
  "退款入账账户"
  user_received_account: String
  "订单金额(分)"
  amount_total: Int
  "退款金额(分)"
  amount_refund: Int
  "用户实际支付金额(分)"
  amount_payer_total: Int
  "用户退款金额(分)"
  amount_payer_refund: Int
}
input WxRefundNoticeSearch {
  "ID列表"
  ids: [WxRefundNoticeId!]
  "ID"
  id: WxRefundNoticeId
  "微信支付订单号"
  transaction_id: String
  transaction_id_like: String
  "商户退款单号"
  out_refund_no: String
  out_refund_no_like: String
  "微信退款单号"
  refund_id: String
  refund_id_like: String
  "退款状态"
  refund_status: [WxRefundNoticeRefundStatus!]
  "退款成功时间"
  success_time: [NaiveDateTime]
}
type Query {
  "根据条件查找微信退款通知总数"
  findCountWxRefundNotice(search: WxRefundNoticeSearch): Int!
  "根据搜索条件和分页查找微信退款通知列表"
  findAllWxRefundNotice(search: WxRefundNoticeSearch, page: PageInput, sort: [SortInput!]): [WxRefundNoticeModel!]!
  "获取微信退款通知字段注释"
  getFieldCommentsWxRefundNotice: WxRefundNoticeFieldComment!
  "根据条件查找第一个微信退款通知"
  findOneWxRefundNotice(search: WxRefundNoticeSearch, sort: [SortInput!]): WxRefundNoticeModel
  "根据 id 查找微信退款通知"
  findByIdWxRefundNotice(id: WxRefundNoticeId!): WxRefundNoticeModel
  "根据 ids 查找微信退款通知"
  findByIdsWxRefundNotice(ids: [WxRefundNoticeId!]!): [WxRefundNoticeModel]!
}

`);
