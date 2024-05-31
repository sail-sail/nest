import type {
  DeptInput as DeptInputType,
  DeptModel as DeptModelType,
  DeptSearch as DeptSearchType,
  DeptFieldComment as DeptFieldCommentType,
} from "/gen/types.ts";

declare const deptId: unique symbol;

declare global {
  
  type DeptId = Distinct<string, typeof deptId>;

  interface DeptSearch extends DeptSearchType {
    /** 部门负责人 */
    usr_ids?: UsrId[];
    usr_ids_is_null?: boolean;
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: number[];
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

  interface DeptModel extends DeptModelType {
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

  interface DeptInput extends DeptInputType {
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

  interface DeptFieldComment extends DeptFieldCommentType {
  }
  
}
