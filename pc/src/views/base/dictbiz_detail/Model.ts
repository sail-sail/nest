import type {
  DictbizDetailInput as DictbizDetailInputType,
  DictbizDetailModel as DictbizDetailModelType,
  DictbizDetailSearch as DictbizDetailSearchType,
  DictbizDetailFieldComment as DictbizDetailFieldCommentType,
} from "#/types";

export interface DictbizDetailModel extends DictbizDetailModelType {
}

export interface DictbizDetailInput extends DictbizDetailInputType {
}

export interface DictbizDetailSearch extends DictbizDetailSearchType {
}

export interface DictbizDetailFieldComment extends DictbizDetailFieldCommentType {
}

export const dictbizDetailFields = [
  // ID
  "id",
  // 业务字典
  "dictbiz_id",
  "dictbiz_id_lbl",
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
  "is_deleted",
];

export const dictbizDetailQueryField = `
  ${ dictbizDetailFields.join(" ") }
`;
