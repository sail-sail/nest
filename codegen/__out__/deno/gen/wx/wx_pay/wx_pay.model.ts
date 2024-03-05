

import type {
  WxPayInput as WxPayInputType,
  WxPayModel as WxPayModelType,
  WxPaySearch as WxPaySearchType,
  WxPayFieldComment as WxPayFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxPayId: unique symbol;
export type WxPayId = Distinct<string, typeof wxPayId>;

export interface WxPaySearch extends WxPaySearchType {
  tenant_id?: string | null;
}

export interface WxPayModel extends WxPayModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface WxPayInput extends WxPayInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { WxPayFieldCommentType as WxPayFieldComment };
