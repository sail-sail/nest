import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type UsrModel as UsrModelType,
  type UsrSearch as UsrSearchType,
} from "/gen/types.ts";

export interface UsrSearch extends UsrSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface UsrModel extends UsrModelType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  tenant_id?: string | null;
}
