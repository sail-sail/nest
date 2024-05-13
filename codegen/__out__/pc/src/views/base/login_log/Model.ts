import type {
  LoginLogInput as LoginLogInputType,
  LoginLogModel as LoginLogModelType,
  LoginLogSearch as LoginLogSearchType,
  LoginLogFieldComment as LoginLogFieldCommentType,
} from "#/types";

declare global {
  
  interface LoginLogModel extends LoginLogModelType {
  }

  interface LoginLogInput extends LoginLogInputType {
  }

  interface LoginLogSearch extends LoginLogSearchType {
  }

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
