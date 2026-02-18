import type {
  WxRefundNoticeInput as WxRefundNoticeInputType,
  WxRefundNoticeModel as WxRefundNoticeModelType,
  WxRefundNoticeSearch as WxRefundNoticeSearchType,
  WxRefundNoticeFieldComment as WxRefundNoticeFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathWxRefundNotice() {
  return "/wx/wx_refund_notice";
}

export function getTableNameWxRefundNotice() {
  return "wx_wx_refund_notice";
}

declare const wxRefundNoticeId: unique symbol;

declare global {
  
  /** 微信退款通知 */
  type WxRefundNoticeId = Distinct<string, typeof wxRefundNoticeId>;
  
  /** 微信退款通知 */
  interface WxRefundNoticeSearch extends WxRefundNoticeSearchType {
    /** 开发者ID */
    appid?: string;
    appid_like?: string;
    /** 商户号 */
    mchid?: string;
    mchid_like?: string;
    /** 商户订单号 */
    out_trade_no?: string;
    out_trade_no_like?: string;
    /** 退款入账账户 */
    user_received_account?: string;
    user_received_account_like?: string;
    /** 订单金额(分) */
    amount_total?: [(number|undefined|null), (number|undefined|null)];
    /** 退款金额(分) */
    amount_refund?: [(number|undefined|null), (number|undefined|null)];
    /** 用户实际支付金额(分) */
    amount_payer_total?: [(number|undefined|null), (number|undefined|null)];
    /** 用户退款金额(分) */
    amount_payer_refund?: [(number|undefined|null), (number|undefined|null)];
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface WxRefundNoticeModel extends WxRefundNoticeModelType {
    create_time?: string | null;
    create_time_lbl: string;
    tenant_id: TenantId;
  }

  interface WxRefundNoticeInput extends WxRefundNoticeInputType {
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    tenant_id?: TenantId | null;
  }

  interface WxRefundNoticeFieldComment extends WxRefundNoticeFieldCommentType {
  }
  
}

/** 微信退款通知 前端允许排序的字段 */
export const canSortInApiWxRefundNotice = {
  // 退款成功时间
  "success_time": true,
  // 创建时间
  "create_time": true,
};

/** 微信退款通知 检测字段是否允许前端排序 */
export function checkSortWxRefundNotice(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxRefundNotice: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxRefundNotice;
    if (!canSortInApiWxRefundNotice[prop]) {
      throw new Error(`checkSortWxRefundNotice: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputWxRefundNotice(
  input?: WxRefundNoticeInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
