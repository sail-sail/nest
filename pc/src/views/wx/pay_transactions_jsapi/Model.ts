/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  PayTransactionsJsapiInput as PayTransactionsJsapiInputType,
  PayTransactionsJsapiModel as PayTransactionsJsapiModelType,
  PayTransactionsJsapiSearch as PayTransactionsJsapiSearchType,
  PayTransactionsJsapiFieldComment as PayTransactionsJsapiFieldCommentType,
} from "#/types";

declare global {
  
  interface PayTransactionsJsapiModel extends PayTransactionsJsapiModelType {
  }

  interface PayTransactionsJsapiInput extends PayTransactionsJsapiInputType {
  }

  interface PayTransactionsJsapiSearch extends PayTransactionsJsapiSearchType {
  }

  interface PayTransactionsJsapiFieldComment extends PayTransactionsJsapiFieldCommentType {
  }
  
}

export const payTransactionsJsapiFields = [
  // ID
  "id",
  // 开发者ID
  "appid",
  // 商户号
  "mchid",
  // 商品描述
  "description",
  // 商户订单号
  "out_trade_no",
  // 微信支付订单号
  "transaction_id",
  // 交易状态
  "trade_state",
  "trade_state_lbl",
  // 交易状态描述
  "trade_state_desc",
  // 支付完成时间
  "success_time",
  "success_time_lbl",
  // 交易限制时间
  "time_expire",
  // 附加数据
  "attach",
  // 附加数据2
  "attach2",
  // 通知地址
  "notify_url",
  // 是否支持发票
  "support_fapiao",
  "support_fapiao_lbl",
  // 订单金额(分)
  "total_fee",
  // 货币类型
  "currency",
  "currency_lbl",
  // 用户标识
  "openid",
  // 预支付交易会话标识
  "prepay_id",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const payTransactionsJsapiQueryField = `
  ${ payTransactionsJsapiFields.join(" ") }
`;
