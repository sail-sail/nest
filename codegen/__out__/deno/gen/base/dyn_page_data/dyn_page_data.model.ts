import type {
  DynPageDataInput as DynPageDataInputType,
  DynPageDataModel as DynPageDataModelType,
  DynPageDataSearch as DynPageDataSearchType,
  DynPageDataFieldComment as DynPageDataFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/dyn_page_data";

declare const dynPageDataId: unique symbol;

declare global {
  
  /** 动态页面数据 */
  type DynPageDataId = Distinct<string, typeof dynPageDataId>;
  
  /** 动态页面数据 */
  interface DynPageDataSearch extends DynPageDataSearchType {
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface DynPageDataModel extends DynPageDataModelType {
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

  interface DynPageDataInput extends DynPageDataInputType {
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

  interface DynPageDataFieldComment extends DynPageDataFieldCommentType {
  }
  
}

/** 动态页面数据 前端允许排序的字段 */
export const canSortInApiDynPageData = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 动态页面数据 检测字段是否允许前端排序 */
export function checkSortDynPageData(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDynPageData: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDynPageData;
    if (!canSortInApiDynPageData[prop]) {
      throw new Error(`checkSortDynPageData: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDynPageData(
  input?: DynPageDataInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
