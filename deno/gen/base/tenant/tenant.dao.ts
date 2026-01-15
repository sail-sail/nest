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
  many2manyUpdate,
} from "/lib/util/dao_util.ts";

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
  findOneLang,
} from "/gen/base/lang/lang.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  getPagePathTenant,
  getTableNameTenant,
} from "./tenant.model.ts";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<TenantSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (isNotEmpty(search?.keyword)) {
    whereQuery += " and (";
    whereQuery += ` t.code like ${ args.push("%" + sqlLike(search?.keyword) + "%") }`;
    whereQuery += " or";
    whereQuery += ` t.lbl like ${ args.push("%" + sqlLike(search?.keyword) + "%") }`;
    whereQuery += ")";
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.code_seq != null) {
    if (search.code_seq[0] != null) {
      whereQuery += ` and t.code_seq>=${ args.push(search.code_seq[0]) }`;
    }
    if (search.code_seq[1] != null) {
      whereQuery += ` and t.code_seq<=${ args.push(search.code_seq[1]) }`;
    }
  }
  if (search?.code != null) {
    whereQuery += ` and t.code=${ args.push(search.code) }`;
  }
  if (isNotEmpty(search?.code_like)) {
    whereQuery += ` and t.code like ${ args.push("%" + sqlLike(search?.code_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.domain_ids != null) {
    whereQuery += ` and base_domain.id in (${ args.push(search.domain_ids) })`;
  }
  if (search?.domain_ids_is_null) {
    whereQuery += ` and base_domain.id is null`;
  }
  if (isNotEmpty(search?.domain_ids_lbl_like)) {
    whereQuery += ` and base_domain.lbl like ${ args.push("%" + sqlLike(search?.domain_ids_lbl_like) + "%") }`;
  }
  if (search?.menu_ids != null) {
    whereQuery += ` and base_menu.id in (${ args.push(search.menu_ids) })`;
  }
  if (search?.menu_ids_is_null) {
    whereQuery += ` and base_menu.id is null`;
  }
  if (isNotEmpty(search?.menu_ids_lbl_like)) {
    whereQuery += ` and base_menu.lbl like ${ args.push("%" + sqlLike(search?.menu_ids_lbl_like) + "%") }`;
  }
  if (search?.title != null) {
    whereQuery += ` and t.title=${ args.push(search.title) }`;
  }
  if (isNotEmpty(search?.title_like)) {
    whereQuery += ` and t.title like ${ args.push("%" + sqlLike(search?.title_like) + "%") }`;
  }
  if (search?.info != null) {
    whereQuery += ` and t.info=${ args.push(search.info) }`;
  }
  if (isNotEmpty(search?.info_like)) {
    whereQuery += ` and t.info like ${ args.push("%" + sqlLike(search?.info_like) + "%") }`;
  }
  if (search?.lang_id != null) {
    whereQuery += ` and t.lang_id in (${ args.push(search.lang_id) })`;
  }
  if (search?.lang_id_is_null) {
    whereQuery += ` and t.lang_id is null`;
  }
  if (search?.lang_id_lbl != null) {
    whereQuery += ` and t.lang_id_lbl in (${ args.push(search.lang_id_lbl) })`;
  }
  if (isNotEmpty(search?.lang_id_lbl_like)) {
    whereQuery += ` and t.lang_id_lbl like ${ args.push("%" + sqlLike(search.lang_id_lbl_like) + "%") }`;
  }
  if (search?.is_locked != null) {
    whereQuery += ` and t.is_locked in (${ args.push(search.is_locked) })`;
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in (${ args.push(search.is_enabled) })`;
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
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<TenantSearch>,
  options?: {
  },
) {
  
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `base_tenant t
  left join base_tenant_domain
    on base_tenant_domain.tenant_id=t.id
    and base_tenant_domain.is_deleted=${ args.push(is_deleted) }
  left join base_domain
    on base_tenant_domain.domain_id=base_domain.id
    and base_domain.is_deleted=${ args.push(is_deleted) }
  left join(select
  json_objectagg(base_tenant_domain.order_by,base_domain.id) domain_ids,
  json_objectagg(base_tenant_domain.order_by,base_domain.lbl) domain_ids_lbl,
  base_tenant.id tenant_id
  from base_tenant_domain
  inner join base_domain on base_domain.id=base_tenant_domain.domain_id
  inner join base_tenant on base_tenant.id=base_tenant_domain.tenant_id
  where base_tenant_domain.is_deleted=${ args.push(is_deleted) }
  group by tenant_id) _domain on _domain.tenant_id=t.id
  left join base_tenant_menu
    on base_tenant_menu.tenant_id=t.id
    and base_tenant_menu.is_deleted=${ args.push(is_deleted) }
  left join base_menu
    on base_tenant_menu.menu_id=base_menu.id
    and base_menu.is_deleted=${ args.push(is_deleted) }
  left join(select
  json_objectagg(base_tenant_menu.order_by,base_menu.id) menu_ids,
  json_objectagg(base_tenant_menu.order_by,base_menu.lbl) menu_ids_lbl,
  base_tenant.id tenant_id
  from base_tenant_menu
  inner join base_menu on base_menu.id=base_tenant_menu.menu_id
  inner join base_tenant on base_tenant.id=base_tenant_menu.tenant_id
  where base_tenant_menu.is_deleted=${ args.push(is_deleted) }
  group by tenant_id) _menu on _menu.tenant_id=t.id`;
  return fromQuery;
}

