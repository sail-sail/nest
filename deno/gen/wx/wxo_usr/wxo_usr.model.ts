import type {
  WxoUsrInput as WxoUsrInputType,
  WxoUsrModel as WxoUsrModelType,
  WxoUsrSearch as WxoUsrSearchType,
  WxoUsrFieldComment as WxoUsrFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/wxo_usr";

declare const wxoUsrId: unique symbol;

declare global {
  
  type WxoUsrId = Distinct<string, typeof wxoUsrId>;

  interface WxoUsrSearch extends WxoUsrSearchType {
    /** 公众号用户唯一标识 */
    openid?: string;
    openid_like?: string;
    /** 公众号用户统一标识 */
    unionid?: string;
    unionid_like?: string;
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
    /** 组织 */
    org_id?: OrgId[];
    /** 组织 */
    org_id_is_null?: boolean;
    /** 组织 */
    org_id_lbl?: string[];
    /** 组织 */
    org_id_lbl_like?: string;
    tenant_id?: TenantId | null;
  }

  interface WxoUsrModel extends WxoUsrModelType {
    /** 组织 */
    org_id: OrgId;
    /** 组织 */
    org_id_lbl: string;
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

  interface WxoUsrInput extends WxoUsrInputType {
    /** 组织 */
    org_id?: OrgId | null;
    /** 组织 */
    org_id_lbl?: string | null;
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

  interface WxoUsrFieldComment extends WxoUsrFieldCommentType {
  }
  
}

/** 公众号用户 前端允许排序的字段 */
export const canSortInApiWxoUsr = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 公众号用户 检测字段是否允许前端排序 */
export function checkSortWxoUsr(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxoUsr: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxoUsr;
    if (!canSortInApiWxoUsr[prop]) {
      throw new Error(`checkSortWxoUsr: ${ JSON.stringify(item) }`);
    }
  }
}
