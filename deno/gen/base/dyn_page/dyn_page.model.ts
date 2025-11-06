import type {
  DynPageInput as DynPageInputType,
  DynPageModel as DynPageModelType,
  DynPageSearch as DynPageSearchType,
  DynPageFieldComment as DynPageFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  intoInputDynPageField,
} from "/gen/base/dyn_page_field/dyn_page_field.model.ts";

export const route_path = "/base/dyn_page";

declare const dynPageId: unique symbol;

declare global {
  
  /** 动态页面 */
  type DynPageId = Distinct<string, typeof dynPageId>;
  
  /** 动态页面 */
  interface DynPageSearch extends DynPageSearchType {
    /** 编码-序列号 */
    code_seq?: [(number|undefined|null), (number|undefined|null)];
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface DynPageModel extends DynPageModelType {
    /** 编码-序列号 */
    code_seq: number;
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

  interface DynPageInput extends DynPageInputType {
    /** 编码-序列号 */
    code_seq?: number | null;
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

  interface DynPageFieldComment extends DynPageFieldCommentType {
  }
  
}

/** 动态页面 前端允许排序的字段 */
export const canSortInApiDynPage = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 动态页面 检测字段是否允许前端排序 */
export function checkSortDynPage(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDynPage: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDynPage;
    if (!canSortInApiDynPage[prop]) {
      throw new Error(`checkSortDynPage: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDynPage(
  input?: DynPageInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
  
  // 动态页面字段
  input?.dyn_page_field?.map(intoInputDynPageField);
}
