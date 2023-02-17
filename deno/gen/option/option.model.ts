import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type OptionModel as OptionModelType,
  type OptionSearch as OptionSearchType,
} from "/gen/types.ts";

export interface OptionSearch extends OptionSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface OptionModel extends OptionModelType {
  tenant_id?: string | null;
}
