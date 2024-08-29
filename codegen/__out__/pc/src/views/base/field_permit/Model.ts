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

export const fieldPermitQueryField = `
  ${ fieldPermitFields.join(" ") }
`;
