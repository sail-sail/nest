

import type {
  WxoAppInput as WxoAppInputType,
  WxoAppModel as WxoAppModelType,
  WxoAppSearch as WxoAppSearchType,
  WxoAppFieldComment as WxoAppFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxoAppId: unique symbol;
export type WxoAppId = Distinct<string, typeof wxoAppId>;

export interface WxoAppSearch extends WxoAppSearchType {
  tenant_id?: string | null;
}

export interface WxoAppModel extends WxoAppModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
}

export interface WxoAppInput extends WxoAppInputType {
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

export type { WxoAppFieldCommentType as WxoAppFieldComment };
