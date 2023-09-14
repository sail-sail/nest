import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
} from "/gen/types.ts";

export interface OptionsSearch extends OptionsSearchType {
  $extra?: SearchExtra[];
}

export interface OptionsModel extends OptionsModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface OptionsInput extends OptionsInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}

export interface OptionsFieldComment {
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
  is_sys: string;
  is_sys_lbl: string;
}
