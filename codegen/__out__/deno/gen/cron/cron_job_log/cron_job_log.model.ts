import type {
  CronJobLogInput as CronJobLogInputType,
  CronJobLogModel as CronJobLogModelType,
  CronJobLogSearch as CronJobLogSearchType,
  CronJobLogFieldComment as CronJobLogFieldCommentType,
} from "/gen/types.ts";

declare const cronJobLogId: unique symbol;

declare global {
  
  type CronJobLogId = Distinct<string, typeof cronJobLogId>;

  interface CronJobLogSearch extends CronJobLogSearchType {
    /** 执行结果 */
    exec_result?: string;
    exec_result_like?: string;
    /** 结束时间 */
    end_time?: string[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 创建人 */
    create_usr_id?: UsrId[];
    create_usr_id_is_null?: boolean;
    create_usr_id_lbl?: string[];
    /** 更新人 */
    update_usr_id?: UsrId[];
    update_usr_id_is_null?: boolean;
    update_usr_id_lbl?: string[];
    /** 更新时间 */
    update_time?: string[];
    tenant_id?: TenantId | null;
  }

  interface CronJobLogModel extends CronJobLogModelType {
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

  interface CronJobLogInput extends CronJobLogInputType {
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

  interface CronJobLogFieldComment extends CronJobLogFieldCommentType {
  }
  
}
