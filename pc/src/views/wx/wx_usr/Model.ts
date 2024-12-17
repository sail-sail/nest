/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxUsrInput as WxUsrInputType,
  WxUsrModel as WxUsrModelType,
  WxUsrSearch as WxUsrSearchType,
  WxUsrFieldComment as WxUsrFieldCommentType,
} from "#/types";

declare global {
  
  interface WxUsrModel extends WxUsrModelType {
  }

  interface WxUsrInput extends WxUsrInputType {
  }

  interface WxUsrSearch extends WxUsrSearchType {
  }

  interface WxUsrFieldComment extends WxUsrFieldCommentType {
  }
  
}

export const wxUsrFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 用户
  "usr_id",
  "usr_id_lbl",
  // 昵称
  "nick_name",
  // 头像
  "avatar_url",
  // 手机
  "mobile",
  // 小程序用户唯一标识
  "openid",
  // 用户统一标识
  "unionid",
  // 性别
  "gender",
  "gender_lbl",
  // 城市
  "city",
  // 省份
  "province",
  // 国家
  "country",
  // 语言
  "language",
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

export const wxUsrQueryField = `
  ${ wxUsrFields.join(" ") }
`;
