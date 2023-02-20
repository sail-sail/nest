import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type MenuModel as MenuModelType,
  type MenuSearch as MenuSearchType,
} from "/gen/types.ts";

export interface MenuSearch extends MenuSearchType {
  $extra?: SearchExtra[];
}

export interface MenuModel extends MenuModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}
