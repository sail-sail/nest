
export interface Background_taskModel {
  [key: string]: any,
  is_deleted?: 0|1,
  id?: string, //ID
  lbl?: string, //名称
  state?: string, //状态
  type?: string, //类型
  result?: string, //执行结果
  err_msg?: string, //错误信息
  begin_time?: string, //开始时间
  end_time?: string, //结束时间
  rem?: string, //备注
}

export interface Background_taskSearch {
  is_deleted?: 0|1|"0"|"1";
  ids?: string[]; // ids
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
