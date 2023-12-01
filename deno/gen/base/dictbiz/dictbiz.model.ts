import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictbizInput as DictbizInputType,
  DictbizModel as DictbizModelType,
  DictbizSearch as DictbizSearchType,
  DictbizFieldComment as DictbizFieldCommentType,
} from "/gen/types.ts";

declare const dictbizId: unique symbol;
export type DictbizId = typeof dictbizId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface DictbizSearch extends DictbizSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DictbizModel extends DictbizModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface DictbizInput extends DictbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { DictbizFieldCommentType as DictbizFieldComment };
