import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxAppTokenInput as WxAppTokenInputType,
  WxAppTokenModel as WxAppTokenModelType,
  WxAppTokenSearch as WxAppTokenSearchType,
} from "/gen/types.ts";

export interface WxAppTokenSearch extends WxAppTokenSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxAppTokenModel extends WxAppTokenModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface WxAppTokenInput extends WxAppTokenInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface WxAppTokenFieldComment {
  id: string;
  wx_app_id: string;
  wx_app_id_lbl: string;
  access_token: string;
  token_time: string;
  token_time_lbl: string;
  expires_in: string;
}
