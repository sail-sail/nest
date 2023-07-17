import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DictbizInput as DictbizInputType,
  type DictbizModel as DictbizModelType,
  type DictbizSearch as DictbizSearchType,
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
  tenant_id?: string | null;
}

export interface DictbizInput extends DictbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
