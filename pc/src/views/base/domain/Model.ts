/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DomainInput as DomainInputType,
  DomainModel as DomainModelType,
  DomainSearch as DomainSearchType,
  DomainFieldComment as DomainFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 域名 */
  interface DomainModel extends DomainModelType {
  }
  
  /** 域名 */
  interface DomainInput extends DomainInputType {
  }
  
  /** 域名 */
  interface DomainSearch extends DomainSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 域名 */
  interface DomainFieldComment extends DomainFieldCommentType {
  }
  
}

export const domainFields = [
  // ID
  "id",
  // 协议
  "protocol",
  // 名称
  "lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 默认
  "is_default",
  "is_default_lbl",
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

export const domainQueryField = `
  ${ domainFields.join(" ") }
`;
