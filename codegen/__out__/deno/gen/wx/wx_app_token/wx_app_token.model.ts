import type {
  WxAppTokenInput as WxAppTokenInputType,
  WxAppTokenModel as WxAppTokenModelType,
  WxAppTokenSearch as WxAppTokenSearchType,
  WxAppTokenFieldComment as WxAppTokenFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/wx_app_token";

declare const wxAppTokenId: unique symbol;

declare global {
  
  type WxAppTokenId = Distinct<string, typeof wxAppTokenId>;

  interface WxAppTokenSearch extends WxAppTokenSearchType {
    /** 令牌 */
    access_token?: string;
    access_token_like?: string;
    /** 令牌创建时间 */
    token_time?: string[];
    /** 令牌超时时间 */
    expires_in?: number[];
    /** 创建人 */
    create_usr_id?: UsrId[];
    /** 创建人 */
    create_usr_id_is_null?: boolean;
    /** 创建人 */
    create_usr_id_lbl?: string[];
    /** 创建时间 */
    create_time?: string[];
    /** 更新人 */
    update_usr_id?: UsrId[];
    /** 更新人 */
    update_usr_id_is_null?: boolean;
    /** 更新人 */
    update_usr_id_lbl?: string[];
    /** 更新时间 */
    update_time?: string[];
  }

  interface WxAppTokenModel extends WxAppTokenModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface WxAppTokenInput extends WxAppTokenInputType {
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

  interface WxAppTokenFieldComment extends WxAppTokenFieldCommentType {
  }
  
}

/** 小程序接口凭据 前端允许排序的字段 */
export const canSortInApiWxAppToken = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 小程序接口凭据 检测字段是否允许前端排序 */
export function checkSortWxAppToken(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxAppToken: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxAppToken;
    if (!canSortInApiWxAppToken[prop]) {
      throw new Error(`checkSortWxAppToken: ${ JSON.stringify(item) }`);
    }
  }
}
