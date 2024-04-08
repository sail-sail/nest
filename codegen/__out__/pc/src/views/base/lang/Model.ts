import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
  LangFieldComment as LangFieldCommentType,
} from "#/types";

export interface LangModel extends LangModelType {
}

export interface LangInput extends LangInputType {
}

export interface LangSearch extends LangSearchType {
}

export interface LangFieldComment extends LangFieldCommentType {
}

export const langFields = [
  // ID
  "id",
  // 编码
  "code",
  // 名称
  "lbl",
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

export const langQueryField = `
  ${ langFields.join(" ") }
`;
