/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxRefundNoticeInput as WxRefundNoticeInputType,
  WxRefundNoticeModel as WxRefundNoticeModelType,
  WxRefundNoticeSearch as WxRefundNoticeSearchType,
  WxRefundNoticeFieldComment as WxRefundNoticeFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 微信退款通知 */
  interface WxRefundNoticeModel extends WxRefundNoticeModelType {
  }
  
  /** 微信退款通知 */
  interface WxRefundNoticeInput extends WxRefundNoticeInputType {
  }
  
  /** 微信退款通知 */
  interface WxRefundNoticeSearch extends WxRefundNoticeSearchType {
  }
  
  /** 微信退款通知 */
  interface WxRefundNoticeFieldComment extends WxRefundNoticeFieldCommentType {
  }
  
}

export const wxRefundNoticeFields = [
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
  // 退款状态
  "refund_status",
  "refund_status_lbl",
  // 退款成功时间
  "success_time",
  "success_time_lbl",
  // 退款入账账户
  "user_received_account",
  // 订单金额(分)
  "amount_total",
  // 退款金额(分)
  "amount_refund",
  // 用户实际支付金额(分)
  "amount_payer_total",
  // 用户退款金额(分)
  "amount_payer_refund",
  // 创建时间
  "create_time",
  "create_time_lbl",
];

export const wxRefundNoticeQueryField = `
  ${ wxRefundNoticeFields.join(" ") }
`;
