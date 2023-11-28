import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CardConsumeInput as CardConsumeInputType,
  CardConsumeModel as CardConsumeModelType,
  CardConsumeSearch as CardConsumeSearchType,
  CardConsumeFieldComment as CardConsumeFieldCommentType,
} from "/gen/types.ts";

export const cardConsumeId = Symbol.for("CardConsumeId");
export type CardConsumeId = typeof cardConsumeId;

export interface CardConsumeSearch extends CardConsumeSearchType {
  /** 微信支付订单号 */
  transaction_id?: string;
  transaction_id_like?: string;
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CardConsumeModel extends CardConsumeModelType {
  /** 微信支付订单号 */
  transaction_id: string;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface CardConsumeInput extends CardConsumeInputType {
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

export type { CardConsumeFieldCommentType as CardConsumeFieldComment };
