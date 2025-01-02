import type {
  SeoInput as SeoInputType,
  SeoModel as SeoModelType,
  SeoSearch as SeoSearchType,
  SeoFieldComment as SeoFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/nuxt/seo";

declare const seoId: unique symbol;

declare global {
  
  type SeoId = Distinct<string, typeof seoId>;

  interface SeoSearch extends SeoSearchType {
    /** 标题 */
    title?: string;
    title_like?: string;
    /** 描述 */
    description?: string;
    description_like?: string;
    /** 关键词 */
    keywords?: string;
    keywords_like?: string;
    /** 分享图片 */
    og_image?: string;
    og_image_like?: string;
    /** 分享标题 */
    og_title?: string;
    og_title_like?: string;
    /** 分享描述 */
    og_description?: string;
    og_description_like?: string;
    /** 锁定 */
    is_locked?: number[];
    /** 默认 */
    is_default?: number[];
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

  interface SeoModel extends SeoModelType {
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

  interface SeoInput extends SeoInputType {
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

  interface SeoFieldComment extends SeoFieldCommentType {
  }
  
}

/** SEO优化 前端允许排序的字段 */
export const canSortInApiSeo = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** SEO优化 检测字段是否允许前端排序 */
export function checkSortSeo(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortSeo: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiSeo;
    if (!canSortInApiSeo[prop]) {
      throw new Error(`checkSortSeo: ${ JSON.stringify(item) }`);
    }
  }
}
