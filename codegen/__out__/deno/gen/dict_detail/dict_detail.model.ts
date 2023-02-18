import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type Dict_DetailModel as Dict_DetailModelType,
  type Dict_DetailSearch as Dict_DetailSearchType,
} from "/gen/types.ts";

export interface Dict_DetailSearch extends Dict_DetailSearchType {
  $extra?: SearchExtra[];
}

export interface Dict_DetailModel extends Dict_DetailModelType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
}
