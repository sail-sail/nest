

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
  /** 创建人 */
  create_usr_id?: UsrId[];
  create_usr_id_is_null?: boolean;
  /** 创建时间 */
  create_time?: string[];
  /** 更新人 */
  update_usr_id?: UsrId[];
  update_usr_id_is_null?: boolean;
  /** 更新时间 */
  update_time?: string[];
}

export interface WxoAppTokenModel extends WxoAppTokenModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
}

export interface WxoAppTokenInput extends WxoAppTokenInputType {
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;
  create_time?: string | null;
  create_time_lbl?: string | null;
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;
  update_time?: string | null;
  update_time_lbl?: string | null;
  is_deleted?: number | null;
}

export type { WxoAppTokenFieldCommentType as WxoAppTokenFieldComment };
