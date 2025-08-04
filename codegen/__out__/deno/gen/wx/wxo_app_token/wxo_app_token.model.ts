import type {
  WxoAppTokenInput as WxoAppTokenInputType,
  WxoAppTokenModel as WxoAppTokenModelType,
  WxoAppTokenSearch as WxoAppTokenSearchType,
  WxoAppTokenFieldComment as WxoAppTokenFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/wxo_app_token";

declare const wxoAppTokenId: unique symbol;

declare global {
  
  /** 小程序接口凭据 */
  type WxoAppTokenId = Distinct<string, typeof wxoAppTokenId>;
  
  /** 小程序接口凭据 */
  interface WxoAppTokenSearch extends WxoAppTokenSearchType {
    /** 开发者ID */
    appid?: string;
    appid_like?: string;
    /** 开发者密码 */
    appsecret?: string;
    appsecret_like?: string;
    /** 令牌 */
    access_token?: string;
    access_token_like?: string;
    /** 令牌创建时间 */
    token_time?: [(string|undefined|null), (string|undefined|null)];
    /** 令牌超时时间 */
    expires_in?: [(number|undefined|null), (number|undefined|null)];
    /** 创建人 */
    create_usr_id?: UsrId[];
    /** 创建人 */
    create_usr_id_is_null?: boolean;
    /** 创建人 */
    create_usr_id_lbl?: string[];
    /** 创建人 */
    create_usr_id_lbl_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新人 */
    update_usr_id?: UsrId[];
    /** 更新人 */
    update_usr_id_is_null?: boolean;
    /** 更新人 */
    update_usr_id_lbl?: string[];
    /** 更新人 */
    update_usr_id_lbl_like?: string;
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface WxoAppTokenModel extends WxoAppTokenModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface WxoAppTokenInput extends WxoAppTokenInputType {
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
  }

  interface WxoAppTokenFieldComment extends WxoAppTokenFieldCommentType {
  }
  
}

/** 小程序接口凭据 前端允许排序的字段 */
export const canSortInApiWxoAppToken = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 小程序接口凭据 检测字段是否允许前端排序 */
export function checkSortWxoAppToken(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxoAppToken: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxoAppToken;
    if (!canSortInApiWxoAppToken[prop]) {
      throw new Error(`checkSortWxoAppToken: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputWxoAppToken(
  input?: WxoAppTokenInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
