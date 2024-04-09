import type {
  WxoUsrInput as WxoUsrInputType,
  WxoUsrModel as WxoUsrModelType,
  WxoUsrSearch as WxoUsrSearchType,
  WxoUsrFieldComment as WxoUsrFieldCommentType,
} from "#/types";

declare global {
  
  interface WxoUsrModel extends WxoUsrModelType {
  }

  interface WxoUsrInput extends WxoUsrInputType {
  }

  interface WxoUsrSearch extends WxoUsrSearchType {
  }

  interface WxoUsrFieldComment extends WxoUsrFieldCommentType {
  }
  
}


export const wxoUsrFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 用户
  "usr_id",
  "usr_id_lbl",
  // 公众号用户唯一标识
  "openid",
  // 公众号用户统一标识
  "unionid",
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

export const wxoUsrQueryField = `
  ${ wxoUsrFields.join(" ") }
`;
