import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
} from "/gen/types.ts";

export const dictId = Symbol.for("DictId");
export type DictId = typeof dictId;

export interface DictSearch extends DictSearchType {
  $extra?: SearchExtra[];
}

export interface DictModel extends DictModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DictInput extends DictInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DictFieldCommentType as DictFieldComment };
