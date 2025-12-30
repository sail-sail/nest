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

export function getPagePathFieldPermit() {
  return "/base/field_permit";
}

export function getTableNameFieldPermit() {
  return "base_field_permit";
}

declare const fieldPermitId: unique symbol;

declare global {
  
  /** 字段权限 */
  type FieldPermitId = Distinct<string, typeof fieldPermitId>;
  
  /** 字段权限 */
  interface FieldPermitSearch extends FieldPermitSearchType {
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
  }

  interface FieldPermitModel extends FieldPermitModelType {
    /** 系统字段 */
    is_sys: number;
  }

  interface FieldPermitInput extends FieldPermitInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }

  interface FieldPermitFieldComment extends FieldPermitFieldCommentType {
  }
  
}

/** 字段权限 前端允许排序的字段 */
export const canSortInApiFieldPermit = {
  // 排序
  "order_by": true,
};

/** 字段权限 检测字段是否允许前端排序 */
export function checkSortFieldPermit(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
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

export function intoInputFieldPermit(
  input?: FieldPermitInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
