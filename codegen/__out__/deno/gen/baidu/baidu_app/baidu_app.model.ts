import type {
  BaiduAppInput as BaiduAppInputType,
  BaiduAppModel as BaiduAppModelType,
  BaiduAppSearch as BaiduAppSearchType,
  BaiduAppFieldComment as BaiduAppFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/baidu/baidu_app";

declare const baiduAppId: unique symbol;

declare global {
  
  /** 百度应用 */
  type BaiduAppId = Distinct<string, typeof baiduAppId>;
  
  /** 百度应用 */
  interface BaiduAppSearch extends BaiduAppSearchType {
    /** AppID */
    appid?: string;
    appid_like?: string;
    /** API Key */
    api_key?: string;
    api_key_like?: string;
    /** Secret Key */
    secret_key?: string;
    secret_key_like?: string;
    /** AES Key */
    aes_key?: string;
    aes_key_like?: string;
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

  interface BaiduAppModel extends BaiduAppModelType {
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

  interface BaiduAppInput extends BaiduAppInputType {
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

  interface BaiduAppFieldComment extends BaiduAppFieldCommentType {
  }
  
}

/** 百度应用 前端允许排序的字段 */
export const canSortInApiBaiduApp = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 百度应用 检测字段是否允许前端排序 */
export function checkSortBaiduApp(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortBaiduApp: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiBaiduApp;
    if (!canSortInApiBaiduApp[prop]) {
      throw new Error(`checkSortBaiduApp: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputBaiduApp(
  input?: BaiduAppInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
