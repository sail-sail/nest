import type {
  WxAppInput as WxAppInputType,
  WxAppModel as WxAppModelType,
  WxAppSearch as WxAppSearchType,
  WxAppFieldComment as WxAppFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathWxApp() {
  return "/wx/wx_app";
}

export function getTableNameWxApp() {
  return "wx_wx_app";
}

declare const wxAppId: unique symbol;

declare global {
  
  /** 小程序设置 */
  type WxAppId = Distinct<string, typeof wxAppId>;
  
  /** 小程序设置 */
  interface WxAppSearch extends WxAppSearchType {
    /** 开发者密码 */
    appsecret?: string;
    appsecret_like?: string;
    /** 默认角色 */
    default_role_codes?: string;
    default_role_codes_like?: string;
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

  interface WxAppModel extends WxAppModelType {
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

  interface WxAppInput extends WxAppInputType {
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

  interface WxAppFieldComment extends WxAppFieldCommentType {
  }
  
}

/** 小程序设置 前端允许排序的字段 */
export const canSortInApiWxApp = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 小程序设置 检测字段是否允许前端排序 */
export function checkSortWxApp(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxApp: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxApp;
    if (!canSortInApiWxApp[prop]) {
      throw new Error(`checkSortWxApp: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputWxApp(
  input?: WxAppInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
