import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./pay_transactions_jsapi.resolver.ts";

defineGraphql(resolver, /* GraphQL */`

type RequestPaymentOptions {
  out_trade_no: String!
  orderInfo: String!
  timeStamp: String!
  nonceStr: String!
  package: String!
  signType: String!
  paySign: String!
}

type TradeStateResult {
  trade_state: PayTransactionsJsapiTradeState!
  trade_state_desc: String!
}

type Query {
  "微信支付测试, requestPayment 所需参数"
  getTestPayOpt(appid: String!): RequestPaymentOptions!
  
  "通过 out_trade_no 查询支付状态"
  tradeStatePayTransactionsJsapi(out_trade_no: String!): TradeStateResult!
}

`);
