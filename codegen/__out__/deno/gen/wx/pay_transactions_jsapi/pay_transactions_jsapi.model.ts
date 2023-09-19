import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PayTransactionsJsapiInput as PayTransactionsJsapiInputType,
  PayTransactionsJsapiModel as PayTransactionsJsapiModelType,
  PayTransactionsJsapiSearch as PayTransactionsJsapiSearchType,
} from "/gen/types.ts";

export interface PayTransactionsJsapiSearch extends PayTransactionsJsapiSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PayTransactionsJsapiModel extends PayTransactionsJsapiModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface PayTransactionsJsapiInput extends PayTransactionsJsapiInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface PayTransactionsJsapiFieldComment {
  id: string;
  appid: string;
  mchid: string;
  description: string;
  out_trade_no: string;
  transaction_id: string;
  trade_state: string;
  trade_state_lbl: string;
  trade_state_desc: string;
  success_time: string;
  success_time_lbl: string;
  time_expire: string;
  attach: string;
  attach2: string;
  notify_url: string;
  support_fapiao: string;
  support_fapiao_lbl: string;
  total_fee: string;
  currency: string;
  currency_lbl: string;
  openid: string;
  prepay_id: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
