import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
  OptionsFieldComment as OptionsFieldCommentType,
} from "/gen/types.ts";

declare const optionsId: unique symbol;
export type OptionsId = typeof optionsId;

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface OptionsSearch extends OptionsSearchType {
  $extra?: SearchExtra[];
}

export interface OptionsModel extends OptionsModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface OptionsInput extends OptionsInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { OptionsFieldCommentType as OptionsFieldComment };
