import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxoUsrInput as WxoUsrInputType,
  WxoUsrModel as WxoUsrModelType,
  WxoUsrSearch as WxoUsrSearchType,
  WxoUsrFieldComment as WxoUsrFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const wxoUsrId: unique symbol;
export type WxoUsrId = Distinct<string, typeof wxoUsrId>;

export interface WxoUsrSearch extends WxoUsrSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxoUsrModel extends WxoUsrModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface WxoUsrInput extends WxoUsrInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { WxoUsrFieldCommentType as WxoUsrFieldComment };