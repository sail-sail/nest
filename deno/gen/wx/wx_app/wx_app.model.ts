import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxAppInput as WxAppInputType,
  WxAppModel as WxAppModelType,
  WxAppSearch as WxAppSearchType,
  WxAppFieldComment as WxAppFieldCommentType,
} from "/gen/types.ts";

export const wxAppId = Symbol.for("WxAppId");
export type WxAppId = typeof wxAppId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface WxAppSearch extends WxAppSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxAppModel extends WxAppModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface WxAppInput extends WxAppInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { WxAppFieldCommentType as WxAppFieldComment };
