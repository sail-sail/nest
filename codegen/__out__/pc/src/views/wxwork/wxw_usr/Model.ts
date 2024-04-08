import type {
  WxwUsrInput as WxwUsrInputType,
  WxwUsrModel as WxwUsrModelType,
  WxwUsrSearch as WxwUsrSearchType,
  WxwUsrFieldComment as WxwUsrFieldCommentType,
} from "#/types";

export interface WxwUsrModel extends WxwUsrModelType {
}

export interface WxwUsrInput extends WxwUsrInputType {
}

export interface WxwUsrSearch extends WxwUsrSearchType {
}

export interface WxwUsrFieldComment extends WxwUsrFieldCommentType {
}

export const wxwUsrFields = [
  // ID
  "id",
  // 姓名
  "lbl",
  // 用户ID
  "userid",
  // 备注
  "rem",
  "is_deleted",
];

export const wxwUsrQueryField = `
  ${ wxwUsrFields.join(" ") }
`;
