import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  FieldPermitInput as FieldPermitInputType,
  FieldPermitModel as FieldPermitModelType,
  FieldPermitSearch as FieldPermitSearchType,
} from "/gen/types.ts";

export interface FieldPermitSearch extends FieldPermitSearchType {
  $extra?: SearchExtra[];
}

export interface FieldPermitModel extends FieldPermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface FieldPermitInput extends FieldPermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}

export interface FieldPermitFieldComment {
  id: string;
  menu_id: string;
  menu_id_lbl: string;
  code: string;
  lbl: string;
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
