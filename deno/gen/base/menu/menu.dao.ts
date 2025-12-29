// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import sqlstring from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
  splitCreateArr,
  FIND_ALL_IDS_LIMIT,
} from "/lib/util/dao_util.ts";

import {
  log,
  error,
  escapeDec,
  reqDate,
  delCache as delCacheCtx,
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
  hash,
} from "/lib/util/string_util.ts";

import { ServiceException } from "/lib/exceptions/service.exception.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  InputMaybe,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  getPagePathMenu,
  getTableNameMenu,
} from "./menu.model.ts";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<MenuSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.parent_id != null) {
    whereQuery += ` and t.parent_id in (${ args.push(search.parent_id) })`;
  }
  if (search?.parent_id_is_null) {
    whereQuery += ` and t.parent_id is null`;
  }
  if (search?.parent_id_lbl != null) {
    whereQuery += ` and parent_id_lbl.lbl in (${ args.push(search.parent_id_lbl) })`;
  }
  if (isNotEmpty(search?.parent_id_lbl_like)) {
    whereQuery += ` and parent_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.parent_id_lbl_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.route_path != null) {
    whereQuery += ` and t.route_path=${ args.push(search.route_path) }`;
  }
  if (isNotEmpty(search?.route_path_like)) {
    whereQuery += ` and t.route_path like ${ args.push("%" + sqlLike(search?.route_path_like) + "%") }`;
  }
  if (search?.route_query != null) {
    whereQuery += ` and t.route_query=${ args.push(search.route_query) }`;
  }
  if (isNotEmpty(search?.route_query_like)) {
    whereQuery += ` and t.route_query like ${ args.push("%" + sqlLike(search?.route_query_like) + "%") }`;
  }
  if (search?.is_home_hide != null) {
    whereQuery += ` and t.is_home_hide in (${ args.push(search.is_home_hide) })`;
  }
  if (search?.is_dyn_page != null) {
    whereQuery += ` and t.is_dyn_page in (${ args.push(search.is_dyn_page) })`;
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in (${ args.push(search.is_enabled) })`;
  }
  // 仅当前租户
  if (search?.is_current_tenant) {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    whereQuery += ` and base_tenant_menu.tenant_id=${ args.push(tenant_id) }`;
  }
  if (search?.order_by != null) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by>=${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by<=${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in (${ args.push(search.create_usr_id) })`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and t.create_usr_id_lbl in (${ args.push(search.create_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.create_usr_id_lbl_like)) {
    whereQuery += ` and t.create_usr_id_lbl like ${ args.push("%" + sqlLike(search.create_usr_id_lbl_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and t.update_usr_id in (${ args.push(search.update_usr_id) })`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
  }
  if (search?.update_usr_id_lbl != null) {
    whereQuery += ` and t.update_usr_id_lbl in (${ args.push(search.update_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.update_usr_id_lbl_like)) {
    whereQuery += ` and t.update_usr_id_lbl like ${ args.push("%" + sqlLike(search.update_usr_id_lbl_like) + "%") }`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time>=${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time<=${ args.push(search.update_time[1]) }`;
    }
  }
  if (search?.is_hidden != null) {
    whereQuery += ` and t.is_hidden in (${ args.push(search?.is_hidden) })`;
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<MenuSearch>,
  options?: {
  },
) {
  let fromQuery = `base_menu t
  left join base_menu parent_id_lbl on parent_id_lbl.id=t.parent_id
  left join base_tenant_menu on base_tenant_menu.menu_id=t.id and base_tenant_menu.is_deleted=0
  `;
  return fromQuery;
}

// MARK: findCountMenu
/** 根据条件查找菜单总数 */
export async function findCountMenu(
  search?: Readonly<MenuSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameMenu();
  const method = "findCountMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return 0;
  }
  if (search && search.ids && search.ids.length === 0) {
    return 0;
  }
  // 父菜单
  if (search && search.parent_id != null) {
    const len = search.parent_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.parent_id.length > ${ ids_limit }`);
    }
  }
  // 首页隐藏
  if (search && search.is_home_hide != null) {
    const len = search.is_home_hide.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_home_hide.length > ${ ids_limit }`);
    }
  }
  // 动态页面
  if (search && search.is_dyn_page != null) {
    const len = search.is_dyn_page.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_dyn_page.length > ${ ids_limit }`);
    }
  }
  // 启用
  if (search && search.is_enabled != null) {
    const len = search.is_enabled.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_enabled.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  // 隐藏记录
  if (search && search.is_hidden != null) {
    const len = search.is_hidden.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_hidden.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select count(1) total from (select 1 from ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAllMenu
/** 根据搜索条件和分页查找菜单列表 */
export async function findAllMenu(
  search?: Readonly<MenuSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<MenuModel[]> {
  
  const table = getTableNameMenu();
  const method = "findAllMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (page && Object.keys(page).length > 0) {
      msg += ` page:${ JSON.stringify(page) }`;
    }
    if (sort && Object.keys(sort).length > 0) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 父菜单
  if (search && search.parent_id != null) {
    const len = search.parent_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.parent_id.length > ${ ids_limit }`);
    }
  }
  // 首页隐藏
  if (search && search.is_home_hide != null) {
    const len = search.is_home_hide.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_home_hide.length > ${ ids_limit }`);
    }
  }
  // 动态页面
  if (search && search.is_dyn_page != null) {
    const len = search.is_dyn_page.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_dyn_page.length > ${ ids_limit }`);
    }
  }
  // 启用
  if (search && search.is_enabled != null) {
    const len = search.is_enabled.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_enabled.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  // 隐藏记录
  if (search && search.is_hidden != null) {
    const len = search.is_hidden.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_hidden.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,parent_id_lbl.lbl parent_id_lbl
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  sort = sort ?? [ ];
  sort = sort.filter((item) => item.prop);
  
  sort.push({
    prop: "order_by",
    order: SortOrderEnum.Asc,
  });
  
  if (!sort.some((item) => item.prop === "create_time")) {
    sort.push({
      prop: "create_time",
      order: SortOrderEnum.Desc,
    });
  }
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<MenuModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },
  );
  
  const [
    is_home_hideDict, // 首页隐藏
    is_dyn_pageDict, // 动态页面
    is_enabledDict, // 启用
  ] = await getDict([
    "yes_no",
    "yes_no",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 父菜单
    model.parent_id_lbl = model.parent_id_lbl || "";
    
    // 首页隐藏
    let is_home_hide_lbl = model.is_home_hide?.toString() || "";
    if (model.is_home_hide != null) {
      const dictItem = is_home_hideDict.find((dictItem) => dictItem.val === String(model.is_home_hide));
      if (dictItem) {
        is_home_hide_lbl = dictItem.lbl;
      }
    }
    model.is_home_hide_lbl = is_home_hide_lbl || "";
    
    // 动态页面
    let is_dyn_page_lbl = model.is_dyn_page?.toString() || "";
    if (model.is_dyn_page != null) {
      const dictItem = is_dyn_pageDict.find((dictItem) => dictItem.val === String(model.is_dyn_page));
      if (dictItem) {
        is_dyn_page_lbl = dictItem.lbl;
      }
    }
    model.is_dyn_page_lbl = is_dyn_page_lbl || "";
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled != null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === String(model.is_enabled));
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl || "";
    
    // 创建时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (create_time.isValid()) {
        model.create_time = create_time.format("YYYY-MM-DDTHH:mm:ss");
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.create_time_lbl = (model.create_time || "").toString();
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (update_time.isValid()) {
        model.update_time = update_time.format("YYYY-MM-DDTHH:mm:ss");
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.update_time_lbl = (model.update_time || "").toString();
      }
    } else {
      model.update_time_lbl = "";
    }
  }
  
  return result;
}

// MARK: setIdByLblMenu
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblMenu(
  input: MenuInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    is_home_hideDict, // 首页隐藏
    is_dyn_pageDict, // 动态页面
    is_enabledDict, // 启用
  ] = await getDict([
    "yes_no",
    "yes_no",
    "is_enabled",
  ]);
  
  // 父菜单
  if (isNotEmpty(input.parent_id_lbl) && input.parent_id == null) {
    input.parent_id_lbl = String(input.parent_id_lbl).trim();
    const menuModel = await findOneMenu(
      {
        lbl: input.parent_id_lbl,
      },
      undefined,
      options,
    );
    if (menuModel) {
      input.parent_id = menuModel.id;
    }
  } else if (isEmpty(input.parent_id_lbl) && input.parent_id != null) {
    const menu_model = await findOneMenu(
      {
        id: input.parent_id,
      },
      undefined,
      options,
    );
    if (menu_model) {
      input.parent_id_lbl = menu_model.lbl;
    }
  }
  
  // 首页隐藏
  if (isNotEmpty(input.is_home_hide_lbl) && input.is_home_hide == null) {
    const val = is_home_hideDict.find((itemTmp) => itemTmp.lbl === input.is_home_hide_lbl)?.val;
    if (val != null) {
      input.is_home_hide = Number(val);
    }
  } else if (isEmpty(input.is_home_hide_lbl) && input.is_home_hide != null) {
    const lbl = is_home_hideDict.find((itemTmp) => itemTmp.val === String(input.is_home_hide))?.lbl || "";
    input.is_home_hide_lbl = lbl;
  }
  
  // 动态页面
  if (isNotEmpty(input.is_dyn_page_lbl) && input.is_dyn_page == null) {
    const val = is_dyn_pageDict.find((itemTmp) => itemTmp.lbl === input.is_dyn_page_lbl)?.val;
    if (val != null) {
      input.is_dyn_page = Number(val);
    }
  } else if (isEmpty(input.is_dyn_page_lbl) && input.is_dyn_page != null) {
    const lbl = is_dyn_pageDict.find((itemTmp) => itemTmp.val === String(input.is_dyn_page))?.lbl || "";
    input.is_dyn_page_lbl = lbl;
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled == null) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val != null) {
      input.is_enabled = Number(val);
    }
  } else if (isEmpty(input.is_enabled_lbl) && input.is_enabled != null) {
    const lbl = is_enabledDict.find((itemTmp) => itemTmp.val === String(input.is_enabled))?.lbl || "";
    input.is_enabled_lbl = lbl;
  }
}

// MARK: getFieldCommentsMenu
/** 获取菜单字段注释 */
export async function getFieldCommentsMenu(): Promise<MenuFieldComment> {
  const field_comments: MenuFieldComment = {
    id: "ID",
    parent_id: "父菜单",
    parent_id_lbl: "父菜单",
    lbl: "名称",
    route_path: "路由",
    route_query: "参数",
    is_home_hide: "首页隐藏",
    is_home_hide_lbl: "首页隐藏",
    is_dyn_page: "动态页面",
    is_dyn_page_lbl: "动态页面",
    is_enabled: "启用",
    is_enabled_lbl: "启用",
    order_by: "排序",
    rem: "备注",
    create_usr_id: "创建人",
    create_usr_id_lbl: "创建人",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
    update_usr_id: "更新人",
    update_usr_id_lbl: "更新人",
    update_time: "更新时间",
    update_time_lbl: "更新时间",
  };
  
  return field_comments;
}

// MARK: findByUniqueMenu
/** 通过唯一约束获得菜单列表 */
export async function findByUniqueMenu(
  search0: Readonly<MenuInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel[]> {
  
  const table = getTableNameMenu();
  const method = "findByUniqueMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search0.id) {
    const model = await findOneMenu(
      {
        id: search0.id,
      },
      undefined,
      options,
    );
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: MenuModel[] = [ ];
  {
    if (search0.parent_id == null) {
      return [ ];
    }
    let parent_id: MenuId[] = [ ];
    if (!Array.isArray(search0.parent_id) && search0.parent_id != null) {
      parent_id = [ search0.parent_id, search0.parent_id ];
    } else {
      parent_id = search0.parent_id || [ ];
    }
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAllMenu(
      {
        parent_id,
        lbl,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueMenu(
  oldModel: Readonly<MenuModel>,
  input: Readonly<MenuInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.parent_id === input.parent_id &&
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUniqueMenu
/** 通过唯一约束检查 菜单 是否已经存在 */
export async function checkByUniqueMenu(
  input: Readonly<MenuInput>,
  oldModel: Readonly<MenuModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueMenu(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("菜单 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: MenuId = await updateByIdMenu(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        options,
      );
      return id;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

// MARK: findOneMenu
/** 根据条件查找第一菜单 */
export async function findOneMenu(
  search?: Readonly<MenuSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel | undefined> {
  
  const table = getTableNameMenu();
  const method = "findOneMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const menu_models = await findAllMenu(
    search,
    page,
    sort,
    options,
  );
  
  const menu_model = menu_models[0];
  
  return menu_model;
}

// MARK: findOneOkMenu
/** 根据条件查找第一菜单, 如果不存在则抛错 */
export async function findOneOkMenu(
  search?: Readonly<MenuSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel> {
  
  const table = getTableNameMenu();
  const method = "findOneOkMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const menu_models = await findAllMenu(
    search,
    page,
    sort,
    options,
  );
  
  const menu_model = menu_models[0];
  
  if (!menu_model) {
    const err_msg = "此 菜单 已被删除";
    throw new Error(err_msg);
  }
  
  return menu_model;
}

// MARK: findByIdMenu
/** 根据 id 查找菜单 */
export async function findByIdMenu(
  id: MenuId,
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel | undefined> {
  
  const table = getTableNameMenu();
  const method = "findByIdMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    return;
  }
  
  const menu_model = await findOneMenu(
    {
      id,
    },
    undefined,
    options,
  );
  
  return menu_model;
}

// MARK: findByIdOkMenu
/** 根据 id 查找菜单, 如果不存在则抛错 */
export async function findByIdOkMenu(
  id: MenuId,
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel> {
  
  const table = getTableNameMenu();
  const method = "findByIdOkMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const menu_model = await findByIdMenu(
    id,
    options,
  );
  
  if (!menu_model) {
    const err_msg = "此 菜单 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return menu_model;
}

// MARK: findByIdsMenu
/** 根据 ids 查找菜单 */
export async function findByIdsMenu(
  ids: MenuId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel[]> {
  
  const table = getTableNameMenu();
  const method = "findByIdsMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || ids.length === 0) {
    return [ ];
  }
  
  const models = await findAllMenu(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  const models2 = ids
    .map((id) => models.find((item) => item.id === id))
    .filter((item) => !!item);
  
  return models2;
}

// MARK: findByIdsOkMenu
/** 根据 ids 查找菜单, 出现查询不到的 id 则报错 */
export async function findByIdsOkMenu(
  ids: MenuId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MenuModel[]> {
  
  const table = getTableNameMenu();
  const method = "findByIdsOkMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const models = await findByIdsMenu(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 菜单 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 菜单 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existMenu
/** 根据搜索条件判断菜单是否存在 */
export async function existMenu(
  search?: Readonly<MenuSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameMenu();
  const method = "existMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  const model = await findOneMenu(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdMenu
/** 根据id判断菜单是否存在 */
export async function existByIdMenu(
  id?: Readonly<MenuId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameMenu();
  const method = "existByIdMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from base_menu t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const queryOptions = {
    cacheKey1,
    cacheKey2,
  };
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,
    queryOptions,
  );
  const result = !!model?.e;
  
  return result;
}

// MARK: validateIsEnabledMenu
/** 校验菜单是否启用 */
export async function validateIsEnabledMenu(
  model: Readonly<MenuModel>,
) {
  if (model.is_enabled == 0) {
    throw "菜单 已禁用";
  }
}

// MARK: validateOptionMenu
/** 校验菜单是否存在 */
export async function validateOptionMenu(
  model?: MenuModel,
) {
  if (!model) {
    const err_msg = "菜单 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateMenu
/** 菜单增加和修改时校验输入 */
export async function validateMenu(
  input: Readonly<MenuInput>,
) {
  const fieldComments = await getFieldCommentsMenu();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 父菜单
  await validators.chars_max_length(
    input.parent_id,
    22,
    fieldComments.parent_id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    45,
    fieldComments.lbl,
  );
  
  // 路由
  await validators.chars_max_length(
    input.route_path,
    100,
    fieldComments.route_path,
  );
  
  // 参数
  await validators.chars_max_length(
    input.route_query,
    200,
    fieldComments.route_query,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
  // 创建人
  await validators.chars_max_length(
    input.create_usr_id,
    22,
    fieldComments.create_usr_id,
  );
  
  // 更新人
  await validators.chars_max_length(
    input.update_usr_id,
    22,
    fieldComments.update_usr_id,
  );
  
}

// MARK: createReturnMenu
/** 创建 菜单 并返回 */
export async function createReturnMenu(
  input: Readonly<MenuInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MenuModel> {
  
  const table = getTableNameMenu();
  const method = "createReturnMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  const model = await validateOptionMenu(
    await findOneMenu(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createMenu
/** 创建 菜单 */
export async function createMenu(
  input: Readonly<MenuInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MenuId> {
  
  const table = getTableNameMenu();
  const method = "createMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

// MARK: createsReturnMenu
/** 批量创建 菜单 并返回 */
export async function createsReturnMenu(
  inputs: MenuInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MenuModel[]> {
  
  const table = getTableNameMenu();
  const method = "createsReturnMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  const models = await findByIdsMenu(ids, options);
  
  return models;
}

// MARK: createsMenu
/** 批量创建 菜单 */
export async function createsMenu(
  inputs: MenuInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MenuId[]> {
  
  const table = getTableNameMenu();
  const method = "createsMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: MenuInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MenuId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNameMenu();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: MenuId[] = [ ];
  const inputs2: MenuInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueMenu(input, options);
    if (oldModels.length > 0) {
      let id: MenuId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueMenu(
          input,
          oldModel,
          options?.uniqueType,
          options,
        );
        if (id) {
          break;
        }
      }
      if (id) {
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
    const id = shortUuidV4<MenuId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCacheMenu();
  
  const args = new QueryArgs();
  let sql = "insert into base_menu(id,create_time,update_time,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,parent_id,lbl,route_path,route_query,is_home_hide,is_dyn_page,is_enabled,order_by,rem,is_hidden)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (!is_silent_mode) {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,${ args.push(reqDate()) }`;
        }
      } else {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,null`;
        }
      }
      if (input.update_time != null || input.update_time_save_null) {
        sql += `,${ args.push(input.update_time) }`;
      } else {
        sql += `,null`;
      }
      if (!is_silent_mode) {
        if (input.create_usr_id == null) {
          let usr_id = await get_usr_id();
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id, options);
            if (!usr_model) {
              usr_id = undefined;
            } else {
              usr_lbl = usr_model.lbl;
            }
          }
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
          sql += ",default";
        } else {
          let usr_id: UsrId | undefined = input.create_usr_id;
          let usr_lbl = "";
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
            usr_lbl = "";
          } else {
            usr_lbl = usr_model.lbl;
          }
          if (usr_id) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
        if (input.create_usr_id_lbl == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id_lbl) }`;
        }
      }
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.update_usr_id_lbl != null) {
        sql += `,${ args.push(input.update_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.parent_id != null) {
        sql += `,${ args.push(input.parent_id) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.route_path != null) {
        sql += `,${ args.push(input.route_path) }`;
      } else {
        sql += ",default";
      }
      if (input.route_query != null) {
        sql += `,${ args.push(input.route_query) }`;
      } else {
        sql += ",default";
      }
      if (input.is_home_hide != null) {
        sql += `,${ args.push(input.is_home_hide) }`;
      } else {
        sql += ",default";
      }
      if (input.is_dyn_page != null) {
        sql += `,${ args.push(input.is_dyn_page) }`;
      } else {
        sql += ",default";
      }
      if (input.is_enabled != null) {
        sql += `,${ args.push(input.is_enabled) }`;
      } else {
        sql += ",default";
      }
      if (input.order_by != null) {
        sql += `,${ args.push(input.order_by) }`;
      } else {
        sql += ",default";
      }
      if (input.rem != null) {
        sql += `,${ args.push(input.rem) }`;
      } else {
        sql += ",default";
      }
      if (input.is_hidden != null) {
        sql += `,${ args.push(input.is_hidden) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  await delCacheMenu();
  
  return ids2;
}

// MARK: delCacheMenu
/** 删除缓存 */
export async function delCacheMenu() {
  await delCacheCtx(`dao.sql.base_menu`);
  await delCacheCtx(`dao.sql.base_menu._getMenus`);
}

// MARK: updateByIdMenu
/** 根据 id 修改 菜单 */
export async function updateByIdMenu(
  id: MenuId,
  input: MenuInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<MenuId> {
  
  const table = getTableNameMenu();
  const method = "updateByIdMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    throw new Error("updateByIdMenu: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdMenu: input cannot be null");
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueMenu(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "菜单 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdMenu(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 菜单 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update base_menu set `;
  let updateFldNum = 0;
  if (input.parent_id != null) {
    if (input.parent_id != oldModel.parent_id) {
      sql += `parent_id=${ args.push(input.parent_id) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.route_path != null) {
    if (input.route_path != oldModel.route_path) {
      sql += `route_path=${ args.push(input.route_path) },`;
      updateFldNum++;
    }
  }
  if (input.route_query != null) {
    if (input.route_query != oldModel.route_query) {
      sql += `route_query=${ args.push(input.route_query) },`;
      updateFldNum++;
    }
  }
  if (input.is_home_hide != null) {
    if (input.is_home_hide != oldModel.is_home_hide) {
      sql += `is_home_hide=${ args.push(input.is_home_hide) },`;
      updateFldNum++;
    }
  }
  if (input.is_dyn_page != null) {
    if (input.is_dyn_page != oldModel.is_dyn_page) {
      sql += `is_dyn_page=${ args.push(input.is_dyn_page) },`;
      updateFldNum++;
    }
  }
  if (input.is_enabled != null) {
    if (input.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled=${ args.push(input.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (input.order_by != null) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by=${ args.push(input.order_by) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.create_usr_id_lbl)) {
    sql += `create_usr_id_lbl=?,`;
    args.push(input.create_usr_id_lbl);
    updateFldNum++;
  }
  if (input.create_usr_id != null) {
    if (input.create_usr_id != oldModel.create_usr_id) {
      sql += `create_usr_id=${ args.push(input.create_usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.create_time != null || input.create_time_save_null) {
    if (input.create_time != oldModel.create_time) {
      sql += `create_time=${ args.push(input.create_time) },`;
      updateFldNum++;
    }
  }
  if (input.is_hidden != null) {
    if (input.is_hidden != oldModel.is_hidden) {
      sql += `is_hidden=${ args.push(input.is_hidden) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        let usr_id = await get_usr_id();
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
        if (usr_lbl) {
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      } else if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
        let usr_id: UsrId | undefined = input.update_usr_id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      }
    } else {
      if (input.update_usr_id != null) {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
      if (input.update_usr_id_lbl != null) {
        sql += `update_usr_id_lbl=${ args.push(input.update_usr_id_lbl) },`;
      }
    }
    if (!is_silent_mode && !is_creating) {
      if (input.update_time != null || input.update_time_save_null) {
        sql += `update_time=${ args.push(input.update_time) },`;
      } else {
        sql += `update_time=${ args.push(reqDate()) },`;
      }
    } else if (input.update_time != null || input.update_time_save_null) {
      sql += `update_time=${ args.push(input.update_time) },`;
    }
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    await delCacheMenu();
    
    if (sqlSetFldNum > 0) {
      const is_debug = getParsedEnv("database_debug_sql") === "true";
      await execute(
        sql,
        args,
        {
          debug: is_debug,
        },
      );
    }
  }
  
  if (updateFldNum > 0) {
    await delCacheMenu();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsMenu
/** 根据 ids 删除 菜单 */
export async function deleteByIdsMenu(
  ids: MenuId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMenu();
  const method = "deleteByIdsMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCacheMenu();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdMenu(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update base_menu set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      let usr_id = await get_usr_id();
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }
      let usr_lbl = "";
      if (usr_id) {
        const usr_model = await findByIdUsr(usr_id, options);
        if (!usr_model) {
          usr_id = undefined;
        } else {
          usr_lbl = usr_model.lbl;
        }
      }
      if (usr_lbl) {
        sql += `,delete_usr_id_lbl=${ args.push(usr_lbl) }`;
      }
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(
      sql,
      args,
      {
        debug: is_debug_sql,
      },
    );
    affectedRows += res.affectedRows;
    {
      const args = new QueryArgs();
      const sql = `update base_role_menu set is_deleted=1 where menu_id=${ args.push(id) } and is_deleted=0`;
      await execute(
        sql,
        args,
        {
          debug: is_debug_sql,
        },
      );
    }
    {
      const args = new QueryArgs();
      const sql = `update base_tenant_menu set is_deleted=1 where menu_id=${ args.push(id) } and is_deleted=0`;
      await execute(
        sql,
        args,
        {
          debug: is_debug_sql,
        },
      );
    }
  }
  
  await delCacheMenu();
  
  return affectedRows;
}

// MARK: getIsEnabledByIdMenu
/** 根据 id 查找 菜单 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledByIdMenu(
  id: MenuId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findByIdMenu(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIdsMenu
/** 根据 ids 启用或者禁用 菜单 */
export async function enableByIdsMenu(
  ids: MenuId[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMenu();
  const method = "enableByIdsMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (is_enabled != null) {
      msg += ` is_enabled:${ is_enabled }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCacheMenu();
  }
  
  const args = new QueryArgs();
  const sql = `update base_menu set is_enabled=${ args.push(is_enabled) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCacheMenu();
  
  return num;
}

// MARK: revertByIdsMenu
/** 根据 ids 还原 菜单 */
export async function revertByIdsMenu(
  ids: MenuId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMenu();
  const method = "revertByIdsMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCacheMenu();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOneMenu(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdMenu(
        id,
        options,
      );
    }
    if (!old_model) {
      continue;
    }
    {
      const input = {
        ...old_model,
        id: undefined,
      } as MenuInput;
      const models = await findByUniqueMenu(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "菜单 重复";
      }
    }
    const args = new QueryArgs();
    const sql = `update base_menu set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCacheMenu();
  
  return num;
}

// MARK: forceDeleteByIdsMenu
/** 根据 ids 彻底删除 菜单 */
export async function forceDeleteByIdsMenu(
  ids: MenuId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMenu();
  const method = "forceDeleteByIdsMenu";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCacheMenu();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneMenu(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (oldModel && !is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from base_menu where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    {
      const args = new QueryArgs();
      const sql = `delete from base_role_menu where menu_id=${ args.push(id) }`;
      await execute(
        sql,
        args,
        {
          debug: is_debug_sql,
        },
      );
    }
    {
      const args = new QueryArgs();
      const sql = `delete from base_tenant_menu where menu_id=${ args.push(id) }`;
      await execute(
        sql,
        args,
        {
          debug: is_debug_sql,
        },
      );
    }
  }
  
  await delCacheMenu();
  
  return num;
}

// MARK: findLastOrderByMenu
/** 查找 菜单 order_by 字段的最大值 */
export async function findLastOrderByMenu(
  search?: Readonly<MenuSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMenu();
  const method = "findLastOrderByMenu";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let sql = `select t.order_by from base_menu t`;
  const args = new QueryArgs();
  const whereQuery = await getWhereQuery(
    args,
    search,
  );
  if (whereQuery) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` order by t.order_by desc limit 1`;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  let result = model?.order_by ?? 0;
  
  return result;
}
