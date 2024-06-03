import type {
  WxwMsgInput as WxwMsgInputType,
  WxwMsgModel as WxwMsgModelType,
  WxwMsgSearch as WxwMsgSearchType,
  WxwMsgFieldComment as WxwMsgFieldCommentType,
} from "/gen/types.ts";

declare const wxwMsgId: unique symbol;

declare global {
  
  type WxwMsgId = Distinct<string, typeof wxwMsgId>;

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
    create_usr_id_is_null?: boolean;
    create_usr_id_lbl?: string[];
    /** 更新人 */
    update_usr_id?: UsrId[];
    update_usr_id_is_null?: boolean;
    update_usr_id_lbl?: string[];
    /** 更新时间 */
    update_time?: string[];
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
