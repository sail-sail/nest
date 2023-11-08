import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxAppInput as WxAppInputType,
  WxAppModel as WxAppModelType,
  WxAppSearch as WxAppSearchType,
} from "/gen/types.ts";

export interface WxAppSearch extends WxAppSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxAppModel extends WxAppModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface WxAppInput extends WxAppInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface WxAppFieldComment {
  id: string;
  lbl: string;
  appid: string;
  appsecret: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
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
