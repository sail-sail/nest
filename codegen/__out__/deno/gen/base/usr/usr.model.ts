import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
  UsrFieldComment as UsrFieldCommentType,
} from "/gen/types.ts";

export const usrId = Symbol.for("UsrId");
export type UsrId = typeof usrId;

export interface UsrSearch extends UsrSearchType {
  tenant_id?: string | null;
  is_hidden?: (0|1)[];
  $extra?: SearchExtra[];
}

export interface UsrModel extends UsrModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  is_hidden: 0|1;
}

export interface UsrInput extends UsrInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  is_hidden?: 0|1|null;
}

export type { UsrFieldCommentType as UsrFieldComment };
