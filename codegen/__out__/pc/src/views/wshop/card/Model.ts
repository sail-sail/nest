/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
} from "#/types";

declare global {
  
  interface CardModel extends CardModelType {
    /** 充值余额 */
    balance_lbl: string;
    /** 赠送余额 */
    give_balance_lbl: string;
    /** 累计消费 */
    growth_amt_lbl: string;
  }

  interface CardInput extends CardInputType {
  }

  interface CardSearch extends CardSearchType {
  }

  interface CardFieldComment extends CardFieldCommentType {
  }
  
}

export const cardFields = [
  // ID
  "id",
  // 卡号
  "lbl",
  // 绑定用户
  "usr_id",
  "usr_id_lbl",
  // 会员等级
  "grade",
  "grade_lbl",
  // 姓名
  "name",
  // 电话
  "mobile",
  // 充值余额
  "balance",
  // 赠送余额
  "give_balance",
  // 积分
  "integral",
  // 累计消费
  "growth_amt",
  // 默认
  "is_default_card",
  "is_default_card_lbl",
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

export const cardQueryField = `
  ${ cardFields.join(" ") }
`;
