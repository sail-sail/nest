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
  BigDecimal: any;
  Date: any;
  DateTime: any;
  Decimal: any;
  JSON: any;
  NaiveDate: any;
  NaiveDateTime: any;
  NaiveTime: any;
  Uuid: any;
};

export type BackgroundTaskFieldComment = {
  __typename?: 'BackgroundTaskFieldComment';
  /** 开始时间 */
  begin_time: Scalars['String'];
  /** 开始时间 */
  begin_time_lbl: Scalars['String'];
  /** 结束时间 */
  end_time: Scalars['String'];
  /** 结束时间 */
  end_time_lbl: Scalars['String'];
  /** 错误信息 */
  err_msg: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 执行结果 */
  result: Scalars['String'];
  /** 状态 */
  state: Scalars['String'];
  /** 状态 */
  state_lbl: Scalars['String'];
  /** 类型 */
  type: Scalars['String'];
  /** 类型 */
  type_lbl: Scalars['String'];
};

export type BackgroundTaskInput = {
  /** 开始时间 */
  begin_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 结束时间 */
  end_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 错误信息 */
  err_msg?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 执行结果 */
  result?: InputMaybe<Scalars['String']>;
  /** 状态 */
  state?: InputMaybe<Scalars['String']>;
  /** 状态 */
  state_lbl?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 类型 */
  type?: InputMaybe<Scalars['String']>;
  /** 类型 */
  type_lbl?: InputMaybe<Scalars['String']>;
};

export type BackgroundTaskModel = {
  __typename?: 'BackgroundTaskModel';
  /** 开始时间 */
  begin_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 开始时间 */
  begin_time_lbl?: Maybe<Scalars['String']>;
  /** 结束时间 */
  end_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 结束时间 */
  end_time_lbl?: Maybe<Scalars['String']>;
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
  /** 状态 */
  state: Scalars['String'];
  /** 状态 */
  state_lbl?: Maybe<Scalars['String']>;
  /** 类型 */
  type: Scalars['String'];
  /** 类型 */
  type_lbl?: Maybe<Scalars['String']>;
};

export type BackgroundTaskSearch = {
  /** 开始时间 */
  begin_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<Scalars['String']>>;
  create_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  create_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 结束时间 */
  end_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 错误信息 */
  err_msg?: InputMaybe<Scalars['String']>;
  err_msg_like?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 执行结果 */
  result?: InputMaybe<Scalars['String']>;
  result_like?: InputMaybe<Scalars['String']>;
  /** 状态 */
  state?: InputMaybe<Array<Scalars['String']>>;
  /** 类型 */
  type?: InputMaybe<Array<Scalars['String']>>;
};

export type DeptFieldComment = {
  __typename?: 'DeptFieldComment';
  /** 创建时间 */
  create_time: Scalars['String'];
  /** 创建时间 */
  create_time_lbl: Scalars['String'];
  /** 创建人 */
  create_usr_id: Scalars['String'];
  /** 创建人 */
  create_usr_id_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 父部门 */
  parent_id: Scalars['String'];
  /** 父部门 */
  parent_id_lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time: Scalars['String'];
  /** 更新时间 */
  update_time_lbl: Scalars['String'];
  /** 更新人 */
  update_usr_id: Scalars['String'];
  /** 更新人 */
  update_usr_id_lbl: Scalars['String'];
};

export type DeptInput = {
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  /** 创建人 */
  create_usr_id_lbl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 父部门 */
  parent_id?: InputMaybe<Scalars['ID']>;
  /** 父部门 */
  parent_id_lbl?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Scalars['ID']>;
  /** 更新人 */
  update_usr_id_lbl?: InputMaybe<Scalars['String']>;
};

export type DeptModel = {
  __typename?: 'DeptModel';
  /** 创建时间 */
  create_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 创建时间 */
  create_time_lbl?: Maybe<Scalars['String']>;
  /** 创建人 */
  create_usr_id: Scalars['ID'];
  /** 创建人 */
  create_usr_id_lbl?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 父部门 */
  parent_id: Scalars['ID'];
  /** 父部门 */
  parent_id_lbl?: Maybe<Scalars['String']>;
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 更新时间 */
  update_time_lbl?: Maybe<Scalars['String']>;
  /** 更新人 */
  update_usr_id: Scalars['ID'];
  /** 更新人 */
  update_usr_id_lbl?: Maybe<Scalars['String']>;
};

export type DeptSearch = {
  /** 创建时间 */
  create_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<Scalars['String']>>;
  create_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  create_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 父部门 */
  parent_id?: InputMaybe<Array<Scalars['String']>>;
  parent_id_is_null?: InputMaybe<Scalars['Boolean']>;
  parent_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<Scalars['String']>>;
  update_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  update_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
};

