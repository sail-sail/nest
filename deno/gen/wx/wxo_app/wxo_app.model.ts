import type {
  WxoAppInput as WxoAppInputType,
  WxoAppModel as WxoAppModelType,
  WxoAppSearch as WxoAppSearchType,
  WxoAppFieldComment as WxoAppFieldCommentType,
  // 消息加解密方式
  WxoAppEncodingType,
  // 授权作用域
  WxoAppScope,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/wxo_app";

declare const wxoAppId: unique symbol;

declare global {
  
  /** 公众号设置 */
  type WxoAppId = Distinct<string, typeof wxoAppId>;
  
  /** 公众号设置 */
  interface WxoAppSearch extends WxoAppSearchType {
    /** 开发者密码 */
    appsecret?: string;
    appsecret_like?: string;
    /** 令牌 */
    token?: string;
    token_like?: string;
    /** 消息加解密密钥 */
    encoding_aes_key?: string;
    encoding_aes_key_like?: string;
    /** 消息加解密方式 */
    encoding_type?: WxoAppEncodingType[];
    /** 授权作用域 */
    scope?: WxoAppScope[];
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

  interface WxoAppModel extends WxoAppModelType {
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

  interface WxoAppInput extends WxoAppInputType {
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

  interface WxoAppFieldComment extends WxoAppFieldCommentType {
  }
  
}

/** 公众号设置 前端允许排序的字段 */
export const canSortInApiWxoApp = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 公众号设置 检测字段是否允许前端排序 */
export function checkSortWxoApp(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxoApp: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxoApp;
    if (!canSortInApiWxoApp[prop]) {
      throw new Error(`checkSortWxoApp: ${ JSON.stringify(item) }`);
    }
  }
}
