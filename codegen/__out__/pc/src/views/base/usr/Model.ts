import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
  UsrFieldComment as UsrFieldCommentType,
} from "#/types";

export interface UsrModel extends UsrModelType {
  /** 头像 */
  img_lbl: string;
}

export interface UsrInput extends UsrInputType {
}

export interface UsrSearch extends UsrSearchType {
}

export interface UsrFieldComment extends UsrFieldCommentType {
}

export const usrFields = [
  // ID
  "id",
  // 头像
  "img",
  // 名称
  "lbl",
  // 用户名
  "username",
  // 所属组织
  "org_ids",
  "org_ids_lbl",
  // 默认组织
  "default_org_id",
  "default_org_id_lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 所属部门
  "dept_ids",
  "dept_ids_lbl",
  // 拥有角色
  "role_ids",
  "role_ids_lbl",
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
