import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
} from "#/types";

export interface DictModel extends DictModelType {
}

export interface DictInput extends DictInputType {
}

export interface DictSearch extends DictSearchType {
}

export interface DictFieldComment extends DictFieldCommentType {
}

export const dictFields = [
  // ID
  "id",
  // 编码
  "code",
  // 名称
  "lbl",
  // 数据类型
  "type",
  "type_lbl",
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
  dict_detail {
    // ID
    "id",
    // 名称
    "lbl",
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
  }
];
