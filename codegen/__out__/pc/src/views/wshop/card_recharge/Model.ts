/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CardRechargeInput as CardRechargeInputType,
  CardRechargeModel as CardRechargeModelType,
  CardRechargeSearch as CardRechargeSearchType,
  CardRechargeFieldComment as CardRechargeFieldCommentType,
} from "#/types";

declare global {
  
  /** 会员卡充值记录 */
  interface CardRechargeModel extends CardRechargeModelType {
    /** 充值金额 */
    amt_lbl: string;
    /** 赠送金额 */
    give_amt_lbl: string;
    /** 充值后充值余额 */
    balance_lbl: string;
    /** 充值后赠送余额 */
    give_balance_lbl: string;
  }
  
  /** 会员卡充值记录 */
  interface CardRechargeInput extends CardRechargeInputType {
  }
  
  /** 会员卡充值记录 */
  interface CardRechargeSearch extends CardRechargeSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 会员卡充值记录 */
  interface CardRechargeFieldComment extends CardRechargeFieldCommentType {
  }
  
}

export const cardRechargeFields = [
  // ID
  "id",
  // 会员卡
  "card_id",
  "card_id_lbl",
  // 用户
  "usr_id",
  "usr_id_lbl",
  // 充值金额
  "amt",
  // 赠送金额
  "give_amt",
  // 充值后充值余额
  "balance",
  // 充值后赠送余额
  "give_balance",
  // 充值后积分
  "integral",
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

export const cardRechargeQueryField = `
  ${ cardRechargeFields.join(" ") }
`;
