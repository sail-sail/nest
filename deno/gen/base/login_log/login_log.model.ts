import type {
  LoginLogInput as LoginLogInputType,
  LoginLogModel as LoginLogModelType,
  LoginLogSearch as LoginLogSearchType,
  LoginLogFieldComment as LoginLogFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const loginLogId: unique symbol;
export type LoginLogId = Distinct<string, typeof loginLogId>;

export interface LoginLogSearch extends LoginLogSearchType {
  /** 创建人 */
  create_usr_id?: UsrId[];
  create_usr_id_is_null?: boolean;
  /** 更新人 */
  update_usr_id?: UsrId[];
  update_usr_id_is_null?: boolean;
  /** 更新时间 */
  update_time?: string[];
  tenant_id?: string | null;
}

export interface LoginLogModel extends LoginLogModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
}

export interface LoginLogInput extends LoginLogInputType {
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

export type { LoginLogFieldCommentType as LoginLogFieldComment };
