import type {
  DataPermitInput as DataPermitInputType,
  DataPermitModel as DataPermitModelType,
  DataPermitSearch as DataPermitSearchType,
  DataPermitFieldComment as DataPermitFieldCommentType,
} from "#/types";

declare global {
  
  interface DataPermitModel extends DataPermitModelType {
  }

  interface DataPermitInput extends DataPermitInputType {
  }

  interface DataPermitSearch extends DataPermitSearchType {
  }

  interface DataPermitFieldComment extends DataPermitFieldCommentType {
  }
  
}

export const dataPermitFields = [
  // ID
  "id",
  // 菜单
  "menu_id",
  "menu_id_lbl",
  // 范围
  "scope",
  "scope_lbl",
  // 类型
  "type",
  "type_lbl",
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

export const dataPermitQueryField = `
  ${ dataPermitFields.join(" ") }
`;
