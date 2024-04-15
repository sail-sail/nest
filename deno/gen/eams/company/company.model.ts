import type {
  CompanyInput as CompanyInputType,
  CompanyModel as CompanyModelType,
  CompanySearch as CompanySearchType,
  CompanyFieldComment as CompanyFieldCommentType,
} from "/gen/types.ts";

declare const companyId: unique symbol;

declare global {
  
  type CompanyId = Distinct<string, typeof companyId>;

  interface CompanySearch extends CompanySearchType {
    tenant_id?: string | null;
  }

  interface CompanyModel extends CompanyModelType {
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

  interface CompanyInput extends CompanyInputType {
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

  interface CompanyFieldComment extends CompanyFieldCommentType {
  }
  
}
