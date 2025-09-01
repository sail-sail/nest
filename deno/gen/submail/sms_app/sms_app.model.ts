import type {
  SmsAppInput as SmsAppInputType,
  SmsAppModel as SmsAppModelType,
  SmsAppSearch as SmsAppSearchType,
  SmsAppFieldComment as SmsAppFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/submail/sms_app";

declare const smsAppId: unique symbol;

declare global {
  
  /** 短信应用 */
  type SmsAppId = Distinct<string, typeof smsAppId>;
  
  /** 短信应用 */
  interface SmsAppSearch extends SmsAppSearchType {
    /** appid */
    appid?: string;
    appid_like?: string;
    /** appkey */
    appkey?: string;
    appkey_like?: string;
    /** 锁定 */
    is_locked?: number[];
    /** 暂停发送 */
    is_paused?: number[];
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

  interface SmsAppModel extends SmsAppModelType {
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

  interface SmsAppInput extends SmsAppInputType {
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

  interface SmsAppFieldComment extends SmsAppFieldCommentType {
  }
  
}

/** 短信应用 前端允许排序的字段 */
export const canSortInApiSmsApp = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 短信应用 检测字段是否允许前端排序 */
export function checkSortSmsApp(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortSmsApp: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiSmsApp;
    if (!canSortInApiSmsApp[prop]) {
      throw new Error(`checkSortSmsApp: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputSmsApp(
  input?: SmsAppInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
