/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  SmsSendRecordInput as SmsSendRecordInputType,
  SmsSendRecordModel as SmsSendRecordModelType,
  SmsSendRecordSearch as SmsSendRecordSearchType,
  SmsSendRecordFieldComment as SmsSendRecordFieldCommentType,
} from "#/types";

declare global {
  
  /** 短信发送记录 */
  interface SmsSendRecordModel extends SmsSendRecordModelType {
  }
  
  /** 短信发送记录 */
  interface SmsSendRecordInput extends SmsSendRecordInputType {
  }
  
  /** 短信发送记录 */
  interface SmsSendRecordSearch extends SmsSendRecordSearchType {
    is_deleted?: 0 | 1;
  }
  
  /** 短信发送记录 */
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
  "send_to",
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
  // 消息
  "msg",
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
