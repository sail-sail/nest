import type {
  TenantInput as TenantInputType,
  TenantModel as TenantModelType,
  TenantSearch as TenantSearchType,
  TenantFieldComment as TenantFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

declare const tenantId: unique symbol;

declare global {
  
  type TenantId = Distinct<string, typeof tenantId>;

  interface TenantSearch extends TenantSearchType {
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
  }

  interface TenantModel extends TenantModelType {
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

  interface TenantInput extends TenantInputType {
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

  interface TenantFieldComment extends TenantFieldCommentType {
  }
  
}

/** 租户 前端允许排序的字段 */
export const canSortInApiTenant = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 租户 检测字段是否允许前端排序 */
export function checkSortTenant(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortTenant: ${ JSON.stringify(item) }`);
    }
    const prop = item.prop as keyof typeof canSortInApiTenant;
    if (!canSortInApiTenant[prop]) {
      throw new Error(`checkSortTenant: ${ JSON.stringify(item) }`);
    }
  }
}
