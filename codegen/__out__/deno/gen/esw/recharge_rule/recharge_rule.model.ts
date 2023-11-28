import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  RechargeRuleInput as RechargeRuleInputType,
  RechargeRuleModel as RechargeRuleModelType,
  RechargeRuleSearch as RechargeRuleSearchType,
  RechargeRuleFieldComment as RechargeRuleFieldCommentType,
} from "/gen/types.ts";

export const rechargeRuleId = Symbol.for("RechargeRuleId");
export type RechargeRuleId = typeof rechargeRuleId;

export interface RechargeRuleSearch extends RechargeRuleSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface RechargeRuleModel extends RechargeRuleModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface RechargeRuleInput extends RechargeRuleInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { RechargeRuleFieldCommentType as RechargeRuleFieldComment };
