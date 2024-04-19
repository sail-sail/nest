import type {
  SeoInput as SeoInputType,
  SeoModel as SeoModelType,
  SeoSearch as SeoSearchType,
  SeoFieldComment as SeoFieldCommentType,
} from "/gen/types.ts";

declare const seoId: unique symbol;

declare global {
  
  type SeoId = Distinct<string, typeof seoId>;

  interface SeoSearch extends SeoSearchType {
    tenant_id?: string | null;
  }

  interface SeoModel extends SeoModelType {
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

  interface SeoInput extends SeoInputType {
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

  interface SeoFieldComment extends SeoFieldCommentType {
  }
  
}
