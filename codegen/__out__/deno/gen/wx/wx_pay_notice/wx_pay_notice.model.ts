import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxPayNoticeInput as WxPayNoticeInputType,
  WxPayNoticeModel as WxPayNoticeModelType,
  WxPayNoticeSearch as WxPayNoticeSearchType,
  WxPayNoticeFieldComment as WxPayNoticeFieldCommentType,
} from "/gen/types.ts";

export const wxPayNoticeId = Symbol.for("WxPayNoticeId");
export type WxPayNoticeId = typeof wxPayNoticeId;

export interface WxPayNoticeSearch extends WxPayNoticeSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxPayNoticeModel extends WxPayNoticeModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface WxPayNoticeInput extends WxPayNoticeInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { WxPayNoticeFieldCommentType as WxPayNoticeFieldComment };
