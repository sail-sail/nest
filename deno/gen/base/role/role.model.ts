import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  RoleInput as RoleInputType,
  RoleModel as RoleModelType,
  RoleSearch as RoleSearchType,
} from "/gen/types.ts";

export interface RoleSearch extends RoleSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface RoleModel extends RoleModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface RoleInput extends RoleInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface RoleFieldComment {
  id: string;
  lbl: string;
  home_url: string;
  menu_ids: string;
  menu_ids_lbl: string;
  permit_ids: string;
  permit_ids_lbl: string;
  data_permit_ids: string;
  data_permit_ids_lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
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
