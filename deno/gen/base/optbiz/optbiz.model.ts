import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OptbizInput as OptbizInputType,
  OptbizModel as OptbizModelType,
  OptbizSearch as OptbizSearchType,
} from "/gen/types.ts";

export interface OptbizSearch extends OptbizSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OptbizModel extends OptbizModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface OptbizInput extends OptbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface OptbizFieldComment {
  id: string;
  lbl: string;
  ky: string;
  val: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
  version: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
