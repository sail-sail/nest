import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  PtTypeInput as PtTypeInputType,
  PtTypeModel as PtTypeModelType,
  PtTypeSearch as PtTypeSearchType,
  PtTypeFieldComment as PtTypeFieldCommentType,
} from "/gen/types.ts";

export const ptTypeId = Symbol.for("PtTypeId");
export type PtTypeId = typeof ptTypeId;

export interface PtTypeSearch extends PtTypeSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PtTypeModel extends PtTypeModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface PtTypeInput extends PtTypeInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { PtTypeFieldCommentType as PtTypeFieldComment };
