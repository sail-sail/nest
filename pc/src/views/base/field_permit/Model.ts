/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  FieldPermitInput as FieldPermitInputType,
  FieldPermitModel as FieldPermitModelType,
  FieldPermitSearch as FieldPermitSearchType,
  FieldPermitFieldComment as FieldPermitFieldCommentType,
} from "#/types";

declare global {
  
  interface FieldPermitModel extends FieldPermitModelType {
  }

  interface FieldPermitInput extends FieldPermitInputType {
    /** 系统字段 */
    is_sys?: number;
  }

  interface FieldPermitSearch extends FieldPermitSearchType {
  }

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
