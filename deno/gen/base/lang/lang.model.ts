import type {
  LangInput as LangInputType,
  LangModel as LangModelType,
  LangSearch as LangSearchType,
  LangFieldComment as LangFieldCommentType,
} from "/gen/types.ts";

declare const langId: unique symbol;

declare global {
  
  type LangId = Distinct<string, typeof langId>;

  interface LangSearch extends LangSearchType {
    /** 排序 */
    order_by?: number[];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
  }

  interface LangModel extends LangModelType {
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

  interface LangInput extends LangInputType {
    /** 系统字段 */
    is_sys?: number | null;
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

  interface LangFieldComment extends LangFieldCommentType {
  }
  
}
