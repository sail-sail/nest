

import type {
  DictDetailInput as DictDetailInputType,
  DictDetailModel as DictDetailModelType,
  DictDetailSearch as DictDetailSearchType,
  DictDetailFieldComment as DictDetailFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const dictDetailId: unique symbol;
export type DictDetailId = Distinct<string, typeof dictDetailId>;

export interface DictDetailSearch extends DictDetailSearchType {
}

export interface DictDetailModel extends DictDetailModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface DictDetailInput extends DictDetailInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { DictDetailFieldCommentType as DictDetailFieldComment };
