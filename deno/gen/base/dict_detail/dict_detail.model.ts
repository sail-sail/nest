import type {
  DictDetailInput as DictDetailInputType,
  DictDetailModel as DictDetailModelType,
  DictDetailSearch as DictDetailSearchType,
  DictDetailFieldComment as DictDetailFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathDictDetail() {
  return "/base/dict_detail";
}

export function getTableNameDictDetail() {
  return "base_dict_detail";
}

declare const dictDetailId: unique symbol;

declare global {
  
  /** 系统字典明细 */
  type DictDetailId = Distinct<string, typeof dictDetailId>;
  
  /** 系统字典明细 */
  interface DictDetailSearch extends DictDetailSearchType {
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

  interface DictDetailModel extends DictDetailModelType {
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

  interface DictDetailInput extends DictDetailInputType {
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

  interface DictDetailFieldComment extends DictDetailFieldCommentType {
  }
  
}

/** 系统字典明细 前端允许排序的字段 */
export const canSortInApiDictDetail = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 系统字典明细 检测字段是否允许前端排序 */
export function checkSortDictDetail(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDictDetail: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDictDetail;
    if (!canSortInApiDictDetail[prop]) {
      throw new Error(`checkSortDictDetail: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDictDetail(
  input?: DictDetailInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
