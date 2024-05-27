import type {
  WxappConfigInput as WxappConfigInputType,
  WxappConfigModel as WxappConfigModelType,
  WxappConfigSearch as WxappConfigSearchType,
  WxappConfigFieldComment as WxappConfigFieldCommentType,
} from "/gen/types.ts";

declare const wxappConfigId: unique symbol;

declare global {
  
  type WxappConfigId = Distinct<string, typeof wxappConfigId>;

  interface WxappConfigSearch extends WxappConfigSearchType {
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface WxappConfigModel extends WxappConfigModelType {
    /** 系统字段 */
    is_sys: number;
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

  interface WxappConfigInput extends WxappConfigInputType {
    /** 系统字段 */
    is_sys?: number | null;
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

  interface WxappConfigFieldComment extends WxappConfigFieldCommentType {
  }
  
}
