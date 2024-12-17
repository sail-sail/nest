/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxPayInput as WxPayInputType,
  WxPayModel as WxPayModelType,
  WxPaySearch as WxPaySearchType,
  WxPayFieldComment as WxPayFieldCommentType,
} from "#/types";

declare global {
  
  interface WxPayModel extends WxPayModelType {
  }

  interface WxPayInput extends WxPayInputType {
  }

  interface WxPaySearch extends WxPaySearchType {
    is_deleted?: 0 | 1;
  }

  interface WxPayFieldComment extends WxPayFieldCommentType {
  }
  
}

export const wxPayFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 开发者ID
  "appid",
  // 商户号
  "mchid",
  // 公钥
  "public_key",
  // 私钥
  "private_key",
  // APIv3密钥
  "v3_key",
  // 支付终端IP
  "payer_client_ip",
  // 通知地址
  "notify_url",
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

export const wxPayQueryField = `
  ${ wxPayFields.join(" ") }
`;