// MARK: findCountTenant
/** 根据条件查找租户总数 */
export async function findCountTenant(
  search?: Readonly<TenantSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "findCountTenant";
  
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
  // 所属域名
  if (search && search.domain_ids != null) {
    const len = search.domain_ids.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.domain_ids.length > ${ ids_limit }`);
    }
  }
  // 菜单权限
  if (search && search.menu_ids != null) {
    const len = search.menu_ids.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.menu_ids.length > ${ ids_limit }`);
    }
  }
  // 语言
  if (search && search.lang_id != null) {
    const len = search.lang_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.lang_id.length > ${ ids_limit }`);
    }
  }
  // 锁定
  if (search && search.is_locked != null) {
    const len = search.is_locked.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_locked.length > ${ ids_limit }`);
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

// MARK: findAllTenant
/** 根据搜索条件和分页查找租户列表 */
export async function findAllTenant(
  search?: Readonly<TenantSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<TenantModel[]> {
  
  const table = getTableNameTenant();
  const method = "findAllTenant";
  
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
  // 所属域名
  if (search && search.domain_ids != null) {
    const len = search.domain_ids.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.domain_ids.length > ${ ids_limit }`);
    }
  }
  // 菜单权限
  if (search && search.menu_ids != null) {
    const len = search.menu_ids.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.menu_ids.length > ${ ids_limit }`);
    }
  }
  // 语言
  if (search && search.lang_id != null) {
    const len = search.lang_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.lang_id.length > ${ ids_limit }`);
    }
  }
  // 锁定
  if (search && search.is_locked != null) {
    const len = search.is_locked.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_locked.length > ${ ids_limit }`);
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
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,max(domain_ids) domain_ids
      ,max(domain_ids_lbl) domain_ids_lbl
      ,max(menu_ids) menu_ids
      ,max(menu_ids_lbl) menu_ids_lbl
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
  
  const result = await query<TenantModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },
  );
  
  if (page?.isResultLimit !== false) {
    let find_all_result_limit = Number(getParsedEnv("server_find_all_result_limit")) || 1000;
    const len = result.length;
    if (len > find_all_result_limit) {
      throw new Error(`结果集过大, 超过 ${ find_all_result_limit }`);
    }
  }
  for (const item of result) {
    
    // 所属域名
    if (item.domain_ids) {
      const obj = item.domain_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.domain_ids = keys.map((key) => obj[key]);
    } else {
      item.domain_ids = [ ];
    }
    if (item.domain_ids_lbl) {
      const obj = item.domain_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.domain_ids_lbl = keys.map((key) => obj[key]);
    } else {
      item.domain_ids_lbl = [ ];
    }
    
    // 菜单权限
    if (item.menu_ids) {
      const obj = item.menu_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.menu_ids = keys.map((key) => obj[key]);
    } else {
      item.menu_ids = [ ];
    }
    if (item.menu_ids_lbl) {
      const obj = item.menu_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.menu_ids_lbl = keys.map((key) => obj[key]);
    } else {
      item.menu_ids_lbl = [ ];
    }
  }
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked != null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === String(model.is_locked));
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl || "";
    
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

