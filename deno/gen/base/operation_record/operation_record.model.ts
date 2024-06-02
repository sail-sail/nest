import type {
  OperationRecordInput as OperationRecordInputType,
  OperationRecordModel as OperationRecordModelType,
  OperationRecordSearch as OperationRecordSearchType,
  OperationRecordFieldComment as OperationRecordFieldCommentType,
} from "/gen/types.ts";

declare const operationRecordId: unique symbol;

declare global {
  
  type OperationRecordId = Distinct<string, typeof operationRecordId>;

  interface OperationRecordSearch extends OperationRecordSearchType {
    /** 模块 */
    module?: string;
    module_like?: string;
    /** 方法 */
    method?: string;
    method_like?: string;
    /** 耗时(毫秒) */
    time?: number[];
    /** 操作前数据 */
    old_data?: string;
    old_data_like?: string;
    /** 操作后数据 */
    new_data?: string;
    new_data_like?: string;
    /** 更新人 */
    update_usr_id?: UsrId[];
    update_usr_id_is_null?: boolean;
    update_usr_id_lbl?: string[];
    /** 更新时间 */
    update_time?: string[];
    tenant_id?: TenantId | null;
  }

  interface OperationRecordModel extends OperationRecordModelType {
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

  interface OperationRecordInput extends OperationRecordInputType {
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

  interface OperationRecordFieldComment extends OperationRecordFieldCommentType {
  }
  
}
