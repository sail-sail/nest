import type {
  RechargeRuleInput as RechargeRuleInputType,
  RechargeRuleModel as RechargeRuleModelType,
  RechargeRuleSearch as RechargeRuleSearchType,
  RechargeRuleFieldComment as RechargeRuleFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wshop/recharge_rule";

declare const rechargeRuleId: unique symbol;

declare global {
  
  /** 充值赠送规则 */
  type RechargeRuleId = Distinct<string, typeof rechargeRuleId>;
  
  /** 充值赠送规则 */
  interface RechargeRuleSearch extends RechargeRuleSearchType {
    /** 充值金额 */
    amt?: [(string|undefined|null), (string|undefined|null)];
    /** 赠送金额 */
    give_amt?: [(string|undefined|null), (string|undefined|null)];
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

  interface RechargeRuleModel extends RechargeRuleModelType {
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

  interface RechargeRuleInput extends RechargeRuleInputType {
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

  interface RechargeRuleFieldComment extends RechargeRuleFieldCommentType {
  }
  
}

/** 充值赠送规则 前端允许排序的字段 */
export const canSortInApiRechargeRule = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 充值赠送规则 检测字段是否允许前端排序 */
export function checkSortRechargeRule(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortRechargeRule: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiRechargeRule;
    if (!canSortInApiRechargeRule[prop]) {
      throw new Error(`checkSortRechargeRule: ${ JSON.stringify(item) }`);
    }
  }
}
