import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwAppTokenInput as WxwAppTokenInputType,
  WxwAppTokenModel as WxwAppTokenModelType,
  WxwAppTokenSearch as WxwAppTokenSearchType,
} from "/gen/types.ts";

export interface WxwAppTokenSearch extends WxwAppTokenSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwAppTokenModel extends WxwAppTokenModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface WxwAppTokenInput extends WxwAppTokenInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export interface WxwAppTokenFieldComment {
  id: string;
  wxw_app_id: string;
  wxw_app_id_lbl: string;
  type: string;
  access_token: string;
  token_time: string;
  token_time_lbl: string;
  expires_in: string;
}
