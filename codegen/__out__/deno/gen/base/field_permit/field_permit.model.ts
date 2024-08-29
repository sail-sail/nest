import type {
  FieldPermitInput as FieldPermitInputType,
  FieldPermitModel as FieldPermitModelType,
  FieldPermitSearch as FieldPermitSearchType,
  FieldPermitFieldComment as FieldPermitFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/field_permit";

declare const fieldPermitId: unique symbol;

declare global {
  
  type FieldPermitId = Distinct<string, typeof fieldPermitId>;

  interface FieldPermitSearch extends FieldPermitSearchType {
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface FieldPermitModel extends FieldPermitModelType {
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

  interface FieldPermitInput extends FieldPermitInputType {
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
  }

  interface FieldPermitFieldComment extends FieldPermitFieldCommentType {
  }
  
}

/** 字段权限 前端允许排序的字段 */
export const canSortInApiFieldPermit = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 字段权限 检测字段是否允许前端排序 */
export function checkSortFieldPermit(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortFieldPermit: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiFieldPermit;
    if (!canSortInApiFieldPermit[prop]) {
      throw new Error(`checkSortFieldPermit: ${ JSON.stringify(item) }`);
    }
  }
}
