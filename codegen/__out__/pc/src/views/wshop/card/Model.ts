import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
} from "#/types";

export interface CardModel extends CardModelType {
  /** 充值余额 */
  balance_lbl: string;
  /** 赠送余额 */
  give_balance_lbl: string;
  /** 累计消费 */
  growth_amt_lbl: string;
}

export interface CardInput extends CardInputType {
}

export interface CardSearch extends CardSearchType {
}

export interface CardFieldComment extends CardFieldCommentType {
}
