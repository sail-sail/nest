

import type {
  WxoAppTokenInput as WxoAppTokenInputType,
  WxoAppTokenModel as WxoAppTokenModelType,
  WxoAppTokenSearch as WxoAppTokenSearchType,
  WxoAppTokenFieldComment as WxoAppTokenFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxoAppTokenId: unique symbol;
export type WxoAppTokenId = Distinct<string, typeof wxoAppTokenId>;

export interface WxoAppTokenSearch extends WxoAppTokenSearchType {
}

export interface WxoAppTokenModel extends WxoAppTokenModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface WxoAppTokenInput extends WxoAppTokenInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { WxoAppTokenFieldCommentType as WxoAppTokenFieldComment };
