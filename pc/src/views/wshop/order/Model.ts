/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  OrderInput as OrderInputType,
  OrderModel as OrderModelType,
  OrderSearch as OrderSearchType,
  OrderFieldComment as OrderFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 订单 */
  interface OrderModel extends OrderModelType {
    /** 订单金额 */
    price_lbl: string;
    /** 消费充值金额 */
    amt_lbl: string;
    /** 消费赠送金额 */
    give_amt_lbl: string;
    /** 消费后充值余额 */
    balance_lbl: string;
    /** 消费后赠送余额 */
    give_balance_lbl: string;
  }
  
  /** 订单 */
  interface OrderInput extends OrderInputType {
  }
  
  /** 订单 */
  interface OrderSearch extends OrderSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 订单 */
  interface OrderFieldComment extends OrderFieldCommentType {
  }
  
}

export const orderFields = [
  // ID
  "id",
  // 订单号
  "lbl",
  // 公司
  "company",
  // 联系电话
  "phone",
  // 订单状态
  "status",
  "status_lbl",
  // 用户
  "usr_id",
  "usr_id_lbl",
  // 会员卡
  "card_id",
  "card_id_lbl",
  // 订单金额
  "price",
  // 订单类别
  "type",
  "type_lbl",
  // 消费充值金额
  "amt",
  // 消费赠送金额
  "give_amt",
  // 获得积分
  "integral",
  // 消费后充值余额
  "balance",
  // 消费后赠送余额
  "give_balance",
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

export const orderQueryField = `
  ${ orderFields.join(" ") }
`;
