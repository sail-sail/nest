import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type OptionModel as OptionModelType,
  type OptionSearch as OptionSearchType,
} from "/gen/types.ts";

export interface OptionSearch extends OptionSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OptionModel extends OptionModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
