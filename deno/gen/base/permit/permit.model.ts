import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PermitInput as PermitInputType,
  PermitModel as PermitModelType,
  PermitSearch as PermitSearchType,
} from "/gen/types.ts";

export interface PermitSearch extends PermitSearchType {
  $extra?: SearchExtra[];
}

export interface PermitModel extends PermitModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface PermitInput extends PermitInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
}
