

import type {
  UsrInput as UsrInputType,
  UsrModel as UsrModelType,
  UsrSearch as UsrSearchType,
  UsrFieldComment as UsrFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

declare const usrId: unique symbol;
export type UsrId = Distinct<string, typeof usrId>;

export interface UsrSearch extends UsrSearchType {
  tenant_id?: string | null;
  is_hidden?: (0|1)[];
}

export interface UsrModel extends UsrModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
  is_hidden: 0|1;
}

export interface UsrInput extends UsrInputType {
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
  is_hidden?: 0|1|null;
}

export type { UsrFieldCommentType as UsrFieldComment };
