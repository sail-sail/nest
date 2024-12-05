import type {
  SmsSendRecordInput as SmsSendRecordInputType,
  SmsSendRecordModel as SmsSendRecordModelType,
  SmsSendRecordSearch as SmsSendRecordSearchType,
  SmsSendRecordFieldComment as SmsSendRecordFieldCommentType,
} from "#/types";

declare global {
  
  interface SmsSendRecordModel extends SmsSendRecordModelType {
  }

  interface SmsSendRecordInput extends SmsSendRecordInputType {
  }

  interface SmsSendRecordSearch extends SmsSendRecordSearchType {
  }

  interface SmsSendRecordFieldComment extends SmsSendRecordFieldCommentType {
  }
  
}

export const smsSendRecordFields = [
  // ID
  "id",
  // 短信应用
  "sms_app_id",
  "sms_app_id_lbl",
  // 接收人
  "to",
  // 内容
  "content",
  // 状态
  "status",
  "status_lbl",
  // 发送时间
  "send_time",
  "send_time_lbl",
  // 标签
  "tag",
  // 日志
  "log",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  "is_deleted",
];

export const smsSendRecordQueryField = `
  ${ smsSendRecordFields.join(" ") }
`;