export type DictDetailFieldComment = {
  __typename?: 'DictDetailFieldComment';
  /** 系统字典 */
  dict_id: Scalars['String'];
  /** 系统字典 */
  dict_id_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type DictDetailInput = {
  /** 系统字典 */
  dict_id?: InputMaybe<Scalars['ID']>;
  /** 系统字典 */
  dict_id_lbl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
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

export type DictDetailModel = {
  __typename?: 'DictDetailModel';
  /** 系统字典 */
  dict_id: Scalars['ID'];
  /** 系统字典 */
  dict_id_lbl?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type DictDetailSearch = {
  /** 系统字典 */
  dict_id?: InputMaybe<Array<Scalars['String']>>;
  dict_id_is_null?: InputMaybe<Scalars['Boolean']>;
  dict_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  val_like?: InputMaybe<Scalars['String']>;
};

export type DictFieldComment = {
  __typename?: 'DictFieldComment';
  /** 编码 */
  code: Scalars['String'];
  /** 创建时间 */
  create_time: Scalars['String'];
  /** 创建时间 */
  create_time_lbl: Scalars['String'];
  /** 创建人 */
  create_usr_id: Scalars['String'];
  /** 创建人 */
  create_usr_id_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 数据类型 */
  type: Scalars['String'];
  /** 数据类型 */
  type_lbl: Scalars['String'];
  /** 更新时间 */
  update_time: Scalars['String'];
  /** 更新时间 */
  update_time_lbl: Scalars['String'];
  /** 更新人 */
  update_usr_id: Scalars['String'];
  /** 更新人 */
  update_usr_id_lbl: Scalars['String'];
};

export type DictInput = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  /** 创建人 */
  create_usr_id_lbl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type_lbl?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Scalars['ID']>;
  /** 更新人 */
  update_usr_id_lbl?: InputMaybe<Scalars['String']>;
};

export type DictModel = {
  __typename?: 'DictModel';
  /** 编码 */
  code: Scalars['String'];
  /** 创建时间 */
  create_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 创建时间 */
  create_time_lbl?: Maybe<Scalars['String']>;
  /** 创建人 */
  create_usr_id: Scalars['ID'];
  /** 创建人 */
  create_usr_id_lbl?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 数据类型 */
  type: Scalars['String'];
  /** 数据类型 */
  type_lbl?: Maybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 更新时间 */
  update_time_lbl?: Maybe<Scalars['String']>;
  /** 更新人 */
  update_usr_id: Scalars['ID'];
  /** 更新人 */
  update_usr_id_lbl?: Maybe<Scalars['String']>;
};

export type DictSearch = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  code_like?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<Scalars['String']>>;
  create_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  create_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type?: InputMaybe<Array<Scalars['String']>>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<Scalars['String']>>;
  update_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  update_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
};

export type DictbizDetailFieldComment = {
  __typename?: 'DictbizDetailFieldComment';
  /** 业务字典 */
  dictbiz_id: Scalars['String'];
  /** 业务字典 */
  dictbiz_id_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type DictbizDetailInput = {
  /** 业务字典 */
  dictbiz_id?: InputMaybe<Scalars['ID']>;
  /** 业务字典 */
  dictbiz_id_lbl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
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

export type DictbizDetailModel = {
  __typename?: 'DictbizDetailModel';
  /** 业务字典 */
  dictbiz_id: Scalars['ID'];
  /** 业务字典 */
  dictbiz_id_lbl?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
};

export type DictbizDetailSearch = {
  /** 业务字典 */
  dictbiz_id?: InputMaybe<Array<Scalars['String']>>;
  dictbiz_id_is_null?: InputMaybe<Scalars['Boolean']>;
  dictbiz_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  val_like?: InputMaybe<Scalars['String']>;
};

export type DictbizFieldComment = {
  __typename?: 'DictbizFieldComment';
  /** 编码 */
  code: Scalars['String'];
  /** 创建时间 */
  create_time: Scalars['String'];
  /** 创建时间 */
  create_time_lbl: Scalars['String'];
  /** 创建人 */
  create_usr_id: Scalars['String'];
  /** 创建人 */
  create_usr_id_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 数据类型 */
  type: Scalars['String'];
  /** 数据类型 */
  type_lbl: Scalars['String'];
  /** 更新时间 */
  update_time: Scalars['String'];
  /** 更新时间 */
  update_time_lbl: Scalars['String'];
  /** 更新人 */
  update_usr_id: Scalars['String'];
  /** 更新人 */
  update_usr_id_lbl: Scalars['String'];
};

export type DictbizInput = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  /** 创建人 */
  create_usr_id_lbl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type_lbl?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Scalars['ID']>;
  /** 更新人 */
  update_usr_id_lbl?: InputMaybe<Scalars['String']>;
};

export type DictbizModel = {
  __typename?: 'DictbizModel';
  /** 编码 */
  code: Scalars['String'];
  /** 创建时间 */
  create_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 创建时间 */
  create_time_lbl?: Maybe<Scalars['String']>;
  /** 创建人 */
  create_usr_id: Scalars['ID'];
  /** 创建人 */
  create_usr_id_lbl?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 数据类型 */
  type: Scalars['String'];
  /** 数据类型 */
  type_lbl?: Maybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 更新时间 */
  update_time_lbl?: Maybe<Scalars['String']>;
  /** 更新人 */
  update_usr_id: Scalars['ID'];
  /** 更新人 */
  update_usr_id_lbl?: Maybe<Scalars['String']>;
};

export type DictbizSearch = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  code_like?: InputMaybe<Scalars['String']>;
  /** 创建时间 */
  create_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<Scalars['String']>>;
  create_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  create_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 数据类型 */
  type?: InputMaybe<Array<Scalars['String']>>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<Scalars['String']>>;
  update_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  update_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
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
  dept_id_models: Array<GetLoginInfoDeptIdModels>;
  lang: Scalars['String'];
  lbl: Scalars['String'];
};

export type GetLoginInfoDeptIdModels = {
  __typename?: 'GetLoginInfoDeptIdModels';
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
  children?: Maybe<Array<GetMenus>>;
  id: Scalars['String'];
  lbl: Scalars['String'];
  route_path?: Maybe<Scalars['String']>;
  route_query?: Maybe<Scalars['String']>;
};

export type I18nFieldComment = {
  __typename?: 'I18nFieldComment';
  /** 编码 */
  code: Scalars['String'];
  /** 语言 */
  lang_id: Scalars['String'];
  /** 语言 */
  lang_id_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 菜单 */
  menu_id: Scalars['String'];
  /** 菜单 */
  menu_id_lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
};

export type I18nInput = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 语言 */
  lang_id?: InputMaybe<Scalars['ID']>;
  /** 语言 */
  lang_id_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_id?: InputMaybe<Scalars['ID']>;
  /** 菜单 */
  menu_id_lbl?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type I18nModel = {
  __typename?: 'I18nModel';
  /** 编码 */
  code: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 语言 */
  lang_id: Scalars['ID'];
  /** 语言 */
  lang_id_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 菜单 */
  menu_id: Scalars['ID'];
  /** 菜单 */
  menu_id_lbl?: Maybe<Scalars['String']>;
  /** 备注 */
  rem: Scalars['String'];
};

export type I18nSearch = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  code_like?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 语言 */
  lang_id?: InputMaybe<Array<Scalars['String']>>;
  lang_id_is_null?: InputMaybe<Scalars['Boolean']>;
  lang_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_id?: InputMaybe<Array<Scalars['String']>>;
  menu_id_is_null?: InputMaybe<Scalars['Boolean']>;
  menu_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
};

