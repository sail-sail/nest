import type {
  PtInput as PtInputType,
  PtModel as PtModelType,
  PtSearch as PtSearchType,
  PtFieldComment as PtFieldCommentType,
} from "/gen/types.ts";

declare const ptId: unique symbol;

declare global {
  
  type PtId = Distinct<string, typeof ptId>;

  interface PtSearch extends PtSearchType {
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface PtModel extends PtModelType {
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

  interface PtInput extends PtInputType {
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

  interface PtFieldComment extends PtFieldCommentType {
  }
  
}
