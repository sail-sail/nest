import type {
  DataPermitInput as DataPermitInputType,
  DataPermitModel as DataPermitModelType,
  DataPermitSearch as DataPermitSearchType,
  DataPermitFieldComment as DataPermitFieldCommentType,
  // 类型
  DataPermitType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathDataPermit() {
  return "/base/data_permit";
}

export function getTableNameDataPermit() {
  return "base_data_permit";
}

declare const dataPermitId: unique symbol;

declare global {
  
  /** 数据权限 */
  type DataPermitId = Distinct<string, typeof dataPermitId>;
  
  /** 数据权限 */
  interface DataPermitSearch extends DataPermitSearchType {
    /** 类型 */
    type?: DataPermitType[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface DataPermitModel extends DataPermitModelType {
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
  }

  interface DataPermitInput extends DataPermitInputType {
    /** 系统字段 */
    is_sys?: number | null;
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

  interface DataPermitFieldComment extends DataPermitFieldCommentType {
  }
  
}

/** 数据权限 前端允许排序的字段 */
export const canSortInApiDataPermit = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 数据权限 检测字段是否允许前端排序 */
export function checkSortDataPermit(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDataPermit: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDataPermit;
    if (!canSortInApiDataPermit[prop]) {
      throw new Error(`checkSortDataPermit: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDataPermit(
  input?: DataPermitInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
