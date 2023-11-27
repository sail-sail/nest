import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictDetailInput as DictDetailInputType,
  DictDetailModel as DictDetailModelType,
  DictDetailSearch as DictDetailSearchType,
  DictDetailFieldComment as DictDetailFieldCommentType,
} from "/gen/types.ts";

export const dictDetailId = Symbol.for("DictDetailId");
export type DictDetailId = typeof dictDetailId;

export interface DictDetailSearch extends DictDetailSearchType {
  $extra?: SearchExtra[];
}

export interface DictDetailModel extends DictDetailModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DictDetailInput extends DictDetailInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DictDetailFieldCommentType as DictDetailFieldComment };
