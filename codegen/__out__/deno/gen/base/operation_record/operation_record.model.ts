import type {
  OperationRecordInput as OperationRecordInputType,
  OperationRecordModel as OperationRecordModelType,
  OperationRecordSearch as OperationRecordSearchType,
  OperationRecordFieldComment as OperationRecordFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/operation_record";

declare const operationRecordId: unique symbol;

declare global {
  
  /** 操作记录 */
  type OperationRecordId = Distinct<string, typeof operationRecordId>;
  
  /** 操作记录 */
  interface OperationRecordSearch extends OperationRecordSearchType {
    /** 模块 */
    module?: string;
    module_like?: string;
    /** 方法 */
    method?: string;
    method_like?: string;
    /** 耗时(毫秒) */
    time?: [(number|undefined|null), (number|undefined|null)];
    /** 操作前数据 */
    old_data?: string;
    old_data_like?: string;
    /** 操作后数据 */
    new_data?: string;
    new_data_like?: string;
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

  interface OperationRecordModel extends OperationRecordModelType {
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

  interface OperationRecordInput extends OperationRecordInputType {
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

  interface OperationRecordFieldComment extends OperationRecordFieldCommentType {
  }
  
}

/** 操作记录 前端允许排序的字段 */
export const canSortInApiOperationRecord = {
  // 操作时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 操作记录 检测字段是否允许前端排序 */
export function checkSortOperationRecord(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortOperationRecord: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiOperationRecord;
    if (!canSortInApiOperationRecord[prop]) {
      throw new Error(`checkSortOperationRecord: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputOperationRecord(
  input?: OperationRecordInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
