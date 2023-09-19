import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxPayNoticeInput as WxPayNoticeInputType,
  WxPayNoticeModel as WxPayNoticeModelType,
  WxPayNoticeSearch as WxPayNoticeSearchType,
} from "/gen/types.ts";

export interface WxPayNoticeSearch extends WxPayNoticeSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxPayNoticeModel extends WxPayNoticeModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface WxPayNoticeInput extends WxPayNoticeInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface WxPayNoticeFieldComment {
  id: string;
  appid: string;
  mchid: string;
  openid: string;
  out_trade_no: string;
  transaction_id: string;
  trade_type: string;
  trade_type_lbl: string;
  trade_state: string;
  trade_state_lbl: string;
  trade_state_desc: string;
  bank_type: string;
  attach: string;
  success_time: string;
  success_time_lbl: string;
  total: string;
  payer_total: string;
  currency: string;
  currency_lbl: string;
  payer_currency: string;
  payer_currency_lbl: string;
  device_id: string;
  rem: string;
  raw: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
