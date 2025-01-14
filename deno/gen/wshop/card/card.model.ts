import type {
  CardInput as CardInputType,
  CardModel as CardModelType,
  CardSearch as CardSearchType,
  CardFieldComment as CardFieldCommentType,
  // 会员等级
  CardGrade,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wshop/card";

declare const cardId: unique symbol;

declare global {
  
  /** 会员卡 */
  type CardId = Distinct<string, typeof cardId>;
  
  /** 会员卡 */
  interface CardSearch extends CardSearchType {
    /** 卡号-序列号 */
    lbl_seq?: [(number|undefined|null), (number|undefined|null)];
    /** 会员等级 */
    grade?: CardGrade[];
    /** 充值余额 */
    balance?: [(string|undefined|null), (string|undefined|null)];
    /** 赠送余额 */
    give_balance?: [(string|undefined|null), (string|undefined|null)];
    /** 积分 */
    integral?: [(number|undefined|null), (number|undefined|null)];
    /** 累计消费 */
    growth_amt?: [(string|undefined|null), (string|undefined|null)];
    /** 默认 */
    is_default_card?: number[];
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

  interface CardModel extends CardModelType {
    /** 卡号-序列号 */
    lbl_seq: number;
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

  interface CardInput extends CardInputType {
    /** 卡号-序列号 */
    lbl_seq?: number | null;
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

  interface CardFieldComment extends CardFieldCommentType {
  }
  
}

/** 会员卡 前端允许排序的字段 */
export const canSortInApiCard = {
  // 积分
  "integral": true,
  // 累计消费
  "growth_amt": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 会员卡 检测字段是否允许前端排序 */
export function checkSortCard(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortCard: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiCard;
    if (!canSortInApiCard[prop]) {
      throw new Error(`checkSortCard: ${ JSON.stringify(item) }`);
    }
  }
}
