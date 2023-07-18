import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type OrgInput as OrgInputType,
  type OrgModel as OrgModelType,
  type OrgSearch as OrgSearchType,
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
  tenant_id?: string | null;
}

export interface OrgInput extends OrgInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
