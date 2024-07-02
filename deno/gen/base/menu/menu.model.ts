import type {
  MenuInput as MenuInputType,
  MenuModel as MenuModelType,
  MenuSearch as MenuSearchType,
  MenuFieldComment as MenuFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/menu";

declare const menuId: unique symbol;

declare global {
  
  type MenuId = Distinct<string, typeof menuId>;

  interface MenuSearch extends MenuSearchType {
    /** 路由 */
    route_path?: string;
    route_path_like?: string;
    /** 参数 */
    route_query?: string;
    route_query_like?: string;
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

  interface MenuModel extends MenuModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface MenuInput extends MenuInputType {
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

  interface MenuFieldComment extends MenuFieldCommentType {
  }
  
}

/** 菜单 前端允许排序的字段 */
export const canSortInApiMenu = {
  // 父菜单
  "parent_id_lbl": true,
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 菜单 检测字段是否允许前端排序 */
export function checkSortMenu(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortMenu: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiMenu;
    if (!canSortInApiMenu[prop]) {
      throw new Error(`checkSortMenu: ${ JSON.stringify(item) }`);
    }
  }
}
