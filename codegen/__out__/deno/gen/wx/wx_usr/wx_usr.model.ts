import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxUsrInput as WxUsrInputType,
  WxUsrModel as WxUsrModelType,
  WxUsrSearch as WxUsrSearchType,
} from "/gen/types.ts";

export interface WxUsrSearch extends WxUsrSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxUsrModel extends WxUsrModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface WxUsrInput extends WxUsrInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface WxUsrFieldComment {
  id: string;
  lbl: string;
  usr_id: string;
  usr_id_lbl: string;
  nick_name: string;
  avatar_url: string;
  mobile: string;
  openid: string;
  gz_openid: string;
  unionid: string;
  gender: string;
  gender_lbl: string;
  city: string;
  province: string;
  country: string;
  language: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
