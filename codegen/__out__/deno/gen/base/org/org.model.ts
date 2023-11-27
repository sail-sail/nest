import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OrgInput as OrgInputType,
  OrgModel as OrgModelType,
  OrgSearch as OrgSearchType,
  OrgFieldComment as OrgFieldCommentType,
} from "/gen/types.ts";

export const orgId = Symbol.for("OrgId");
export type OrgId = typeof orgId;

export interface OrgSearch extends OrgSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OrgModel extends OrgModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface OrgInput extends OrgInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { OrgFieldCommentType as OrgFieldComment };
