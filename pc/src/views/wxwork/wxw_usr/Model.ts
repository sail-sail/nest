/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxwUsrInput as WxwUsrInputType,
  WxwUsrModel as WxwUsrModelType,
  WxwUsrSearch as WxwUsrSearchType,
  WxwUsrFieldComment as WxwUsrFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 企微用户 */
  interface WxwUsrModel extends WxwUsrModelType {
  }
  
  /** 企微用户 */
  interface WxwUsrInput extends WxwUsrInputType {
  }
  
  /** 企微用户 */
  interface WxwUsrSearch extends WxwUsrSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 企微用户 */
  interface WxwUsrFieldComment extends WxwUsrFieldCommentType {
  }
  
}

export const wxwUsrFields = [
  // ID
  "id",
  // 企微应用
  "wxw_app_id",
  "wxw_app_id_lbl",
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
