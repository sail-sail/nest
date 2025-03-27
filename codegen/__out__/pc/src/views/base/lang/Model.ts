/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
  LangFieldComment as LangFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 语言 */
  interface LangModel extends LangModelType {
  }
  
  /** 语言 */
  interface LangInput extends LangInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 语言 */
  interface LangSearch extends LangSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 语言 */
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
