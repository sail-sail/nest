import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  I18Ninput as I18NinputType,
  I18Nmodel as I18NmodelType,
  I18Nsearch as I18NsearchType,
} from "/gen/types.ts";

export interface I18Nsearch extends I18NsearchType {
  $extra?: SearchExtra[];
}

export interface I18Nmodel extends I18NmodelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface I18Ninput extends I18NinputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface I18NfieldComment {
  id: string;
  lang_id: string;
  lang_id_lbl: string;
  menu_id: string;
  menu_id_lbl: string;
  code: string;
  lbl: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
