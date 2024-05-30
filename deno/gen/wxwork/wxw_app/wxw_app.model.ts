import type {
  WxwAppInput as WxwAppInputType,
  WxwAppModel as WxwAppModelType,
  WxwAppSearch as WxwAppSearchType,
  WxwAppFieldComment as WxwAppFieldCommentType,
} from "/gen/types.ts";

declare const wxwAppId: unique symbol;

declare global {
  
  type WxwAppId = Distinct<string, typeof wxwAppId>;

  interface WxwAppSearch extends WxwAppSearchType {
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: number[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建人 */
    create_usr_id?: UsrId[];
    create_usr_id_is_null?: boolean;
    create_usr_id_lbl?: string[];
    /** 创建时间 */
    create_time?: string[];
    /** 更新人 */
    update_usr_id?: UsrId[];
    update_usr_id_is_null?: boolean;
    update_usr_id_lbl?: string[];
    /** 更新时间 */
    update_time?: string[];
    tenant_id?: string | null;
  }

  interface WxwAppModel extends WxwAppModelType {
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

  interface WxwAppInput extends WxwAppInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface WxwAppFieldComment extends WxwAppFieldCommentType {
  }
  
}
