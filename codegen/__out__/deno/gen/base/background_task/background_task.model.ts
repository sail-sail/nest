import type {
  BackgroundTaskInput as BackgroundTaskInputType,
  BackgroundTaskModel as BackgroundTaskModelType,
  BackgroundTaskSearch as BackgroundTaskSearchType,
  BackgroundTaskFieldComment as BackgroundTaskFieldCommentType,
} from "/gen/types.ts";

declare const backgroundTaskId: unique symbol;

declare global {
  
  type BackgroundTaskId = Distinct<string, typeof backgroundTaskId>;

  interface BackgroundTaskSearch extends BackgroundTaskSearchType {
    tenant_id?: string | null;
  }

  interface BackgroundTaskModel extends BackgroundTaskModelType {
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

  interface BackgroundTaskInput extends BackgroundTaskInputType {
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

  interface BackgroundTaskFieldComment extends BackgroundTaskFieldCommentType {
  }
  
}
