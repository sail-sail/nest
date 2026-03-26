import type {
  ServerLogInput as ServerLogInputType,
  ServerLogModel as ServerLogModelType,
  ServerLogSearch as ServerLogSearchType,
  ServerLogFieldComment as ServerLogFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export function getPagePathServerLog() {
  return "/base/server_log";
}

export function getTableNameServerLog() {
  return "base_server_log";
}

declare const serverLogId: unique symbol;

declare global {
  
  /** 系统日志 */
  type ServerLogId = Distinct<string, typeof serverLogId>;
  
  /** 系统日志 */
  interface ServerLogSearch extends ServerLogSearchType {
    /** 日志时间 */
    log_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface ServerLogModel extends ServerLogModelType {
  }

  interface ServerLogInput extends ServerLogInputType {
  }

  interface ServerLogFieldComment extends ServerLogFieldCommentType {
  }
  
}

/** 系统日志 前端允许排序的字段 */
export const canSortInApiServerLog = {
  // 日志时间
  "log_time": true,
};

/** 系统日志 检测字段是否允许前端排序 */
export function checkSortServerLog(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortServerLog: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiServerLog;
    if (!canSortInApiServerLog[prop]) {
      throw new Error(`checkSortServerLog: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputServerLog(
  input?: ServerLogInput,
) {
  
  if (!input) {
    return;
  }
}
