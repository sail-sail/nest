export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export type Background_TaskInput = {
  /** 状态名称 */
  _state?: InputMaybe<Scalars['String']>;
  /** 类型名称 */
  _type?: InputMaybe<Scalars['String']>;
  /** 开始时间 */
  begin_time?: InputMaybe<Scalars['String']>;
  /** 结束时间 */
  end_time?: InputMaybe<Scalars['String']>;
  /** 错误信息 */
  err_msg?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 执行结果 */
  result?: InputMaybe<Scalars['String']>;
  /** 状态ID */
  state?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 类型ID */
  type?: InputMaybe<Scalars['String']>;
};

export type Background_TaskModel = {
  __typename?: 'Background_TaskModel';
  /** 状态名称 */
  _state?: Maybe<Scalars['String']>;
  /** 类型名称 */
  _type?: Maybe<Scalars['String']>;
  /** 开始时间 */
  begin_time?: Maybe<Scalars['String']>;
  /** 结束时间 */
  end_time?: Maybe<Scalars['String']>;
  /** 错误信息 */
  err_msg: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 执行结果 */
  result: Scalars['String'];
  /** 状态ID */
  state: Scalars['String'];
  /** 类型ID */
  type: Scalars['String'];
};

export type Background_TaskSearch = {
  _create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 开始时间 */
  begin_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 结束时间 */
  end_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 错误信息 */
  err_msg?: InputMaybe<Scalars['String']>;
  err_msgLike?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 执行结果 */
  result?: InputMaybe<Scalars['String']>;
  resultLike?: InputMaybe<Scalars['String']>;
  /** 状态 */
  state?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 类型 */
  type?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DeptInput = {
  /** 创建人名称 */
  _create_usr_id?: InputMaybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 父部门名称 */
  _parent_id?: InputMaybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 父部门ID */
  parent_id?: InputMaybe<Scalars['ID']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id?: InputMaybe<Scalars['ID']>;
};

export type DeptModel = {
  __typename?: 'DeptModel';
  /** 创建人名称 */
  _create_usr_id?: Maybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 父部门名称 */
  _parent_id?: Maybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: Maybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: Maybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 父部门ID */
  parent_id: Scalars['ID'];
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id: Scalars['ID'];
};

export type DeptSearch = {
  _create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _parent_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 父部门 */
  parent_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type DictInput = {
  /** 创建人名称 */
  _create_usr_id?: InputMaybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 数据类型名称 */
  _type?: InputMaybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: InputMaybe<Scalars['String']>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 数据类型ID */
  type?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id?: InputMaybe<Scalars['ID']>;
};

export type DictModel = {
  __typename?: 'DictModel';
  /** 创建人名称 */
  _create_usr_id?: Maybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 数据类型名称 */
  _type?: Maybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: Maybe<Scalars['String']>;
  /** 编码 */
  code: Scalars['String'];
  /** 创建时间 */
  create_time?: Maybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 数据类型ID */
  type: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id: Scalars['ID'];
};

export type DictSearch = {
  _create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  codeLike?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Dict_DetailInput = {
  /** 系统字典名称 */
  _dict_id?: InputMaybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 系统字典ID */
  dict_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
};

export type Dict_DetailModel = {
  __typename?: 'Dict_DetailModel';
  /** 系统字典名称 */
  _dict_id?: Maybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 系统字典ID */
  dict_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type Dict_DetailSearch = {
  _dict_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 系统字典 */
  dict_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  valLike?: InputMaybe<Scalars['String']>;
};

export type DictbizInput = {
  /** 创建人名称 */
  _create_usr_id?: InputMaybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 数据类型名称 */
  _type?: InputMaybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: InputMaybe<Scalars['String']>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 数据类型ID */
  type?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id?: InputMaybe<Scalars['ID']>;
};

export type DictbizModel = {
  __typename?: 'DictbizModel';
  /** 创建人名称 */
  _create_usr_id?: Maybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 数据类型名称 */
  _type?: Maybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: Maybe<Scalars['String']>;
  /** 编码 */
  code: Scalars['String'];
  /** 创建时间 */
  create_time?: Maybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 数据类型ID */
  type: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id: Scalars['ID'];
};

export type DictbizSearch = {
  _create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  codeLike?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Dictbiz_DetailInput = {
  /** 业务字典名称 */
  _dictbiz_id?: InputMaybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 业务字典ID */
  dictbiz_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
};

export type Dictbiz_DetailModel = {
  __typename?: 'Dictbiz_DetailModel';
  /** 业务字典名称 */
  _dictbiz_id?: Maybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 业务字典ID */
  dictbiz_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type Dictbiz_DetailSearch = {
  _dictbiz_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 业务字典 */
  dictbiz_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  valLike?: InputMaybe<Scalars['String']>;
};

export type GetDict = {
  __typename?: 'GetDict';
  /** 字典编码 */
  code: Scalars['String'];
  /** id */
  id: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 数据类型 */
  type: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type GetLoginInfo = {
  __typename?: 'GetLoginInfo';
  dept_id?: Maybe<Scalars['String']>;
  dept_idModels: Array<GetLoginInfoDept_IdModels>;
  lang: Scalars['String'];
  lbl: Scalars['String'];
};

export type GetLoginInfoDept_IdModels = {
  __typename?: 'GetLoginInfoDept_idModels';
  id: Scalars['String'];
  lbl: Scalars['String'];
};

export type GetLoginTenants = {
  __typename?: 'GetLoginTenants';
  /** ID */
  id?: Maybe<Scalars['ID']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
};

export type GetMenus = {
  __typename?: 'GetMenus';
  children?: Maybe<Scalars['JSON']>;
  id: Scalars['String'];
  lbl: Scalars['String'];
  route_path?: Maybe<Scalars['String']>;
  route_query?: Maybe<Scalars['String']>;
};

export type I18nInput = {
  /** 语言名称 */
  _lang_id?: InputMaybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_id?: InputMaybe<Scalars['String']>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 语言ID */
  lang_id?: InputMaybe<Scalars['ID']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 菜单ID */
  menu_id?: InputMaybe<Scalars['ID']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type I18nModel = {
  __typename?: 'I18nModel';
  /** 语言名称 */
  _lang_id?: Maybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_id?: Maybe<Scalars['String']>;
  /** 编码 */
  code: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 语言ID */
  lang_id: Scalars['ID'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 菜单ID */
  menu_id: Scalars['ID'];
  /** 备注 */
  rem: Scalars['String'];
};

export type I18nSearch = {
  _lang_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _menu_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  codeLike?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 语言 */
  lang_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
};

export type LangInput = {
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type LangModel = {
  __typename?: 'LangModel';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 编码 */
  code: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
};

export type LangSearch = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  codeLike?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
};

export type LoginModel = {
  __typename?: 'LoginModel';
  authorization: Scalars['String'];
  dept_id?: Maybe<Scalars['String']>;
};

export type MenuInput = {
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 父菜单名称 */
  _menu_id?: InputMaybe<Scalars['String']>;
  /** 类型名称 */
  _type?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 父菜单ID */
  menu_id?: InputMaybe<Scalars['ID']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 路由 */
  route_path?: InputMaybe<Scalars['String']>;
  /** 参数 */
  route_query?: InputMaybe<Scalars['JSON']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 类型ID */
  type?: InputMaybe<Scalars['String']>;
};

export type MenuModel = {
  __typename?: 'MenuModel';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 父菜单名称 */
  _menu_id?: Maybe<Scalars['String']>;
  /** 类型名称 */
  _type?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 父菜单ID */
  menu_id: Scalars['ID'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 路由 */
  route_path: Scalars['String'];
  /** 参数 */
  route_query?: Maybe<Scalars['JSON']>;
  /** 类型ID */
  type: Scalars['String'];
};

export type MenuSearch = {
  _menu_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 父菜单 */
  menu_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 路由 */
  route_path?: InputMaybe<Scalars['String']>;
  route_pathLike?: InputMaybe<Scalars['String']>;
  /** 参数 */
  route_query?: InputMaybe<Scalars['String']>;
  route_queryLike?: InputMaybe<Scalars['String']>;
  /** 类型 */
  type?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** 创建一条数据 */
  createDept: Scalars['ID'];
  /** 创建一条数据 */
  createDict: Scalars['ID'];
  /** 创建一条数据 */
  createDict_detail: Scalars['ID'];
  /** 创建一条数据 */
  createDictbiz: Scalars['ID'];
  /** 创建一条数据 */
  createDictbiz_detail: Scalars['ID'];
  /** 创建一条数据 */
  createI18n: Scalars['ID'];
  /** 创建一条数据 */
  createLang: Scalars['ID'];
  /** 创建一条数据 */
  createMenu: Scalars['ID'];
  /** 创建一条数据 */
  createOptions: Scalars['ID'];
  /** 创建一条数据 */
  createRole: Scalars['ID'];
  /** 创建一条数据 */
  createTenant: Scalars['ID'];
  /** 创建一条数据 */
  createUsr: Scalars['ID'];
  /** 根据 ids 删除数据 */
  deleteByIdsBackground_task: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDept: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDict: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDict_detail: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDictbiz_detail: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsI18n: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsLang: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsMenu: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsOperation_record: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsOptions: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsRole: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsTenant: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsUsr: Scalars['Int'];
  /** 切换登录状态下的部门, 更换token */
  deptLoginSelect: Scalars['String'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsBackground_task: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDept: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDict: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDict_detail: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDictbiz_detail: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsI18n: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsLang: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsMenu: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsOperation_record: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsOptions: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsRole: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsTenant: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsUsr: Scalars['Int'];
  /** 导入文件 */
  importFileDept?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileDict?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileDict_detail?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileDictbiz?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileDictbiz_detail?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileI18n?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileLang?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileMenu?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileOptions?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileRole?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileTenant?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileUsr?: Maybe<Scalars['String']>;
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDept: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDict: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDict_detail: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDictbiz_detail: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsOptions: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsUsr: Scalars['Int'];
  /** 登录 */
  login: LoginModel;
  /** 根据 ids 还原数据 */
  revertByIdsBackground_task: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDept: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDict: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDict_detail: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDictbiz_detail: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsI18n: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsLang: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsMenu: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsOperation_record: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsOptions: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsRole: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsTenant: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsUsr: Scalars['Int'];
  selectLang: Scalars['String'];
  /** 根据id修改一条数据 */
  updateByIdDept: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdDict: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdDict_detail: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdDictbiz: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdDictbiz_detail: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdI18n: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdLang: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdMenu: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdOptions: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdRole: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdTenant: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdUsr: Scalars['ID'];
};


export type MutationCreateDeptArgs = {
  model: DeptInput;
};


export type MutationCreateDictArgs = {
  model: DictInput;
};


export type MutationCreateDict_DetailArgs = {
  model: Dict_DetailInput;
};


export type MutationCreateDictbizArgs = {
  model: DictbizInput;
};


export type MutationCreateDictbiz_DetailArgs = {
  model: Dictbiz_DetailInput;
};


export type MutationCreateI18nArgs = {
  model: I18nInput;
};


export type MutationCreateLangArgs = {
  model: LangInput;
};


export type MutationCreateMenuArgs = {
  model: MenuInput;
};


export type MutationCreateOptionsArgs = {
  model: OptionsInput;
};


export type MutationCreateRoleArgs = {
  model: RoleInput;
};


export type MutationCreateTenantArgs = {
  model: TenantInput;
};


export type MutationCreateUsrArgs = {
  model: UsrInput;
};


export type MutationDeleteByIdsBackground_TaskArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDict_DetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictbiz_DetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsI18nArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsLangArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsMenuArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsOperation_RecordArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsOptionsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsRoleArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsTenantArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsUsrArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeptLoginSelectArgs = {
  dept_id: Scalars['String'];
};


export type MutationForceDeleteByIdsBackground_TaskArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDict_DetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictbiz_DetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsI18nArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsLangArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsMenuArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsOperation_RecordArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsOptionsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsRoleArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsTenantArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsUsrArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationImportFileDeptArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileDictArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileDict_DetailArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileDictbizArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileDictbiz_DetailArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileI18nArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileLangArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileMenuArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileOptionsArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileRoleArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileTenantArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileUsrArgs = {
  id: Scalars['ID'];
};


export type MutationLockByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDict_DetailArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictbiz_DetailArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsOptionsArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsUsrArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLoginArgs = {
  dept_id?: InputMaybe<Scalars['String']>;
  lang: Scalars['String'];
  password: Scalars['String'];
  tenant_id: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRevertByIdsBackground_TaskArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDict_DetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictbiz_DetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsI18nArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsLangArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsMenuArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsOperation_RecordArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsOptionsArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsRoleArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsTenantArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsUsrArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationSelectLangArgs = {
  lang: Scalars['String'];
};


export type MutationUpdateByIdDeptArgs = {
  id: Scalars['ID'];
  model: DeptInput;
};


export type MutationUpdateByIdDictArgs = {
  id: Scalars['ID'];
  model: DictInput;
};


export type MutationUpdateByIdDict_DetailArgs = {
  id: Scalars['ID'];
  model: Dict_DetailInput;
};


export type MutationUpdateByIdDictbizArgs = {
  id: Scalars['ID'];
  model: DictbizInput;
};


export type MutationUpdateByIdDictbiz_DetailArgs = {
  id: Scalars['ID'];
  model: Dictbiz_DetailInput;
};


export type MutationUpdateByIdI18nArgs = {
  id: Scalars['ID'];
  model: I18nInput;
};


export type MutationUpdateByIdLangArgs = {
  id: Scalars['ID'];
  model: LangInput;
};


export type MutationUpdateByIdMenuArgs = {
  id: Scalars['ID'];
  model: MenuInput;
};


export type MutationUpdateByIdOptionsArgs = {
  id: Scalars['ID'];
  model: OptionsInput;
};


export type MutationUpdateByIdRoleArgs = {
  id: Scalars['ID'];
  model: RoleInput;
};


export type MutationUpdateByIdTenantArgs = {
  id: Scalars['ID'];
  model: TenantInput;
};


export type MutationUpdateByIdUsrArgs = {
  id: Scalars['ID'];
  model: UsrInput;
};

export type Operation_RecordInput = {
  /** 创建人名称 */
  _create_usr_id?: InputMaybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 操作 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 方法 */
  method?: InputMaybe<Scalars['String']>;
  /** 方法名称 */
  method_lbl?: InputMaybe<Scalars['String']>;
  /** 模块 */
  mod?: InputMaybe<Scalars['String']>;
  /** 模块名称 */
  mod_lbl?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id?: InputMaybe<Scalars['ID']>;
};

export type Operation_RecordModel = {
  __typename?: 'Operation_RecordModel';
  /** 创建人名称 */
  _create_usr_id?: Maybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: Maybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: Maybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 操作 */
  lbl: Scalars['String'];
  /** 方法 */
  method: Scalars['String'];
  /** 方法名称 */
  method_lbl: Scalars['String'];
  /** 模块 */
  mod: Scalars['String'];
  /** 模块名称 */
  mod_lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id: Scalars['ID'];
};

export type Operation_RecordSearch = {
  _create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 操作 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 方法 */
  method?: InputMaybe<Scalars['String']>;
  methodLike?: InputMaybe<Scalars['String']>;
  /** 方法名称 */
  method_lbl?: InputMaybe<Scalars['String']>;
  method_lblLike?: InputMaybe<Scalars['String']>;
  /** 模块 */
  mod?: InputMaybe<Scalars['String']>;
  modLike?: InputMaybe<Scalars['String']>;
  /** 模块名称 */
  mod_lbl?: InputMaybe<Scalars['String']>;
  mod_lblLike?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type OptionsInput = {
  /** 创建人名称 */
  _create_usr_id?: InputMaybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 键 */
  ky?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id?: InputMaybe<Scalars['ID']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  /** 版本号 */
  version?: InputMaybe<Scalars['Int']>;
};

export type OptionsModel = {
  __typename?: 'OptionsModel';
  /** 创建人名称 */
  _create_usr_id?: Maybe<Scalars['String']>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 更新人名称 */
  _update_usr_id?: Maybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: Maybe<Scalars['String']>;
  /** 创建人ID */
  create_usr_id: Scalars['ID'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 键 */
  ky: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['String']>;
  /** 更新人ID */
  update_usr_id: Scalars['ID'];
  /** 值 */
  val: Scalars['String'];
  /** 版本号 */
  version: Scalars['Int'];
};

export type OptionsSearch = {
  _create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 键 */
  ky?: InputMaybe<Scalars['String']>;
  kyLike?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  valLike?: InputMaybe<Scalars['String']>;
  /** 版本号 */
  version?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

/** 分页输入 */
export type PageInput = {
  orderBy?: InputMaybe<Scalars['String']>;
  orderDec?: InputMaybe<Scalars['Boolean']>;
  pgOffset?: InputMaybe<Scalars['Int']>;
  pgSize?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  _version?: Maybe<Scalars['String']>;
  /** 根据搜索条件导出 */
  exportExcelBackground_task: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelDept: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelDict: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelDict_detail: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelDictbiz: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelDictbiz_detail: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelI18n: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelLang: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelMenu: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelOperation_record: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelOptions: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelRole: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelTenant: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelUsr: Scalars['String'];
  /** 根据搜索条件和分页查找数据 */
  findAllBackground_task: Array<Background_TaskModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDept: Array<DeptModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDict: Array<DictModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDict_detail: Array<Dict_DetailModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDictbiz: Array<DictbizModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDictbiz_detail: Array<Dictbiz_DetailModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllI18n: Array<I18nModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllLang: Array<LangModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllMenu: Array<MenuModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllOperation_record: Array<Operation_RecordModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllOptions: Array<OptionsModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllRole: Array<RoleModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllTenant: Array<TenantModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllUsr: Array<UsrModel>;
  /** 根据id查找一条数据 */
  findByIdBackground_task?: Maybe<Background_TaskModel>;
  /** 根据id查找一条数据 */
  findByIdDept?: Maybe<DeptModel>;
  /** 根据id查找一条数据 */
  findByIdDict?: Maybe<DictModel>;
  /** 根据id查找一条数据 */
  findByIdDict_detail?: Maybe<Dict_DetailModel>;
  /** 根据id查找一条数据 */
  findByIdDictbiz?: Maybe<DictbizModel>;
  /** 根据id查找一条数据 */
  findByIdDictbiz_detail?: Maybe<Dictbiz_DetailModel>;
  /** 根据id查找一条数据 */
  findByIdI18n?: Maybe<I18nModel>;
  /** 根据id查找一条数据 */
  findByIdLang?: Maybe<LangModel>;
  /** 根据id查找一条数据 */
  findByIdMenu?: Maybe<MenuModel>;
  /** 根据id查找一条数据 */
  findByIdOperation_record?: Maybe<Operation_RecordModel>;
  /** 根据id查找一条数据 */
  findByIdOptions?: Maybe<OptionsModel>;
  /** 根据id查找一条数据 */
  findByIdRole?: Maybe<RoleModel>;
  /** 根据id查找一条数据 */
  findByIdTenant?: Maybe<TenantModel>;
  /** 根据id查找一条数据 */
  findByIdUsr?: Maybe<UsrModel>;
  /** 根据条件查找据数总数 */
  findCountBackground_task: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDept: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDict: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDict_detail: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDictbiz: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDictbiz_detail: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountI18n: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountLang: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountMenu: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountOperation_record: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountOptions: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountRole: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountTenant: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountUsr: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDept: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDict: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDict_detail: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDictbiz: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDictbiz_detail: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByLang: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByMenu: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByOptions: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByTenant: Scalars['Int'];
  /** 根据条件查找第一条数据 */
  findOneBackground_task?: Maybe<Background_TaskModel>;
  /** 根据条件查找第一条数据 */
  findOneDept?: Maybe<DeptModel>;
  /** 根据条件查找第一条数据 */
  findOneDict?: Maybe<DictModel>;
  /** 根据条件查找第一条数据 */
  findOneDict_detail?: Maybe<Dict_DetailModel>;
  /** 根据条件查找第一条数据 */
  findOneDictbiz?: Maybe<DictbizModel>;
  /** 根据条件查找第一条数据 */
  findOneDictbiz_detail?: Maybe<Dictbiz_DetailModel>;
  /** 根据条件查找第一条数据 */
  findOneI18n?: Maybe<I18nModel>;
  /** 根据条件查找第一条数据 */
  findOneLang?: Maybe<LangModel>;
  /** 根据条件查找第一条数据 */
  findOneMenu?: Maybe<MenuModel>;
  /** 根据条件查找第一条数据 */
  findOneOperation_record?: Maybe<Operation_RecordModel>;
  /** 根据条件查找第一条数据 */
  findOneOptions?: Maybe<OptionsModel>;
  /** 根据条件查找第一条数据 */
  findOneRole?: Maybe<RoleModel>;
  /** 根据条件查找第一条数据 */
  findOneTenant?: Maybe<TenantModel>;
  /** 根据条件查找第一条数据 */
  findOneUsr?: Maybe<UsrModel>;
  /** 获取系统字典列表 */
  getDict: Array<Array<GetDict>>;
  /** 获取业务字典列表 */
  getDictbiz: Array<Array<GetDict>>;
  /** 获取登录信息 */
  getLoginInfo: GetLoginInfo;
  /** 获取登录时的语言列表 */
  getLoginLangs: Array<LangModel>;
  /** 根据 当前网址的域名+端口 获取 租户列表 */
  getLoginTenants: Array<Maybe<GetLoginTenants>>;
  /** 获取主页菜单 */
  getMenus: Array<Maybe<GetMenus>>;
  /** 获取系统选项 */
  getOptionsByLbl: Array<OptionsModel>;
  /** 国际化 */
  n: Scalars['String'];
};


export type QueryExportExcelBackground_TaskArgs = {
  search?: InputMaybe<Background_TaskSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelDeptArgs = {
  search?: InputMaybe<DeptSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelDictArgs = {
  search?: InputMaybe<DictSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelDict_DetailArgs = {
  search?: InputMaybe<Dict_DetailSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelDictbizArgs = {
  search?: InputMaybe<DictbizSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelDictbiz_DetailArgs = {
  search?: InputMaybe<Dictbiz_DetailSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelI18nArgs = {
  search?: InputMaybe<I18nSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelLangArgs = {
  search?: InputMaybe<LangSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelMenuArgs = {
  search?: InputMaybe<MenuSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelOperation_RecordArgs = {
  search?: InputMaybe<Operation_RecordSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelOptionsArgs = {
  search?: InputMaybe<OptionsSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelRoleArgs = {
  search?: InputMaybe<RoleSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelTenantArgs = {
  search?: InputMaybe<TenantSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelUsrArgs = {
  search?: InputMaybe<UsrSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllBackground_TaskArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<Background_TaskSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllDeptArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DeptSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllDictArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DictSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllDict_DetailArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<Dict_DetailSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllDictbizArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DictbizSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllDictbiz_DetailArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<Dictbiz_DetailSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllI18nArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<I18nSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllLangArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<LangSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllMenuArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<MenuSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllOperation_RecordArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<Operation_RecordSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllOptionsArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<OptionsSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllRoleArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<RoleSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllTenantArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<TenantSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllUsrArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<UsrSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindByIdBackground_TaskArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDeptArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDict_DetailArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictbizArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictbiz_DetailArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdI18nArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdLangArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdMenuArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdOperation_RecordArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdOptionsArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdRoleArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdTenantArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdUsrArgs = {
  id: Scalars['ID'];
};


export type QueryFindCountBackground_TaskArgs = {
  search?: InputMaybe<Background_TaskSearch>;
};


export type QueryFindCountDeptArgs = {
  search?: InputMaybe<DeptSearch>;
};


export type QueryFindCountDictArgs = {
  search?: InputMaybe<DictSearch>;
};


export type QueryFindCountDict_DetailArgs = {
  search?: InputMaybe<Dict_DetailSearch>;
};


export type QueryFindCountDictbizArgs = {
  search?: InputMaybe<DictbizSearch>;
};


export type QueryFindCountDictbiz_DetailArgs = {
  search?: InputMaybe<Dictbiz_DetailSearch>;
};


export type QueryFindCountI18nArgs = {
  search?: InputMaybe<I18nSearch>;
};


export type QueryFindCountLangArgs = {
  search?: InputMaybe<LangSearch>;
};


export type QueryFindCountMenuArgs = {
  search?: InputMaybe<MenuSearch>;
};


export type QueryFindCountOperation_RecordArgs = {
  search?: InputMaybe<Operation_RecordSearch>;
};


export type QueryFindCountOptionsArgs = {
  search?: InputMaybe<OptionsSearch>;
};


export type QueryFindCountRoleArgs = {
  search?: InputMaybe<RoleSearch>;
};


export type QueryFindCountTenantArgs = {
  search?: InputMaybe<TenantSearch>;
};


export type QueryFindCountUsrArgs = {
  search?: InputMaybe<UsrSearch>;
};


export type QueryFindOneBackground_TaskArgs = {
  search?: InputMaybe<Background_TaskSearch>;
};


export type QueryFindOneDeptArgs = {
  search?: InputMaybe<DeptSearch>;
};


export type QueryFindOneDictArgs = {
  search?: InputMaybe<DictSearch>;
};


export type QueryFindOneDict_DetailArgs = {
  search?: InputMaybe<Dict_DetailSearch>;
};


export type QueryFindOneDictbizArgs = {
  search?: InputMaybe<DictbizSearch>;
};


export type QueryFindOneDictbiz_DetailArgs = {
  search?: InputMaybe<Dictbiz_DetailSearch>;
};


export type QueryFindOneI18nArgs = {
  search?: InputMaybe<I18nSearch>;
};


export type QueryFindOneLangArgs = {
  search?: InputMaybe<LangSearch>;
};


export type QueryFindOneMenuArgs = {
  search?: InputMaybe<MenuSearch>;
};


export type QueryFindOneOperation_RecordArgs = {
  search?: InputMaybe<Operation_RecordSearch>;
};


export type QueryFindOneOptionsArgs = {
  search?: InputMaybe<OptionsSearch>;
};


export type QueryFindOneRoleArgs = {
  search?: InputMaybe<RoleSearch>;
};


export type QueryFindOneTenantArgs = {
  search?: InputMaybe<TenantSearch>;
};


export type QueryFindOneUsrArgs = {
  search?: InputMaybe<UsrSearch>;
};


export type QueryGetDictArgs = {
  codes: Array<Scalars['String']>;
};


export type QueryGetDictbizArgs = {
  codes: Array<Scalars['String']>;
};


export type QueryGetLoginTenantsArgs = {
  host: Scalars['String'];
};


export type QueryGetMenusArgs = {
  type?: InputMaybe<Scalars['String']>;
};


export type QueryGetOptionsByLblArgs = {
  lbl: Scalars['String'];
};


export type QueryNArgs = {
  code: Scalars['String'];
  langCode: Scalars['String'];
  routePath?: InputMaybe<Scalars['String']>;
};

export type RoleInput = {
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 菜单ID */
  menu_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type RoleModel = {
  __typename?: 'RoleModel';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: Maybe<Array<Scalars['String']>>;
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 菜单ID */
  menu_ids?: Maybe<Array<Scalars['ID']>>;
  /** 备注 */
  rem: Scalars['String'];
};

export type RoleSearch = {
  _menu_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
};

/** 排序输入 */
export type SortInput = {
  order?: InputMaybe<SortOrderEnum>;
  prop?: InputMaybe<Scalars['String']>;
};

export enum SortOrderEnum {
  Asc = 'asc',
  Ascending = 'ascending',
  Desc = 'desc',
  Descending = 'descending'
}

export type TenantInput = {
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: InputMaybe<Array<Scalars['String']>>;
  /** 到期日 */
  expiration?: InputMaybe<Scalars['String']>;
  /** 域名绑定 */
  host?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 最大用户数 */
  max_usr_num?: InputMaybe<Scalars['Int']>;
  /** 菜单ID */
  menu_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type TenantModel = {
  __typename?: 'TenantModel';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: Maybe<Array<Scalars['String']>>;
  /** 到期日 */
  expiration?: Maybe<Scalars['String']>;
  /** 域名绑定 */
  host: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 最大用户数 */
  max_usr_num: Scalars['Int'];
  /** 菜单ID */
  menu_ids?: Maybe<Array<Scalars['ID']>>;
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
};

export type TenantSearch = {
  _menu_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 到期日 */
  expiration?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 域名绑定 */
  host?: InputMaybe<Scalars['String']>;
  hostLike?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 最大用户数 */
  max_usr_num?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 菜单 */
  menu_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 排序 */
  order_by?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
};

export type UsrInput = {
  /** 默认部门名称 */
  _default_dept_id?: InputMaybe<Scalars['String']>;
  /** 拥有部门名称 */
  _dept_ids?: InputMaybe<Array<Scalars['String']>>;
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: InputMaybe<Scalars['String']>;
  /** 拥有角色名称 */
  _role_ids?: InputMaybe<Array<Scalars['String']>>;
  /** 默认部门ID */
  default_dept_id?: InputMaybe<Scalars['ID']>;
  /** 拥有部门ID */
  dept_ids?: InputMaybe<Array<Scalars['ID']>>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 锁定ID */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 拥有角色ID */
  role_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 用户名 */
  username?: InputMaybe<Scalars['String']>;
};

export type UsrModel = {
  __typename?: 'UsrModel';
  /** 默认部门名称 */
  _default_dept_id?: Maybe<Scalars['String']>;
  /** 拥有部门名称 */
  _dept_ids?: Maybe<Array<Scalars['String']>>;
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 锁定名称 */
  _is_locked?: Maybe<Scalars['String']>;
  /** 拥有角色名称 */
  _role_ids?: Maybe<Array<Scalars['String']>>;
  /** 默认部门ID */
  default_dept_id: Scalars['ID'];
  /** 拥有部门ID */
  dept_ids?: Maybe<Array<Scalars['ID']>>;
  /** ID */
  id: Scalars['ID'];
  /** 启用ID */
  is_enabled: Scalars['Int'];
  /** 锁定ID */
  is_locked: Scalars['Int'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 密码 */
  password: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 拥有角色ID */
  role_ids?: Maybe<Array<Scalars['ID']>>;
  /** 用户名 */
  username: Scalars['String'];
};

export type UsrSearch = {
  _default_dept_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _dept_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _role_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 默认部门 */
  default_dept_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 拥有部门 */
  dept_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']>;
  passwordLike?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 拥有角色 */
  role_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 用户名 */
  username?: InputMaybe<Scalars['String']>;
  usernameLike?: InputMaybe<Scalars['String']>;
};
