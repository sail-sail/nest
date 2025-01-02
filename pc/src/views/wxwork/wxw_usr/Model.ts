/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxwUsrInput as WxwUsrInputType,
  WxwUsrModel as WxwUsrModelType,
  WxwUsrSearch as WxwUsrSearchType,
  WxwUsrFieldComment as WxwUsrFieldCommentType,
} from "#/types";

declare global {
  
  interface WxwUsrModel extends WxwUsrModelType {
  }

  interface WxwUsrInput extends WxwUsrInputType {
  }

  interface WxwUsrSearch extends WxwUsrSearchType {
    is_deleted?: 0 | 1;
  }

  interface WxwUsrFieldComment extends WxwUsrFieldCommentType {
  }
  
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
