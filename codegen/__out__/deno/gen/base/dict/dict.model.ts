import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
} from "/gen/types.ts";

export interface DictSearch extends DictSearchType {
  $extra?: SearchExtra[];
}

export interface DictModel extends DictModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DictInput extends DictInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface DictFieldComment {
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
  update_time: string;
  update_time_lbl: string;
}
