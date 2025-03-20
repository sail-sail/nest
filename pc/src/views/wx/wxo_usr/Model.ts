/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxoUsrInput as WxoUsrInputType,
  WxoUsrModel as WxoUsrModelType,
  WxoUsrSearch as WxoUsrSearchType,
  WxoUsrFieldComment as WxoUsrFieldCommentType,
} from "#/types";

declare global {
  
  /** 公众号用户 */
  interface WxoUsrModel extends WxoUsrModelType {
    /** 头像 */
    head_img_lbl: string;
  }
  
  /** 公众号用户 */
  interface WxoUsrInput extends WxoUsrInputType {
  }
  
  /** 公众号用户 */
  interface WxoUsrSearch extends WxoUsrSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 公众号用户 */
  interface WxoUsrFieldComment extends WxoUsrFieldCommentType {
  }
  
}

export const wxoUsrFields = [
  // ID
  "id",
  // 昵称
  "lbl",
  // 头像
  "head_img",
  // 绑定用户
  "usr_id",
  "usr_id_lbl",
  // 开发者ID
  "appid",
  // 公众号用户唯一标识
  "openid",
  // 用户统一标识
  "unionid",
  // 性别
  "sex",
  "sex_lbl",
  // 省份
  "province",
  // 城市
  "city",
  // 国家
  "country",
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
