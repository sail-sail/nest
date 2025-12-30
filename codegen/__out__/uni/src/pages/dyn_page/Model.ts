/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  DynPageInput as DynPageInputType,
  DynPageModel as DynPageModelType,
  DynPageSearch as DynPageSearchType,
  DynPageFieldComment as DynPageFieldCommentType,
} from "#/types.ts";

import {
  dynPageFieldQueryField,
} from "@/pages/dyn_page_field/Model.ts";

declare global {
  
  /** 动态页面 */
  interface DynPageModel extends DynPageModelType {
  }
  
  /** 动态页面 */
  interface DynPageInput extends DynPageInputType {
  }
  
  /** 动态页面 */
  interface DynPageSearch extends DynPageSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 动态页面 */
  interface DynPageFieldComment extends DynPageFieldCommentType {
  }
  
}

export const dynPageFields = [
  // ID
  "id",
  // 路由
  "code",
  // 名称
  "lbl",
  // 父菜单
  "parent_menu_id",
  "parent_menu_id_lbl",
  // 所属角色
  "role_ids",
  "role_ids_lbl",
  // 排序
  "order_by",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
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

export const dynPageQueryField = `
  ${ dynPageFields.join(" ") }
  dyn_page_field {
    ${ dynPageFieldQueryField }
  }
`;
