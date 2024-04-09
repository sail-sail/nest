import type {
  WxUsrInput as WxUsrInputType,
  WxUsrModel as WxUsrModelType,
  WxUsrSearch as WxUsrSearchType,
  WxUsrFieldComment as WxUsrFieldCommentType,
} from "/gen/types.ts";

declare const wxUsrId: unique symbol;

declare global {
  
  type WxUsrId = Distinct<string, typeof wxUsrId>;

  interface WxUsrSearch extends WxUsrSearchType {
    tenant_id?: string | null;
    org_id?: string | null;
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
    org_id: OrgId;
  }

  interface WxUsrInput extends WxUsrInputType {
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

  interface WxUsrFieldComment extends WxUsrFieldCommentType {
  }
  
}
