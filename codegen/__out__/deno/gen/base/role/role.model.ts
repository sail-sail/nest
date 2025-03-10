import type {
  RoleInput as RoleInputType,
  RoleModel as RoleModelType,
  RoleSearch as RoleSearchType,
  RoleFieldComment as RoleFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/role";

declare const roleId: unique symbol;

declare global {
  
  /** 角色 */
  type RoleId = Distinct<string, typeof roleId>;
  
  /** 角色 */
  interface RoleSearch extends RoleSearchType {
    /** 编码-序列号 */
    code_seq?: [(number|undefined|null), (number|undefined|null)];
    /** 首页 */
    home_url?: string;
    home_url_like?: string;
    /** 锁定 */
    is_locked?: number[];
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

  interface RoleModel extends RoleModelType {
    /** 编码-序列号 */
    code_seq: number;
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

  interface RoleInput extends RoleInputType {
    /** 编码-序列号 */
    code_seq?: number | null;
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

  interface RoleFieldComment extends RoleFieldCommentType {
  }
  
}

/** 角色 前端允许排序的字段 */
export const canSortInApiRole = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 角色 检测字段是否允许前端排序 */
export function checkSortRole(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortRole: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiRole;
    if (!canSortInApiRole[prop]) {
      throw new Error(`checkSortRole: ${ JSON.stringify(item) }`);
    }
  }
}
