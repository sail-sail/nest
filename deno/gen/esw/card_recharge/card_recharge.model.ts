import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CardRechargeInput as CardRechargeInputType,
  CardRechargeModel as CardRechargeModelType,
  CardRechargeSearch as CardRechargeSearchType,
  CardRechargeFieldComment as CardRechargeFieldCommentType,
} from "/gen/types.ts";

export const cardRechargeId = Symbol.for("CardRechargeId");
export type CardRechargeId = typeof cardRechargeId;

export interface CardRechargeSearch extends CardRechargeSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CardRechargeModel extends CardRechargeModelType {
  /** 微信支付订单号 */
  transaction_id: string;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface CardRechargeInput extends CardRechargeInputType {
  /** 微信支付订单号 */
  transaction_id?: string;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { CardRechargeFieldCommentType as CardRechargeFieldComment };
