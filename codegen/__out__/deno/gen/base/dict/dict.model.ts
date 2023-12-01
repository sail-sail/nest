import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
} from "/gen/types.ts";

declare const dictId: unique symbol;
export type DictId = typeof dictId;

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface DictSearch extends DictSearchType {
  $extra?: SearchExtra[];
}

export interface DictModel extends DictModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface DictInput extends DictInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DictFieldCommentType as DictFieldComment };
