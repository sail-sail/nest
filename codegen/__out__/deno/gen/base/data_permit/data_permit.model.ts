import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DataPermitInput as DataPermitInputType,
  DataPermitModel as DataPermitModelType,
  DataPermitSearch as DataPermitSearchType,
} from "/gen/types.ts";

export interface DataPermitSearch extends DataPermitSearchType {
  $extra?: SearchExtra[];
}

export interface DataPermitModel extends DataPermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DataPermitInput extends DataPermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}

export interface DataPermitFieldComment {
  id: string;
  menu_id: string;
  menu_id_lbl: string;
  lbl: string;
  scope: string;
  scope_lbl: string;
  type: string;
  type_lbl: string;
  rem: string;
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
