// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  useContext,
} from "/lib/context.ts";

import {
  escapeId,
} from "sqlstring";

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
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
  hash,
} from "/lib/util/string_util.ts";

import {
  deepCompare,
} from "/lib/util/object_util.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  getAuthModel,
  getPassword,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  many2manyUpdate,
} from "/lib/util/dao_util.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOne as findOneOrg,
} from "/gen/base/org/org.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

const route_path = "/base/usr";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<UsrSearch>,
  options?: Readonly<{
  }>,
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id=${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id=${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.img != null) {
    whereQuery += ` and t.img=${ args.push(search.img) }`;
  }
  if (isNotEmpty(search?.img_like)) {
    whereQuery += ` and t.img like ${ args.push("%" + sqlLike(search?.img_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.username != null) {
    whereQuery += ` and t.username=${ args.push(search.username) }`;
  }
  if (isNotEmpty(search?.username_like)) {
    whereQuery += ` and t.username like ${ args.push("%" + sqlLike(search?.username_like) + "%") }`;
  }
  if (search?.role_ids != null) {
    whereQuery += ` and base_role.id in ${ args.push(search.role_ids) }`;
  }
  if (search?.role_ids_is_null) {
    whereQuery += ` and base_role.id is null`;
  }
  if (search?.dept_ids != null) {
    whereQuery += ` and base_dept.id in ${ args.push(search.dept_ids) }`;
  }
  if (search?.dept_ids_is_null) {
    whereQuery += ` and base_dept.id is null`;
  }
  if (search?.org_ids != null) {
    whereQuery += ` and base_org.id in ${ args.push(search.org_ids) }`;
  }
  if (search?.org_ids_is_null) {
    whereQuery += ` and base_org.id is null`;
  }
  if (search?.default_org_id != null) {
    whereQuery += ` and t.default_org_id in ${ args.push(search.default_org_id) }`;
  }
  if (search?.default_org_id_is_null) {
    whereQuery += ` and t.default_org_id is null`;
  }
  if (search?.is_locked != null) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
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
    whereQuery += ` and t.create_usr_id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and t.create_usr_id_lbl in ${ args.push(search.create_usr_id_lbl) }`;
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
    whereQuery += ` and t.update_usr_id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
  }
  if (search?.update_usr_id_lbl != null) {
    whereQuery += ` and t.update_usr_id_lbl in ${ args.push(search.update_usr_id_lbl) }`;
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
    whereQuery += ` and t.is_hidden in ${ args.push(search?.is_hidden) }`;
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<UsrSearch>,
  options?: Readonly<{
  }>,
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `base_usr t
    left join base_usr_role
      on base_usr_role.usr_id=t.id
      and base_usr_role.is_deleted=${ args.push(is_deleted) }
    left join base_role
      on base_usr_role.role_id=base_role.id
      and base_role.is_deleted=${ args.push(is_deleted) }
    left join(select
    json_objectagg(base_usr_role.order_by,base_role.id) role_ids,
    json_objectagg(base_usr_role.order_by,base_role.lbl) role_ids_lbl,
    base_usr.id usr_id
    from base_usr_role
    inner join base_role on base_role.id=base_usr_role.role_id
    inner join base_usr on base_usr.id=base_usr_role.usr_id
    where base_usr_role.is_deleted=${ args.push(is_deleted) }
    group by usr_id) _role on _role.usr_id=t.id
    left join base_usr_dept
      on base_usr_dept.usr_id=t.id
      and base_usr_dept.is_deleted=${ args.push(is_deleted) }
    left join base_dept
      on base_usr_dept.dept_id=base_dept.id
      and base_dept.is_deleted=${ args.push(is_deleted) }
    left join(select
    json_objectagg(base_usr_dept.order_by,base_dept.id) dept_ids,
    json_objectagg(base_usr_dept.order_by,base_dept.lbl) dept_ids_lbl,
    base_usr.id usr_id
    from base_usr_dept
    inner join base_dept on base_dept.id=base_usr_dept.dept_id
    inner join base_usr on base_usr.id=base_usr_dept.usr_id
    where base_usr_dept.is_deleted=${ args.push(is_deleted) }
    group by usr_id) _dept on _dept.usr_id=t.id
    left join base_usr_org
      on base_usr_org.usr_id=t.id
      and base_usr_org.is_deleted=${ args.push(is_deleted) }
    left join base_org
      on base_usr_org.org_id=base_org.id
      and base_org.is_deleted=${ args.push(is_deleted) }
    left join(select
    json_objectagg(base_usr_org.order_by,base_org.id) org_ids,
    json_objectagg(base_usr_org.order_by,base_org.lbl) org_ids_lbl,
    base_usr.id usr_id
    from base_usr_org
    inner join base_org on base_org.id=base_usr_org.org_id
    inner join base_usr on base_usr.id=base_usr_org.usr_id
    where base_usr_org.is_deleted=${ args.push(is_deleted) }
    group by usr_id) _org on _org.usr_id=t.id
    left join base_org default_org_id_lbl on default_org_id_lbl.id=t.default_org_id`;
  return fromQuery;
}

/**
 * 根据条件查找用户总数
 * @param { UsrSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: Readonly<UsrSearch>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  const table = "base_usr";
  const method = "findCount";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
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

/**
 * 根据搜索条件和分页查找用户列表
 * @param {UsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: Readonly<UsrSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput | SortInput[],
  options?: Readonly<{
    debug?: boolean;
    ids_limit?: number;
  }>,
): Promise<UsrModel[]> {
  const table = "base_usr";
  const method = "findAll";
  
  if (options?.debug !== false) {
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
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 所属角色
  if (search && search.role_ids != null) {
    const len = search.role_ids.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.role_ids.length > ${ ids_limit }`);
    }
  }
  // 所属部门
  if (search && search.dept_ids != null) {
    const len = search.dept_ids.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.dept_ids.length > ${ ids_limit }`);
    }
  }
  // 所属组织
  if (search && search.org_ids != null) {
    const len = search.org_ids.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.org_ids.length > ${ ids_limit }`);
    }
  }
  // 默认组织
  if (search && search.default_org_id != null) {
    const len = search.default_org_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.default_org_id.length > ${ ids_limit }`);
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
      ,max(role_ids) role_ids
      ,max(role_ids_lbl) role_ids_lbl
      ,max(dept_ids) dept_ids
      ,max(dept_ids_lbl) dept_ids_lbl
      ,max(org_ids) org_ids
      ,max(org_ids_lbl) org_ids_lbl
      ,default_org_id_lbl.lbl default_org_id_lbl
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "order_by",
        order: SortOrderEnum.Asc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
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
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<UsrModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug,
    },
  );
  for (const item of result) {
    
    // 所属角色
    if (item.role_ids) {
      const obj = item.role_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.role_ids = keys.map((key) => obj[key]);
    } else {
      item.role_ids = [ ];
    }
    if (item.role_ids_lbl) {
      const obj = item.role_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.role_ids_lbl = keys.map((key) => obj[key]);
    } else {
      item.role_ids_lbl = [ ];
    }
    
    // 所属部门
    if (item.dept_ids) {
      const obj = item.dept_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.dept_ids = keys.map((key) => obj[key]);
    } else {
      item.dept_ids = [ ];
    }
    if (item.dept_ids_lbl) {
      const obj = item.dept_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.dept_ids_lbl = keys.map((key) => obj[key]);
    } else {
      item.dept_ids_lbl = [ ];
    }
    
    // 所属组织
    if (item.org_ids) {
      const obj = item.org_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.org_ids = keys.map((key) => obj[key]);
    } else {
      item.org_ids = [ ];
    }
    if (item.org_ids_lbl) {
      const obj = item.org_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.org_ids_lbl = keys.map((key) => obj[key]);
    } else {
      item.org_ids_lbl = [ ];
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
    
    // 默认组织
    model.default_org_id_lbl = model.default_org_id_lbl || "";
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked != null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl || "";
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled != null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === model.is_enabled.toString());
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl || "";
    
    // 创建时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (isNaN(create_time.toDate().getTime())) {
        model.create_time_lbl = (model.create_time || "").toString();
      } else {
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (isNaN(update_time.toDate().getTime())) {
        model.update_time_lbl = (model.update_time || "").toString();
      } else {
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.update_time_lbl = "";
    }
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: UsrInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 所属角色
  if (!input.role_ids && input.role_ids_lbl) {
    input.role_ids_lbl = input.role_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.role_ids_lbl = Array.from(new Set(input.role_ids_lbl));
    if (input.role_ids_lbl.length === 0) {
      input.role_ids = [ ];
    } else {
      const debug = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select
          t.id
        from
          base_role t
        where
          t.lbl in ${ args.push(input.role_ids_lbl) }`;
      interface Result {
        id: RoleId;
      }
      const models = await query<Result>(sql, args, {
        debug,
      });
      input.role_ids = models.map((item: { id: RoleId }) => item.id);
    }
  }
  
  // 所属部门
  if (!input.dept_ids && input.dept_ids_lbl) {
    input.dept_ids_lbl = input.dept_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.dept_ids_lbl = Array.from(new Set(input.dept_ids_lbl));
    if (input.dept_ids_lbl.length === 0) {
      input.dept_ids = [ ];
    } else {
      const debug = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select
          t.id
        from
          base_dept t
        where
          t.lbl in ${ args.push(input.dept_ids_lbl) }`;
      interface Result {
        id: DeptId;
      }
      const models = await query<Result>(sql, args, {
        debug,
      });
      input.dept_ids = models.map((item: { id: DeptId }) => item.id);
    }
  }
  
  // 所属组织
  if (!input.org_ids && input.org_ids_lbl) {
    input.org_ids_lbl = input.org_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.org_ids_lbl = Array.from(new Set(input.org_ids_lbl));
    if (input.org_ids_lbl.length === 0) {
      input.org_ids = [ ];
    } else {
      const debug = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select
          t.id
        from
          base_org t
        where
          t.lbl in ${ args.push(input.org_ids_lbl) }`;
      interface Result {
        id: OrgId;
      }
      const models = await query<Result>(sql, args, {
        debug,
      });
      input.org_ids = models.map((item: { id: OrgId }) => item.id);
    }
  }
  
  // 默认组织
  if (isNotEmpty(input.default_org_id_lbl) && input.default_org_id == null) {
    input.default_org_id_lbl = String(input.default_org_id_lbl).trim();
    const orgModel = await findOneOrg({ lbl: input.default_org_id_lbl });
    if (orgModel) {
      input.default_org_id = orgModel.id;
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked == null) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val != null) {
      input.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled == null) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val != null) {
      input.is_enabled = Number(val);
    }
  }
}

/**
 * 获取用户字段注释
 */
export async function getFieldComments(): Promise<UsrFieldComment> {
  const n = initN(route_path);
  const fieldComments: UsrFieldComment = {
    id: await n("ID"),
    img: await n("头像"),
    lbl: await n("名称"),
    username: await n("用户名"),
    role_ids: await n("所属角色"),
    role_ids_lbl: await n("所属角色"),
    dept_ids: await n("所属部门"),
    dept_ids_lbl: await n("所属部门"),
    org_ids: await n("所属组织"),
    org_ids_lbl: await n("所属组织"),
    default_org_id: await n("默认组织"),
    default_org_id_lbl: await n("默认组织"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
    rem: await n("备注"),
    create_usr_id: await n("创建人"),
    create_usr_id_lbl: await n("创建人"),
    create_time: await n("创建时间"),
    create_time_lbl: await n("创建时间"),
    update_usr_id: await n("更新人"),
    update_usr_id_lbl: await n("更新人"),
    update_time: await n("更新时间"),
    update_time_lbl: await n("更新时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得用户列表
 * @param {UsrInput} search0
 */
export async function findByUnique(
  search0: Readonly<UsrInput>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<UsrModel[]> {
  
  const table = "base_usr";
  const method = "findByUnique";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: UsrModel[] = [ ];
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      lbl,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  {
    if (search0.username == null) {
      return [ ];
    }
    const username = search0.username;
    const modelTmps = await findAll({
      username,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {UsrModel} oldModel
 * @param {UsrInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: Readonly<UsrModel>,
  input: Readonly<UsrInput>,
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
    oldModel.username === input.username
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查用户是否已经存在
 * @param {UsrInput} input
 * @param {UsrModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<UsrId | undefined>}
 */
export async function checkByUnique(
  input: Readonly<UsrInput>,
  oldModel: Readonly<UsrModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: Readonly<{
  }>,
): Promise<UsrId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("用户")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: UsrId = await updateById(
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

/**
 * 根据条件查找第一个用户
 * @param {UsrSearch} search?
 */
export async function findOne(
  search?: Readonly<UsrSearch>,
  sort?: SortInput | SortInput[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<UsrModel | undefined> {
  
  const table = "base_usr";
  const method = "findOne";
  
  if (options?.debug !== false) {
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
    options = {
      ...options,
      debug: false,
    };
  }
  
  if (search && search.ids && search.ids.length === 0) {
    return;
  }
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort, options);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找用户
 * @param {UsrId} id
 */
export async function findById(
  id?: UsrId | null,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<UsrModel | undefined> {
  
  const table = "base_usr";
  const method = "findById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
  }
  
  if (!id) {
    return;
  }
  
  const model = await findOne(
    {
      id,
    },
    undefined,
    options,
  );
  
  return model;
}

/** 根据 ids 查找用户 */
export async function findByIds(
  ids: UsrId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<UsrModel[]> {
  
  const table = "base_usr";
  const method = "findByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
  }
  
  if (!ids || ids.length === 0) {
    return [ ];
  }
  
  const models = await findAll(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  if (models.length !== ids.length) {
    throw new Error("findByIds: models.length !== ids.length");
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      throw new Error(`findByIds: id: ${ id } not found`);
    }
    return model;
  });
  
  return models2;
}

/**
 * 根据搜索条件判断用户是否存在
 * @param {UsrSearch} search?
 */
export async function exist(
  search?: Readonly<UsrSearch>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<boolean> {
  
  const table = "base_usr";
  const method = "exist";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
  }
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断用户是否存在
 * @param {UsrId} id
 */
export async function existById(
  id?: Readonly<UsrId | null>,
  options?: Readonly<{
    debug?: boolean;
  }>,
) {
  
  const table = "base_usr";
  const method = "existById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from base_usr t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  const result = !!model?.e;
  
  return result;
}

/** 校验用户是否启用 */
export async function validateIsEnabled(
  model: Readonly<UsrModel>,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("用户") } ${ await ns("已禁用") }`;
  }
}

/** 校验用户是否存在 */
export async function validateOption(
  model?: Readonly<UsrModel>,
) {
  if (!model) {
    throw `${ await ns("用户") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 用户增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: Readonly<UsrInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 头像
  await validators.chars_max_length(
    input.img,
    22,
    fieldComments.img,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    45,
    fieldComments.lbl,
  );
  
  // 用户名
  await validators.chars_max_length(
    input.username,
    45,
    fieldComments.username,
  );
  
  // 默认组织
  await validators.chars_max_length(
    input.default_org_id,
    22,
    fieldComments.default_org_id,
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

/**
 * 创建用户
 * @param {UsrInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<UsrId>} 
 */
export async function create(
  input: Readonly<UsrInput>,
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<UsrId> {
  
  const table = "base_usr";
  const method = "create";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

/**
 * 批量创建用户
 * @param {UsrInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<UsrId[]>} 
 */
export async function creates(
  inputs: UsrInput[],
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<UsrId[]> {
  
  const table = "base_usr";
  const method = "creates";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: UsrInput[],
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<UsrId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "base_usr";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
  const ids2: UsrId[] = [ ];
  const inputs2: UsrInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: UsrId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUnique(
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
    
    const id = shortUuidV4<UsrId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into base_usr(id`;
  if (!silentMode) {
    sql += ",create_time";
  }
  sql += ",tenant_id";
  if (!silentMode) {
    sql += ",create_usr_id";
  }
  if (!silentMode) {
    sql += ",create_usr_id_lbl";
  }
  sql += ",img";
  sql += ",lbl";
  sql += ",username";
  sql += ",password";
  sql += ",default_org_id";
  sql += ",is_locked";
  sql += ",is_enabled";
  sql += ",order_by";
  sql += ",rem";
  sql += ",is_hidden";
  sql += ")values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (!silentMode) {
        if (input.create_time != null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,${ args.push(reqDate()) }`;
        }
      }
      if (input.tenant_id == null) {
        const authModel = await getAuthModel();
        const tenant_id = await getTenant_id(authModel?.id);
        if (tenant_id) {
          sql += `,${ args.push(tenant_id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.tenant_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.tenant_id) }`;
      }
      if (!silentMode) {
        if (input.create_usr_id == null) {
          const authModel = await getAuthModel();
          let usr_id: UsrId | undefined = authModel?.id;
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id);
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
          const usr_model = await findByIdUsr(usr_id);
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
      }
      if (input.img != null) {
        sql += `,${ args.push(input.img) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.username != null) {
        sql += `,${ args.push(input.username) }`;
      } else {
        sql += ",default";
      }
      if (isNotEmpty(input.password)) {
        sql += `,${ args.push(await getPassword(input.password)) }`;
      } else {
        sql += ",default";
      }
      if (input.default_org_id != null) {
        sql += `,${ args.push(input.default_org_id) }`;
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
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
    
    // 所属角色
    await many2manyUpdate(
      input,
      "role_ids",
      {
        mod: "base",
        table: "usr_role",
        column1: "usr_id",
        column2: "role_id",
      },
    );
    
    // 所属部门
    await many2manyUpdate(
      input,
      "dept_ids",
      {
        mod: "base",
        table: "usr_dept",
        column1: "usr_id",
        column2: "dept_id",
      },
    );
    
    // 所属组织
    await many2manyUpdate(
      input,
      "org_ids",
      {
        mod: "base",
        table: "usr_org",
        column1: "usr_id",
        column2: "org_id",
      },
    );
  }
  
  await delCache();
  
  return ids2;
}

/**
 * 删除缓存
 */
export async function delCache() {
  await delCacheCtx(`dao.sql.base_usr`);
  await delCacheCtx(`dao.sql.base_menu._getMenus`);
}

/**
 * 用户根据id修改租户id
 * @param {UsrId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: UsrId,
  tenant_id: Readonly<TenantId>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  const table = "base_usr";
  const method = "updateTenantById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id } `;
    }
    if (tenant_id) {
      msg += ` tenant_id:${ tenant_id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update base_usr set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据 id 修改用户
 * @param {UsrId} id
 * @param {UsrInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<UsrId>}
 */
export async function updateById(
  id: UsrId,
  input: UsrInput,
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
    silentMode?: boolean;
  }>,
): Promise<UsrId> {
  
  const table = "base_usr";
  const method = "updateById";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
  if (options?.debug !== false) {
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
  }
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id as unknown as TenantId);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("用户"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("用户"));
  }
  
  const args = new QueryArgs();
  let sql = `update base_usr set `;
  let updateFldNum = 0;
  if (input.img != null) {
    if (input.img != oldModel.img) {
      sql += `img=${ args.push(input.img) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.username != null) {
    if (input.username != oldModel.username) {
      sql += `username=${ args.push(input.username) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.password)) {
    sql += `password=?,`;
    args.push(await getPassword(input.password));
    updateFldNum++;
  }
  if (input.default_org_id != null) {
    if (input.default_org_id != oldModel.default_org_id) {
      sql += `default_org_id = ${ args.push(input.default_org_id) },`;
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
  if (input.is_hidden != null) {
    if (input.is_hidden != oldModel.is_hidden) {
      sql += `is_hidden=${ args.push(input.is_hidden) },`;
      updateFldNum++;
    }
  }
  
  updateFldNum++;
  
  // 所属角色
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "role_ids",
    {
      mod: "base",
      table: "usr_role",
      column1: "usr_id",
      column2: "role_id",
    },
  );
  
  updateFldNum++;
  
  // 所属部门
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "dept_ids",
    {
      mod: "base",
      table: "usr_dept",
      column1: "usr_id",
      column2: "dept_id",
    },
  );
  
  updateFldNum++;
  
  // 所属组织
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "org_ids",
    {
      mod: "base",
      table: "usr_org",
      column1: "usr_id",
      column2: "org_id",
    },
  );
  
  if (updateFldNum > 0) {
    if (!silentMode) {
      if (input.update_usr_id == null) {
        const authModel = await getAuthModel();
        let usr_id: UsrId | undefined = authModel?.id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(authModel.id) },`;
        }
        if (usr_lbl) {
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      } else if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
        let usr_id: UsrId | undefined = input.update_usr_id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id);
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
    }
    if (!silentMode) {
      if (input.update_time) {
        sql += `update_time = ${ args.push(input.update_time) }`;
      } else {
        sql += `update_time = ${ args.push(reqDate()) }`;
      }
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    await delCache();
    
    await execute(sql, args);
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!silentMode) {
    const newModel = await findById(id);
    
    if (!deepCompare(oldModel, newModel)) {
      log(JSON.stringify(oldModel));
    }
  }
  
  return id;
}

/**
 * 根据 ids 删除用户
 * @param {UsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: UsrId[],
  options?: Readonly<{
    debug?: boolean;
    silentMode?: boolean;
  }>,
): Promise<number> {
  
  const table = "base_usr";
  const method = "deleteByIds";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    let sql = `update base_usr set is_deleted=1`;
    if (!silentMode) {
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找用户是否已启用
 * 不存在则返回 undefined
 * @param {UsrId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: UsrId,
  options?: Readonly<{
  }>,
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  return is_enabled;
}

/**
 * 根据 ids 启用或者禁用用户
 * @param {UsrId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: UsrId[],
  is_enabled: Readonly<0 | 1>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "base_usr";
  const method = "enableByIds";
  
  if (options?.debug !== false) {
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
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  const sql = `update base_usr set is_enabled=${ args.push(is_enabled) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找用户是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {UsrId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: UsrId,
  options?: Readonly<{
  }>,
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  return is_locked;
}

/**
 * 根据 ids 锁定或者解锁用户
 * @param {UsrId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: UsrId[],
  is_locked: Readonly<0 | 1>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "base_usr";
  const method = "lockByIds";
  
  if (options?.debug !== false) {
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
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = `update base_usr set is_locked=${ args.push(is_locked) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原用户
 * @param {UsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: UsrId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "base_usr";
  const method = "revertByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: UsrId = ids[i];
    const args = new QueryArgs();
    const sql = `update base_usr set is_deleted = 0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 检查数据的唯一索引
    {
      const old_model = await findById(id);
      if (!old_model) {
        continue;
      }
      const input = {
        ...old_model,
        id: undefined,
      } as UsrInput;
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("用户"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除用户
 * @param {UsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: UsrId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "base_usr";
  const method = "forceDeleteByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `select * from base_usr where id=${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from base_usr where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
  
/**
 * 查找 用户 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "base_usr";
  const method = "findLastOrderBy";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  let sql = `select t.order_by order_by from base_usr t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);
  {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    whereQuery.push(` t.tenant_id=${ args.push(tenant_id) }`);
  }
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += ` order by t.order_by desc limit 1`;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(sql, args);
  let result = model?.order_by ?? 0;
  
  return result;
}
