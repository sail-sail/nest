import type {
  DictInput as DictInputType,
  DictModel as DictModelType,
  DictSearch as DictSearchType,
  DictFieldComment as DictFieldCommentType,
} from "/gen/types.ts";

declare const dictId: unique symbol;

declare global {
  
  type DictId = Distinct<string, typeof dictId>;

  interface DictSearch extends DictSearchType {
  }

  interface DictModel extends DictModelType {
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

  interface DictInput extends DictInputType {
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

  interface DictFieldComment extends DictFieldCommentType {
  }
  
}
