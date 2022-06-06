
export interface PermitModel {
  [key: string]: any,
  id?: string, //ID
  menu_id?: string, //菜单ID
  _menu_id?: string, //菜单名称
  lbl?: string, //名称
  rem?: string, //备注
  tenant_id?: string, // 租户ID
  create_usr_id?: string, // 创建用户ID
  create_time?: Date, // 创建时间
  update_usr_id?: string, // 更新用户ID
  update_time?: Date, // 更新时间
  is_deleted?: 0|1, // 是否删除
  delete_time?: Date, // 删除时间
}

export interface PermitSearch {
  is_deleted?: 0|1; // 是否已删除
  ids?: string[]; //ID列表
  id?: string; //ID
  menu_id?: string[]; //菜单,
  _menu_id?: string[]; //菜单
  lbl?: string; //名称
  lblLike?: string; //名称
  rem?: string; //备注
  remLike?: string; //备注
}
