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

export const permitQueryField = `
  ${ permitFields.join(" ") }
`;
