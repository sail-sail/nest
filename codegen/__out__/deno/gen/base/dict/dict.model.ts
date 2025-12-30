import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
  // 数据类型
  DictType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

import {
  intoInputDictDetail,
} from "/gen/base/dict_detail/dict_detail.model.ts";

export function getPagePathDict() {
  return "/base/dict";
}

export function getTableNameDict() {
  return "base_dict";
}

declare const dictId: unique symbol;

declare global {
  
  /** 系统字典 */
  type DictId = Distinct<string, typeof dictId>;
  
  /** 系统字典 */
  interface DictSearch extends DictSearchType {
    /** 数据类型 */
    type?: DictType[];
    /** 可新增 */
    is_add?: number;
    is_add_like?: number;
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface DictModel extends DictModelType {
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

  interface DictInput extends DictInputType {
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

  interface DictFieldComment extends DictFieldCommentType {
  }
  
}

/** 系统字典 前端允许排序的字段 */
export const canSortInApiDict = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 系统字典 检测字段是否允许前端排序 */
export function checkSortDict(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDict: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDict;
    if (!canSortInApiDict[prop]) {
      throw new Error(`checkSortDict: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDict(
  input?: DictInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
  
  // 系统字典明细
  input?.dict_detail?.map(intoInputDictDetail);
}
