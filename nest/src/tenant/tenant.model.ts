
export interface TenantModel {
  [key: string]: any,
  id?: string, //ID
  lbl?: string, //名称
  host?: string, //域名绑定
  expiration?: Date, //到期日
  max_usr_num?: number, //最大用户数
  is_enabled?: 0|1, //启用ID
  _is_enabled?: string, //启用名称
  menu_ids?: string[], //菜单ID
  _menu_ids?: string[], //菜单名称
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

export interface TenantSearch {
  is_deleted?: 0|1,
  orderBy?: string,
  orderDec?: string,
  id?: string, //ID
  lbl?: string, //名称
  lblLike?: string, //名称
  host?: string, //域名绑定
  hostLike?: string, //域名绑定
  expiration?: Date, //到期日,
  expirationGt?: Date, //到期日 大于
  expirationGtEq?: Date, //到期日 大于等于
  expirationLt?: Date, //到期日 小于
  expirationLtEq?: Date, //到期日 小于等于
  max_usr_num?: number, //最大用户数,
  max_usr_numGt?: number, //最大用户数 大于
  max_usr_numGtEq?: number, //最大用户数 大于等于
  max_usr_numLt?: number, //最大用户数 小于
  max_usr_numLtEq?: number, //最大用户数 小于等于
  is_enabled?: 0|1[], //启用
  menu_ids?: string[][], //菜单
  menu__lbl?: string[][], //菜单
  order_by?: number, //排序,
  order_byGt?: number, //排序 大于
  order_byGtEq?: number, //排序 大于等于
  order_byLt?: number, //排序 小于
  order_byLtEq?: number, //排序 小于等于
  rem?: string, //备注
  remLike?: string, //备注
}
