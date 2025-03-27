/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  WxwMsgInput as WxwMsgInputType,
  WxwMsgModel as WxwMsgModelType,
  WxwMsgSearch as WxwMsgSearchType,
  WxwMsgFieldComment as WxwMsgFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 企微消息 */
  interface WxwMsgModel extends WxwMsgModelType {
  }
  
  /** 企微消息 */
  interface WxwMsgInput extends WxwMsgInputType {
  }
  
  /** 企微消息 */
  interface WxwMsgSearch extends WxwMsgSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 企微消息 */
  interface WxwMsgFieldComment extends WxwMsgFieldCommentType {
  }
  
}

export const wxwMsgFields = [
  // ID
  "id",
  // 企微应用
  "wxw_app_id",
  "wxw_app_id_lbl",
  // 发送状态
  "errcode",
  "errcode_lbl",
  // 成员ID
  "touser",
  // 标题
  "title",
  // 描述
  "description",
  // 按钮文字
  "btntxt",
  // 发送时间
  "create_time",
  "create_time_lbl",
  // 错误信息
  "errmsg",
  "is_deleted",
];

export const wxwMsgQueryField = `
  ${ wxwMsgFields.join(" ") }
`;
