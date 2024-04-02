import type {
  CardRechargeInput as CardRechargeInputType,
  CardRechargeModel as CardRechargeModelType,
  CardRechargeSearch as CardRechargeSearchType,
  CardRechargeFieldComment as CardRechargeFieldCommentType,
} from "#/types";

export interface CardRechargeModel extends CardRechargeModelType {
  /** 充值金额 */
  amt_lbl: string;
  /** 赠送金额 */
  give_amt_lbl: string;
  /** 充值后充值余额 */
  balance_lbl: string;
  /** 充值后赠送余额 */
  give_balance_lbl: string;
}

export interface CardRechargeInput extends CardRechargeInputType {
}

export interface CardRechargeSearch extends CardRechargeSearchType {
}

export interface CardRechargeFieldComment extends CardRechargeFieldCommentType {
}
