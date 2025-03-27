/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
  OptionsFieldComment as OptionsFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 系统选项 */
  interface OptionsModel extends OptionsModelType {
  }
  
  /** 系统选项 */
  interface OptionsInput extends OptionsInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 系统选项 */
  interface OptionsSearch extends OptionsSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 系统选项 */
  interface OptionsFieldComment extends OptionsFieldCommentType {
  }
  
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
  "is_sys",
];

export const optionsQueryField = `
  ${ optionsFields.join(" ") }
`;
