import type {
  BackgroundTaskInput as BackgroundTaskInputType,
  BackgroundTaskModel as BackgroundTaskModelType,
  BackgroundTaskSearch as BackgroundTaskSearchType,
  BackgroundTaskFieldComment as BackgroundTaskFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/background_task";

declare const backgroundTaskId: unique symbol;

declare global {
  
  /** 后台任务 */
  type BackgroundTaskId = Distinct<string, typeof backgroundTaskId>;
  
  /** 后台任务 */
  interface BackgroundTaskSearch extends BackgroundTaskSearchType {
    /** 执行结果 */
    result?: string;
    result_like?: string;
    /** 错误信息 */
    err_msg?: string;
    err_msg_like?: string;
    /** 结束时间 */
    end_time?: [(string|undefined|null), (string|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface BackgroundTaskModel extends BackgroundTaskModelType {
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

  interface BackgroundTaskInput extends BackgroundTaskInputType {
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

  interface BackgroundTaskFieldComment extends BackgroundTaskFieldCommentType {
  }
  
}

/** 后台任务 前端允许排序的字段 */
export const canSortInApiBackgroundTask = {
  // 开始时间
  "begin_time": true,
  // 结束时间
  "end_time": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 后台任务 检测字段是否允许前端排序 */
export function checkSortBackgroundTask(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortBackgroundTask: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiBackgroundTask;
    if (!canSortInApiBackgroundTask[prop]) {
      throw new Error(`checkSortBackgroundTask: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputBackgroundTask(
  input?: BackgroundTaskInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
