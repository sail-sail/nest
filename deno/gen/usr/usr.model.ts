import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type UsrModel as UsrModelType,
  type UsrSearch as UsrSearchType,
} from "/gen/types.ts";

export interface UsrSearch extends UsrSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface UsrModel extends UsrModelType {
  tenant_id?: string | null;
}
