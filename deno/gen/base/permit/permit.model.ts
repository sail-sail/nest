import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
  PermitFieldComment as PermitFieldCommentType,
} from "/gen/types.ts";

export const permitId = Symbol.for("PermitId");
export type PermitId = typeof permitId;

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
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { PermitFieldCommentType as PermitFieldComment };
