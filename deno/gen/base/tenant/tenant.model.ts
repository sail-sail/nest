import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type TenantModel as TenantModelType,
  type TenantSearch as TenantSearchType,
} from "/gen/types.ts";

export interface TenantSearch extends TenantSearchType {
  $extra?: SearchExtra[];
}

export interface TenantModel extends TenantModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}
