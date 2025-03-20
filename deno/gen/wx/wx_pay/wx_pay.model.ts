import type {
  WxPayInput as WxPayInputType,
  WxPayModel as WxPayModelType,
  WxPaySearch as WxPaySearchType,
  WxPayFieldComment as WxPayFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/wx_pay";

declare const wxPayId: unique symbol;

declare global {
  
  /** 微信支付设置 */
  type WxPayId = Distinct<string, typeof wxPayId>;
  
  /** 微信支付设置 */
  interface WxPaySearch extends WxPaySearchType {
    /** 商户号 */
    mchid?: string;
    mchid_like?: string;
    /** 证书序列号 */
    serial_no?: string;
    serial_no_like?: string;
    /** 公钥 */
    public_key?: string;
    public_key_like?: string;
    /** 私钥 */
    private_key?: string;
    private_key_like?: string;
    /** APIv3密钥 */
    v3_key?: string;
    v3_key_like?: string;
    /** 支付终端IP */
    payer_client_ip?: string;
    payer_client_ip_like?: string;
    /** 通知地址 */
    notify_url?: string;
    notify_url_like?: string;
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface WxPayModel extends WxPayModelType {
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

  interface WxPayInput extends WxPayInputType {
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

  interface WxPayFieldComment extends WxPayFieldCommentType {
  }
  
}

/** 微信支付设置 前端允许排序的字段 */
export const canSortInApiWxPay = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 微信支付设置 检测字段是否允许前端排序 */
export function checkSortWxPay(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxPay: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxPay;
    if (!canSortInApiWxPay[prop]) {
      throw new Error(`checkSortWxPay: ${ JSON.stringify(item) }`);
    }
  }
}
