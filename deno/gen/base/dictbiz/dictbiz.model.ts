import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictbizInput as DictbizInputType,
  DictbizModel as DictbizModelType,
  DictbizSearch as DictbizSearchType,
} from "/gen/types.ts";

export interface DictbizSearch extends DictbizSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DictbizModel extends DictbizModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DictbizInput extends DictbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface DictbizFieldComment {
  id: string;
  code: string;
  lbl: string;
  type: string;
  type_lbl: string;
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
  tenant_id: string;
  tenant_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
  is_deleted: string;
  is_deleted_lbl: string;
}
