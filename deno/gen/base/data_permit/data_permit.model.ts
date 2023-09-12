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
