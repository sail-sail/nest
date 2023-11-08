import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
} from "/gen/types.ts";

export interface UsrSearch extends UsrSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface UsrModel extends UsrModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface UsrInput extends UsrInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface UsrFieldComment {
  id: string;
  img: string;
  lbl: string;
  username: string;
  org_ids: string;
  org_ids_lbl: string;
  default_org_id: string;
  default_org_id_lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  dept_ids: string;
  dept_ids_lbl: string;
  role_ids: string;
  role_ids_lbl: string;
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
