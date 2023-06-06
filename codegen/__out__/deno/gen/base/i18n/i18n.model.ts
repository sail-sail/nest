import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type I18Nmodel as I18NmodelType,
  type I18Nsearch as I18NsearchType,
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
