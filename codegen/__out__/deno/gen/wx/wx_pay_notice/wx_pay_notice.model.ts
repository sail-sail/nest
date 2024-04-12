import type {
  WxPayNoticeInput as WxPayNoticeInputType,
  WxPayNoticeModel as WxPayNoticeModelType,
  WxPayNoticeSearch as WxPayNoticeSearchType,
  WxPayNoticeFieldComment as WxPayNoticeFieldCommentType,
} from "/gen/types.ts";

declare const wxPayNoticeId: unique symbol;

declare global {
  
  type WxPayNoticeId = Distinct<string, typeof wxPayNoticeId>;

  interface WxPayNoticeSearch extends WxPayNoticeSearchType {
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface WxPayNoticeModel extends WxPayNoticeModelType {
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

  interface WxPayNoticeInput extends WxPayNoticeInputType {
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

  interface WxPayNoticeFieldComment extends WxPayNoticeFieldCommentType {
  }
  
}
