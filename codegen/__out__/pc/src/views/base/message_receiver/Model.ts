/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  MessageReceiverInput as MessageReceiverInputType,
  MessageReceiverModel as MessageReceiverModelType,
  MessageReceiverSearch as MessageReceiverSearchType,
  MessageReceiverFieldComment as MessageReceiverFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 消息接收人 */
  interface MessageReceiverModel extends MessageReceiverModelType {
  }
  
  /** 消息接收人 */
  interface MessageReceiverInput extends MessageReceiverInputType {
  }
  
  /** 消息接收人 */
  interface MessageReceiverSearch extends MessageReceiverSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 消息接收人 */
  interface MessageReceiverFieldComment extends MessageReceiverFieldCommentType {
  }
  
}

export const messageReceiverFields = [
  // ID
  "id",
  // 消息
  "message_id",
  "message_id_lbl",
  // 接收人
  "receiver_usr_id",
  "receiver_usr_id_lbl",
  // 已读
  "is_read",
  "is_read_lbl",
  // 阅读时间
  "read_time",
  "read_time_lbl",
  // 组织
  "org_id",
  "org_id_lbl",
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

export const messageReceiverQueryField = `
  ${ messageReceiverFields.join(" ") }
`;
