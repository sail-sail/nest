import type {
  WxoAppTokenInput as WxoAppTokenInputType,
  WxoAppTokenModel as WxoAppTokenModelType,
  WxoAppTokenSearch as WxoAppTokenSearchType,
  WxoAppTokenFieldComment as WxoAppTokenFieldCommentType,
} from "/gen/types.ts";

declare const wxoAppTokenId: unique symbol;

declare global {
  
  type WxoAppTokenId = Distinct<string, typeof wxoAppTokenId>;

  interface WxoAppTokenSearch extends WxoAppTokenSearchType {
    /** 令牌 */
    access_token?: string;
    access_token_like?: string;
    /** 令牌创建时间 */
    token_time?: string[];
    /** 令牌超时时间 */
    expires_in?: number[];
    /** 创建人 */
    create_usr_id?: UsrId[];
    create_usr_id_is_null?: boolean;
    create_usr_id_lbl?: string[];
    /** 创建时间 */
    create_time?: string[];
    /** 更新人 */
    update_usr_id?: UsrId[];
    update_usr_id_is_null?: boolean;
    update_usr_id_lbl?: string[];
    /** 更新时间 */
    update_time?: string[];
  }

  interface WxoAppTokenModel extends WxoAppTokenModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface WxoAppTokenInput extends WxoAppTokenInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
  }

  interface WxoAppTokenFieldComment extends WxoAppTokenFieldCommentType {
  }
  
}
