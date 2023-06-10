import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type UsrInput as UsrInputType,
  type UsrModel as UsrModelType,
  type UsrSearch as UsrSearchType,
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
