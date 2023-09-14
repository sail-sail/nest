import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DeptInput as DeptInputType,
  DeptModel as DeptModelType,
  DeptSearch as DeptSearchType,
} from "/gen/types.ts";

export interface DeptSearch extends DeptSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DeptModel extends DeptModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface DeptInput extends DeptInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface DeptFieldComment {
  id: string;
  parent_id: string;
  parent_id_lbl: string;
  lbl: string;
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
