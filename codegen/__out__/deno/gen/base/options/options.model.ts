

import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
  OptionsFieldComment as OptionsFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const optionsId: unique symbol;
export type OptionsId = Distinct<string, typeof optionsId>;

export interface OptionsSearch extends OptionsSearchType {
}

export interface OptionsModel extends OptionsModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_time?: string | null;
  update_time_lbl: string;
}

export interface OptionsInput extends OptionsInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;
  create_time?: string | null;
  create_time_lbl?: string | null;
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;
  update_time?: string | null;
  update_time_lbl?: string | null;
  is_deleted?: number | null;
}

export type { OptionsFieldCommentType as OptionsFieldComment };
