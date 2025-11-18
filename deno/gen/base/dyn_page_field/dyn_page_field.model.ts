import type {
  DynPageFieldInput as DynPageFieldInputType,
  DynPageFieldModel as DynPageFieldModelType,
  DynPageFieldSearch as DynPageFieldSearchType,
  DynPageFieldFieldComment as DynPageFieldFieldCommentType,
  // 对齐方式
  DynPageFieldAlign,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/dyn_page_field";

declare const dynPageFieldId: unique symbol;

declare global {
  
  /** 动态页面字段 */
  type DynPageFieldId = Distinct<string, typeof dynPageFieldId>;
  
  /** 动态页面字段 */
  interface DynPageFieldSearch extends DynPageFieldSearchType {
    /** 编码-序列号 */
    code_seq?: [(number|undefined|null), (number|undefined|null)];
    /** 类型 */
    type?: string;
    type_like?: string;
    /** 属性 */
    attrs?: string;
    attrs_like?: string;
    /** 计算公式 */
    formula?: string;
    formula_like?: string;
    /** 必填 */
    is_required?: number[];
    /** 查询条件 */
    is_search?: number[];
    /** 宽度 */
    width?: [(number|undefined|null), (number|undefined|null)];
    /** 对齐方式 */
    align?: DynPageFieldAlign[];
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 创建人 */
    create_usr_id?: UsrId[];
    /** 创建人 */
    create_usr_id_is_null?: boolean;
    /** 创建人 */
    create_usr_id_lbl?: string[];
    /** 创建人 */
    create_usr_id_lbl_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新人 */
    update_usr_id?: UsrId[];
    /** 更新人 */
    update_usr_id_is_null?: boolean;
    /** 更新人 */
    update_usr_id_lbl?: string[];
    /** 更新人 */
    update_usr_id_lbl_like?: string;
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface DynPageFieldModel extends DynPageFieldModelType {
    /** 编码-序列号 */
    code_seq: number;
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

  interface DynPageFieldInput extends DynPageFieldInputType {
    /** 编码-序列号 */
    code_seq?: number | null;
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

  interface DynPageFieldFieldComment extends DynPageFieldFieldCommentType {
  }
  
}

/** 动态页面字段 前端允许排序的字段 */
export const canSortInApiDynPageField = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 动态页面字段 检测字段是否允许前端排序 */
export function checkSortDynPageField(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDynPageField: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDynPageField;
    if (!canSortInApiDynPageField[prop]) {
      throw new Error(`checkSortDynPageField: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDynPageField(
  input?: DynPageFieldInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
