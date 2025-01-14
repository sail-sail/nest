/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
  UsrFieldComment as UsrFieldCommentType,
} from "#/types";

declare global {
  
  /** 用户 */
  interface UsrModel extends UsrModelType {
    /** 头像 */
    img_lbl: string;
  }
  
  /** 用户 */
  interface UsrInput extends UsrInputType {
  }
  
  /** 用户 */
  interface UsrSearch extends UsrSearchType {
    is_deleted?: 0 | 1;
  }
  
  /** 用户 */
  interface UsrFieldComment extends UsrFieldCommentType {
  }
  
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
  // 所属角色
  "role_ids",
  "role_ids_lbl",
  // 所属部门
  "dept_ids",
  "dept_ids_lbl",
  // 所属组织
  "org_ids",
  "org_ids_lbl",
  // 默认组织
  "default_org_id",
  "default_org_id_lbl",
  // 类型
  "type",
  "type_lbl",
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

export const usrQueryField = `
  ${ usrFields.join(" ") }
`;
