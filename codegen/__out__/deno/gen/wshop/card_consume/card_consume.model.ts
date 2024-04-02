import type {
  CardConsumeInput as CardConsumeInputType,
  CardConsumeModel as CardConsumeModelType,
  CardConsumeSearch as CardConsumeSearchType,
  CardConsumeFieldComment as CardConsumeFieldCommentType,
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

declare const cardConsumeId: unique symbol;
export type CardConsumeId = Distinct<string, typeof cardConsumeId>;

export interface CardConsumeSearch extends CardConsumeSearchType {
  /** 微信支付订单号 */
  transaction_id?: string;
  transaction_id_like?: string;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface CardConsumeModel extends CardConsumeModelType {
  /** 微信支付订单号 */
  transaction_id: string;
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

export interface CardConsumeInput extends CardConsumeInputType {
  /** 微信支付订单号 */
  transaction_id?: string;
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

export type { CardConsumeFieldCommentType as CardConsumeFieldComment };
