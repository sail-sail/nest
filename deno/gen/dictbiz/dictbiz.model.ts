import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DictbizModel as DictbizModelType,
  type DictbizSearch as DictbizSearchType,
} from "/gen/types.ts";

export interface DictbizSearch extends DictbizSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface DictbizModel extends DictbizModelType {
  tenant_id?: string | null;
}
