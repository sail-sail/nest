/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  SeoInput as SeoInputType,
  SeoModel as SeoModelType,
  SeoSearch as SeoSearchType,
  SeoFieldComment as SeoFieldCommentType,
} from "#/types";

declare global {
  
  interface SeoModel extends SeoModelType {
    /** 分享图片 */
    og_image_lbl: string;
  }

  interface SeoInput extends SeoInputType {
  }

  interface SeoSearch extends SeoSearchType {
    is_deleted?: 0 | 1;
  }

  interface SeoFieldComment extends SeoFieldCommentType {
  }
  
}

export const seoFields = [
  // ID
  "id",
  // 标题
  "title",
  // 描述
  "description",
  // 关键词
  "keywords",
  // 分享图片
  "og_image",
  // 分享标题
  "og_title",
  // 分享描述
  "og_description",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 默认
  "is_default",
  "is_default_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const seoQueryField = `
  ${ seoFields.join(" ") }
`;
