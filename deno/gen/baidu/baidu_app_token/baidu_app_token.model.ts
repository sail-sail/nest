import type {
  BaiduAppTokenInput as BaiduAppTokenInputType,
  BaiduAppTokenModel as BaiduAppTokenModelType,
  BaiduAppTokenSearch as BaiduAppTokenSearchType,
  BaiduAppTokenFieldComment as BaiduAppTokenFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/baidu/baidu_app_token";

declare const baiduAppTokenId: unique symbol;

declare global {
  
  /** 百度接口凭据 */
  type BaiduAppTokenId = Distinct<string, typeof baiduAppTokenId>;
  
  /** 百度接口凭据 */
  interface BaiduAppTokenSearch extends BaiduAppTokenSearchType {
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
    tenant_id?: TenantId | null;
  }

  interface BaiduAppTokenModel extends BaiduAppTokenModelType {
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

  interface BaiduAppTokenInput extends BaiduAppTokenInputType {
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

  interface BaiduAppTokenFieldComment extends BaiduAppTokenFieldCommentType {
  }
  
}

/** 百度接口凭据 前端允许排序的字段 */
export const canSortInApiBaiduAppToken = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 百度接口凭据 检测字段是否允许前端排序 */
export function checkSortBaiduAppToken(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortBaiduAppToken: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiBaiduAppToken;
    if (!canSortInApiBaiduAppToken[prop]) {
      throw new Error(`checkSortBaiduAppToken: ${ JSON.stringify(item) }`);
    }
  }
}
