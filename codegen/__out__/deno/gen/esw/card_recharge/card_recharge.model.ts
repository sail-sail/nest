import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CardRechargeInput as CardRechargeInputType,
  CardRechargeModel as CardRechargeModelType,
  CardRechargeSearch as CardRechargeSearchType,
  CardRechargeFieldComment as CardRechargeFieldCommentType,
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

declare const cardRechargeId: unique symbol;
export type CardRechargeId = Distinct<string, typeof cardRechargeId>;

export interface CardRechargeSearch extends CardRechargeSearchType {
  /** 微信支付订单号 */
  transaction_id?: string;
  transaction_id_like?: string;
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CardRechargeModel extends CardRechargeModelType {
  /** 微信支付订单号 */
  transaction_id: string;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface CardRechargeInput extends CardRechargeInputType {
  /** 微信支付订单号 */
  transaction_id?: string;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { CardRechargeFieldCommentType as CardRechargeFieldComment };
