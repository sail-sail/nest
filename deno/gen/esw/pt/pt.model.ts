import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PtInput as PtInputType,
  PtModel as PtModelType,
  PtSearch as PtSearchType,
  PtFieldComment as PtFieldCommentType,
} from "/gen/types.ts";

export const ptId = Symbol.for("PtId");
export type PtId = typeof ptId;

export interface PtSearch extends PtSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PtModel extends PtModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface PtInput extends PtInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { PtFieldCommentType as PtFieldComment };
