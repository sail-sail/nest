

import type {
  OptbizInput as OptbizInputType,
  OptbizModel as OptbizModelType,
  OptbizSearch as OptbizSearchType,
  OptbizFieldComment as OptbizFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const optbizId: unique symbol;
export type OptbizId = Distinct<string, typeof optbizId>;

export interface OptbizSearch extends OptbizSearchType {
  tenant_id?: string | null;
}

export interface OptbizModel extends OptbizModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
}

export interface OptbizInput extends OptbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;
  create_time?: string | null;
  create_time_lbl?: string | null;
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;
  update_time?: string | null;
  update_time_lbl?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { OptbizFieldCommentType as OptbizFieldComment };
