/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  OrgInput as OrgInputType,
  OrgModel as OrgModelType,
  OrgSearch as OrgSearchType,
  OrgFieldComment as OrgFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 组织 */
  interface OrgModel extends OrgModelType {
  }
  
  /** 组织 */
  interface OrgInput extends OrgInputType {
  }
  
  /** 组织 */
  interface OrgSearch extends OrgSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 组织 */
  interface OrgFieldComment extends OrgFieldCommentType {
  }
  
}

export const orgFields = [
  // ID
  "id",
  // 名称
  "lbl",
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

export const orgQueryField = `
  ${ orgFields.join(" ") }
`;
