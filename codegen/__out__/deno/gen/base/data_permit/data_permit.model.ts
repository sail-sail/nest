import type {
  DataPermitInput as DataPermitInputType,
  DataPermitModel as DataPermitModelType,
  DataPermitSearch as DataPermitSearchType,
  DataPermitFieldComment as DataPermitFieldCommentType,
} from "/gen/types.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const dataPermitId: unique symbol;
export type DataPermitId = Distinct<string, typeof dataPermitId>;

export interface DataPermitSearch extends DataPermitSearchType {
}

export interface DataPermitModel extends DataPermitModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_usr_id_lbl: string;
  update_time?: string | null;
  update_time_lbl: string;
}

export interface DataPermitInput extends DataPermitInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;
  create_time?: string | null;
  create_time_lbl?: string | null;
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;
  update_time?: string | null;
  update_time_lbl?: string | null;
  is_deleted?: number | null;
}

export type { DataPermitFieldCommentType as DataPermitFieldComment };
