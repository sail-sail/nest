

import type {
  I18nInput as I18nInputType,
  I18nModel as I18nModelType,
  I18nSearch as I18nSearchType,
  I18nFieldComment as I18nFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const i18nId: unique symbol;
export type I18nId = Distinct<string, typeof i18nId>;

export interface I18nSearch extends I18nSearchType {
}

export interface I18nModel extends I18nModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
}

export interface I18nInput extends I18nInputType {
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

export type { I18nFieldCommentType as I18nFieldComment };
