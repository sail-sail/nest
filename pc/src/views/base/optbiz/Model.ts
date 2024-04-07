import type {
  OptbizInput as OptbizInputType,
  OptbizModel as OptbizModelType,
  OptbizSearch as OptbizSearchType,
  OptbizFieldComment as OptbizFieldCommentType,
} from "#/types";

export interface OptbizModel extends OptbizModelType {
}

export interface OptbizInput extends OptbizInputType {
}

export interface OptbizSearch extends OptbizSearchType {
}

export interface OptbizFieldComment extends OptbizFieldCommentType {
}

export const optbizFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 键
  "ky",
  // 值
  "val",
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
  "version",
  "is_deleted",
];
