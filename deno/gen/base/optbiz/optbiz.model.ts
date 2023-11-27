import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OptbizInput as OptbizInputType,
  OptbizModel as OptbizModelType,
  OptbizSearch as OptbizSearchType,
  OptbizFieldComment as OptbizFieldCommentType,
} from "/gen/types.ts";

export const optbizId = Symbol.for("OptbizId");
export type OptbizId = typeof optbizId;

export interface OptbizSearch extends OptbizSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OptbizModel extends OptbizModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface OptbizInput extends OptbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { OptbizFieldCommentType as OptbizFieldComment };
