import type {
  WxoUsrInput as WxoUsrInputType,
  WxoUsrModel as WxoUsrModelType,
  WxoUsrSearch as WxoUsrSearchType,
  WxoUsrFieldComment as WxoUsrFieldCommentType,
} from "/gen/types.ts";

declare const wxoUsrId: unique symbol;

declare global {
  
  type WxoUsrId = Distinct<string, typeof wxoUsrId>;

  interface WxoUsrSearch extends WxoUsrSearchType {
    /** 用户 */
    usr_id?: UsrId[];
    usr_id_is_null?: boolean;
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
    tenant_id?: string | null;
    org_id?: OrgId | null;
  }

  interface WxoUsrModel extends WxoUsrModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
    org_id: OrgId;
  }

  interface WxoUsrInput extends WxoUsrInputType {
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
    org_id?: OrgId | null;
  }

  interface WxoUsrFieldComment extends WxoUsrFieldCommentType {
  }
  
}