// MARK: setIdByLblTenant
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblTenant(
  input: TenantInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 所属域名
  if (!input.domain_ids && input.domain_ids_lbl) {
    input.domain_ids_lbl = input.domain_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.domain_ids_lbl = Array.from(new Set(input.domain_ids_lbl));
    if (input.domain_ids_lbl.length === 0) {
      input.domain_ids = [ ];
    } else {
      const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select t.id from base_domain t where t.lbl in (${ args.push(input.domain_ids_lbl) })`;
      interface Result {
        id: DomainId;
      }
      const models = await query<Result>(sql, args, {
        debug: is_debug_sql,
      });
      input.domain_ids = models.map((item: { id: DomainId }) => item.id);
    }
  }
  
  // 菜单权限
  if (!input.menu_ids && input.menu_ids_lbl) {
    input.menu_ids_lbl = input.menu_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.menu_ids_lbl = Array.from(new Set(input.menu_ids_lbl));
    if (input.menu_ids_lbl.length === 0) {
      input.menu_ids = [ ];
    } else {
      const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select t.id from base_menu t where t.lbl in (${ args.push(input.menu_ids_lbl) })`;
      interface Result {
        id: MenuId;
      }
      const models = await query<Result>(sql, args, {
        debug: is_debug_sql,
      });
      input.menu_ids = models.map((item: { id: MenuId }) => item.id);
    }
  }
  
  // 语言
  if (isNotEmpty(input.lang_id_lbl) && input.lang_id == null) {
    input.lang_id_lbl = String(input.lang_id_lbl).trim();
    const langModel = await findOneLang(
      {
        lbl: input.lang_id_lbl,
      },
      undefined,
      options,
    );
    if (langModel) {
      input.lang_id = langModel.id;
    }
  } else if (isEmpty(input.lang_id_lbl) && input.lang_id != null) {
    const lang_model = await findOneLang(
      {
        id: input.lang_id,
      },
      undefined,
      options,
    );
    if (lang_model) {
      input.lang_id_lbl = lang_model.lbl;
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked == null) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val != null) {
      input.is_locked = Number(val);
    }
  } else if (isEmpty(input.is_locked_lbl) && input.is_locked != null) {
    const lbl = is_lockedDict.find((itemTmp) => itemTmp.val === String(input.is_locked))?.lbl || "";
    input.is_locked_lbl = lbl;
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

// MARK: getFieldCommentsTenant
/** 获取租户字段注释 */
export async function getFieldCommentsTenant(): Promise<TenantFieldComment> {
  const field_comments: TenantFieldComment = {
    id: "ID",
    code: "编码",
    lbl: "名称",
    domain_ids: "所属域名",
    domain_ids_lbl: "所属域名",
    menu_ids: "菜单权限",
    menu_ids_lbl: "菜单权限",
    title: "标题",
    info: "简介",
    lang_id: "语言",
    lang_id_lbl: "语言",
    is_locked: "锁定",
    is_locked_lbl: "锁定",
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

// MARK: findByUniqueTenant
/** 通过唯一约束获得租户列表 */
export async function findByUniqueTenant(
  search0: Readonly<TenantInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel[]> {
  
  const table = getTableNameTenant();
  const method = "findByUniqueTenant";
  
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
    const model = await findOneTenant(
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
  const models: TenantModel[] = [ ];
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAllTenant(
      {
        lbl,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  {
    if (search0.code == null) {
      return [ ];
    }
    const code = search0.code;
    const modelTmps = await findAllTenant(
      {
        code,
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
export function equalsByUniqueTenant(
  oldModel: Readonly<TenantModel>,
  input: Readonly<TenantInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  if (
    oldModel.code === input.code
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUniqueTenant
/** 通过唯一约束检查 租户 是否已经存在 */
export async function checkByUniqueTenant(
  input: Readonly<TenantInput>,
  oldModel: Readonly<TenantModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueTenant(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("租户 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: TenantId = await updateByIdTenant(
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

// MARK: findOneTenant
/** 根据条件查找第一租户 */
export async function findOneTenant(
  search?: Readonly<TenantSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel | undefined> {
  
  const table = getTableNameTenant();
  const method = "findOneTenant";
  
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
  
  const tenant_models = await findAllTenant(
    search,
    page,
    sort,
    options,
  );
  
  const tenant_model = tenant_models[0];
  
  return tenant_model;
}

// MARK: findOneOkTenant
/** 根据条件查找第一租户, 如果不存在则抛错 */
export async function findOneOkTenant(
  search?: Readonly<TenantSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel> {
  
  const table = getTableNameTenant();
  const method = "findOneOkTenant";
  
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
  
  const tenant_models = await findAllTenant(
    search,
    page,
    sort,
    options,
  );
  
  const tenant_model = tenant_models[0];
  
  if (!tenant_model) {
    const err_msg = "此 租户 已被删除";
    throw new Error(err_msg);
  }
  
  return tenant_model;
}

// MARK: findByIdTenant
/** 根据 id 查找租户 */
export async function findByIdTenant(
  id: TenantId,
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel | undefined> {
  
  const table = getTableNameTenant();
  const method = "findByIdTenant";
  
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
  
  const tenant_model = await findOneTenant(
    {
      id,
    },
    undefined,
    options,
  );
  
  return tenant_model;
}

// MARK: findByIdOkTenant
/** 根据 id 查找租户, 如果不存在则抛错 */
export async function findByIdOkTenant(
  id: TenantId,
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel> {
  
  const table = getTableNameTenant();
  const method = "findByIdOkTenant";
  
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
  
  const tenant_model = await findByIdTenant(
    id,
    options,
  );
  
  if (!tenant_model) {
    const err_msg = "此 租户 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return tenant_model;
}

// MARK: findByIdsTenant
/** 根据 ids 查找租户 */
export async function findByIdsTenant(
  ids: TenantId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel[]> {
  
  const table = getTableNameTenant();
  const method = "findByIdsTenant";
  
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
  
  const models = await findAllTenant(
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

// MARK: findByIdsOkTenant
/** 根据 ids 查找租户, 出现查询不到的 id 则报错 */
export async function findByIdsOkTenant(
  ids: TenantId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<TenantModel[]> {
  
  const table = getTableNameTenant();
  const method = "findByIdsOkTenant";
  
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
  
  const models = await findByIdsTenant(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 租户 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 租户 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existTenant
/** 根据搜索条件判断租户是否存在 */
export async function existTenant(
  search?: Readonly<TenantSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameTenant();
  const method = "existTenant";
  
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
  const model = await findOneTenant(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdTenant
/** 根据id判断租户是否存在 */
export async function existByIdTenant(
  id?: Readonly<TenantId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameTenant();
  const method = "existByIdTenant";
  
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
  const sql = `select 1 e from base_tenant t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateIsEnabledTenant
/** 校验租户是否启用 */
export async function validateIsEnabledTenant(
  model: Readonly<TenantModel>,
) {
  if (model.is_enabled == 0) {
    throw "租户 已禁用";
  }
}

// MARK: validateOptionTenant
/** 校验租户是否存在 */
export async function validateOptionTenant(
  model?: TenantModel,
) {
  if (!model) {
    const err_msg = "租户 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateTenant
/** 租户增加和修改时校验输入 */
export async function validateTenant(
  input: Readonly<TenantInput>,
) {
  const fieldComments = await getFieldCommentsTenant();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 编码
  await validators.chars_max_length(
    input.code,
    20,
    fieldComments.code,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    45,
    fieldComments.lbl,
  );
  
  // 标题
  await validators.chars_max_length(
    input.title,
    45,
    fieldComments.title,
  );
  
  // 简介
  await validators.chars_max_length(
    input.info,
    100,
    fieldComments.info,
  );
  
  // 语言
  await validators.chars_max_length(
    input.lang_id,
    22,
    fieldComments.lang_id,
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

// MARK: findAutoCodeTenant
/** 获得 租户 自动编码 */
export async function findAutoCodeTenant(
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameTenant();
  const method = "findAutoCodeTenant";
  
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
  
  const model = await findOneTenant(
    undefined,
    [
      {
        prop: "code_seq",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  
  const model_deleted = await findOneTenant(
    {
      is_deleted: 1,
    },
    [
      {
        prop: "code_seq",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  
  let code_seq = (model?.code_seq || 0) + 1;
  const code_seq_deleted = (model_deleted?.code_seq || 0) + 1;
  if (code_seq_deleted > code_seq) {
    code_seq = code_seq_deleted;
  }
  const code = "ZH" + code_seq.toString().padStart(3, "0");
  
  return {
    code_seq,
    code,
  };
}

// MARK: createReturnTenant
/** 创建 租户 并返回 */
export async function createReturnTenant(
  input: Readonly<TenantInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<TenantModel> {
  
  const table = getTableNameTenant();
  const method = "createReturnTenant";
  
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
  
  const model = await validateOptionTenant(
    await findOneTenant(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createTenant
/** 创建 租户 */
export async function createTenant(
  input: Readonly<TenantInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<TenantId> {
  
  const table = getTableNameTenant();
  const method = "createTenant";
  
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

// MARK: createsReturnTenant
/** 批量创建 租户 并返回 */
export async function createsReturnTenant(
  inputs: TenantInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<TenantModel[]> {
  
  const table = getTableNameTenant();
  const method = "createsReturnTenant";
  
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
  
  const models = await findByIdsTenant(ids, options);
  
  return models;
}

// MARK: createsTenant
/** 批量创建 租户 */
export async function createsTenant(
  inputs: TenantInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<TenantId[]> {
  
  const table = getTableNameTenant();
  const method = "createsTenant";
  
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
  inputs: TenantInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<TenantId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  // 设置自动编码
  for (const input of inputs) {
    if (input.code) {
      continue;
    }
    const {
      code_seq,
      code,
    } = await findAutoCodeTenant(options);
    input.code_seq = code_seq;
    input.code = code;
  }
  
  const table = getTableNameTenant();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: TenantId[] = [ ];
  const inputs2: TenantInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueTenant(input, options);
    if (oldModels.length > 0) {
      let id: TenantId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueTenant(
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
    
    const id = shortUuidV4<TenantId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCacheTenant();
  
  const args = new QueryArgs();
  let sql = "insert into base_tenant(id,create_time,update_time,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,code_seq,code,lbl,title,info,lang_id_lbl,lang_id,is_locked,is_enabled,order_by,rem,is_sys)values";
  
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
      if (input.code_seq != null) {
        sql += `,${ args.push(input.code_seq) }`;
      } else {
        sql += ",default";
      }
      if (input.code != null) {
        sql += `,${ args.push(input.code) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.title != null) {
        sql += `,${ args.push(input.title) }`;
      } else {
        sql += ",default";
      }
      if (input.info != null) {
        sql += `,${ args.push(input.info) }`;
      } else {
        sql += ",default";
      }
      if (input.lang_id_lbl != null) {
        sql += `,${ args.push(input.lang_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.lang_id != null) {
        sql += `,${ args.push(input.lang_id) }`;
      } else {
        sql += ",default";
      }
      if (input.is_locked != null) {
        sql += `,${ args.push(input.is_locked) }`;
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
      if (input.is_sys != null) {
        sql += `,${ args.push(input.is_sys) }`;
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
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
    
    // 所属域名
    await many2manyUpdate(
      input,
      "domain_ids",
      {
        mod: "base",
        table: "tenant_domain",
        column1: "tenant_id",
        column2: "domain_id",
      },
    );
    
    // 菜单权限
    await many2manyUpdate(
      input,
      "menu_ids",
      {
        mod: "base",
        table: "tenant_menu",
        column1: "tenant_id",
        column2: "menu_id",
      },
    );
  }
  
  await delCacheTenant();
  
  return ids2;
}

// MARK: delCacheTenant
/** 删除缓存 */
export async function delCacheTenant() {
  await delCacheCtx(`dao.sql.base_tenant`);
  await delCacheCtx(`dao.sql.base_domain`);
  await delCacheCtx(`dao.sql.base_menu`);
  await delCacheCtx(`dao.sql.base_lang`);
  await delCacheCtx(`dao.sql.base_menu._getMenus`);
}

// MARK: updateByIdTenant
/** 根据 id 修改 租户 */
export async function updateByIdTenant(
  id: TenantId,
  input: TenantInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<TenantId> {
  
  const table = getTableNameTenant();
  const method = "updateByIdTenant";
  
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
    throw new Error("updateByIdTenant: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdTenant: input cannot be null");
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueTenant(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "租户 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdTenant(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 租户 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update base_tenant set `;
  let updateFldNum = 0;
  if (input.code_seq != null) {
    if (input.code_seq != oldModel.code_seq) {
      sql += `code_seq=${ args.push(input.code_seq) },`;
      updateFldNum++;
    }
  }
  if (input.code != null) {
    if (input.code != oldModel.code) {
      sql += `code=${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.title != null) {
    if (input.title != oldModel.title) {
      sql += `title=${ args.push(input.title) },`;
      updateFldNum++;
    }
  }
  if (input.info != null) {
    if (input.info != oldModel.info) {
      sql += `info=${ args.push(input.info) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.lang_id_lbl)) {
    sql += `lang_id_lbl=?,`;
    args.push(input.lang_id_lbl);
    updateFldNum++;
  }
  if (input.lang_id != null) {
    if (input.lang_id != oldModel.lang_id) {
      sql += `lang_id=${ args.push(input.lang_id) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked != null) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked=${ args.push(input.is_locked) },`;
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
  if (input.is_sys != null) {
    if (input.is_sys != oldModel.is_sys) {
      sql += `is_sys=${ args.push(input.is_sys) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  updateFldNum++;
  
  // 所属域名
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "domain_ids",
    {
      mod: "base",
      table: "tenant_domain",
      column1: "tenant_id",
      column2: "domain_id",
    },
  );
  
  updateFldNum++;
  
  // 菜单权限
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "menu_ids",
    {
      mod: "base",
      table: "tenant_menu",
      column1: "tenant_id",
      column2: "menu_id",
    },
  );
  
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
    
    await delCacheTenant();
    
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
    await delCacheTenant();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsTenant
/** 根据 ids 删除 租户 */
export async function deleteByIdsTenant(
  ids: TenantId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "deleteByIdsTenant";
  
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
  
  await delCacheTenant();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdTenant(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update base_tenant set is_deleted=1`;
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
      const domain_ids = oldModel.domain_ids;
      if (domain_ids && domain_ids.length > 0) {
        const args = new QueryArgs();
        const sql = `update base_tenant_domain set is_deleted=1 where tenant_id=${ args.push(id) } and domain_id in (${ args.push(domain_ids) }) and is_deleted=0`;
        await execute(sql, args);
      }
    }
    {
      const menu_ids = oldModel.menu_ids;
      if (menu_ids && menu_ids.length > 0) {
        const args = new QueryArgs();
        const sql = `update base_tenant_menu set is_deleted=1 where tenant_id=${ args.push(id) } and menu_id in (${ args.push(menu_ids) }) and is_deleted=0`;
        await execute(sql, args);
      }
    }
  }
  
  await delCacheTenant();
  
  return affectedRows;
}

// MARK: getIsEnabledByIdTenant
/** 根据 id 查找 租户 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledByIdTenant(
  id: TenantId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findByIdTenant(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIdsTenant
/** 根据 ids 启用或者禁用 租户 */
export async function enableByIdsTenant(
  ids: TenantId[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "enableByIdsTenant";
  
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
    await delCacheTenant();
  }
  
  const args = new QueryArgs();
  const sql = `update base_tenant set is_enabled=${ args.push(is_enabled) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCacheTenant();
  
  return num;
}

// MARK: getIsLockedByIdTenant
/** 根据 id 查找 租户 是否已锁定, 不存在则返回 undefined, 已锁定的不能修改和删除 */
export async function getIsLockedByIdTenant(
  id: TenantId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const tenant_model = await findByIdTenant(
    id,
    options,
  );
  const is_locked = tenant_model?.is_locked as (0 | 1 | undefined);
  
  return is_locked;
}

// MARK: lockByIdsTenant
/** 根据 ids 锁定或者解锁 租户 */
export async function lockByIdsTenant(
  ids: TenantId[],
  is_locked: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "lockByIdsTenant";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (is_locked != null) {
      msg += ` is_locked:${ is_locked }`;
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
  
  await delCacheTenant();
  
  const args = new QueryArgs();
  let sql = `update base_tenant set is_locked=${ args.push(is_locked) } where id in (${ args.push(ids) })`;
  const result = await execute(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  const num = result.affectedRows;
  
  await delCacheTenant();
  
  return num;
}

// MARK: revertByIdsTenant
/** 根据 ids 还原 租户 */
export async function revertByIdsTenant(
  ids: TenantId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "revertByIdsTenant";
  
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
  
  await delCacheTenant();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOneTenant(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdTenant(
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
      } as TenantInput;
      const models = await findByUniqueTenant(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "租户 重复";
      }
    }
    const args = new QueryArgs();
    const sql = `update base_tenant set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    {
      const domain_ids = old_model.domain_ids;
      if (domain_ids && domain_ids.length > 0) {
        const args = new QueryArgs();
        const sql = `update base_tenant_domain set is_deleted=0 where tenant_id=${ args.push(id) } and domain_id in (${ args.push(domain_ids) }) and is_deleted=1`;
        await execute(sql, args);
      }
    }
    {
      const menu_ids = old_model.menu_ids;
      if (menu_ids && menu_ids.length > 0) {
        const args = new QueryArgs();
        const sql = `update base_tenant_menu set is_deleted=0 where tenant_id=${ args.push(id) } and menu_id in (${ args.push(menu_ids) }) and is_deleted=1`;
        await execute(sql, args);
      }
    }
  }
  
  await delCacheTenant();
  
  return num;
}

// MARK: forceDeleteByIdsTenant
/** 根据 ids 彻底删除 租户 */
export async function forceDeleteByIdsTenant(
  ids: TenantId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "forceDeleteByIdsTenant";
  
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
  
  await delCacheTenant();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneTenant(
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
    const sql = `delete from base_tenant where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    if (oldModel) {
      const domain_ids = oldModel.domain_ids;
      if (domain_ids && domain_ids.length > 0) {
        const args = new QueryArgs();
        const sql = `delete from base_tenant_domain where tenant_id=${ args.push(id) } and domain_id in (${ args.push(domain_ids) })`;
        await execute(
          sql,
          args,
          {
            debug: is_debug_sql,
          },
        );
      }
    }
    if (oldModel) {
      const menu_ids = oldModel.menu_ids;
      if (menu_ids && menu_ids.length > 0) {
        const args = new QueryArgs();
        const sql = `delete from base_tenant_menu where tenant_id=${ args.push(id) } and menu_id in (${ args.push(menu_ids) })`;
        await execute(
          sql,
          args,
          {
            debug: is_debug_sql,
          },
        );
      }
    }
  }
  
  await delCacheTenant();
  
  return num;
}

// MARK: findLastOrderByTenant
/** 查找 租户 order_by 字段的最大值 */
export async function findLastOrderByTenant(
  search?: Readonly<TenantSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameTenant();
  const method = "findLastOrderByTenant";
  
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
  
  let sql = `select t.order_by from base_tenant t`;
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
