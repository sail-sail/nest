import type {
  OrderInput as OrderInputType,
  OrderModel as OrderModelType,
  OrderSearch as OrderSearchType,
  OrderFieldComment as OrderFieldCommentType,
  // 订单状态
  OrderStatus,
  // 订单类别
  OrderType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wshop/order";

declare const orderId: unique symbol;

declare global {
  
  /** 订单 */
  type OrderId = Distinct<string, typeof orderId>;
  
  /** 订单 */
  interface OrderSearch extends OrderSearchType {
    /** 订单号-序列号 */
    lbl_seq?: [(number|undefined|null), (number|undefined|null)];
    /** 订单号-日期 */
    lbl_date_seq?: [(string|undefined|null), (string|undefined|null)];
    /** 订单状态 */
    status?: OrderStatus[];
    /** 订单金额 */
    price?: [(string|undefined|null), (string|undefined|null)];
    /** 订单类别 */
    type?: OrderType[];
    /** 消费充值金额 */
    amt?: [(string|undefined|null), (string|undefined|null)];
    /** 消费赠送金额 */
    give_amt?: [(string|undefined|null), (string|undefined|null)];
    /** 获得积分 */
    integral?: [(number|undefined|null), (number|undefined|null)];
    /** 消费后充值余额 */
    balance?: [(string|undefined|null), (string|undefined|null)];
    /** 消费后赠送余额 */
    give_balance?: [(string|undefined|null), (string|undefined|null)];
    /** 锁定 */
    is_locked?: number[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    /** 组织 */
    org_id?: OrgId[];
    /** 组织 */
    org_id_is_null?: boolean;
    /** 组织 */
    org_id_lbl?: string[];
    /** 组织 */
    org_id_lbl_like?: string;
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
    lbl_date_seq_lbl?: string | null;
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

/** 订单 前端允许排序的字段 */
export const canSortInApiOrder = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 订单 检测字段是否允许前端排序 */
export function checkSortOrder(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortOrder: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiOrder;
    if (!canSortInApiOrder[prop]) {
      throw new Error(`checkSortOrder: ${ JSON.stringify(item) }`);
    }
  }
}
