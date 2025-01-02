import type {
  CardRechargeInput as CardRechargeInputType,
  CardRechargeModel as CardRechargeModelType,
  CardRechargeSearch as CardRechargeSearchType,
  CardRechargeFieldComment as CardRechargeFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wshop/card_recharge";

declare const cardRechargeId: unique symbol;

declare global {
  
  type CardRechargeId = Distinct<string, typeof cardRechargeId>;

  interface CardRechargeSearch extends CardRechargeSearchType {
    /** 微信支付订单号 */
    transaction_id?: string;
    transaction_id_like?: string;
    /** 充值金额 */
    amt?: [(string|undefined|null), (string|undefined|null)];
    /** 赠送金额 */
    give_amt?: [(string|undefined|null), (string|undefined|null)];
    /** 充值后充值余额 */
    balance?: [(string|undefined|null), (string|undefined|null)];
    /** 充值后赠送余额 */
    give_balance?: [(string|undefined|null), (string|undefined|null)];
    /** 充值后积分 */
    integral?: [(number|undefined|null), (number|undefined|null)];
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

  interface CardRechargeModel extends CardRechargeModelType {
    /** 微信支付订单号 */
    transaction_id: string;
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

  interface CardRechargeInput extends CardRechargeInputType {
    /** 微信支付订单号 */
    transaction_id?: string | null;
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

  interface CardRechargeFieldComment extends CardRechargeFieldCommentType {
  }
  
}

/** 会员卡充值记录 前端允许排序的字段 */
export const canSortInApiCardRecharge = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 会员卡充值记录 检测字段是否允许前端排序 */
export function checkSortCardRecharge(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortCardRecharge: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiCardRecharge;
    if (!canSortInApiCardRecharge[prop]) {
      throw new Error(`checkSortCardRecharge: ${ JSON.stringify(item) }`);
    }
  }
}
