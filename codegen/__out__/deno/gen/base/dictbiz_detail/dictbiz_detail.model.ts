import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Dictbiz_DetailModel as Dictbiz_DetailModelType,
  type Dictbiz_DetailSearch as Dictbiz_DetailSearchType,
} from "/gen/types.ts";

export interface Dictbiz_DetailSearch extends Dictbiz_DetailSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface Dictbiz_DetailModel extends Dictbiz_DetailModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
