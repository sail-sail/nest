/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  MessageInput as MessageInputType,
  MessageModel as MessageModelType,
  MessageSearch as MessageSearchType,
  MessageFieldComment as MessageFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 消息 */
  interface MessageModel extends MessageModelType {
  }
  
  /** 消息 */
  interface MessageInput extends MessageInputType {
  }
  
  /** 消息 */
  interface MessageSearch extends MessageSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 消息 */
  interface MessageFieldComment extends MessageFieldCommentType {
  }
  
}

export const messageFields = [
  // ID
  "id",
  // 分类
  "category",
  "category_lbl",
  // 发送通道
  "channel",
  "channel_lbl",
  // 标题
  "title",
  // 内容
  "content",
  // 跳转路由
  "route_path",
  // 跳转参数
  "route_query",
  // 发送人
  "sender_usr_id",
  "sender_usr_id_lbl",
  // 系统消息
  "is_sys_msg",
  "is_sys_msg_lbl",
  // 置顶
  "is_pinned",
  "is_pinned_lbl",
  // 所属组织
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

export const messageQueryField = `
  ${ messageFields.join(" ") }
`;
