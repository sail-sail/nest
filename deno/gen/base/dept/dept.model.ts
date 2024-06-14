import type {
  DeptInput as DeptInputType,
  DeptModel as DeptModelType,
  DeptSearch as DeptSearchType,
  DeptFieldComment as DeptFieldCommentType,
  SortInput,
} from "/gen/types.ts";

declare const deptId: unique symbol;

declare global {
  
  type DeptId = Distinct<string, typeof deptId>;

  interface DeptSearch extends DeptSearchType {
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
    tenant_id?: TenantId | null;
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
  }

  interface DeptInput extends DeptInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface DeptFieldComment extends DeptFieldCommentType {
  }
  
}

/** 部门 前端允许排序的字段 */
export const canSortInApiDept = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 部门 检测字段是否允许前端排序 */
export function checkSortDept(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== "asc" && order !== "desc" &&
      order !== "ascending" && order !== "descending"
    ) {
      throw new Error(`checkSortDept: ${ JSON.stringify(item) }`);
    }
    const prop = item.prop as keyof typeof canSortInApiDept;
    if (!canSortInApiDept[prop]) {
      throw new Error(`checkSortDept: ${ JSON.stringify(item) }`);
    }
  }
}
