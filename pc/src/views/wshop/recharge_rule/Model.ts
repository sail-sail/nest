import type {
  RechargeRuleInput as RechargeRuleInputType,
  RechargeRuleModel as RechargeRuleModelType,
  RechargeRuleSearch as RechargeRuleSearchType,
  RechargeRuleFieldComment as RechargeRuleFieldCommentType,
} from "#/types";

export interface RechargeRuleModel extends RechargeRuleModelType {
  /** 充值金额 */
  amt_lbl: string;
  /** 赠送金额 */
  give_amt_lbl: string;
}

export interface RechargeRuleInput extends RechargeRuleInputType {
}

export interface RechargeRuleSearch extends RechargeRuleSearchType {
}

export interface RechargeRuleFieldComment extends RechargeRuleFieldCommentType {
}
