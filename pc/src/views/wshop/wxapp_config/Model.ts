/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxappConfigInput as WxappConfigInputType,
  WxappConfigModel as WxappConfigModelType,
  WxappConfigSearch as WxappConfigSearchType,
  WxappConfigFieldComment as WxappConfigFieldCommentType,
} from "#/types";

declare global {
  
  interface WxappConfigModel extends WxappConfigModelType {
    /** 图片 */
    img_lbl: string;
  }

  interface WxappConfigInput extends WxappConfigInputType {
    /** 系统字段 */
    is_sys?: number;
  }

  interface WxappConfigSearch extends WxappConfigSearchType {
  }

  interface WxappConfigFieldComment extends WxappConfigFieldCommentType {
  }
  
}

export const wxappConfigFields = [
  // ID
  "id",
  // 图片
  "img",
  // 名称
  "lbl",
  // 值
  "val",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
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
  "is_sys",
];

export const wxappConfigQueryField = `
  ${ wxappConfigFields.join(" ") }
`;
