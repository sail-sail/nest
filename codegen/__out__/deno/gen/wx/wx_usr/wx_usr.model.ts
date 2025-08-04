import type {
  WxUsrInput as WxUsrInputType,
  WxUsrModel as WxUsrModelType,
  WxUsrSearch as WxUsrSearchType,
  WxUsrFieldComment as WxUsrFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wx/wx_usr";

declare const wxUsrId: unique symbol;

declare global {
  
  /** 小程序用户 */
  type WxUsrId = Distinct<string, typeof wxUsrId>;
  
  /** 小程序用户 */
  interface WxUsrSearch extends WxUsrSearchType {
    /** 昵称 */
    nick_name?: string;
    nick_name_like?: string;
    /** 头像 */
    avatar_img?: string;
    avatar_img_like?: string;
    /** 手机 */
    mobile?: string;
    mobile_like?: string;
    /** 小程序用户唯一标识 */
    openid?: string;
    openid_like?: string;
    /** 用户统一标识 */
    unionid?: string;
    unionid_like?: string;
    /** 性别 */
    gender?: number[];
    /** 城市 */
    city?: string;
    city_like?: string;
    /** 省份 */
    province?: string;
    province_like?: string;
    /** 国家 */
    country?: string;
    country_like?: string;
    /** 语言 */
    language?: string;
    language_like?: string;
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface WxUsrModel extends WxUsrModelType {
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

  interface WxUsrInput extends WxUsrInputType {
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

  interface WxUsrFieldComment extends WxUsrFieldCommentType {
  }
  
}

/** 小程序用户 前端允许排序的字段 */
export const canSortInApiWxUsr = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 小程序用户 检测字段是否允许前端排序 */
export function checkSortWxUsr(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxUsr: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxUsr;
    if (!canSortInApiWxUsr[prop]) {
      throw new Error(`checkSortWxUsr: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputWxUsr(
  input?: WxUsrInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
