import type {
  SeoInput as SeoInputType,
  SeoModel as SeoModelType,
  SeoSearch as SeoSearchType,
  SeoFieldComment as SeoFieldCommentType,
} from "/gen/types.ts";

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
    order_by?: number[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
    tenant_id?: string | null;
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
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface SeoFieldComment extends SeoFieldCommentType {
  }
  
}
