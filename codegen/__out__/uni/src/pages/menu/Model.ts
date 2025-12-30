/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  MenuInput as MenuInputType,
  MenuModel as MenuModelType,
  MenuSearch as MenuSearchType,
  MenuFieldComment as MenuFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 菜单 */
  interface MenuModel extends MenuModelType {
  }
  
  /** 菜单 */
  interface MenuInput extends MenuInputType {
  }
  
  /** 菜单 */
  interface MenuSearch extends MenuSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 菜单 */
  interface MenuFieldComment extends MenuFieldCommentType {
  }
  
}

export const menuFields = [
  // ID
  "id",
  // 父菜单
  "parent_id",
  "parent_id_lbl",
  // 名称
  "lbl",
  // 路由
  "route_path",
  // 参数
  "route_query",
  // 首页隐藏
  "is_home_hide",
  "is_home_hide_lbl",
  // 动态页面
  "is_dyn_page",
  "is_dyn_page_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
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

export const menuQueryField = `
  ${ menuFields.join(" ") }
`;
