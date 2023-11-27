import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  TenantInput as TenantInputType,
  TenantModel as TenantModelType,
  TenantSearch as TenantSearchType,
  TenantFieldComment as TenantFieldCommentType,
} from "/gen/types.ts";

export const tenantId = Symbol.for("TenantId");
export type TenantId = typeof tenantId;

export interface TenantSearch extends TenantSearchType {
  $extra?: SearchExtra[];
}

export interface TenantModel extends TenantModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface TenantInput extends TenantInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { TenantFieldCommentType as TenantFieldComment };
