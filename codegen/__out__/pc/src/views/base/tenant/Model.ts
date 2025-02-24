/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  TenantInput as TenantInputType,
  TenantModel as TenantModelType,
  TenantSearch as TenantSearchType,
  TenantFieldComment as TenantFieldCommentType,
} from "#/types";

declare global {
  
  /** 租户 */
  interface TenantModel extends TenantModelType {
  }
  
  /** 租户 */
  interface TenantInput extends TenantInputType {
    /** 系统字段 */
    is_sys?: number | null;
  }
  
  /** 租户 */
  interface TenantSearch extends TenantSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 租户 */
  interface TenantFieldComment extends TenantFieldCommentType {
  }
  
}

export const tenantFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 所属域名
  "domain_ids",
  "domain_ids_lbl",
  // 菜单权限
  "menu_ids",
  "menu_ids_lbl",
  // 标题
  "title",
  // 描述
  "desc",
  // 语言
  "lang_id",
  "lang_id_lbl",
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
  "is_sys",
];

export const tenantQueryField = `
  ${ tenantFields.join(" ") }
`;
