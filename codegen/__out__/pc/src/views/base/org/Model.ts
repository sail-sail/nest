import type {
  OrgInput as OrgInputType,
  OrgModel as OrgModelType,
  OrgSearch as OrgSearchType,
  OrgFieldComment as OrgFieldCommentType,
} from "#/types";

export interface OrgModel extends OrgModelType {
}

export interface OrgInput extends OrgInputType {
}

export interface OrgSearch extends OrgSearchType {
}

export interface OrgFieldComment extends OrgFieldCommentType {
}

export const orgFields = [
  // ID
  "id",
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
