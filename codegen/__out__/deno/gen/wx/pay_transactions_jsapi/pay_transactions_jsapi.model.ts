import type {
  PayTransactionsJsapiInput as PayTransactionsJsapiInputType,
  PayTransactionsJsapiModel as PayTransactionsJsapiModelType,
  PayTransactionsJsapiSearch as PayTransactionsJsapiSearchType,
  PayTransactionsJsapiFieldComment as PayTransactionsJsapiFieldCommentType,
  // 交易状态
  PayTransactionsJsapiTradeState,
  // 货币类型
  PayTransactionsJsapiCurrency,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/pay_transactions_jsapi";

declare const payTransactionsJsapiId: unique symbol;

declare global {
  
  /** 微信JSAPI下单 */
  type PayTransactionsJsapiId = Distinct<string, typeof payTransactionsJsapiId>;
  
  /** 微信JSAPI下单 */
  interface PayTransactionsJsapiSearch extends PayTransactionsJsapiSearchType {
    /** 开发者ID */
    appid?: string;
    appid_like?: string;
    /** 商户号 */
    mchid?: string;
    mchid_like?: string;
    /** 商品描述 */
    description?: string;
    description_like?: string;
    /** 商户订单号 */
    out_trade_no?: string;
    out_trade_no_like?: string;
    /** 交易状态 */
    trade_state?: PayTransactionsJsapiTradeState[];
    /** 交易状态描述 */
    trade_state_desc?: string;
    trade_state_desc_like?: string;
    /** 支付完成时间 */
    success_time?: [(string|undefined|null), (string|undefined|null)];
    /** 交易限制时间 */
    time_expire?: string;
    time_expire_like?: string;
    /** 附加数据 */
    attach?: string;
    attach_like?: string;
    /** 附加数据2 */
    attach2?: string;
    attach2_like?: string;
    /** 通知地址 */
    notify_url?: string;
    notify_url_like?: string;
    /** 是否支持发票 */
    support_fapiao?: number[];
    /** 订单金额(分) */
    total_fee?: [(number|undefined|null), (number|undefined|null)];
    /** 货币类型 */
    currency?: PayTransactionsJsapiCurrency[];
    /** 用户标识 */
    openid?: string;
    openid_like?: string;
    /** 预支付交易会话标识 */
    prepay_id?: string;
    prepay_id_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface PayTransactionsJsapiModel extends PayTransactionsJsapiModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
  }

  interface PayTransactionsJsapiInput extends PayTransactionsJsapiInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface PayTransactionsJsapiFieldComment extends PayTransactionsJsapiFieldCommentType {
  }
  
}

/** 微信JSAPI下单 前端允许排序的字段 */
export const canSortInApiPayTransactionsJsapi = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 微信JSAPI下单 检测字段是否允许前端排序 */
export function checkSortPayTransactionsJsapi(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortPayTransactionsJsapi: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiPayTransactionsJsapi;
    if (!canSortInApiPayTransactionsJsapi[prop]) {
      throw new Error(`checkSortPayTransactionsJsapi: ${ JSON.stringify(item) }`);
    }
  }
}
