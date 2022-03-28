
export interface UsrModel {
  [key: string]: any,
  is_deleted?: 0|1,
  id?: string, //ID
  lbl?: string, //名称
  username?: string, //用户名
  password?: string, //密码
  is_enabled?: 0|1, //启用
  role_ids?: string[], //角色ID
  _role_ids?: string[], //角色名称
  rem?: string, //备注
}

export interface UsrSearch {
  is_deleted?: 0|1,
  orderBy?: string,
  orderDec?: string,
  lbl?: string, //名称,
  lblLike?: string, //名称,
  username?: string, //用户名,
  usernameLike?: string, //用户名,
  role_ids?: string[][], //角色,
  role__lbl?: string[][], //角色,
}
