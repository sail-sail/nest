import type {
  PtTypeInput as PtTypeInputType,
  PtTypeModel as PtTypeModelType,
  PtTypeSearch as PtTypeSearchType,
  PtTypeFieldComment as PtTypeFieldCommentType,
} from "#/types";

export interface PtTypeModel extends PtTypeModelType {
  /** 图标 */
  img_lbl: string;
}

export interface PtTypeInput extends PtTypeInputType {
}

export interface PtTypeSearch extends PtTypeSearchType {
}

export interface PtTypeFieldComment extends PtTypeFieldCommentType {
}