export type LangFieldComment = {
  __typename?: 'LangFieldComment';
  /** 编码 */
  code: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
};

export type LangInput = {
  /** 编码 */
  code?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
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
  /** 编码 */
  code: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
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
  code_like?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
};

export type LoginModel = {
  __typename?: 'LoginModel';
  authorization: Scalars['String'];
  dept_id?: Maybe<Scalars['String']>;
};

export type MenuFieldComment = {
  __typename?: 'MenuFieldComment';
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 父菜单 */
  menu_id: Scalars['String'];
  /** 父菜单 */
  menu_id_lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 路由 */
  route_path: Scalars['String'];
  /** 参数 */
  route_query: Scalars['String'];
  /** 类型 */
  type: Scalars['String'];
  /** 类型 */
  type_lbl: Scalars['String'];
};

export type MenuInput = {
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 父菜单 */
  menu_id?: InputMaybe<Scalars['ID']>;
  /** 父菜单 */
  menu_id_lbl?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 路由 */
  route_path?: InputMaybe<Scalars['String']>;
  /** 参数 */
  route_query?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 类型 */
  type?: InputMaybe<Scalars['String']>;
  /** 类型 */
  type_lbl?: InputMaybe<Scalars['String']>;
};

export type MenuModel = {
  __typename?: 'MenuModel';
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 父菜单 */
  menu_id: Scalars['ID'];
  /** 父菜单 */
  menu_id_lbl?: Maybe<Scalars['String']>;
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 路由 */
  route_path: Scalars['String'];
  /** 参数 */
  route_query?: Maybe<Scalars['String']>;
  /** 类型 */
  type: Scalars['String'];
  /** 类型 */
  type_lbl?: Maybe<Scalars['String']>;
};

