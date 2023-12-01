import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  FieldPermitInput as FieldPermitInputType,
  FieldPermitModel as FieldPermitModelType,
  FieldPermitSearch as FieldPermitSearchType,
  FieldPermitFieldComment as FieldPermitFieldCommentType,
} from "/gen/types.ts";

declare const fieldPermitId: unique symbol;
export type FieldPermitId = typeof fieldPermitId;

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface FieldPermitSearch extends FieldPermitSearchType {
  $extra?: SearchExtra[];
}

export interface FieldPermitModel extends FieldPermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface FieldPermitInput extends FieldPermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { FieldPermitFieldCommentType as FieldPermitFieldComment };
