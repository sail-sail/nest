
export interface Background_taskModel {
  [key: string]: any,
  id?: string, //ID
  lbl?: string, //名称
  state?: string, //状态ID
  _state?: string, //状态名称
  type?: string, //类型ID
  _type?: string, //类型名称
  result?: string, //执行结果
  err_msg?: string, //错误信息
  begin_time?: Date, //开始时间
  end_time?: Date, //结束时间
  rem?: string, //备注
  tenant_id?: string, // 租户ID
  create_usr_id?: string, // 创建用户ID
  create_time?: Date, // 创建时间
  update_usr_id?: string, // 更新用户ID
  update_time?: Date, // 更新时间
  is_deleted?: 0|1, // 是否删除
  delete_time?: Date, // 删除时间
}

export interface Background_taskSearch {
  is_deleted?: 0|1;
  orderBy?: string;
  orderDec?: string;
  id?: string; //ID
  lbl?: string; //名称
  lblLike?: string; //名称
  state?: string[]; //状态
  type?: string[]; //类型
  result?: string; //执行结果
  resultLike?: string; //执行结果
  err_msg?: string; //错误信息
  err_msgLike?: string; //错误信息
  begin_time?: string[]; //开始时间
  end_time?: string[]; //结束时间
  rem?: string; //备注
  remLike?: string; //备注
}
