import type {
  WxappConfigInput as WxappConfigInputType,
  WxappConfigModel as WxappConfigModelType,
  WxappConfigSearch as WxappConfigSearchType,
  WxappConfigFieldComment as WxappConfigFieldCommentType,
} from "#/types";

export interface WxappConfigModel extends WxappConfigModelType {
  /** 图片 */
  img_lbl: string;
}

export interface WxappConfigInput extends WxappConfigInputType {
}

export interface WxappConfigSearch extends WxappConfigSearchType {
}

export interface WxappConfigFieldComment extends WxappConfigFieldCommentType {
}
