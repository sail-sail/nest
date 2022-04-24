
export interface RoleModel {
  [key: string]: any,
  is_deleted?: 0|1,
  id?: string, //ID
  lbl?: string, //名称
  rem?: string, //备注
  is_enabled?: 0|1, //启用
  menu_ids?: string[], //菜单ID
  _menu_ids?: string[], //菜单名称
}

export interface RoleSearch {
  is_deleted?: 0|1;
  lbl?: string; //名称
  lblLike?: string; //名称
  menu_ids?: string[][]; //菜单,
  _menu_ids?: string[][]; //菜单
}
