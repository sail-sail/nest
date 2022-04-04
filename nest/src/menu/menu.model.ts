
export interface MenuModel {
  [key: string]: any,
  id?: string, //ID
  type?: string, //类型ID
  _type?: string, //类型名称
  menu_id?: string, //父菜单ID
  _menu_id?: string, //父菜单名称
  lbl?: string, //名称
  route_path?: string, //路由
  route_query?: any, //参数
  is_enabled?: 0|1, //启用ID
  _is_enabled?: string, //启用名称
  order_by?: number, //排序
  rem?: string, //备注
  tenant_id?: string, // 租户ID
  create_usr_id?: string, // 创建用户ID
  create_time?: Date, // 创建时间
  update_usr_id?: string, // 更新用户ID
  update_time?: Date, // 更新时间
  is_deleted?: 0|1, // 是否删除
  delete_time?: Date, // 删除时间
}

export interface MenuSearch {
  is_deleted?: 0|1;
  orderBy?: string;
  orderDec?: string;
  id?: string; //ID
  type?: string[]; //类型
  menu_id?: string[]; //父菜单,
  menu__lbl?: string[]; //父菜单
  lbl?: string; //名称
  lblLike?: string; //名称
  route_path?: string; //路由
  route_pathLike?: string; //路由
  route_query?: any; //参数
  route_queryLike?: any; //参数
  is_enabled?: 0|1[]; //启用
  order_by?: number[]; //排序
  rem?: string; //备注
  remLike?: string; //备注
}
