import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OptionsInput as OptionsInputType,
  OptionsModel as OptionsModelType,
  OptionsSearch as OptionsSearchType,
} from "/gen/types.ts";

export interface OptionsSearch extends OptionsSearchType {
  $extra?: SearchExtra[];
}

export interface OptionsModel extends OptionsModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface OptionsInput extends OptionsInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}
