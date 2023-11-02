import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  TenantInput as TenantInputType,
  TenantModel as TenantModelType,
  TenantSearch as TenantSearchType,
} from "/gen/types.ts";

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
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface TenantFieldComment {
  id: string;
  lbl: string;
  domain_ids: string;
  domain_ids_lbl: string;
  menu_ids: string;
  menu_ids_lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
  is_deleted: string;
  is_deleted_lbl: string;
}
