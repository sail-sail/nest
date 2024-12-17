/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CardConsumeInput as CardConsumeInputType,
  CardConsumeModel as CardConsumeModelType,
  CardConsumeSearch as CardConsumeSearchType,
  CardConsumeFieldComment as CardConsumeFieldCommentType,
} from "#/types";

declare global {
  
  interface CardConsumeModel extends CardConsumeModelType {
    /** 消费充值金额 */
    amt_lbl: string;
    /** 消费赠送金额 */
    give_amt_lbl: string;
    /** 消费后余额 */
    balance_lbl: string;
    /** 消费后赠送余额 */
    give_balance_lbl: string;
  }

  interface CardConsumeInput extends CardConsumeInputType {
  }

  interface CardConsumeSearch extends CardConsumeSearchType {
  }

  interface CardConsumeFieldComment extends CardConsumeFieldCommentType {
  }
  
}

export const cardConsumeFields = [
  // ID
  "id",
  // 卡号
  "card_id",
  "card_id_lbl",
  // 用户
  "usr_id",
  "usr_id_lbl",
  // 消费充值金额
  "amt",
  // 消费赠送金额
  "give_amt",
  // 获得积分
  "integral",
  // 消费后余额
  "balance",
  // 消费后赠送余额
  "give_balance",
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

export const cardConsumeQueryField = `
  ${ cardConsumeFields.join(" ") }
`;
