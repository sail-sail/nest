
export interface OptionModel {
  [key: string]: any,
  is_deleted?: 0|1,
  id?: string, //ID
  lbl?: string, //名称
  key?: string, //键
  value?: string, //值
  rem?: string, //备注
}

export interface OptionSearch {
  is_deleted?: 0|1|"0"|"1";
  ids?: string[]; // ids
  id?: string; //ID
  lbl?: string; //名称
  lblLike?: string; //名称
  key?: string; //键
  keyLike?: string; //键
  value?: string; //值
  valueLike?: string; //值
  rem?: string; //备注
  remLike?: string; //备注
}
