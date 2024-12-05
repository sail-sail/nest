import type {
  SmsAppInput as SmsAppInputType,
  SmsAppModel as SmsAppModelType,
  SmsAppSearch as SmsAppSearchType,
  SmsAppFieldComment as SmsAppFieldCommentType,
} from "#/types";

declare global {
  
  interface SmsAppModel extends SmsAppModelType {
  }

  interface SmsAppInput extends SmsAppInputType {
  }

  interface SmsAppSearch extends SmsAppSearchType {
  }

  interface SmsAppFieldComment extends SmsAppFieldCommentType {
  }
  
}

export const smsAppFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // appid
  "appid",
  // appkey
  "appkey",
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

export const smsAppQueryField = `
  ${ smsAppFields.join(" ") }
`;
