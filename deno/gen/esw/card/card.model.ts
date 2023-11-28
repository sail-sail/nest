import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
} from "/gen/types.ts";

export const cardId = Symbol.for("CardId");
export type CardId = typeof cardId;

export interface CardSearch extends CardSearchType {
  /** 卡号-序列号 */
  seq_lbl?: number[];
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CardModel extends CardModelType {
  /** 卡号-序列号 */
  seq_lbl: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface CardInput extends CardInputType {
  /** 卡号-序列号 */
  seq_lbl?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { CardFieldCommentType as CardFieldComment };
