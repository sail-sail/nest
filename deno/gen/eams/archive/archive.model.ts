import type {
  ArchiveInput as ArchiveInputType,
  ArchiveModel as ArchiveModelType,
  ArchiveSearch as ArchiveSearchType,
  ArchiveFieldComment as ArchiveFieldCommentType,
} from "/gen/types.ts";

declare const archiveId: unique symbol;

declare global {
  
  type ArchiveId = Distinct<string, typeof archiveId>;

  interface ArchiveSearch extends ArchiveSearchType {
    tenant_id?: string | null;
  }

  interface ArchiveModel extends ArchiveModelType {
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

  interface ArchiveInput extends ArchiveInputType {
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

  interface ArchiveFieldComment extends ArchiveFieldCommentType {
  }
  
}
