import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  LoginLogInput as LoginLogInputType,
  LoginLogModel as LoginLogModelType,
  LoginLogSearch as LoginLogSearchType,
  LoginLogFieldComment as LoginLogFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const loginLogId: unique symbol;
export type LoginLogId = Distinct<string, typeof loginLogId>;

export interface LoginLogSearch extends LoginLogSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface LoginLogModel extends LoginLogModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface LoginLogInput extends LoginLogInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { LoginLogFieldCommentType as LoginLogFieldComment };
