import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Dictbiz_DetailModel as Dictbiz_DetailModelType,
  type Dictbiz_DetailSearch as Dictbiz_DetailSearchType,
} from "/gen/types.ts";

export interface Dictbiz_DetailSearch extends Dictbiz_DetailSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface Dictbiz_DetailModel extends Dictbiz_DetailModelType {
  tenant_id?: string | null;
}
