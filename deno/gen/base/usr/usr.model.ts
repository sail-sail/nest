import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
  UsrFieldComment as UsrFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/usr";

declare const usrId: unique symbol;

declare global {
  
  type UsrId = Distinct<string, typeof usrId>;

  interface UsrSearch extends UsrSearchType {
    /** 头像 */
    img?: string;
    img_like?: string;
    /** 类型 */
    type?: string[];
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
    is_hidden?: (0|1)[];
  }

  interface UsrModel extends UsrModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
    is_hidden: 0|1;
  }

  interface UsrInput extends UsrInputType {
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
    is_hidden?: 0|1|null;
  }

  interface UsrFieldComment extends UsrFieldCommentType {
  }
  
}

/** 用户 前端允许排序的字段 */
export const canSortInApiUsr = {
  // 用户名
  "username": true,
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 用户 检测字段是否允许前端排序 */
export function checkSortUsr(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortUsr: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiUsr;
    if (!canSortInApiUsr[prop]) {
      throw new Error(`checkSortUsr: ${ JSON.stringify(item) }`);
    }
  }
}
