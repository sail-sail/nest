/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxPayNoticeInput as WxPayNoticeInputType,
  WxPayNoticeModel as WxPayNoticeModelType,
  WxPayNoticeSearch as WxPayNoticeSearchType,
  WxPayNoticeFieldComment as WxPayNoticeFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 微信支付通知 */
  interface WxPayNoticeModel extends WxPayNoticeModelType {
  }
  
  /** 微信支付通知 */
  interface WxPayNoticeInput extends WxPayNoticeInputType {
  }
  
  /** 微信支付通知 */
  interface WxPayNoticeSearch extends WxPayNoticeSearchType {
  }
  
  /** 微信支付通知 */
  interface WxPayNoticeFieldComment extends WxPayNoticeFieldCommentType {
  }
  
}

export const wxPayNoticeFields = [
  // ID
  "id",
  // 开发者ID
  "appid",
  // 商户号
  "mchid",
  // 用户标识
  "openid",
  // 商户订单号
  "out_trade_no",
  // 微信支付订单号
  "transaction_id",
  // 交易类型
  "trade_type",
  "trade_type_lbl",
  // 交易状态
  "trade_state",
  "trade_state_lbl",
  // 交易状态描述
  "trade_state_desc",
  // 付款银行
  "bank_type",
  // 附加数据
  "attach",
  // 支付完成时间
  "success_time",
  "success_time_lbl",
  // 总金额(分)
  "total",
  // 用户支付金额(分)
  "payer_total",
  // 货币类型
  "currency",
  "currency_lbl",
  // 用户支付币种
  "payer_currency",
  "payer_currency_lbl",
  // 商户端设备号
  "device_id",
  // 备注
  "rem",
  // 
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 
  "update_usr_id",
  "update_usr_id_lbl",
  // 
  "update_time",
];

export const wxPayNoticeQueryField = `
  ${ wxPayNoticeFields.join(" ") }
`;
