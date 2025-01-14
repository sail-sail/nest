import type {
  WxwMsgInput as WxwMsgInputType,
  WxwMsgModel as WxwMsgModelType,
  WxwMsgSearch as WxwMsgSearchType,
  WxwMsgFieldComment as WxwMsgFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wxwork/wxw_msg";

declare const wxwMsgId: unique symbol;

declare global {
  
  /** 企微消息 */
  type WxwMsgId = Distinct<string, typeof wxwMsgId>;
  
  /** 企微消息 */
  interface WxwMsgSearch extends WxwMsgSearchType {
    /** 成员ID */
    touser?: string;
    touser_like?: string;
    /** 标题 */
    title?: string;
    title_like?: string;
    /** 描述 */
    description?: string;
    description_like?: string;
    /** 链接 */
    url?: string;
    url_like?: string;
    /** 按钮文字 */
    btntxt?: string;
    btntxt_like?: string;
    /** 错误信息 */
    errmsg?: string;
    errmsg_like?: string;
    /** 消息ID */
    msgid?: string;
    msgid_like?: string;
    /** 创建人 */
    create_usr_id?: UsrId[];
    /** 创建人 */
    create_usr_id_is_null?: boolean;
    /** 创建人 */
    create_usr_id_lbl?: string[];
    /** 创建人 */
    create_usr_id_lbl_like?: string;
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

  interface WxwMsgModel extends WxwMsgModelType {
    /** 链接 */
    url: string;
    /** 消息ID */
    msgid: string;
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

  interface WxwMsgInput extends WxwMsgInputType {
    /** 链接 */
    url?: string | null;
    /** 消息ID */
    msgid?: string | null;
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

  interface WxwMsgFieldComment extends WxwMsgFieldCommentType {
  }
  
}

/** 企微消息 前端允许排序的字段 */
export const canSortInApiWxwMsg = {
  // 发送时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 企微消息 检测字段是否允许前端排序 */
export function checkSortWxwMsg(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxwMsg: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxwMsg;
    if (!canSortInApiWxwMsg[prop]) {
      throw new Error(`checkSortWxwMsg: ${ JSON.stringify(item) }`);
    }
  }
}
