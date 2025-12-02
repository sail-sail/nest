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

export function getPagePathDynPageVal() {
  return "/base/dyn_page_val";
}

export function getTableNameDynPageVal() {
  return "base_dyn_page_val";
}

declare const dynPageValId: unique symbol;

declare global {
  
  /** 动态页面值 */
  type DynPageValId = Distinct<string, typeof dynPageValId>;
  
  /** 动态页面值 */
  interface DynPageValSearch extends DynPageValSearchType {
    /** 关联页面路由 */
    ref_code?: string;
    ref_code_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface DynPageValModel extends DynPageValModelType {
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

  interface DynPageValInput extends DynPageValInputType {
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

  interface DynPageValFieldComment extends DynPageValFieldCommentType {
  }
  
}

/** 动态页面值 前端允许排序的字段 */
export const canSortInApiDynPageVal = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
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
