

import type {
  OrgInput as OrgInputType,
  OrgModel as OrgModelType,
  OrgSearch as OrgSearchType,
  OrgFieldComment as OrgFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const orgId: unique symbol;
export type OrgId = Distinct<string, typeof orgId>;

export interface OrgSearch extends OrgSearchType {
  tenant_id?: string | null;
}

export interface OrgModel extends OrgModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface OrgInput extends OrgInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { OrgFieldCommentType as OrgFieldComment };
