import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PermitInput as PermitInputType,
  type PermitModel as PermitModelType,
  type PermitSearch as PermitSearchType,
} from "/gen/types.ts";

export interface PermitSearch extends PermitSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PermitModel extends PermitModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface PermitInput extends PermitInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
