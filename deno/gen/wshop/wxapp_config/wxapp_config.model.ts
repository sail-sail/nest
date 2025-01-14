import type {
  WxappConfigInput as WxappConfigInputType,
  WxappConfigModel as WxappConfigModelType,
  WxappConfigSearch as WxappConfigSearchType,
  WxappConfigFieldComment as WxappConfigFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/wshop/wxapp_config";

declare const wxappConfigId: unique symbol;

declare global {
  
  /** 小程序配置 */
  type WxappConfigId = Distinct<string, typeof wxappConfigId>;
  
  /** 小程序配置 */
  interface WxappConfigSearch extends WxappConfigSearchType {
    /** 图片 */
    img?: string;
    img_like?: string;
    /** 值 */
    val?: string;
    val_like?: string;
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

  interface WxappConfigModel extends WxappConfigModelType {
    /** 系统字段 */
    is_sys: number;
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

  interface WxappConfigInput extends WxappConfigInputType {
    /** 系统字段 */
    is_sys?: number | null;
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

  interface WxappConfigFieldComment extends WxappConfigFieldCommentType {
  }
  
}

/** 小程序配置 前端允许排序的字段 */
export const canSortInApiWxappConfig = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 小程序配置 检测字段是否允许前端排序 */
export function checkSortWxappConfig(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortWxappConfig: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiWxappConfig;
    if (!canSortInApiWxappConfig[prop]) {
      throw new Error(`checkSortWxappConfig: ${ JSON.stringify(item) }`);
    }
  }
}
