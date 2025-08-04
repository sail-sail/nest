import type {
  I18nInput as I18nInputType,
  I18nModel as I18nModelType,
  I18nSearch as I18nSearchType,
  I18nFieldComment as I18nFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/i18n";

declare const i18nId: unique symbol;

declare global {
  
  /** 国际化 */
  type I18nId = Distinct<string, typeof i18nId>;
  
  /** 国际化 */
  interface I18nSearch extends I18nSearchType {
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface I18nModel extends I18nModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface I18nInput extends I18nInputType {
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

  interface I18nFieldComment extends I18nFieldCommentType {
  }
  
}

/** 国际化 前端允许排序的字段 */
export const canSortInApiI18n = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 国际化 检测字段是否允许前端排序 */
export function checkSortI18n(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortI18n: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiI18n;
    if (!canSortInApiI18n[prop]) {
      throw new Error(`checkSortI18n: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputI18n(
  input?: I18nInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
