
export interface TenantModel {
  [key: string]: any,
  is_deleted?: 0|1,
  id?: string, //ID
  lbl?: string, //名称
  host?: string, //域名绑定
  expiration?: string, //到期日
  max_usr_num?: number, //最大用户数
  is_enabled?: 0|1, //启用
  menu_ids?: string[], //菜单ID
  _menu_ids?: string[], //菜单名称
  order_by?: number, //排序
  rem?: string, //备注
}

export interface TenantSearch {
  is_deleted?: 0|1|"0"|"1";
  ids?: string[]; // ids
  id?: string; //ID
  lbl?: string; //名称
  lblLike?: string; //名称
  host?: string; //域名绑定
  hostLike?: string; //域名绑定
  expiration?: string[]; //到期日
  max_usr_num?: number[]; //最大用户数
  is_enabled?: 0|1|"0"|"1"[]; //启用
  menu_ids?: string[][]; //菜单
  _menu_ids?: string[][]; //菜单
  order_by?: number[]; //排序
  rem?: string; //备注
  remLike?: string; //备注
}
