/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  RechargeRuleInput as RechargeRuleInputType,
  RechargeRuleModel as RechargeRuleModelType,
  RechargeRuleSearch as RechargeRuleSearchType,
  RechargeRuleFieldComment as RechargeRuleFieldCommentType,
} from "#/types";

declare global {
  
  /** 充值赠送规则 */
  interface RechargeRuleModel extends RechargeRuleModelType {
    /** 充值金额 */
    amt_lbl: string;
    /** 赠送金额 */
    give_amt_lbl: string;
  }
  
  /** 充值赠送规则 */
  interface RechargeRuleInput extends RechargeRuleInputType {
  }
  
  /** 充值赠送规则 */
  interface RechargeRuleSearch extends RechargeRuleSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 充值赠送规则 */
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
