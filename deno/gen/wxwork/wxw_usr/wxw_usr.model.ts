import type {
  WxwUsrInput as WxwUsrInputType,
  WxwUsrModel as WxwUsrModelType,
  WxwUsrSearch as WxwUsrSearchType,
  WxwUsrFieldComment as WxwUsrFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wxwork/wxw_usr";

declare const wxwUsrId: unique symbol;

declare global {
  
  /** 企微用户 */
  type WxwUsrId = Distinct<string, typeof wxwUsrId>;
  
  /** 企微用户 */
  interface WxwUsrSearch extends WxwUsrSearchType {
    /** 企业ID */
    corpid?: string;
    corpid_like?: string;
    /** 应用ID */
    agentid?: string;
    agentid_like?: string;
    /** 用户ID */
    userid?: string;
    userid_like?: string;
    /** 手机号 */
    mobile?: string;
    mobile_like?: string;
    /** 性别 */
    gender?: string;
    gender_like?: string;
    /** 邮箱 */
    email?: string;
    email_like?: string;
    /** 企业邮箱 */
    biz_email?: string;
    biz_email_like?: string;
    /** 直属上级 */
    direct_leader?: string;
    direct_leader_like?: string;
    /** 职位 */
    position?: string;
    position_like?: string;
    /** 头像 */
    avatar?: string;
    avatar_like?: string;
    /** 头像缩略图 */
    thumb_avatar?: string;
    thumb_avatar_like?: string;
    /** 个人二维码 */
    qr_code?: string;
    qr_code_like?: string;
    /** 备注 */
    rem?: string;
    rem_like?: string;
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

  interface WxwUsrModel extends WxwUsrModelType {
    /** 企业ID */
    corpid: string;
    /** 应用ID */
    agentid: string;
    /** 手机号 */
    mobile: string;
    /** 性别 */
    gender: string;
    /** 邮箱 */
    email: string;
    /** 企业邮箱 */
    biz_email: string;
    /** 直属上级 */
    direct_leader: string;
    /** 职位 */
    position: string;
    /** 头像 */
    avatar: string;
    /** 头像缩略图 */
    thumb_avatar: string;
    /** 个人二维码 */
    qr_code: string;
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

  interface WxwUsrInput extends WxwUsrInputType {
    /** 企业ID */
    corpid?: string | null;
    /** 应用ID */
    agentid?: string | null;
    /** 手机号 */
    mobile?: string | null;
    /** 性别 */
    gender?: string | null;
    /** 邮箱 */
    email?: string | null;
    /** 企业邮箱 */
    biz_email?: string | null;
    /** 直属上级 */
    direct_leader?: string | null;
    /** 职位 */
    position?: string | null;
    /** 头像 */
    avatar?: string | null;
    /** 头像缩略图 */
    thumb_avatar?: string | null;
    /** 个人二维码 */
    qr_code?: string | null;
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

  interface WxwUsrFieldComment extends WxwUsrFieldCommentType {
  }
  
}

/** 企微用户 前端允许排序的字段 */
export const canSortInApiWxwUsr = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 企微用户 检测字段是否允许前端排序 */
export function checkSortWxwUsr(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxwUsr: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxwUsr;
    if (!canSortInApiWxwUsr[prop]) {
      throw new Error(`checkSortWxwUsr: ${ JSON.stringify(item) }`);
    }
  }
}
