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

export interface WxAppTokenModel extends WxAppTokenModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
}

export interface WxAppTokenInput extends WxAppTokenInputType {
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

export type { WxAppTokenFieldCommentType as WxAppTokenFieldComment };
