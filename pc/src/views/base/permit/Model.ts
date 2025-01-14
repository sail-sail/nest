/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
  PermitFieldComment as PermitFieldCommentType,
} from "#/types";

declare global {
  
  /** 按钮权限 */
  interface PermitModel extends PermitModelType {
  }
  
  /** 按钮权限 */
  interface PermitInput extends PermitInputType {
    /** 系统字段 */
    is_sys?: number;
  }
  
  /** 按钮权限 */
  interface PermitSearch extends PermitSearchType {
  }
  
  /** 按钮权限 */
  interface PermitFieldComment extends PermitFieldCommentType {
  }
  
}

export const permitFields = [
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

export const permitQueryField = `
  ${ permitFields.join(" ") }
`;
