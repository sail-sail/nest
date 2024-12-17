/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  PtInput as PtInputType,
  PtModel as PtModelType,
  PtSearch as PtSearchType,
  PtFieldComment as PtFieldCommentType,
} from "#/types";

declare global {
  
  interface PtModel extends PtModelType {
    /** 图标 */
    img_lbl: string;
    /** 价格 */
    price_lbl: string;
    /** 原价 */
    original_price_lbl: string;
    /** 详情顶部图片 */
    detail_top_img_lbl: string;
    /** 详情底部图片 */
    detail_bottom_img_lbl: string;
  }

  interface PtInput extends PtInputType {
  }

  interface PtSearch extends PtSearchType {
  }

  interface PtFieldComment extends PtFieldCommentType {
  }
  
}

export const ptFields = [
  // ID
  "id",
  // 图标
  "img",
  // 名称
  "lbl",
  // 产品类别
  "pt_type_ids",
  "pt_type_ids_lbl",
  // 价格
  "price",
  // 原价
  "original_price",
  // 单位
  "unit",
  // 新品
  "is_new",
  "is_new_lbl",
  // 简介
  "introduct",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 详情
  "detail",
  // 详情顶部图片
  "detail_top_img",
  // 详情底部图片
  "detail_bottom_img",
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

export const ptQueryField = `
  ${ ptFields.join(" ") }
`;
