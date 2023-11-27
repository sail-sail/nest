import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  FieldPermitInput as FieldPermitInputType,
  FieldPermitModel as FieldPermitModelType,
  FieldPermitSearch as FieldPermitSearchType,
  FieldPermitFieldComment as FieldPermitFieldCommentType,
} from "/gen/types.ts";

export const fieldPermitId = Symbol.for("FieldPermitId");
export type FieldPermitId = typeof fieldPermitId;

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
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { FieldPermitFieldCommentType as FieldPermitFieldComment };
