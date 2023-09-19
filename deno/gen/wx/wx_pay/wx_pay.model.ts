import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxPayInput as WxPayInputType,
  WxPayModel as WxPayModelType,
  WxPaySearch as WxPaySearchType,
} from "/gen/types.ts";

export interface WxPaySearch extends WxPaySearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxPayModel extends WxPayModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface WxPayInput extends WxPayInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface WxPayFieldComment {
  id: string;
  lbl: string;
  appid: string;
  mchid: string;
  publicKey: string;
  privateKey: string;
  key: string;
  payer_client_ip: string;
  notify_url: string;
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
