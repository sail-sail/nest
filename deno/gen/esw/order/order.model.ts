import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OrderInput as OrderInputType,
  OrderModel as OrderModelType,
  OrderSearch as OrderSearchType,
  OrderFieldComment as OrderFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const orderId: unique symbol;
export type OrderId = Distinct<string, typeof orderId>;

export interface OrderSearch extends OrderSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OrderModel extends OrderModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface OrderInput extends OrderInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { OrderFieldCommentType as OrderFieldComment };
