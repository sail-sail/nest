import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DictbizInput as DictbizInputType,
  DictbizModel as DictbizModelType,
  DictbizSearch as DictbizSearchType,
  DictbizFieldComment as DictbizFieldCommentType,
} from "/gen/types.ts";

export const dictbizId = Symbol.for("DictbizId");
export type DictbizId = typeof dictbizId;

export interface DictbizSearch extends DictbizSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DictbizModel extends DictbizModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface DictbizInput extends DictbizInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { DictbizFieldCommentType as DictbizFieldComment };
