import type {
  ArchiveInput as ArchiveInputType,
  ArchiveModel as ArchiveModelType,
  ArchiveSearch as ArchiveSearchType,
  ArchiveFieldComment as ArchiveFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/eams/archive";

declare const archiveId: unique symbol;

declare global {
  
  type ArchiveId = Distinct<string, typeof archiveId>;

  interface ArchiveSearch extends ArchiveSearchType {
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface ArchiveModel extends ArchiveModelType {
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

  interface ArchiveInput extends ArchiveInputType {
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

  interface ArchiveFieldComment extends ArchiveFieldCommentType {
  }
  
}

/** 全宗设置 前端允许排序的字段 */
export const canSortInApiArchive = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 全宗设置 检测字段是否允许前端排序 */
export function checkSortArchive(sort?: SortInput[]) {
  if (!sort) return;
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortArchive: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiArchive;
    if (!canSortInApiArchive[prop]) {
      throw new Error(`checkSortArchive: ${ JSON.stringify(item) }`);
    }
  }
}