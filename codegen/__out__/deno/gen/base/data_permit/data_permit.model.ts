import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DataPermitInput as DataPermitInputType,
  DataPermitModel as DataPermitModelType,
  DataPermitSearch as DataPermitSearchType,
  DataPermitFieldComment as DataPermitFieldCommentType,
} from "/gen/types.ts";

export const dataPermitId = Symbol.for("DataPermitId");
export type DataPermitId = typeof dataPermitId;

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface DataPermitSearch extends DataPermitSearchType {
  $extra?: SearchExtra[];
}

export interface DataPermitModel extends DataPermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface DataPermitInput extends DataPermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DataPermitFieldCommentType as DataPermitFieldComment };
