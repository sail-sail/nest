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
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}