export type MenuSearch = {
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 父菜单 */
  menu_id?: InputMaybe<Array<Scalars['String']>>;
  menu_id_is_null?: InputMaybe<Scalars['Boolean']>;
  menu_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 路由 */
  route_path?: InputMaybe<Scalars['String']>;
  route_path_like?: InputMaybe<Scalars['String']>;
  /** 参数 */
  route_query?: InputMaybe<Scalars['String']>;
  route_query_like?: InputMaybe<Scalars['String']>;
  /** 类型 */
  type?: InputMaybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** 创建一条数据 */
  createDept: Scalars['ID'];
  /** 创建一条数据 */
  createDict: Scalars['ID'];
  /** 创建一条数据 */
  createDictDetail: Scalars['ID'];
  /** 创建一条数据 */
  createDictbiz: Scalars['ID'];
  /** 创建一条数据 */
  createDictbizDetail: Scalars['ID'];
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
  deleteByIdsBackgroundTask: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDept: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDict: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDictDetail: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsDictbizDetail: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsI18n: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsLang: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsMenu: Scalars['Int'];
  /** 根据 ids 删除数据 */
  deleteByIdsOperationRecord: Scalars['Int'];
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
  forceDeleteByIdsBackgroundTask: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDept: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDict: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDictDetail: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsDictbizDetail: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsI18n: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsLang: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsMenu: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsOperationRecord: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsOptions: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsRole: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsTenant: Scalars['Int'];
  /** 根据 ids 彻底删除数据 */
  forceDeleteByIdsUsr: Scalars['Int'];
  /** 批量导入 */
  importModelsDept?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsDict?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsDictDetail?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsDictbiz?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsDictbizDetail?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsI18n?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsLang?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsMenu?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsOptions?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsRole?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsTenant?: Maybe<Scalars['String']>;
  /** 批量导入 */
  importModelsUsr?: Maybe<Scalars['String']>;
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDept: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDict: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDictDetail: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsDictbizDetail: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsOptions: Scalars['Int'];
  /** 根据 ids 锁定或者解锁数据 */
  lockByIdsUsr: Scalars['Int'];
  /** 登录 */
  login: LoginModel;
  /** 根据 ids 还原数据 */
  revertByIdsBackgroundTask: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDept: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDict: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDictDetail: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDictbiz: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsDictbizDetail: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsI18n: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsLang: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsMenu: Scalars['Int'];
  /** 根据 ids 还原数据 */
  revertByIdsOperationRecord: Scalars['Int'];
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
  updateByIdDictDetail: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdDictbiz: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdDictbizDetail: Scalars['ID'];
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


export type MutationCreateDictDetailArgs = {
  model: DictDetailInput;
};


export type MutationCreateDictbizArgs = {
  model: DictbizInput;
};


export type MutationCreateDictbizDetailArgs = {
  model: DictbizDetailInput;
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


export type MutationDeleteByIdsBackgroundTaskArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictDetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationDeleteByIdsDictbizDetailArgs = {
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


export type MutationDeleteByIdsOperationRecordArgs = {
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


export type MutationForceDeleteByIdsBackgroundTaskArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictDetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationForceDeleteByIdsDictbizDetailArgs = {
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


export type MutationForceDeleteByIdsOperationRecordArgs = {
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


export type MutationImportModelsDeptArgs = {
  models: Array<DeptInput>;
};


export type MutationImportModelsDictArgs = {
  models: Array<DictInput>;
};


export type MutationImportModelsDictDetailArgs = {
  models: Array<DictDetailInput>;
};


export type MutationImportModelsDictbizArgs = {
  models: Array<DictbizInput>;
};


export type MutationImportModelsDictbizDetailArgs = {
  models: Array<DictbizDetailInput>;
};


export type MutationImportModelsI18nArgs = {
  models: Array<I18nInput>;
};


export type MutationImportModelsLangArgs = {
  models: Array<LangInput>;
};


export type MutationImportModelsMenuArgs = {
  models: Array<MenuInput>;
};


export type MutationImportModelsOptionsArgs = {
  models: Array<OptionsInput>;
};


export type MutationImportModelsRoleArgs = {
  models: Array<RoleInput>;
};


export type MutationImportModelsTenantArgs = {
  models: Array<TenantInput>;
};


export type MutationImportModelsUsrArgs = {
  models: Array<UsrInput>;
};


export type MutationLockByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictDetailArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
  is_locked: Scalars['Int'];
};


export type MutationLockByIdsDictbizDetailArgs = {
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


export type MutationRevertByIdsBackgroundTaskArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDeptArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictDetailArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictbizArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationRevertByIdsDictbizDetailArgs = {
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


export type MutationRevertByIdsOperationRecordArgs = {
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


export type MutationUpdateByIdDictDetailArgs = {
  id: Scalars['ID'];
  model: DictDetailInput;
};


export type MutationUpdateByIdDictbizArgs = {
  id: Scalars['ID'];
  model: DictbizInput;
};


export type MutationUpdateByIdDictbizDetailArgs = {
  id: Scalars['ID'];
  model: DictbizDetailInput;
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

export type OperationRecordFieldComment = {
  __typename?: 'OperationRecordFieldComment';
  /** 创建时间 */
  create_time: Scalars['String'];
  /** 创建时间 */
  create_time_lbl: Scalars['String'];
  /** 创建人 */
  create_usr_id: Scalars['String'];
  /** 创建人 */
  create_usr_id_lbl: Scalars['String'];
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
  update_time: Scalars['String'];
  /** 更新时间 */
  update_time_lbl: Scalars['String'];
  /** 更新人 */
  update_usr_id: Scalars['String'];
  /** 更新人 */
  update_usr_id_lbl: Scalars['String'];
};

export type OperationRecordInput = {
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  /** 创建人 */
  create_usr_id_lbl?: InputMaybe<Scalars['String']>;
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
  update_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Scalars['ID']>;
  /** 更新人 */
  update_usr_id_lbl?: InputMaybe<Scalars['String']>;
};

export type OperationRecordModel = {
  __typename?: 'OperationRecordModel';
  /** 创建时间 */
  create_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 创建时间 */
  create_time_lbl?: Maybe<Scalars['String']>;
  /** 创建人 */
  create_usr_id: Scalars['ID'];
  /** 创建人 */
  create_usr_id_lbl?: Maybe<Scalars['String']>;
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
  update_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 更新时间 */
  update_time_lbl?: Maybe<Scalars['String']>;
  /** 更新人 */
  update_usr_id: Scalars['ID'];
  /** 更新人 */
  update_usr_id_lbl?: Maybe<Scalars['String']>;
};

export type OperationRecordSearch = {
  /** 创建时间 */
  create_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<Scalars['String']>>;
  create_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  create_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 操作 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 方法 */
  method?: InputMaybe<Scalars['String']>;
  /** 方法名称 */
  method_lbl?: InputMaybe<Scalars['String']>;
  method_lbl_like?: InputMaybe<Scalars['String']>;
  method_like?: InputMaybe<Scalars['String']>;
  /** 模块 */
  mod?: InputMaybe<Scalars['String']>;
  /** 模块名称 */
  mod_lbl?: InputMaybe<Scalars['String']>;
  mod_lbl_like?: InputMaybe<Scalars['String']>;
  mod_like?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<Scalars['String']>>;
  update_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  update_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
};

export type OptionsFieldComment = {
  __typename?: 'OptionsFieldComment';
  /** 创建时间 */
  create_time: Scalars['String'];
  /** 创建时间 */
  create_time_lbl: Scalars['String'];
  /** 创建人 */
  create_usr_id: Scalars['String'];
  /** 创建人 */
  create_usr_id_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 键 */
  ky: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time: Scalars['String'];
  /** 更新时间 */
  update_time_lbl: Scalars['String'];
  /** 更新人 */
  update_usr_id: Scalars['String'];
  /** 更新人 */
  update_usr_id_lbl: Scalars['String'];
  /** 值 */
  val: Scalars['String'];
  /** 版本号 */
  version: Scalars['String'];
};

export type OptionsInput = {
  /** 创建时间 */
  create_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Scalars['ID']>;
  /** 创建人 */
  create_usr_id_lbl?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
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
  update_time?: InputMaybe<Scalars['NaiveDateTime']>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Scalars['ID']>;
  /** 更新人 */
  update_usr_id_lbl?: InputMaybe<Scalars['String']>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  /** 版本号 */
  version?: InputMaybe<Scalars['Int']>;
};

export type OptionsModel = {
  __typename?: 'OptionsModel';
  /** 创建时间 */
  create_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 创建时间 */
  create_time_lbl?: Maybe<Scalars['String']>;
  /** 创建人 */
  create_usr_id: Scalars['ID'];
  /** 创建人 */
  create_usr_id_lbl?: Maybe<Scalars['String']>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 键 */
  ky: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
  /** 更新时间 */
  update_time?: Maybe<Scalars['NaiveDateTime']>;
  /** 更新时间 */
  update_time_lbl?: Maybe<Scalars['String']>;
  /** 更新人 */
  update_usr_id: Scalars['ID'];
  /** 更新人 */
  update_usr_id_lbl?: Maybe<Scalars['String']>;
  /** 值 */
  val: Scalars['String'];
  /** 版本号 */
  version: Scalars['Int'];
};

export type OptionsSearch = {
  /** 创建时间 */
  create_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 创建人 */
  create_usr_id?: InputMaybe<Array<Scalars['String']>>;
  create_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  create_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 键 */
  ky?: InputMaybe<Scalars['String']>;
  ky_like?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 更新时间 */
  update_time?: InputMaybe<Array<Scalars['NaiveDateTime']>>;
  /** 更新人 */
  update_usr_id?: InputMaybe<Array<Scalars['String']>>;
  update_usr_id_is_null?: InputMaybe<Scalars['Boolean']>;
  update_usr_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 值 */
  val?: InputMaybe<Scalars['String']>;
  val_like?: InputMaybe<Scalars['String']>;
  /** 版本号 */
  version?: InputMaybe<Array<Scalars['Int']>>;
};

/** 分页输入 */
export type PageInput = {
  pgOffset?: InputMaybe<Scalars['Int']>;
  pgSize?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  _version?: Maybe<Scalars['String']>;
  /** 根据搜索条件和分页查找数据 */
  findAllBackgroundTask: Array<BackgroundTaskModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDept: Array<DeptModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDict: Array<DictModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDictDetail: Array<DictDetailModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDictbiz: Array<DictbizModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllDictbizDetail: Array<DictbizDetailModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllI18n: Array<I18nModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllLang: Array<LangModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllMenu: Array<MenuModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllOperationRecord: Array<OperationRecordModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllOptions: Array<OptionsModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllRole: Array<RoleModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllTenant: Array<TenantModel>;
  /** 根据搜索条件和分页查找数据 */
  findAllUsr: Array<UsrModel>;
  /** 根据id查找一条数据 */
  findByIdBackgroundTask?: Maybe<BackgroundTaskModel>;
  /** 根据id查找一条数据 */
  findByIdDept?: Maybe<DeptModel>;
  /** 根据id查找一条数据 */
  findByIdDict?: Maybe<DictModel>;
  /** 根据id查找一条数据 */
  findByIdDictDetail?: Maybe<DictDetailModel>;
  /** 根据id查找一条数据 */
  findByIdDictbiz?: Maybe<DictbizModel>;
  /** 根据id查找一条数据 */
  findByIdDictbizDetail?: Maybe<DictbizDetailModel>;
  /** 根据id查找一条数据 */
  findByIdI18n?: Maybe<I18nModel>;
  /** 根据id查找一条数据 */
  findByIdLang?: Maybe<LangModel>;
  /** 根据id查找一条数据 */
  findByIdMenu?: Maybe<MenuModel>;
  /** 根据id查找一条数据 */
  findByIdOperationRecord?: Maybe<OperationRecordModel>;
  /** 根据id查找一条数据 */
  findByIdOptions?: Maybe<OptionsModel>;
  /** 根据id查找一条数据 */
  findByIdRole?: Maybe<RoleModel>;
  /** 根据id查找一条数据 */
  findByIdTenant?: Maybe<TenantModel>;
  /** 根据id查找一条数据 */
  findByIdUsr?: Maybe<UsrModel>;
  /** 根据条件查找据数总数 */
  findCountBackgroundTask: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDept: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDict: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDictDetail: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDictbiz: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountDictbizDetail: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountI18n: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountLang: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountMenu: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountOperationRecord: Scalars['Int'];
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
  findLastOrderByDictDetail: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDictbiz: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByDictbizDetail: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByLang: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByMenu: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByOptions: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByTenant: Scalars['Int'];
  /** 根据条件查找第一条数据 */
  findOneBackgroundTask?: Maybe<BackgroundTaskModel>;
  /** 根据条件查找第一条数据 */
  findOneDept?: Maybe<DeptModel>;
  /** 根据条件查找第一条数据 */
  findOneDict?: Maybe<DictModel>;
  /** 根据条件查找第一条数据 */
  findOneDictDetail?: Maybe<DictDetailModel>;
  /** 根据条件查找第一条数据 */
  findOneDictbiz?: Maybe<DictbizModel>;
  /** 根据条件查找第一条数据 */
  findOneDictbizDetail?: Maybe<DictbizDetailModel>;
  /** 根据条件查找第一条数据 */
  findOneI18n?: Maybe<I18nModel>;
  /** 根据条件查找第一条数据 */
  findOneLang?: Maybe<LangModel>;
  /** 根据条件查找第一条数据 */
  findOneMenu?: Maybe<MenuModel>;
  /** 根据条件查找第一条数据 */
  findOneOperationRecord?: Maybe<OperationRecordModel>;
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
  /** 获取字段对应的名称 */
  getFieldCommentsBackgroundTask: BackgroundTaskFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsDept: DeptFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsDict: DictFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsDictDetail: DictDetailFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsDictbiz: DictbizFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsDictbizDetail: DictbizDetailFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsI18n: I18nFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsLang: LangFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsMenu: MenuFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsOperationRecord: OperationRecordFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsOptions: OptionsFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsRole: RoleFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsTenant: TenantFieldComment;
  /** 获取字段对应的名称 */
  getFieldCommentsUsr: UsrFieldComment;
  /** 获取登录信息 */
  getLoginInfo: GetLoginInfo;
  /** 获取登录时的语言列表 */
  getLoginLangs: Array<LangModel>;
  /** 根据 当前网址的域名+端口 获取 租户列表 */
  getLoginTenants: Array<Maybe<GetLoginTenants>>;
  /** 获取主页菜单 */
  getMenus: Array<GetMenus>;
  /** 获取系统选项 */
  getOptionsByLbl: Array<OptionsModel>;
  /** 国际化 */
  n: Scalars['String'];
};


export type QueryFindAllBackgroundTaskArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<BackgroundTaskSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllDeptArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DeptSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllDictArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DictSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllDictDetailArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DictDetailSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllDictbizArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DictbizSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllDictbizDetailArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<DictbizDetailSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllI18nArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<I18nSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllLangArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<LangSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllMenuArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<MenuSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllOperationRecordArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<OperationRecordSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllOptionsArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<OptionsSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllRoleArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<RoleSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllTenantArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<TenantSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindAllUsrArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<UsrSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindByIdBackgroundTaskArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDeptArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictDetailArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictbizArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdDictbizDetailArgs = {
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


export type QueryFindByIdOperationRecordArgs = {
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


export type QueryFindCountBackgroundTaskArgs = {
  search?: InputMaybe<BackgroundTaskSearch>;
};


export type QueryFindCountDeptArgs = {
  search?: InputMaybe<DeptSearch>;
};


export type QueryFindCountDictArgs = {
  search?: InputMaybe<DictSearch>;
};


export type QueryFindCountDictDetailArgs = {
  search?: InputMaybe<DictDetailSearch>;
};


export type QueryFindCountDictbizArgs = {
  search?: InputMaybe<DictbizSearch>;
};


export type QueryFindCountDictbizDetailArgs = {
  search?: InputMaybe<DictbizDetailSearch>;
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


export type QueryFindCountOperationRecordArgs = {
  search?: InputMaybe<OperationRecordSearch>;
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


export type QueryFindOneBackgroundTaskArgs = {
  search?: InputMaybe<BackgroundTaskSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneDeptArgs = {
  search?: InputMaybe<DeptSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneDictArgs = {
  search?: InputMaybe<DictSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneDictDetailArgs = {
  search?: InputMaybe<DictDetailSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneDictbizArgs = {
  search?: InputMaybe<DictbizSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneDictbizDetailArgs = {
  search?: InputMaybe<DictbizDetailSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneI18nArgs = {
  search?: InputMaybe<I18nSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneLangArgs = {
  search?: InputMaybe<LangSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneMenuArgs = {
  search?: InputMaybe<MenuSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneOperationRecordArgs = {
  search?: InputMaybe<OperationRecordSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneOptionsArgs = {
  search?: InputMaybe<OptionsSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneRoleArgs = {
  search?: InputMaybe<RoleSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneTenantArgs = {
  search?: InputMaybe<TenantSearch>;
  sort?: InputMaybe<Array<SortInput>>;
};


export type QueryFindOneUsrArgs = {
  search?: InputMaybe<UsrSearch>;
  sort?: InputMaybe<Array<SortInput>>;
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

export type RoleFieldComment = {
  __typename?: 'RoleFieldComment';
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 菜单 */
  menu_ids: Scalars['String'];
  /** 菜单 */
  menu_ids_lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
};

export type RoleInput = {
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 菜单 */
  menu_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type RoleModel = {
  __typename?: 'RoleModel';
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 菜单 */
  menu_ids?: Maybe<Array<Scalars['ID']>>;
  /** 菜单 */
  menu_ids_lbl?: Maybe<Array<Scalars['String']>>;
  /** 备注 */
  rem: Scalars['String'];
};

export type RoleSearch = {
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_ids?: InputMaybe<Array<Scalars['String']>>;
  menu_ids_is_null?: InputMaybe<Scalars['Boolean']>;
  menu_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
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

export type TenantFieldComment = {
  __typename?: 'TenantFieldComment';
  /** 到期日 */
  expiration: Scalars['String'];
  /** 到期日 */
  expiration_lbl: Scalars['String'];
  /** 域名绑定 */
  host: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 最大用户数 */
  max_usr_num: Scalars['String'];
  /** 菜单 */
  menu_ids: Scalars['String'];
  /** 菜单 */
  menu_ids_lbl: Scalars['String'];
  /** 排序 */
  order_by: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
};

export type TenantInput = {
  /** 到期日 */
  expiration?: InputMaybe<Scalars['NaiveDate']>;
  /** 域名绑定 */
  host?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 最大用户数 */
  max_usr_num?: InputMaybe<Scalars['Int']>;
  /** 菜单 */
  menu_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 菜单 */
  menu_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
};

export type TenantModel = {
  __typename?: 'TenantModel';
  /** 到期日 */
  expiration?: Maybe<Scalars['Date']>;
  /** 到期日 */
  expiration_lbl?: Maybe<Scalars['String']>;
  /** 域名绑定 */
  host: Scalars['String'];
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 最大用户数 */
  max_usr_num: Scalars['Int'];
  /** 菜单 */
  menu_ids?: Maybe<Array<Scalars['ID']>>;
  /** 菜单 */
  menu_ids_lbl?: Maybe<Array<Scalars['String']>>;
  /** 排序 */
  order_by: Scalars['Int'];
  /** 备注 */
  rem: Scalars['String'];
};

export type TenantSearch = {
  /** 到期日 */
  expiration?: InputMaybe<Array<Scalars['NaiveDate']>>;
  /** 域名绑定 */
  host?: InputMaybe<Scalars['String']>;
  host_like?: InputMaybe<Scalars['String']>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 最大用户数 */
  max_usr_num?: InputMaybe<Array<Scalars['Int']>>;
  /** 菜单 */
  menu_ids?: InputMaybe<Array<Scalars['String']>>;
  menu_ids_is_null?: InputMaybe<Scalars['Boolean']>;
  menu_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 排序 */
  order_by?: InputMaybe<Array<Scalars['Int']>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
};

export type UsrFieldComment = {
  __typename?: 'UsrFieldComment';
  /** 默认部门 */
  default_dept_id: Scalars['String'];
  /** 默认部门 */
  default_dept_id_lbl: Scalars['String'];
  /** 拥有部门 */
  dept_ids: Scalars['String'];
  /** 拥有部门 */
  dept_ids_lbl: Scalars['String'];
  /** 启用 */
  is_enabled: Scalars['String'];
  /** 启用 */
  is_enabled_lbl: Scalars['String'];
  /** 锁定 */
  is_locked: Scalars['String'];
  /** 锁定 */
  is_locked_lbl: Scalars['String'];
  /** 名称 */
  lbl: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 拥有角色 */
  role_ids: Scalars['String'];
  /** 拥有角色 */
  role_ids_lbl: Scalars['String'];
  /** 用户名 */
  username: Scalars['String'];
};

export type UsrInput = {
  /** 默认部门 */
  default_dept_id?: InputMaybe<Scalars['ID']>;
  /** 默认部门 */
  default_dept_id_lbl?: InputMaybe<Scalars['String']>;
  /** 拥有部门 */
  dept_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 拥有部门 */
  dept_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用 */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled_lbl?: InputMaybe<Scalars['String']>;
  /** 锁定 */
  is_locked?: InputMaybe<Scalars['Int']>;
  /** 锁定 */
  is_locked_lbl?: InputMaybe<Scalars['String']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 拥有角色 */
  role_ids?: InputMaybe<Array<Scalars['ID']>>;
  /** 拥有角色 */
  role_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 租户ID */
  tenant_id?: InputMaybe<Scalars['String']>;
  /** 用户名 */
  username?: InputMaybe<Scalars['String']>;
};

export type UsrModel = {
  __typename?: 'UsrModel';
  /** 默认部门 */
  default_dept_id: Scalars['ID'];
  /** 默认部门 */
  default_dept_id_lbl?: Maybe<Scalars['String']>;
  /** 拥有部门 */
  dept_ids?: Maybe<Array<Scalars['ID']>>;
  /** 拥有部门 */
  dept_ids_lbl?: Maybe<Array<Scalars['String']>>;
  /** ID */
  id: Scalars['ID'];
  /** 启用 */
  is_enabled: Scalars['Int'];
  /** 启用 */
  is_enabled_lbl?: Maybe<Scalars['String']>;
  /** 锁定 */
  is_locked: Scalars['Int'];
  /** 锁定 */
  is_locked_lbl?: Maybe<Scalars['String']>;
  /** 名称 */
  lbl: Scalars['String'];
  /** 密码 */
  password: Scalars['String'];
  /** 备注 */
  rem: Scalars['String'];
  /** 拥有角色 */
  role_ids?: Maybe<Array<Scalars['ID']>>;
  /** 拥有角色 */
  role_ids_lbl?: Maybe<Array<Scalars['String']>>;
  /** 用户名 */
  username: Scalars['String'];
};

export type UsrSearch = {
  /** 默认部门 */
  default_dept_id?: InputMaybe<Array<Scalars['String']>>;
  default_dept_id_is_null?: InputMaybe<Scalars['Boolean']>;
  default_dept_id_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 拥有部门 */
  dept_ids?: InputMaybe<Array<Scalars['String']>>;
  dept_ids_is_null?: InputMaybe<Scalars['Boolean']>;
  dept_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 启用 */
  is_enabled?: InputMaybe<Array<Scalars['Int']>>;
  /** 锁定 */
  is_locked?: InputMaybe<Array<Scalars['Int']>>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lbl_like?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  rem_like?: InputMaybe<Scalars['String']>;
  /** 拥有角色 */
  role_ids?: InputMaybe<Array<Scalars['String']>>;
  role_ids_is_null?: InputMaybe<Scalars['Boolean']>;
  role_ids_lbl?: InputMaybe<Array<Scalars['String']>>;
  /** 用户名 */
  username?: InputMaybe<Scalars['String']>;
  username_like?: InputMaybe<Scalars['String']>;
};
