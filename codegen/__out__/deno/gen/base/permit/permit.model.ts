import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
} from "/gen/types.ts";

export interface PermitSearch extends PermitSearchType {
  $extra?: SearchExtra[];
}

export interface PermitModel extends PermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface PermitInput extends PermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface PermitFieldComment {
  id: string;
  menu_id: string;
  menu_id_lbl: string;
  code: string;
  lbl: string;
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
