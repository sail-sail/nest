/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  OptbizInput as OptbizInputType,
  OptbizModel as OptbizModelType,
  OptbizSearch as OptbizSearchType,
  OptbizFieldComment as OptbizFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 业务选项 */
  interface OptbizModel extends OptbizModelType {
  }
  
  /** 业务选项 */
  interface OptbizInput extends OptbizInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 业务选项 */
  interface OptbizSearch extends OptbizSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 业务选项 */
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
