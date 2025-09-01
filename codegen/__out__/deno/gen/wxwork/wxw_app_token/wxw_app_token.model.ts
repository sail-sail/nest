import type {
  WxwAppTokenInput as WxwAppTokenInputType,
  WxwAppTokenModel as WxwAppTokenModelType,
  WxwAppTokenSearch as WxwAppTokenSearchType,
  WxwAppTokenFieldComment as WxwAppTokenFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wxwork/wxw_app_token";

declare const wxwAppTokenId: unique symbol;

declare global {
  
  /** 企微应用接口凭据 */
  type WxwAppTokenId = Distinct<string, typeof wxwAppTokenId>;
  
  /** 企微应用接口凭据 */
  interface WxwAppTokenSearch extends WxwAppTokenSearchType {
    /** 类型corp和contact */
    type?: string;
    type_like?: string;
    /** 企业ID */
    corpid?: string;
    corpid_like?: string;
    /** 密钥 */
    corpsecret?: string;
    corpsecret_like?: string;
    /** 通讯录密钥 */
    contactsecret?: string;
    contactsecret_like?: string;
    /** 令牌 */
    access_token?: string;
    access_token_like?: string;
    /** 令牌创建时间 */
    token_time?: [(string|undefined|null), (string|undefined|null)];
    /** 令牌超时时间 */
    expires_in?: [(number|undefined|null), (number|undefined|null)];
    /** 企业jsapi_ticket */
    jsapi_ticket?: string;
    jsapi_ticket_like?: string;
    /** 企业jsapi_ticket创建时间 */
    jsapi_ticket_time?: [(string|undefined|null), (string|undefined|null)];
    /** 企业jsapi_ticket超时时间 */
    jsapi_ticket_expires_in?: [(number|undefined|null), (number|undefined|null)];
    /** 应用jsapi_ticket */
    jsapi_ticket_agent_config?: string;
    jsapi_ticket_agent_config_like?: string;
    /** 应用jsapi_ticket创建时间 */
    jsapi_ticket_agent_config_time?: [(string|undefined|null), (string|undefined|null)];
    /** 应用jsapi_ticket超时时间 */
    jsapi_ticket_agent_config_expires_in?: [(number|undefined|null), (number|undefined|null)];
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

  interface WxwAppTokenModel extends WxwAppTokenModelType {
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

  interface WxwAppTokenInput extends WxwAppTokenInputType {
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

  interface WxwAppTokenFieldComment extends WxwAppTokenFieldCommentType {
  }
  
}

/** 企微应用接口凭据 前端允许排序的字段 */
export const canSortInApiWxwAppToken = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 企微应用接口凭据 检测字段是否允许前端排序 */
export function checkSortWxwAppToken(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxwAppToken: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxwAppToken;
    if (!canSortInApiWxwAppToken[prop]) {
      throw new Error(`checkSortWxwAppToken: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputWxwAppToken(
  input?: WxwAppTokenInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
