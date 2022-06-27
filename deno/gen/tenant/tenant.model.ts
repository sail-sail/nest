
export interface TenantModel {
  id: string, //ID
  lbl: string, //名称
  host: string, //域名绑定
  expiration: string|null, //到期日
  max_usr_num: number, //最大用户数
  is_enabled: 0|1, //启用ID
  _is_enabled: string, //启用名称
  menu_ids: string[], //菜单ID
  _menu_ids: string[], //菜单名称
  order_by: number, //排序
  rem: string, //备注
  create_usr_id: string, // 创建用户ID
  create_time: string|null, // 创建时间
  update_usr_id: string, // 更新用户ID
  update_time: string|null, // 更新时间
  is_deleted: 0|1, // 是否删除
  delete_time: string|null, // 删除时间
}

export interface TenantSearch {
  is_deleted?: 0|1; // 是否已删除
  ids?: string[]; //ID列表
  id?: string; //ID
  lbl?: string; //名称
  lblLike?: string; //名称
  host?: string; //域名绑定
  hostLike?: string; //域名绑定
  expiration?: string[]; //到期日
  max_usr_num?: number[]; //最大用户数
  is_enabled?: 0|1[]; //启用
  menu_ids?: string[][]; //菜单,
  _menu_ids?: string[][]; //菜单
  order_by?: number[]; //排序
  rem?: string; //备注
  remLike?: string; //备注
}
