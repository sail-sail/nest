import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
  UsrFieldComment as UsrFieldCommentType,
} from "#/types";

export interface UsrModel extends UsrModelType {
  /** 头像 */
  img_lbl: string;
}

export interface UsrInput extends UsrInputType {
}

export interface UsrSearch extends UsrSearchType {
}

export interface UsrFieldComment extends UsrFieldCommentType {
}
