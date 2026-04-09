/* oxlint-disable @typescript-eslint/no-empty-object-type */
import type {
  TenantInput as TenantInputType,
  TenantModel as TenantModelType,
  TenantSearch as TenantSearchType,
  TenantFieldComment as TenantFieldCommentType,
} from "#/types.ts";

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
