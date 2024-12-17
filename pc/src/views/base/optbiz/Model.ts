/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  OptbizInput as OptbizInputType,
  OptbizModel as OptbizModelType,
  OptbizSearch as OptbizSearchType,
  OptbizFieldComment as OptbizFieldCommentType,
} from "#/types";

declare global {
  
  interface OptbizModel extends OptbizModelType {
  }

  interface OptbizInput extends OptbizInputType {
    /** 系统字段 */
    is_sys?: number;
  }

  interface OptbizSearch extends OptbizSearchType {
  }

  interface OptbizFieldComment extends OptbizFieldCommentType {
  }
  
}

export const optbizFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 键
  "ky",
  // 值
  "val",
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
  "version",
  "is_deleted",
  "is_sys",
];

export const optbizQueryField = `
  ${ optbizFields.join(" ") }
`;
