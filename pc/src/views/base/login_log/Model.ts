import type {
  LoginLogInput as LoginLogInputType,
  LoginLogModel as LoginLogModelType,
  LoginLogSearch as LoginLogSearchType,
  LoginLogFieldComment as LoginLogFieldCommentType,
} from "#/types";

export interface LoginLogModel extends LoginLogModelType {
}

export interface LoginLogInput extends LoginLogInputType {
  create_time_lbl?: string;
}

export interface LoginLogSearch extends LoginLogSearchType {
}

export interface LoginLogFieldComment extends LoginLogFieldCommentType {
}

export const loginLogFields = [
  // ID
  "id",
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
