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
  /** 订单号-序列号 */
  lbl_seq?: number[];
  /** 订单号-日期 */
  lbl_date_seq?: string[];
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface OrderModel extends OrderModelType {
  /** 订单号-序列号 */
  lbl_seq: number;
  /** 订单号-日期 */
  lbl_date_seq?: string | null;
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface OrderInput extends OrderInputType {
  /** 订单号-序列号 */
  lbl_seq?: number;
  /** 订单号-日期 */
  lbl_date_seq?: string | null;
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;
  create_time?: string | null;
  create_time_lbl?: string | null;
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;
  update_time?: string | null;
  update_time_lbl?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { OrderFieldCommentType as OrderFieldComment };
