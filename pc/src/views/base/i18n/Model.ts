/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  I18nInput as I18nInputType,
  I18nModel as I18nModelType,
  I18nSearch as I18nSearchType,
  I18nFieldComment as I18nFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 国际化 */
  interface I18nModel extends I18nModelType {
  }
  
  /** 国际化 */
  interface I18nInput extends I18nInputType {
  }
  
  /** 国际化 */
  interface I18nSearch extends I18nSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 国际化 */
  interface I18nFieldComment extends I18nFieldCommentType {
  }
  
}

export const i18nFields = [
  // ID
  "id",
  // 语言
  "lang_id",
  "lang_id_lbl",
  // 菜单
  "menu_id",
  "menu_id_lbl",
  // 编码
  "code",
  // 名称
  "lbl",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const i18nQueryField = `
  ${ i18nFields.join(" ") }
`;
