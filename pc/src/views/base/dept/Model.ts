/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DeptInput as DeptInputType,
  DeptModel as DeptModelType,
  DeptSearch as DeptSearchType,
  DeptFieldComment as DeptFieldCommentType,
} from "#/types";

declare global {
  
  interface DeptModel extends DeptModelType {
  }

  interface DeptInput extends DeptInputType {
  }

  interface DeptSearch extends DeptSearchType {
  }

  interface DeptFieldComment extends DeptFieldCommentType {
  }
  
}

export const deptFields = [
  // ID
  "id",
  // 父部门
  "parent_id",
  "parent_id_lbl",
  // 名称
  "lbl",
  // 部门负责人
  "usr_ids",
  "usr_ids_lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 组织
  "org_id",
  "org_id_lbl",
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

export const deptQueryField = `
  ${ deptFields.join(" ") }
`;
