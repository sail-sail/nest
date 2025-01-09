/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  LoginLogInput as LoginLogInputType,
  LoginLogModel as LoginLogModelType,
  LoginLogSearch as LoginLogSearchType,
  LoginLogFieldComment as LoginLogFieldCommentType,
} from "#/types";

declare global {
  
  /** 登录日志 */
  interface LoginLogModel extends LoginLogModelType {
  }
  
  /** 登录日志 */
  interface LoginLogInput extends LoginLogInputType {
  }
  
  /** 登录日志 */
  interface LoginLogSearch extends LoginLogSearchType {
    is_deleted?: 0 | 1;
  }
  
  /** 登录日志 */
  interface LoginLogFieldComment extends LoginLogFieldCommentType {
  }
  
}

export const loginLogFields = [
  // ID
  "id",
  // 类型
  "type",
  "type_lbl",
  // 用户名
  "username",
  // 登录成功
  "is_succ",
  "is_succ_lbl",
  // IP
  "ip",
  // 登录时间
  "create_time",
  "create_time_lbl",
  "is_deleted",
];

export const loginLogQueryField = `
  ${ loginLogFields.join(" ") }
`;
