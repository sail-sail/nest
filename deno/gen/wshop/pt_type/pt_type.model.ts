import type {
  PtTypeInput as PtTypeInputType,
  PtTypeModel as PtTypeModelType,
  PtTypeSearch as PtTypeSearchType,
  PtTypeFieldComment as PtTypeFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const ptTypeId: unique symbol;
export type PtTypeId = Distinct<string, typeof ptTypeId>;

export interface PtTypeSearch extends PtTypeSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
}

export interface PtTypeModel extends PtTypeModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface PtTypeInput extends PtTypeInputType {
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
  org_id?: OrgId | null;
}

export type { PtTypeFieldCommentType as PtTypeFieldComment };
