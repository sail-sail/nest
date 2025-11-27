/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DynPageDataInput as DynPageDataInputType,
  DynPageDataModel as DynPageDataModelType,
  DynPageDataSearch as DynPageDataSearchType,
  DynPageDataFieldComment as DynPageDataFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 动态页面数据 */
  interface DynPageDataModel extends DynPageDataModelType {
  }
  
  /** 动态页面数据 */
  interface DynPageDataInput extends DynPageDataInputType {
  }
  
  /** 动态页面数据 */
  interface DynPageDataSearch extends DynPageDataSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 动态页面数据 */
  interface DynPageDataFieldComment extends DynPageDataFieldCommentType {
  }
  
}

export const dynPageDataFields = [
  // ID
  "id",
  // 关联页面路由
  "ref_code",
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
  // 动态页面数据
  "dyn_page_data",
];

export const dynPageDataQueryField = `
  ${ dynPageDataFields.join(" ") }
`;
