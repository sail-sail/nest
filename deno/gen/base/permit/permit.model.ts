import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
  PermitFieldComment as PermitFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const permitId: unique symbol;
export type PermitId = Distinct<string, typeof permitId>;

export interface PermitSearch extends PermitSearchType {
  $extra?: SearchExtra[];
}

export interface PermitModel extends PermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface PermitInput extends PermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { PermitFieldCommentType as PermitFieldComment };
