import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  BackgroundTaskInput as BackgroundTaskInputType,
  BackgroundTaskModel as BackgroundTaskModelType,
  BackgroundTaskSearch as BackgroundTaskSearchType,
  BackgroundTaskFieldComment as BackgroundTaskFieldCommentType,
} from "/gen/types.ts";

export const backgroundTaskId = Symbol.for("BackgroundTaskId");
export type BackgroundTaskId = typeof backgroundTaskId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface BackgroundTaskSearch extends BackgroundTaskSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface BackgroundTaskModel extends BackgroundTaskModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface BackgroundTaskInput extends BackgroundTaskInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { BackgroundTaskFieldCommentType as BackgroundTaskFieldComment };
