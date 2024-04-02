import type {
  OrderInput as OrderInputType,
  OrderModel as OrderModelType,
  OrderSearch as OrderSearchType,
  OrderFieldComment as OrderFieldCommentType,
} from "#/types";

export interface OrderModel extends OrderModelType {
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

export interface OrderInput extends OrderInputType {
}

export interface OrderSearch extends OrderSearchType {
}

export interface OrderFieldComment extends OrderFieldCommentType {
}
