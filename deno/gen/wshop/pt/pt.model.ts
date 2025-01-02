import type {
  PtInput as PtInputType,
  PtModel as PtModelType,
  PtSearch as PtSearchType,
  PtFieldComment as PtFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wshop/pt";

declare const ptId: unique symbol;

declare global {
  
  type PtId = Distinct<string, typeof ptId>;

  interface PtSearch extends PtSearchType {
    /** 图标 */
    img?: string;
    img_like?: string;
    /** 价格 */
    price?: [(string|undefined|null), (string|undefined|null)];
    /** 原价 */
    original_price?: [(string|undefined|null), (string|undefined|null)];
    /** 单位 */
    unit?: string;
    unit_like?: string;
    /** 新品 */
    is_new?: number[];
    /** 简介 */
    introduct?: string;
    introduct_like?: string;
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 详情 */
    detail?: string;
    detail_like?: string;
    /** 详情顶部图片 */
    detail_top_img?: string;
    detail_top_img_like?: string;
    /** 详情底部图片 */
    detail_bottom_img?: string;
    detail_bottom_img_like?: string;
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

  interface PtModel extends PtModelType {
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

  interface PtInput extends PtInputType {
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

  interface PtFieldComment extends PtFieldCommentType {
  }
  
}

/** 产品 前端允许排序的字段 */
export const canSortInApiPt = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 产品 检测字段是否允许前端排序 */
export function checkSortPt(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortPt: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiPt;
    if (!canSortInApiPt[prop]) {
      throw new Error(`checkSortPt: ${ JSON.stringify(item) }`);
    }
  }
}
