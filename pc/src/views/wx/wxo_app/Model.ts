/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxoAppInput as WxoAppInputType,
  WxoAppModel as WxoAppModelType,
  WxoAppSearch as WxoAppSearchType,
  WxoAppFieldComment as WxoAppFieldCommentType,
} from "#/types";

declare global {
  
  interface WxoAppModel extends WxoAppModelType {
  }

  interface WxoAppInput extends WxoAppInputType {
  }

  interface WxoAppSearch extends WxoAppSearchType {
  }

  interface WxoAppFieldComment extends WxoAppFieldCommentType {
  }
  
}

export const wxoAppFields = [
  // ID
  "id",
  // 原始ID
  "code",
  // 名称
  "lbl",
  // 开发者ID
  "appid",
  // 开发者密码
  "appsecret",
  // 令牌
  "token",
  // 消息加解密密钥
  "encoding_aes_key",
  // 消息加解密方式
  "encoding_type",
  "encoding_type_lbl",
  // 授权作用域
  "scope",
  "scope_lbl",
  // 网页授权域名
  "domain_id",
  "domain_id_lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
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

export const wxoAppQueryField = `
  ${ wxoAppFields.join(" ") }
`;
