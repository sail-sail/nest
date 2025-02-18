/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxwAppInput as WxwAppInputType,
  WxwAppModel as WxwAppModelType,
  WxwAppSearch as WxwAppSearchType,
  WxwAppFieldComment as WxwAppFieldCommentType,
} from "#/types";

declare global {
  
  /** 企微应用 */
  interface WxwAppModel extends WxwAppModelType {
  }
  
  /** 企微应用 */
  interface WxwAppInput extends WxwAppInputType {
  }
  
  /** 企微应用 */
  interface WxwAppSearch extends WxwAppSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 企微应用 */
  interface WxwAppFieldComment extends WxwAppFieldCommentType {
  }
  
}

export const wxwAppFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 企业ID
  "corpid",
  // 应用ID
  "agentid",
  // 可信域名
  "domain_id",
  "domain_id_lbl",
  // 应用密钥
  "corpsecret",
  // 通讯录密钥
  "contactsecret",
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
  "is_deleted",
];

export const wxwAppQueryField = `
  ${ wxwAppFields.join(" ") }
`;
