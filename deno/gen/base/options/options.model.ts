import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type OptionsInput as OptionsInputType,
  type OptionsModel as OptionsModelType,
  type OptionsSearch as OptionsSearchType,
} from "/gen/types.ts";

export interface OptionsSearch extends OptionsSearchType {
  $extra?: SearchExtra[];
}

export interface OptionsModel extends OptionsModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface OptionsInput extends OptionsInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}
