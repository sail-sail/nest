import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxAppTokenInput as WxAppTokenInputType,
  WxAppTokenModel as WxAppTokenModelType,
  WxAppTokenSearch as WxAppTokenSearchType,
  WxAppTokenFieldComment as WxAppTokenFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxAppTokenId: unique symbol;
export type WxAppTokenId = Distinct<string, typeof wxAppTokenId>;

export interface WxAppTokenSearch extends WxAppTokenSearchType {
  $extra?: SearchExtra[];
}

export interface WxAppTokenModel extends WxAppTokenModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
}

export interface WxAppTokenInput extends WxAppTokenInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
}

export type { WxAppTokenFieldCommentType as WxAppTokenFieldComment };