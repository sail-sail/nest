import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  RechargeRuleInput as RechargeRuleInputType,
  RechargeRuleModel as RechargeRuleModelType,
  RechargeRuleSearch as RechargeRuleSearchType,
  RechargeRuleFieldComment as RechargeRuleFieldCommentType,
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

declare const rechargeRuleId: unique symbol;
export type RechargeRuleId = Distinct<string, typeof rechargeRuleId>;

export interface RechargeRuleSearch extends RechargeRuleSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface RechargeRuleModel extends RechargeRuleModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface RechargeRuleInput extends RechargeRuleInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { RechargeRuleFieldCommentType as RechargeRuleFieldComment };
