import type {
  WxRefundInput as WxRefundInputType,
  WxRefundModel as WxRefundModelType,
  WxRefundSearch as WxRefundSearchType,
  WxRefundFieldComment as WxRefundFieldCommentType,
  // 退款渠道
  WxRefundChannel,
  // 资金账户
  WxRefundFundsAccount,
  // 退款币种
  WxRefundAmountCurrency,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathWxRefund() {
  return "/wx/wx_refund";
}

export function getTableNameWxRefund() {
  return "wx_wx_refund";
}

declare const wxRefundId: unique symbol;

declare global {
  
  /** 微信退款申请 */
  type WxRefundId = Distinct<string, typeof wxRefundId>;
  
  /** 微信退款申请 */
  interface WxRefundSearch extends WxRefundSearchType {
    /** 开发者ID */
    appid?: string;
    appid_like?: string;
    /** 商户号 */
    mchid?: string;
    mchid_like?: string;
    /** 商户订单号 */
    out_trade_no?: string;
    out_trade_no_like?: string;
    /** 退款原因 */
    reason?: string;
    reason_like?: string;
    /** 附加数据2 */
    attach2?: string;
    attach2_like?: string;
    /** 退款结果回调地址 */
    notify_url?: string;
    notify_url_like?: string;
    /** 退款渠道 */
    channel?: WxRefundChannel[];
    /** 退款入账账户 */
    user_received_account?: string;
    user_received_account_like?: string;
    /** 资金账户 */
    funds_account?: WxRefundFundsAccount[];
    /** 订单金额(分) */
    amount_total?: [(number|undefined|null), (number|undefined|null)];
    /** 退款金额(分) */
    amount_refund?: [(number|undefined|null), (number|undefined|null)];
    /** 用户实际支付金额(分) */
    amount_payer_total?: [(number|undefined|null), (number|undefined|null)];
    /** 用户退款金额(分) */
    amount_payer_refund?: [(number|undefined|null), (number|undefined|null)];
    /** 应结退款金额(分) */
    amount_settlement_refund?: [(number|undefined|null), (number|undefined|null)];
    /** 优惠退款金额(分) */
    amount_discount_refund?: [(number|undefined|null), (number|undefined|null)];
    /** 退款币种 */
    amount_currency?: WxRefundAmountCurrency[];
    /** 手续费退款金额(分) */
    amount_refund_fee?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface WxRefundModel extends WxRefundModelType {
    /** 附加数据2 */
    attach2: string;
    /** 退款结果回调地址 */
    notify_url: string;
    create_time?: string | null;
    create_time_lbl: string;
    tenant_id: TenantId;
  }

  interface WxRefundInput extends WxRefundInputType {
    /** 附加数据2 */
    attach2?: string | null;
    /** 退款结果回调地址 */
    notify_url?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    tenant_id?: TenantId | null;
  }

  interface WxRefundFieldComment extends WxRefundFieldCommentType {
  }
  
}

/** 微信退款申请 前端允许排序的字段 */
export const canSortInApiWxRefund = {
  // 退款成功时间
  "success_time": true,
  // 创建时间
  "create_time": true,
};

/** 微信退款申请 检测字段是否允许前端排序 */
export function checkSortWxRefund(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxRefund: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxRefund;
    if (!canSortInApiWxRefund[prop]) {
      throw new Error(`checkSortWxRefund: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputWxRefund(
  input?: WxRefundInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
