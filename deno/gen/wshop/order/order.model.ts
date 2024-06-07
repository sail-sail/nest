import type {
  OrderInput as OrderInputType,
  OrderModel as OrderModelType,
  OrderSearch as OrderSearchType,
  OrderFieldComment as OrderFieldCommentType,
  // 订单状态
  OrderStatus,
  // 订单类别
  OrderType,
} from "/gen/types.ts";

declare const orderId: unique symbol;

declare global {
  
  type OrderId = Distinct<string, typeof orderId>;

  interface OrderSearch extends OrderSearchType {
    /** 订单号-序列号 */
    lbl_seq?: number[];
    /** 订单号-日期 */
    lbl_date_seq?: string[];
    /** 订单状态 */
    status?: OrderStatus[];
    /** 订单金额 */
    price?: string[];
    /** 订单类别 */
    type?: OrderType[];
    /** 消费充值金额 */
    amt?: string[];
    /** 消费赠送金额 */
    give_amt?: string[];
    /** 获得积分 */
    integral?: number[];
    /** 消费后充值余额 */
    balance?: string[];
    /** 消费后赠送余额 */
    give_balance?: string[];
    /** 锁定 */
    is_locked?: number[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
    /** 组织 */
    org_id?: OrgId[];
    org_id_is_null?: boolean;
    /** 组织 */
    org_id_lbl?: string[];
    tenant_id?: TenantId | null;
  }

  interface OrderModel extends OrderModelType {
    /** 订单号-序列号 */
    lbl_seq: number;
    /** 订单号-日期 */
    lbl_date_seq: string | null;
    /** 订单号-日期 */
    lbl_date_seq_lbl: string;
    /** 组织 */
    org_id: OrgId;
    /** 组织 */
    org_id_lbl: string;
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
  }

  interface OrderInput extends OrderInputType {
    /** 订单号-序列号 */
    lbl_seq?: number | null;
    /** 订单号-日期 */
    lbl_date_seq?: string | null;
    lbl_date_seq_lbl?: String | null;
    lbl_date_seq_save_null?: boolean | null;
    /** 组织 */
    org_id?: OrgId | null;
    /** 组织 */
    org_id_lbl?: string | null;
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface OrderFieldComment extends OrderFieldCommentType {
  }
  
}
