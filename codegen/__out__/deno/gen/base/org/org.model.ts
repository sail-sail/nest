import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OrgInput as OrgInputType,
  OrgModel as OrgModelType,
  OrgSearch as OrgSearchType,
} from "/gen/types.ts";

export interface OrgSearch extends OrgSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OrgModel extends OrgModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface OrgInput extends OrgInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface OrgFieldComment {
  id: string;
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
  tenant_id: string;
  tenant_id_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
  is_deleted: string;
  is_deleted_lbl: string;
}
