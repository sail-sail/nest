import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxPayNoticeInput as WxPayNoticeInputType,
  WxPayNoticeModel as WxPayNoticeModelType,
  WxPayNoticeSearch as WxPayNoticeSearchType,
  WxPayNoticeFieldComment as WxPayNoticeFieldCommentType,
} from "/gen/types.ts";

declare const wxPayNoticeId: unique symbol;
export type WxPayNoticeId = typeof wxPayNoticeId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface WxPayNoticeSearch extends WxPayNoticeSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxPayNoticeModel extends WxPayNoticeModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface WxPayNoticeInput extends WxPayNoticeInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { WxPayNoticeFieldCommentType as WxPayNoticeFieldComment };
