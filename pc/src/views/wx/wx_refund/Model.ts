/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxRefundInput as WxRefundInputType,
  WxRefundModel as WxRefundModelType,
  WxRefundSearch as WxRefundSearchType,
  WxRefundFieldComment as WxRefundFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 微信退款申请 */
  interface WxRefundModel extends WxRefundModelType {
  }
  
  /** 微信退款申请 */
  interface WxRefundInput extends WxRefundInputType {
  }
  
  /** 微信退款申请 */
  interface WxRefundSearch extends WxRefundSearchType {
  }
  
  /** 微信退款申请 */
  interface WxRefundFieldComment extends WxRefundFieldCommentType {
  }
  
}

export const wxRefundFields = [
  // ID
  "id",
  // 开发者ID
  "appid",
  // 商户号
  "mchid",
  // 商户订单号
  "out_trade_no",
  // 微信支付订单号
  "transaction_id",
  // 商户退款单号
  "out_refund_no",
  // 微信退款单号
  "refund_id",
  // 退款原因
  "reason",
  // 退款渠道
  "channel",
  "channel_lbl",
  // 退款入账账户
  "user_received_account",
  // 退款成功时间
  "success_time",
  "success_time_lbl",
  // 退款状态
  "status",
  "status_lbl",
  // 资金账户
  "funds_account",
  "funds_account_lbl",
  // 订单金额(分)
  "amount_total",
  // 退款金额(分)
  "amount_refund",
  // 用户实际支付金额(分)
  "amount_payer_total",
  // 用户退款金额(分)
  "amount_payer_refund",
  // 应结退款金额(分)
  "amount_settlement_refund",
  // 优惠退款金额(分)
  "amount_discount_refund",
  // 退款币种
  "amount_currency",
  "amount_currency_lbl",
  // 手续费退款金额(分)
  "amount_refund_fee",
  // 备注
  "rem",
  // 创建时间
  "create_time",
  "create_time_lbl",
];

export const wxRefundQueryField = `
  ${ wxRefundFields.join(" ") }
`;
