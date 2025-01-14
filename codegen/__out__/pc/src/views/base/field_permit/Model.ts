/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldPermitInput as FieldPermitInputType,
  FieldPermitModel as FieldPermitModelType,
  FieldPermitSearch as FieldPermitSearchType,
  FieldPermitFieldComment as FieldPermitFieldCommentType,
} from "#/types";

declare global {
  
  /** 字段权限 */
  interface FieldPermitModel extends FieldPermitModelType {
  }
  
  /** 字段权限 */
  interface FieldPermitInput extends FieldPermitInputType {
    /** 系统字段 */
    is_sys?: number;
  }
  
  /** 字段权限 */
  interface FieldPermitSearch extends FieldPermitSearchType {
  }
  
  /** 字段权限 */
  interface FieldPermitFieldComment extends FieldPermitFieldCommentType {
  }
  
}

export const fieldPermitFields = [
  // ID
  "id",
  // 菜单
  "menu_id",
  "menu_id_lbl",
  // 编码
  "code",
  // 名称
  "lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  "is_sys",
];

export const fieldPermitQueryField = `
  ${ fieldPermitFields.join(" ") }
`;
