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
  tenant_id?: string | null;
}

export interface UsrInput extends UsrInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface UsrFieldComment {
  id: string;
  img: string;
  lbl: string;
  username: string;
  default_org_id: string;
  default_org_id_lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  org_ids: string;
  org_ids_lbl: string;
  dept_ids: string;
  dept_ids_lbl: string;
  role_ids: string;
  role_ids_lbl: string;
  rem: string;
}
