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
  /** 类型ID */
  type?: InputMaybe<Scalars['String']>;
};

export type Background_TaskSearch = {
  /** 开始时间 */
  begin_time?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type FindAllBackground_Task = {
  __typename?: 'FindAllBackground_task';
  /** 状态名称 */
  _state?: Maybe<Scalars['String']>;
  /** 类型名称 */
  _type?: Maybe<Scalars['String']>;
  /** 开始时间 */
  begin_time?: Maybe<Scalars['String']>;
  /** 结束时间 */
  end_time?: Maybe<Scalars['String']>;
  /** 错误信息 */
  err_msg?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
  /** 备注 */
  rem?: Maybe<Scalars['String']>;
  /** 执行结果 */
  result?: Maybe<Scalars['String']>;
  /** 状态ID */
  state?: Maybe<Scalars['String']>;
  /** 类型ID */
  type?: Maybe<Scalars['String']>;
};

export type FindAllMenu = {
  __typename?: 'FindAllMenu';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 父菜单名称 */
  _menu_id?: Maybe<Scalars['String']>;
  /** 类型名称 */
  _type?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: Maybe<Scalars['Int']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
  /** 父菜单ID */
  menu_id?: Maybe<Scalars['ID']>;
  /** 排序 */
  order_by?: Maybe<Scalars['Int']>;
  /** 备注 */
  rem?: Maybe<Scalars['String']>;
  /** 路由 */
  route_path?: Maybe<Scalars['String']>;
  /** 参数 */
  route_query?: Maybe<Scalars['JSON']>;
  /** 类型ID */
  type?: Maybe<Scalars['String']>;
};

export type FindAllPermit = {
  __typename?: 'FindAllPermit';
  /** 菜单名称 */
  _menu_id?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
  /** 菜单ID */
  menu_id?: Maybe<Scalars['ID']>;
  /** 备注 */
  rem?: Maybe<Scalars['String']>;
};

export type FindAllRole = {
  __typename?: 'FindAllRole';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  id?: Maybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: Maybe<Scalars['Int']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
  /** 菜单ID */
  menu_ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** 备注 */
  rem?: Maybe<Scalars['String']>;
};

export type FindAllTenant = {
  __typename?: 'FindAllTenant';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** 到期日 */
  expiration?: Maybe<Scalars['String']>;
  /** 域名绑定 */
  host?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: Maybe<Scalars['Int']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
  /** 最大用户数 */
  max_usr_num?: Maybe<Scalars['Int']>;
  /** 菜单ID */
  menu_ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** 排序 */
  order_by?: Maybe<Scalars['Int']>;
  /** 备注 */
  rem?: Maybe<Scalars['String']>;
};

export type FindAllUsr = {
  __typename?: 'FindAllUsr';
  /** 启用名称 */
  _is_enabled?: Maybe<Scalars['String']>;
  /** 角色名称 */
  _role_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  id?: Maybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: Maybe<Scalars['Int']>;
  /** 名称 */
  lbl?: Maybe<Scalars['String']>;
  /** 密码 */
  password?: Maybe<Scalars['String']>;
  /** 备注 */
  rem?: Maybe<Scalars['String']>;
  /** 角色ID */
  role_ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** 用户名 */
  username?: Maybe<Scalars['String']>;
};

export type GetLoginTenants = {
  __typename?: 'GetLoginTenants';
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
  /** 类型ID */
  type?: InputMaybe<Scalars['String']>;
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
  createBackground_task: Scalars['ID'];
  /** 创建一条数据 */
  createMenu: Scalars['ID'];
  /** 创建一条数据 */
  createPermit: Scalars['ID'];
  /** 创建一条数据 */
  createRole: Scalars['ID'];
  /** 创建一条数据 */
  createTenant: Scalars['ID'];
  /** 创建一条数据 */
  createUsr: Scalars['ID'];
  /** 根据ids删除数据 */
  deleteByIdsBackground_task: Scalars['Int'];
  /** 根据ids删除数据 */
  deleteByIdsMenu: Scalars['Int'];
  /** 根据ids删除数据 */
  deleteByIdsPermit: Scalars['Int'];
  /** 根据ids删除数据 */
  deleteByIdsRole: Scalars['Int'];
  /** 根据ids删除数据 */
  deleteByIdsTenant: Scalars['Int'];
  /** 根据ids删除数据 */
  deleteByIdsUsr: Scalars['Int'];
  /** 导入文件 */
  importFileBackground_task?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileMenu?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFilePermit?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileRole?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileTenant?: Maybe<Scalars['String']>;
  /** 导入文件 */
  importFileUsr?: Maybe<Scalars['String']>;
  /** 登录 */
  login: Scalars['String'];
  /** 根据ids还原数据 */
  revertByIdsBackground_task: Scalars['Int'];
  /** 根据ids还原数据 */
  revertByIdsMenu: Scalars['Int'];
  /** 根据ids还原数据 */
  revertByIdsPermit: Scalars['Int'];
  /** 根据ids还原数据 */
  revertByIdsRole: Scalars['Int'];
  /** 根据ids还原数据 */
  revertByIdsTenant: Scalars['Int'];
  /** 根据ids还原数据 */
  revertByIdsUsr: Scalars['Int'];
  /** 根据id修改一条数据 */
  updateByIdBackground_task: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdMenu: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdPermit: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdRole: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdTenant: Scalars['ID'];
  /** 根据id修改一条数据 */
  updateByIdUsr: Scalars['ID'];
};


export type MutationCreateBackground_TaskArgs = {
  model: Background_TaskInput;
};


export type MutationCreateMenuArgs = {
  model: MenuInput;
};


export type MutationCreatePermitArgs = {
  model: PermitInput;
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
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteByIdsMenuArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteByIdsPermitArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteByIdsRoleArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteByIdsTenantArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteByIdsUsrArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationImportFileBackground_TaskArgs = {
  id: Scalars['ID'];
};


export type MutationImportFileMenuArgs = {
  id: Scalars['ID'];
};


export type MutationImportFilePermitArgs = {
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


export type MutationLoginArgs = {
  password: Scalars['String'];
  tenant_id: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRevertByIdsBackground_TaskArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRevertByIdsMenuArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRevertByIdsPermitArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRevertByIdsRoleArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRevertByIdsTenantArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationRevertByIdsUsrArgs = {
  ids: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationUpdateByIdBackground_TaskArgs = {
  id: Scalars['ID'];
  model: Background_TaskInput;
};


export type MutationUpdateByIdMenuArgs = {
  id: Scalars['ID'];
  model: MenuInput;
};


export type MutationUpdateByIdPermitArgs = {
  id: Scalars['ID'];
  model: PermitInput;
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

export type PageInput = {
  orderBy?: InputMaybe<Scalars['String']>;
  orderDec?: InputMaybe<Scalars['Boolean']>;
  pgOffset?: InputMaybe<Scalars['Int']>;
  pgSize?: InputMaybe<Scalars['Int']>;
};

export type PermitInput = {
  /** 菜单名称 */
  _menu_id?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 菜单ID */
  menu_id?: InputMaybe<Scalars['ID']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
};

export type PermitSearch = {
  _menu_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** ID */
  id?: InputMaybe<Scalars['ID']>;
  /** ID列表 */
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 是否已删除 */
  is_deleted?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  lblLike?: InputMaybe<Scalars['String']>;
  /** 菜单 */
  menu_id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _version?: Maybe<Scalars['String']>;
  /** 根据搜索条件导出 */
  exportExcelBackground_task: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelMenu: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelPermit: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelRole: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelTenant: Scalars['String'];
  /** 根据搜索条件导出 */
  exportExcelUsr: Scalars['String'];
  /** 根据搜索条件和分页查找数据 */
  findAllBackground_task: Array<Maybe<FindAllBackground_Task>>;
  /** 根据搜索条件和分页查找数据 */
  findAllMenu: Array<Maybe<FindAllMenu>>;
  /** 根据搜索条件和分页查找数据 */
  findAllPermit: Array<Maybe<FindAllPermit>>;
  /** 根据搜索条件和分页查找数据 */
  findAllRole: Array<Maybe<FindAllRole>>;
  /** 根据搜索条件和分页查找数据 */
  findAllTenant: Array<Maybe<FindAllTenant>>;
  /** 根据搜索条件和分页查找数据 */
  findAllUsr: Array<Maybe<FindAllUsr>>;
  /** 根据id查找一条数据 */
  findByIdBackground_task?: Maybe<FindAllBackground_Task>;
  /** 根据id查找一条数据 */
  findByIdMenu?: Maybe<FindAllMenu>;
  /** 根据id查找一条数据 */
  findByIdPermit?: Maybe<FindAllPermit>;
  /** 根据id查找一条数据 */
  findByIdRole?: Maybe<FindAllRole>;
  /** 根据id查找一条数据 */
  findByIdTenant?: Maybe<FindAllTenant>;
  /** 根据id查找一条数据 */
  findByIdUsr?: Maybe<FindAllUsr>;
  /** 根据条件查找据数总数 */
  findCountBackground_task: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountMenu: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountPermit: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountRole: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountTenant: Scalars['Int'];
  /** 根据条件查找据数总数 */
  findCountUsr: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByMenu: Scalars['Int'];
  /** 查找order_by字段的最大值 */
  findLastOrderByTenant: Scalars['Int'];
  /** 根据条件查找第一条数据 */
  findOneBackground_task?: Maybe<FindAllBackground_Task>;
  /** 根据条件查找第一条数据 */
  findOneMenu?: Maybe<FindAllMenu>;
  /** 根据条件查找第一条数据 */
  findOnePermit?: Maybe<FindAllPermit>;
  /** 根据条件查找第一条数据 */
  findOneRole?: Maybe<FindAllRole>;
  /** 根据条件查找第一条数据 */
  findOneTenant?: Maybe<FindAllTenant>;
  /** 根据条件查找第一条数据 */
  findOneUsr?: Maybe<FindAllUsr>;
  /** 根据 当前网址的域名+端口 获取 租户列表 */
  getLoginTenants: Array<Maybe<GetLoginTenants>>;
  /** 获取主页菜单 */
  getMenus: Array<Maybe<GetMenus>>;
};


export type QueryExportExcelBackground_TaskArgs = {
  search?: InputMaybe<Background_TaskSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelMenuArgs = {
  search?: InputMaybe<MenuSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryExportExcelPermitArgs = {
  search?: InputMaybe<PermitSearch>;
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


export type QueryFindAllMenuArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<MenuSearch>;
  sort?: InputMaybe<Array<InputMaybe<SortInput>>>;
};


export type QueryFindAllPermitArgs = {
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<PermitSearch>;
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


export type QueryFindByIdMenuArgs = {
  id: Scalars['ID'];
};


export type QueryFindByIdPermitArgs = {
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


export type QueryFindCountMenuArgs = {
  search?: InputMaybe<MenuSearch>;
};


export type QueryFindCountPermitArgs = {
  search?: InputMaybe<PermitSearch>;
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


export type QueryFindOneMenuArgs = {
  search?: InputMaybe<MenuSearch>;
};


export type QueryFindOnePermitArgs = {
  search?: InputMaybe<PermitSearch>;
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


export type QueryGetLoginTenantsArgs = {
  host: Scalars['String'];
};


export type QueryGetMenusArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type RoleInput = {
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 菜单名称 */
  _menu_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 菜单ID */
  menu_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
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
  _menu_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  menu_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 排序 */
  order_by?: InputMaybe<Scalars['Int']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
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
  /** 启用名称 */
  _is_enabled?: InputMaybe<Scalars['String']>;
  /** 角色名称 */
  _role_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  id?: InputMaybe<Scalars['ID']>;
  /** 启用ID */
  is_enabled?: InputMaybe<Scalars['Int']>;
  /** 名称 */
  lbl?: InputMaybe<Scalars['String']>;
  /** 密码 */
  password?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  /** 角色ID */
  role_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** 用户名 */
  username?: InputMaybe<Scalars['String']>;
};

export type UsrSearch = {
  _role_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  /** 密码 */
  password?: InputMaybe<Scalars['String']>;
  passwordLike?: InputMaybe<Scalars['String']>;
  /** 备注 */
  rem?: InputMaybe<Scalars['String']>;
  remLike?: InputMaybe<Scalars['String']>;
  /** 角色 */
  role_ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** 用户名 */
  username?: InputMaybe<Scalars['String']>;
  usernameLike?: InputMaybe<Scalars['String']>;
};
