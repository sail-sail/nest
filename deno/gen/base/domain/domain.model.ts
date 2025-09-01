import type {
  DomainInput as DomainInputType,
  DomainModel as DomainModelType,
  DomainSearch as DomainSearchType,
  DomainFieldComment as DomainFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/base/domain";

declare const domainId: unique symbol;

declare global {
  
  /** 域名 */
  type DomainId = Distinct<string, typeof domainId>;
  
  /** 域名 */
  interface DomainSearch extends DomainSearchType {
    /** 协议 */
    protocol?: string;
    protocol_like?: string;
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
  }

  interface DomainModel extends DomainModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface DomainInput extends DomainInputType {
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
  }

  interface DomainFieldComment extends DomainFieldCommentType {
  }
  
}

/** 域名 前端允许排序的字段 */
export const canSortInApiDomain = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 域名 检测字段是否允许前端排序 */
export function checkSortDomain(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortDomain: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiDomain;
    if (!canSortInApiDomain[prop]) {
      throw new Error(`checkSortDomain: ${ JSON.stringify(item) }`);
    }
  }
}

export function intoInputDomain(
  input?: DomainInput,
) {
  
  if (!input) {
    return;
  }
  
  input.id = undefined;
}
