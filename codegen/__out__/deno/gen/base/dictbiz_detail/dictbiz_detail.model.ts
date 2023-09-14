import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictbizDetailInput as DictbizDetailInputType,
  DictbizDetailModel as DictbizDetailModelType,
  DictbizDetailSearch as DictbizDetailSearchType,
} from "/gen/types.ts";

export interface DictbizDetailSearch extends DictbizDetailSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DictbizDetailModel extends DictbizDetailModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface DictbizDetailInput extends DictbizDetailInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface DictbizDetailFieldComment {
  id: string;
  dictbiz_id: string;
  dictbiz_id_lbl: string;
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
