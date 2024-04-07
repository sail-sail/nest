import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
  OptionsFieldComment as OptionsFieldCommentType,
} from "#/types";

export interface OptionsModel extends OptionsModelType {
}

export interface OptionsInput extends OptionsInputType {
}

export interface OptionsSearch extends OptionsSearchType {
}

export interface OptionsFieldComment extends OptionsFieldCommentType {
}

export const optionsFields = [
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
