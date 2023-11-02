import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DomainInput as DomainInputType,
  DomainModel as DomainModelType,
  DomainSearch as DomainSearchType,
} from "/gen/types.ts";

export interface DomainSearch extends DomainSearchType {
  $extra?: SearchExtra[];
}

export interface DomainModel extends DomainModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface DomainInput extends DomainInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  is_deleted?: number | null;
}

export interface DomainFieldComment {
  id: string;
  protocol: string;
  lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  is_default: string;
  is_default_lbl: string;
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
