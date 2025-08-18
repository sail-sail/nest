import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
  OptionsFieldComment as OptionsFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/options";

declare const optionsId: unique symbol;

declare global {
  
  /** 系统选项 */
  type OptionsId = Distinct<string, typeof optionsId>;
  
  /** 系统选项 */
  interface OptionsSearch extends OptionsSearchType {
    /** 键 */
    ky?: string;
    ky_like?: string;
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
  }

  interface OptionsModel extends OptionsModelType {
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

  interface OptionsInput extends OptionsInputType {
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

  interface OptionsFieldComment extends OptionsFieldCommentType {
  }
  
}

/** 系统选项 前端允许排序的字段 */
export const canSortInApiOptions = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 系统选项 检测字段是否允许前端排序 */
export function checkSortOptions(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortOptions: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiOptions;
    if (!canSortInApiOptions[prop]) {
      throw new Error(`checkSortOptions: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputOptions(
  input?: OptionsInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
