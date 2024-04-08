import type {
  JobInput as JobInputType,
  JobModel as JobModelType,
  JobSearch as JobSearchType,
  JobFieldComment as JobFieldCommentType,
} from "#/types";

export interface JobModel extends JobModelType {
}

export interface JobInput extends JobInputType {
}

export interface JobSearch extends JobSearchType {
}

export interface JobFieldComment extends JobFieldCommentType {
}

export const jobFields = [
  // ID
  "id",
  // 编码
  "code",
  // 名称
  "lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const jobQueryField = `
  ${ jobFields.join(" ") }
`;
