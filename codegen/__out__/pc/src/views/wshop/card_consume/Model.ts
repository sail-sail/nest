import type {
  CardConsumeInput as CardConsumeInputType,
  CardConsumeModel as CardConsumeModelType,
  CardConsumeSearch as CardConsumeSearchType,
  CardConsumeFieldComment as CardConsumeFieldCommentType,
} from "#/types";

export interface CardConsumeModel extends CardConsumeModelType {
  /** 消费充值金额 */
  amt_lbl: string;
  /** 消费赠送金额 */
  give_amt_lbl: string;
  /** 消费后余额 */
  balance_lbl: string;
  /** 消费后赠送余额 */
  give_balance_lbl: string;
}

export interface CardConsumeInput extends CardConsumeInputType {
}

export interface CardConsumeSearch extends CardConsumeSearchType {
}

export interface CardConsumeFieldComment extends CardConsumeFieldCommentType {
}
