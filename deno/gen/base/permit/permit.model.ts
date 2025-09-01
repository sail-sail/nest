import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
  PermitFieldComment as PermitFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/permit";

declare const permitId: unique symbol;

declare global {
  
  /** 按钮权限 */
  type PermitId = Distinct<string, typeof permitId>;
  
  /** 按钮权限 */
  interface PermitSearch extends PermitSearchType {
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
  }

  interface PermitModel extends PermitModelType {
    /** 系统字段 */
    is_sys: number;
  }

  interface PermitInput extends PermitInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }

  interface PermitFieldComment extends PermitFieldCommentType {
  }
  
}

/** 按钮权限 前端允许排序的字段 */
export const canSortInApiPermit = {
  // 排序
  "order_by": true,
};

/** 按钮权限 检测字段是否允许前端排序 */
export function checkSortPermit(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortPermit: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiPermit;
    if (!canSortInApiPermit[prop]) {
      throw new Error(`checkSortPermit: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputPermit(
  input?: PermitInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
