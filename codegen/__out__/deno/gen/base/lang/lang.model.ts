import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
  LangFieldComment as LangFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathLang() {
  return "/base/lang";
}

export function getTableNameLang() {
  return "base_lang";
}

declare const langId: unique symbol;

declare global {
  
  /** 语言 */
  type LangId = Distinct<string, typeof langId>;
  
  /** 语言 */
  interface LangSearch extends LangSearchType {
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

  interface LangModel extends LangModelType {
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

  interface LangInput extends LangInputType {
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

  interface LangFieldComment extends LangFieldCommentType {
  }
  
}

/** 语言 前端允许排序的字段 */
export const canSortInApiLang = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 语言 检测字段是否允许前端排序 */
export function checkSortLang(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortLang: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiLang;
    if (!canSortInApiLang[prop]) {
      throw new Error(`checkSortLang: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputLang(
  input?: LangInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
