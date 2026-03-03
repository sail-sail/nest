/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  ServerLogInput as ServerLogInputType,
  ServerLogModel as ServerLogModelType,
  ServerLogSearch as ServerLogSearchType,
  ServerLogFieldComment as ServerLogFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 系统日志 */
  interface ServerLogModel extends ServerLogModelType {
  }
  
  /** 系统日志 */
  interface ServerLogInput extends ServerLogInputType {
  }
  
  /** 系统日志 */
  interface ServerLogSearch extends ServerLogSearchType {
  }
  
  /** 系统日志 */
  interface ServerLogFieldComment extends ServerLogFieldCommentType {
  }
  
}

export const serverLogFields = [
  // ID
  "id",
  // 日志日期
  "log_date",
  "log_date_lbl",
  // 日志时间
  "log_time",
  "log_time_lbl",
  // 日志级别
  "level",
  "level_lbl",
  // 模块
  "module",
  // 请求ID
  "req_id",
  // 日志内容
  "content",
];

export const serverLogQueryField = `
  ${ serverLogFields.join(" ") }
`;
