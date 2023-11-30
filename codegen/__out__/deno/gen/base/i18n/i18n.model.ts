import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  I18Ninput as I18NinputType,
  I18Nmodel as I18NmodelType,
  I18Nsearch as I18NsearchType,
  I18NfieldComment as I18NfieldCommentType,
} from "/gen/types.ts";

export const i18nId = Symbol.for("I18NId");
export type I18NId = typeof i18nId;

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface I18Nsearch extends I18NsearchType {
  $extra?: SearchExtra[];
}

export interface I18Nmodel extends I18NmodelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface I18Ninput extends I18NinputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { I18NfieldCommentType as I18NfieldComment };
