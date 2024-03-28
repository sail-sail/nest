import type {
  CronJobLogDetailInput as CronJobLogDetailInputType,
  CronJobLogDetailModel as CronJobLogDetailModelType,
  CronJobLogDetailSearch as CronJobLogDetailSearchType,
  CronJobLogDetailFieldComment as CronJobLogDetailFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const cronJobLogDetailId: unique symbol;
export type CronJobLogDetailId = Distinct<string, typeof cronJobLogDetailId>;

export interface CronJobLogDetailSearch extends CronJobLogDetailSearchType {
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

export interface CronJobLogDetailModel extends CronJobLogDetailModelType {
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

export interface CronJobLogDetailInput extends CronJobLogDetailInputType {
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

export type { CronJobLogDetailFieldCommentType as CronJobLogDetailFieldComment };
