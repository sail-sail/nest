import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxwAppInput as WxwAppInputType,
  WxwAppModel as WxwAppModelType,
  WxwAppSearch as WxwAppSearchType,
  WxwAppFieldComment as WxwAppFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxwAppId: unique symbol;
export type WxwAppId = Distinct<string, typeof wxwAppId>;

export interface WxwAppSearch extends WxwAppSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxwAppModel extends WxwAppModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface WxwAppInput extends WxwAppInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { WxwAppFieldCommentType as WxwAppFieldComment };
