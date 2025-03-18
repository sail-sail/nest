/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxAppInput as WxAppInputType,
  WxAppModel as WxAppModelType,
  WxAppSearch as WxAppSearchType,
  WxAppFieldComment as WxAppFieldCommentType,
} from "#/types";

declare global {
  
  /** 小程序设置 */
  interface WxAppModel extends WxAppModelType {
  }
  
  /** 小程序设置 */
  interface WxAppInput extends WxAppInputType {
  }
  
  /** 小程序设置 */
  interface WxAppSearch extends WxAppSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 小程序设置 */
  interface WxAppFieldComment extends WxAppFieldCommentType {
  }
  
}

export const wxAppFields = [
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

export const wxAppQueryField = `
  ${ wxAppFields.join(" ") }
`;
