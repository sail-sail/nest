
export interface MenuModel {
  [key: string]: any,
  is_deleted?: 0|1,
  id?: string, //ID
  type?: string, //类型
  menu_id?: string, //父菜单ID
  _menu_id?: string, //父菜单名称
  lbl?: string, //名称
  route_path?: string, //路由
  route_query?: any, //参数
  is_enabled?: 0|1, //启用
  order_by?: number, //排序
  rem?: string, //备注
}

export interface MenuSearch {
  is_deleted?: 0|1|"0"|"1";
  ids?: string[]; // ids
  id?: string; //ID
  type?: string[]; //类型
  menu_id?: string[]; //父菜单
  _menu_id?: string[]; //父菜单
  lbl?: string; //名称
  lblLike?: string; //名称
  route_path?: string; //路由
  route_pathLike?: string; //路由
  route_query?: any; //参数
  route_queryLike?: any; //参数
  is_enabled?: 0|1|"0"|"1"[]; //启用
  order_by?: number[]; //排序
  rem?: string; //备注
  remLike?: string; //备注
}
