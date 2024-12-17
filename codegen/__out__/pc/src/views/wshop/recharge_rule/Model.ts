/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  RechargeRuleInput as RechargeRuleInputType,
  RechargeRuleModel as RechargeRuleModelType,
  RechargeRuleSearch as RechargeRuleSearchType,
  RechargeRuleFieldComment as RechargeRuleFieldCommentType,
} from "#/types";

declare global {
  
  interface RechargeRuleModel extends RechargeRuleModelType {
    /** 充值金额 */
    amt_lbl: string;
    /** 赠送金额 */
    give_amt_lbl: string;
  }

  interface RechargeRuleInput extends RechargeRuleInputType {
  }

  interface RechargeRuleSearch extends RechargeRuleSearchType {
  }

  interface RechargeRuleFieldComment extends RechargeRuleFieldCommentType {
  }
  
}

export const rechargeRuleFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 充值金额
  "amt",
  // 赠送金额
  "give_amt",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const rechargeRuleQueryField = `
  ${ rechargeRuleFields.join(" ") }
`;
