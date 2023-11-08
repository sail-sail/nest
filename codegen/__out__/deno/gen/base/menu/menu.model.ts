import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  MenuInput as MenuInputType,
  MenuModel as MenuModelType,
  MenuSearch as MenuSearchType,
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

export interface MenuInput extends MenuInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface MenuFieldComment {
  id: string;
  type: string;
  type_lbl: string;
  parent_id: string;
  parent_id_lbl: string;
  lbl: string;
  route_path: string;
  route_query: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
