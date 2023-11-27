import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxAppTokenInput as WxAppTokenInputType,
  WxAppTokenModel as WxAppTokenModelType,
  WxAppTokenSearch as WxAppTokenSearchType,
  WxAppTokenFieldComment as WxAppTokenFieldCommentType,
} from "/gen/types.ts";

export const wxAppTokenId = Symbol.for("WxAppTokenId");
export type WxAppTokenId = typeof wxAppTokenId;

export interface WxAppTokenSearch extends WxAppTokenSearchType {
  $extra?: SearchExtra[];
}

export interface WxAppTokenModel extends WxAppTokenModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
}

export interface WxAppTokenInput extends WxAppTokenInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { WxAppTokenFieldCommentType as WxAppTokenFieldComment };
