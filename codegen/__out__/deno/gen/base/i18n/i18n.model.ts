import type {
  I18nInput as I18nInputType,
  I18nModel as I18nModelType,
  I18nSearch as I18nSearchType,
  I18nFieldComment as I18nFieldCommentType,
} from "/gen/types.ts";

declare const i18nId: unique symbol;

declare global {
  
  type I18nId = Distinct<string, typeof i18nId>;

  interface I18nSearch extends I18nSearchType {
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: string[];
    /** 更新时间 */
    update_time?: string[];
  }

  interface I18nModel extends I18nModelType {
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
  }

  interface I18nInput extends I18nInputType {
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

  interface I18nFieldComment extends I18nFieldCommentType {
  }
  
}
