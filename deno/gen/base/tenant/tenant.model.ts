import type {
  TenantInput as TenantInputType,
  TenantModel as TenantModelType,
  TenantSearch as TenantSearchType,
  TenantFieldComment as TenantFieldCommentType,
} from "/gen/types.ts";

declare const tenantId: unique symbol;

declare global {
  
  type TenantId = Distinct<string, typeof tenantId>;

  interface TenantSearch extends TenantSearchType {
  }

  interface TenantModel extends TenantModelType {
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
  }

  interface TenantInput extends TenantInputType {
    /** 系统字段 */
    is_sys?: number;
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
  }

  interface TenantFieldComment extends TenantFieldCommentType {
  }
  
}
