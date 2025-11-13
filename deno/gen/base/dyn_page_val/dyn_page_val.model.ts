import type {
  DynPageValInput as DynPageValInputType,
  DynPageValModel as DynPageValModelType,
  DynPageValSearch as DynPageValSearchType,
  DynPageValFieldComment as DynPageValFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/dyn_page_val";

declare const dynPageValId: unique symbol;

declare global {
  
  /** 动态页面值 */
  type DynPageValId = Distinct<string, typeof dynPageValId>;
  
  /** 动态页面值 */
  interface DynPageValSearch extends DynPageValSearchType {
    /** 关联页面路由 */
    ref_code?: string;
    ref_code_like?: string;
    tenant_id?: TenantId | null;
  }

  interface DynPageValModel extends DynPageValModelType {
    tenant_id: TenantId;
  }

  interface DynPageValInput extends DynPageValInputType {
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface DynPageValFieldComment extends DynPageValFieldCommentType {
  }
  
}

/** 动态页面值 前端允许排序的字段 */
export const canSortInApiDynPageVal = {
};

/** 动态页面值 检测字段是否允许前端排序 */
export function checkSortDynPageVal(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDynPageVal: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDynPageVal;
    if (!canSortInApiDynPageVal[prop]) {
      throw new Error(`checkSortDynPageVal: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDynPageVal(
  input?: DynPageValInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
