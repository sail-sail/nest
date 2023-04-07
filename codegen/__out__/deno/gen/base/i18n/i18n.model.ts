import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type I18nModel as I18nModelType,
  type I18nSearch as I18nSearchType,
} from "/gen/types.ts";

export interface I18nSearch extends I18nSearchType {
  $extra?: SearchExtra[];
}

export interface I18nModel extends I18nModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}
