import type {
  IconInput as IconInputType,
  IconModel as IconModelType,
  IconSearch as IconSearchType,
  IconFieldComment as IconFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/icon";

declare const iconId: unique symbol;

declare global {
  
  /** 图标库 */
  type IconId = Distinct<string, typeof iconId>;
  
  /** 图标库 */
  interface IconSearch extends IconSearchType {
    /** 图标 */
    img?: string;
    img_like?: string;
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface IconModel extends IconModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface IconInput extends IconInputType {
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

  interface IconFieldComment extends IconFieldCommentType {
  }
  
}

/** 图标库 前端允许排序的字段 */
export const canSortInApiIcon = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 图标库 检测字段是否允许前端排序 */
export function checkSortIcon(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortIcon: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiIcon;
    if (!canSortInApiIcon[prop]) {
      throw new Error(`checkSortIcon: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputIcon(
  input?: IconInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
