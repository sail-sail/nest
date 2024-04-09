import type {
  CronJobLogDetailInput as CronJobLogDetailInputType,
  CronJobLogDetailModel as CronJobLogDetailModelType,
  CronJobLogDetailSearch as CronJobLogDetailSearchType,
  CronJobLogDetailFieldComment as CronJobLogDetailFieldCommentType,
} from "/gen/types.ts";

declare const cronJobLogDetailId: unique symbol;

declare global {
  
  type CronJobLogDetailId = Distinct<string, typeof cronJobLogDetailId>;

  interface CronJobLogDetailSearch extends CronJobLogDetailSearchType {
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

  interface CronJobLogDetailModel extends CronJobLogDetailModelType {
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

  interface CronJobLogDetailInput extends CronJobLogDetailInputType {
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

  interface CronJobLogDetailFieldComment extends CronJobLogDetailFieldCommentType {
  }
  
}
