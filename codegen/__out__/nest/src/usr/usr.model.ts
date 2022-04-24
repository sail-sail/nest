
export interface UsrModel {
  [key: string]: any,
  id?: string, //ID
  lbl?: string, //名称
  username?: string, //用户名
  password?: string, //密码
  is_enabled?: 0|1, //启用ID
  _is_enabled?: string, //启用名称
  role_ids?: string[], //角色ID
  _role_ids?: string[], //角色名称
  rem?: string, //备注
  tenant_id?: string, // 租户ID
  create_usr_id?: string, // 创建用户ID
  create_time?: Date, // 创建时间
  update_usr_id?: string, // 更新用户ID
  update_time?: Date, // 更新时间
  is_deleted?: 0|1, // 是否删除
  delete_time?: Date, // 删除时间
}

export interface UsrSearch {
  is_deleted?: 0|1;
  id?: string; //ID
  lbl?: string; //名称
  lblLike?: string; //名称
  username?: string; //用户名
  usernameLike?: string; //用户名
  password?: string; //密码
  passwordLike?: string; //密码
  is_enabled?: 0|1[]; //启用
  role_ids?: string[][]; //角色,
  _role_ids?: string[][]; //角色
  rem?: string; //备注
  remLike?: string; //备注
}
