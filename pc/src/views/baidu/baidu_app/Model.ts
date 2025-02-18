/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  BaiduAppInput as BaiduAppInputType,
  BaiduAppModel as BaiduAppModelType,
  BaiduAppSearch as BaiduAppSearchType,
  BaiduAppFieldComment as BaiduAppFieldCommentType,
} from "#/types";

declare global {
  
  /** 百度应用 */
  interface BaiduAppModel extends BaiduAppModelType {
  }
  
  /** 百度应用 */
  interface BaiduAppInput extends BaiduAppInputType {
  }
  
  /** 百度应用 */
  interface BaiduAppSearch extends BaiduAppSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 百度应用 */
  interface BaiduAppFieldComment extends BaiduAppFieldCommentType {
  }
  
}

export const baiduAppFields = [
  // ID
  "id",
  // 应用名称
  "lbl",
  // AppID
  "appid",
  // API Key
  "api_key",
  // Secret Key
  "secret_key",
  // AES Key
  "aes_key",
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

export const baiduAppQueryField = `
  ${ baiduAppFields.join(" ") }
`;
