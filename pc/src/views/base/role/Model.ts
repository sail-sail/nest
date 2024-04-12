import type {
  RoleInput as RoleInputType,
  RoleModel as RoleModelType,
  RoleSearch as RoleSearchType,
  RoleFieldComment as RoleFieldCommentType,
} from "#/types";

declare global {
  
  interface RoleModel extends RoleModelType {
  }

  interface RoleInput extends RoleInputType {
  }

  interface RoleSearch extends RoleSearchType {
  }

  interface RoleFieldComment extends RoleFieldCommentType {
  }
  
}

export const roleFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 首页
  "home_url",
  // 菜单权限
  "menu_ids",
  "menu_ids_lbl",
  // 按钮权限
  "permit_ids",
  "permit_ids_lbl",
  // 数据权限
  "data_permit_ids",
  "data_permit_ids_lbl",
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
  "is_deleted",
];

export const roleQueryField = `
  ${ roleFields.join(" ") }
`;
