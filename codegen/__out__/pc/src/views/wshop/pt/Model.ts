import type {
  PtInput as PtInputType,
  PtModel as PtModelType,
  PtSearch as PtSearchType,
  PtFieldComment as PtFieldCommentType,
} from "#/types";

export interface PtModel extends PtModelType {
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

export interface PtInput extends PtInputType {
}

export interface PtSearch extends PtSearchType {
}

export interface PtFieldComment extends PtFieldCommentType {
}
