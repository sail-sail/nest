import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwUsrInput as WxwUsrInputType,
  WxwUsrModel as WxwUsrModelType,
  WxwUsrSearch as WxwUsrSearchType,
} from "/gen/types.ts";

export interface WxwUsrSearch extends WxwUsrSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwUsrModel extends WxwUsrModelType {
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
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface WxwUsrInput extends WxwUsrInputType {
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
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface WxwUsrFieldComment {
  id: string;
  lbl: string;
  userid: string;
  mobile: string;
  gender: string;
  email: string;
  biz_email: string;
  direct_leader: string;
  position: string;
  avatar: string;
  thumb_avatar: string;
  qr_code: string;
  rem: string;
}
