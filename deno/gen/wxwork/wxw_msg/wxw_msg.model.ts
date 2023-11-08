import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwMsgInput as WxwMsgInputType,
  WxwMsgModel as WxwMsgModelType,
  WxwMsgSearch as WxwMsgSearchType,
} from "/gen/types.ts";

export interface WxwMsgSearch extends WxwMsgSearchType {
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

export interface WxwMsgFieldComment {
  id: string;
  wxw_app_id: string;
  wxw_app_id_lbl: string;
  errcode: string;
  errcode_lbl: string;
  touser: string;
  title: string;
  description: string;
  url: string;
  btntxt: string;
  create_time: string;
  create_time_lbl: string;
  errmsg: string;
  msgid: string;
}
