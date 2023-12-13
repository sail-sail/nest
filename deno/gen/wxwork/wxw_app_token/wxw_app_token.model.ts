import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwAppTokenInput as WxwAppTokenInputType,
  WxwAppTokenModel as WxwAppTokenModelType,
  WxwAppTokenSearch as WxwAppTokenSearchType,
  WxwAppTokenFieldComment as WxwAppTokenFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxwAppTokenId: unique symbol;
export type WxwAppTokenId = Distinct<string, typeof wxwAppTokenId>;

export interface WxwAppTokenSearch extends WxwAppTokenSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwAppTokenModel extends WxwAppTokenModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface WxwAppTokenInput extends WxwAppTokenInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { WxwAppTokenFieldCommentType as WxwAppTokenFieldComment };
