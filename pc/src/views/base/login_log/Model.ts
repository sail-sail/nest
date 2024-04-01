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
