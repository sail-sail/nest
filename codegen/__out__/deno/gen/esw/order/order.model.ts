import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OrderInput as OrderInputType,
  OrderModel as OrderModelType,
  OrderSearch as OrderSearchType,
  OrderFieldComment as OrderFieldCommentType,
} from "/gen/types.ts";

export const orderId = Symbol.for("OrderId");
export type OrderId = typeof orderId;

export interface OrderSearch extends OrderSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OrderModel extends OrderModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface OrderInput extends OrderInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { OrderFieldCommentType as OrderFieldComment };
