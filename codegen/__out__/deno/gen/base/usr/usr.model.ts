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

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

export interface UsrSearch extends UsrSearchType {
  tenant_id?: string | null;
  is_hidden?: (0|1)[];
  $extra?: SearchExtra[];
}

export interface UsrModel extends UsrModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  is_hidden: 0|1;
}

export interface UsrInput extends UsrInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  is_hidden?: 0|1|null;
}

export type { UsrFieldCommentType as UsrFieldComment };
