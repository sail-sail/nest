import type {
  WxwUsrInput as WxwUsrInputType,
  WxwUsrModel as WxwUsrModelType,
  WxwUsrSearch as WxwUsrSearchType,
  WxwUsrFieldComment as WxwUsrFieldCommentType,
} from "/gen/types.ts";

declare const wxwUsrId: unique symbol;

declare global {
  
  type WxwUsrId = Distinct<string, typeof wxwUsrId>;

  interface WxwUsrSearch extends WxwUsrSearchType {
    /** 手机号 */
    mobile?: string;
    mobile_like?: string;
    /** 性别 */
    gender?: string;
    gender_like?: string;
    /** 邮箱 */
    email?: string;
    email_like?: string;
    /** 企业邮箱 */
    biz_email?: string;
    biz_email_like?: string;
    /** 直属上级 */
    direct_leader?: string;
    direct_leader_like?: string;
    /** 职位 */
    position?: string;
    position_like?: string;
    /** 头像 */
    avatar?: string;
    avatar_like?: string;
    /** 头像缩略图 */
    thumb_avatar?: string;
    thumb_avatar_like?: string;
    /** 个人二维码 */
    qr_code?: string;
    qr_code_like?: string;
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
    tenant_id?: string | null;
  }

  interface WxwUsrModel extends WxwUsrModelType {
    /** 手机号 */
    mobile: string;
    /** 性别 */
    gender: string;
    /** 邮箱 */
    email: string;
    /** 企业邮箱 */
    biz_email: string;
    /** 直属上级 */
    direct_leader: string;
    /** 职位 */
    position: string;
    /** 头像 */
    avatar: string;
    /** 头像缩略图 */
    thumb_avatar: string;
    /** 个人二维码 */
    qr_code: string;
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
  }

  interface WxwUsrInput extends WxwUsrInputType {
    /** 手机号 */
    mobile?: string;
    /** 性别 */
    gender?: string;
    /** 邮箱 */
    email?: string;
    /** 企业邮箱 */
    biz_email?: string;
    /** 直属上级 */
    direct_leader?: string;
    /** 职位 */
    position?: string;
    /** 头像 */
    avatar?: string;
    /** 头像缩略图 */
    thumb_avatar?: string;
    /** 个人二维码 */
    qr_code?: string;
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
  }

  interface WxwUsrFieldComment extends WxwUsrFieldCommentType {
  }
  
}