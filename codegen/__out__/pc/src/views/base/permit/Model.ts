import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
  PermitFieldComment as PermitFieldCommentType,
} from "#/types";

declare global {
  
  interface PermitModel extends PermitModelType {
  }

  interface PermitInput extends PermitInputType {
  }

  interface PermitSearch extends PermitSearchType {
  }

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
];

export const permitQueryField = `
  ${ permitFields.join(" ") }
`;
