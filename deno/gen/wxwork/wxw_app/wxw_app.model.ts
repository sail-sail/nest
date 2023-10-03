import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwAppInput as WxwAppInputType,
  WxwAppModel as WxwAppModelType,
  WxwAppSearch as WxwAppSearchType,
} from "/gen/types.ts";

export interface WxwAppSearch extends WxwAppSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwAppModel extends WxwAppModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface WxwAppInput extends WxwAppInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface WxwAppFieldComment {
  id: string;
  lbl: string;
  corpid: string;
  agentid: string;
  corpsecret: string;
  contactsecret: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
}
