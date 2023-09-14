import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictDetailInput as DictDetailInputType,
  DictDetailModel as DictDetailModelType,
  DictDetailSearch as DictDetailSearchType,
} from "/gen/types.ts";

export interface DictDetailSearch extends DictDetailSearchType {
  $extra?: SearchExtra[];
}

export interface DictDetailModel extends DictDetailModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DictDetailInput extends DictDetailInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}

export interface DictDetailFieldComment {
  id: string;
  dict_id: string;
  dict_id_lbl: string;
  lbl: string;
  val: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
  is_sys: string;
  is_sys_lbl: string;
}
