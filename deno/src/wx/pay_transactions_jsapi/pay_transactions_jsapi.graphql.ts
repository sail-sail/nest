import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./pay_transactions_jsapi.resolver.ts";

defineGraphql(resolver, /* GraphQL */`

type RequestPaymentOptions {
  orderInfo: String!
  timeStamp: String!
  nonceStr: String!
  package: String!
  signType: String!
  paySign: String!
}

type Query {
  "微信支付测试, requestPayment 所需参数"
  getTestPayOpt(appid: String!): RequestPaymentOptions!
}

`);
