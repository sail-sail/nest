import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DictDetailModel as DictDetailModelType,
  type DictDetailSearch as DictDetailSearchType,
} from "/gen/types.ts";

export interface DictDetailSearch extends DictDetailSearchType {
  $extra?: SearchExtra[];
}

export interface DictDetailModel extends DictDetailModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}
