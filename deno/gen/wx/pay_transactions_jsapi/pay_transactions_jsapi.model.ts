import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PayTransactionsJsapiInput as PayTransactionsJsapiInputType,
  PayTransactionsJsapiModel as PayTransactionsJsapiModelType,
  PayTransactionsJsapiSearch as PayTransactionsJsapiSearchType,
  PayTransactionsJsapiFieldComment as PayTransactionsJsapiFieldCommentType,
} from "/gen/types.ts";

export const payTransactionsJsapiId = Symbol.for("PayTransactionsJsapiId");
export type PayTransactionsJsapiId = typeof payTransactionsJsapiId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface PayTransactionsJsapiSearch extends PayTransactionsJsapiSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PayTransactionsJsapiModel extends PayTransactionsJsapiModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface PayTransactionsJsapiInput extends PayTransactionsJsapiInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { PayTransactionsJsapiFieldCommentType as PayTransactionsJsapiFieldComment };
