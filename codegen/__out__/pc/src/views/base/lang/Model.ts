/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
  LangFieldComment as LangFieldCommentType,
} from "#/types";

declare global {
  
  interface LangModel extends LangModelType {
  }

  interface LangInput extends LangInputType {
    /** 系统字段 */
    is_sys?: number;
  }

  interface LangSearch extends LangSearchType {
  }

  interface LangFieldComment extends LangFieldCommentType {
  }
  
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
  "is_sys",
];

export const langQueryField = `
  ${ langFields.join(" ") }
`;
