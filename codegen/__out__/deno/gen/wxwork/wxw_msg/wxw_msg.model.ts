import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwMsgInput as WxwMsgInputType,
  WxwMsgModel as WxwMsgModelType,
  WxwMsgSearch as WxwMsgSearchType,
  WxwMsgFieldComment as WxwMsgFieldCommentType,
} from "/gen/types.ts";

export const wxwMsgId = Symbol.for("WxwMsgId");
export type WxwMsgId = typeof wxwMsgId;

export interface WxwMsgSearch extends WxwMsgSearchType {
  /** 链接 */
  url?: string;
  url_like?: string;
  /** 消息ID */
  msgid?: string;
  msgid_like?: string;
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwMsgModel extends WxwMsgModelType {
  /** 链接 */
  url: string;
  /** 消息ID */
  msgid: string;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface WxwMsgInput extends WxwMsgInputType {
  /** 链接 */
  url?: string;
  /** 消息ID */
  msgid?: string;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { WxwMsgFieldCommentType as WxwMsgFieldComment };
