import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  WxappConfigInput as WxappConfigInputType,
  WxappConfigModel as WxappConfigModelType,
  WxappConfigSearch as WxappConfigSearchType,
  WxappConfigFieldComment as WxappConfigFieldCommentType,
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

declare const wxappConfigId: unique symbol;
export type WxappConfigId = Distinct<string, typeof wxappConfigId>;

export interface WxappConfigSearch extends WxappConfigSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface WxappConfigModel extends WxappConfigModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface WxappConfigInput extends WxappConfigInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { WxappConfigFieldCommentType as WxappConfigFieldComment };
