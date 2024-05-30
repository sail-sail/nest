import type {
  WxUsrInput as WxUsrInputType,
  WxUsrModel as WxUsrModelType,
  WxUsrSearch as WxUsrSearchType,
  WxUsrFieldComment as WxUsrFieldCommentType,
} from "/gen/types.ts";

declare const wxUsrId: unique symbol;

declare global {
  
  type WxUsrId = Distinct<string, typeof wxUsrId>;

  interface WxUsrSearch extends WxUsrSearchType {
    /** 用户 */
    usr_id?: UsrId[];
    usr_id_is_null?: boolean;
    /** 昵称 */
    nick_name?: string;
    nick_name_like?: string;
    /** 头像 */
    avatar_url?: string;
    avatar_url_like?: string;
    /** 手机 */
    mobile?: string;
    mobile_like?: string;
    /** 小程序用户唯一标识 */
    openid?: string;
    openid_like?: string;
    /** 小程序用户统一标识 */
    unionid?: string;
    unionid_like?: string;
    /** 性别 */
    gender?: number[];
    /** 城市 */
    city?: string;
    city_like?: string;
    /** 省份 */
    province?: string;
    province_like?: string;
    /** 国家 */
    country?: string;
    country_like?: string;
    /** 语言 */
    language?: string;
    language_like?: string;
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
    tenant_id?: string | null;
    org_id?: string | null;
  }

  interface WxUsrModel extends WxUsrModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
    org_id: OrgId;
  }

  interface WxUsrInput extends WxUsrInputType {
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
    org_id?: OrgId | null;
  }

  interface WxUsrFieldComment extends WxUsrFieldCommentType {
  }
  
}
