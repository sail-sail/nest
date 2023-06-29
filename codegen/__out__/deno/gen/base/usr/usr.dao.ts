// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars ban-types
import {
  escapeId,
  escape,
} from "sqlstring";

import dayjs from "dayjs";

import {
  log,
  escapeDec,
  reqDate,
  delCache as delCacheCtx,
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  type PartialNull,
} from "/typings/types.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import * as dictSrcDao from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";

import {
  many2manyUpdate,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type UsrInput,
  type UsrModel,
  type UsrSearch,
} from "./usr.model.ts";

import * as deptDao from "/gen/base/dept/dept.dao.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: UsrSearch,
  options?: {
  },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id == null) {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (isNotEmpty(search?.tenant_id) && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.username !== undefined) {
    whereQuery += ` and t.username = ${ args.push(search.username) }`;
  }
  if (search?.username === null) {
    whereQuery += ` and t.username is null`;
  }
  if (isNotEmpty(search?.username_like)) {
    whereQuery += ` and t.username like ${ args.push(sqlLike(search?.username_like) + "%") }`;
  }
  if (search?.dept_ids && !Array.isArray(search?.dept_ids)) {
    search.dept_ids = [ search.dept_ids ];
  }
  if (search?.dept_ids && search?.dept_ids.length > 0) {
    whereQuery += ` and base_dept.id in ${ args.push(search.dept_ids) }`;
  }
  if (search?.dept_ids === null) {
    whereQuery += ` and base_dept.id is null`;
  }
  if (search?.dept_ids_is_null) {
    whereQuery += ` and base_dept.id is null`;
  }
  if (search?.default_dept_id && !Array.isArray(search?.default_dept_id)) {
    search.default_dept_id = [ search.default_dept_id ];
  }
  if (search?.default_dept_id && search?.default_dept_id.length > 0) {
    whereQuery += ` and default_dept_id_lbl.id in ${ args.push(search.default_dept_id) }`;
  }
  if (search?.default_dept_id === null) {
    whereQuery += ` and default_dept_id_lbl.id is null`;
  }
  if (search?.default_dept_id_is_null) {
    whereQuery += ` and default_dept_id_lbl.id is null`;
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.role_ids && !Array.isArray(search?.role_ids)) {
    search.role_ids = [ search.role_ids ];
  }
  if (search?.role_ids && search?.role_ids.length > 0) {
    whereQuery += ` and base_role.id in ${ args.push(search.role_ids) }`;
  }
  if (search?.role_ids === null) {
    whereQuery += ` and base_role.id is null`;
  }
  if (search?.role_ids_is_null) {
    whereQuery += ` and base_role.id is null`;
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (search?.rem === null) {
    whereQuery += ` and t.rem is null`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.$extra) {
    const extras = search.$extra;
    for (let i = 0; i < extras.length; i++) {
      const extra = extras[i];
      const queryTmp = await extra(args);
      if (queryTmp) {
        whereQuery += ` ${ queryTmp }`;
      }
    }
  }
  return whereQuery;
}

function getFromQuery() {
  const fromQuery = /*sql*/ `
    base_usr t
    left join base_usr_dept
      on base_usr_dept.usr_id = t.id
      and base_usr_dept.is_deleted = 0
    left join base_dept
      on base_usr_dept.dept_id = base_dept.id
      and base_dept.is_deleted = 0
    left join (
      select
        json_arrayagg(base_dept.id) dept_ids,
        json_arrayagg(base_dept.lbl) dept_ids_lbl,
        base_usr.id usr_id
      from base_usr_dept
      inner join base_dept
        on base_dept.id = base_usr_dept.dept_id
        and base_dept.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_dept.usr_id
      where
        base_usr_dept.is_deleted = 0
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join base_dept default_dept_id_lbl
      on default_dept_id_lbl.id = t.default_dept_id
    left join base_usr_role
      on base_usr_role.usr_id = t.id
      and base_usr_role.is_deleted = 0
    left join base_role
      on base_usr_role.role_id = base_role.id
      and base_role.is_deleted = 0
    left join (
      select
        json_arrayagg(base_role.id) role_ids,
        json_arrayagg(base_role.lbl) role_ids_lbl,
        base_usr.id usr_id
      from base_usr_role
      inner join base_role
        on base_role.id = base_usr_role.role_id
        and base_role.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_role.usr_id
      where
        base_usr_role.is_deleted = 0
      group by usr_id
    ) _role
      on _role.usr_id = t.id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { UsrSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: UsrSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "findCount";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ getFromQuery() }
        where
          ${ await getWhereQuery(args, search, options) }
        group by t.id
      ) t
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {UsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "base_usr";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
      ,max(dept_ids) dept_ids
      ,max(dept_ids_lbl) dept_ids_lbl
      ,default_dept_id_lbl.lbl default_dept_id_lbl
      ,max(role_ids) role_ids
      ,max(role_ids_lbl) role_ids_lbl
    from
      ${ getFromQuery() }
    where
      ${ await getWhereQuery(args, search, options) }
    group by t.id
  `;
  
  // 排序
  if (!sort) {
    sort = [ ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item?.prop);
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  let result = await query<UsrModel>(sql, args, { cacheKey1, cacheKey2 });
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    // 密码
    model.password = "";
    
    // 锁定
    let is_locked_lbl = model.is_locked.toString();
    if (model.is_locked !== undefined && model.is_locked !== null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
    // 启用
    let is_enabled_lbl = model.is_enabled.toString();
    if (model.is_enabled !== undefined && model.is_enabled !== null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === model.is_enabled.toString());
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl;
  }
  
  return result;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const n = initN("/usr");
  const fieldComments = {
    lbl: await n("名称"),
    username: await n("用户名"),
    dept_ids: await n("拥有部门"),
    dept_ids_lbl: await n("拥有部门"),
    default_dept_id: await n("默认部门"),
    default_dept_id_lbl: await n("默认部门"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    role_ids: await n("拥有角色"),
    role_ids_lbl: await n("拥有角色"),
    rem: await n("备注"),
  };
  return fieldComments;
}

/**
 * 获得表的唯一字段名列表
 */
export async function getUniqueKeys(): Promise<{
  uniqueKeys: (keyof UsrModel)[];
  uniqueComments: { [key: string]: string };
}> {
  const n = initN("/i18n");
  const uniqueKeys: (keyof UsrModel)[] = [
    "lbl",
  ];
  const uniqueComments = {
    lbl: await n("名称"),
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {UsrSearch | PartialNull<UsrModel>} search0
 */
export async function findByUnique(
  search0: UsrSearch | PartialNull<UsrModel>,
  options?: {
  },
) {
  if (search0.id) {
    const model = await findOne({ id: search0.id });
    return model;
  }
  const { uniqueKeys } = await getUniqueKeys();
  if (!uniqueKeys || uniqueKeys.length === 0) {
    return;
  }
  const search: UsrSearch = { };
  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    const val = (search0 as any)[key];
    if (isEmpty(val)) {
      return;
    }
    (search as any)[key] = val;
  }
  const model = await findOne(search);
  return model;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {UsrModel} oldModel
 * @param {PartialNull<UsrModel>} model
 * @return {boolean}
 */
export async function equalsByUnique(
  oldModel: UsrModel,
  model: PartialNull<UsrModel>,
): Promise<boolean> {
  if (!oldModel || !model) return false;
  const { uniqueKeys } = await getUniqueKeys();
  if (!uniqueKeys || uniqueKeys.length === 0) return false;
  let isEquals = true;
  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    const oldVal = oldModel[key];
    const val = model[key];
    if (oldVal != val) {
      isEquals = false;
      break;
    }
  }
  return isEquals;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {UsrInput} model
 * @param {UsrModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  model: UsrInput,
  oldModel: UsrModel,
  uniqueType: "ignore" | "throw" | "update" = "throw",
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = await equalsByUnique(oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      const { uniqueKeys, uniqueComments } = await getUniqueKeys();
      const lbl = uniqueKeys
        .filter((key) => typeof key !== "symbol")
        .map((key) => uniqueComments[key as string]).join(", ");
      throw new UniqueException(await ns("{0} 的值已经存在", lbl));
    }
    if (uniqueType === "update") {
      const result = await updateById(
        oldModel.id,
        {
          ...model,
          id: undefined,
        },
        options
      );
      return result;
    }
    if (uniqueType === "ignore") {
      return;
    }
  }
  return;
}

/**
 * 根据条件查找第一条数据
 * @param {UsrSearch} search?
 */
export async function findOne(
  search?: UsrSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(search, page, sort);
  if (result && result.length > 0) {
    return result[0];
  }
  return;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
  options?: {
  },
) {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {UsrSearch} search?
 */
export async function exist(
  search?: UsrSearch,
  options?: {
  },
) {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const table = "base_usr";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      base_usr t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  let result = !!model?.e;
  
  return result;
}

/**
 * 创建数据
 * @param {UsrInput} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  model: UsrInput,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string> {
  const table = "base_usr";
  const method = "create";
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  
  // 拥有部门
  if (!model.dept_ids && model.dept_ids_lbl) {
    if (typeof model.dept_ids_lbl === "string" || model.dept_ids_lbl instanceof String) {
      model.dept_ids_lbl = model.dept_ids_lbl.split(",");
    }
    model.dept_ids_lbl = model.dept_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        base_dept t
      where
        t.lbl in ${ args.push(model.dept_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.dept_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 默认部门
  if (isNotEmpty(model.default_dept_id_lbl) && model.default_dept_id === undefined) {
    model.default_dept_id_lbl = String(model.default_dept_id_lbl).trim();
    const deptModel = await deptDao.findOne({ lbl: model.default_dept_id_lbl });
    if (deptModel) {
      model.default_dept_id = deptModel.id;
    }
  }
  
  // 锁定
  if (isNotEmpty(model.is_locked_lbl) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model.is_locked_lbl)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(model.is_enabled_lbl) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model.is_enabled_lbl)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }
  
  // 拥有角色
  if (!model.role_ids && model.role_ids_lbl) {
    if (typeof model.role_ids_lbl === "string" || model.role_ids_lbl instanceof String) {
      model.role_ids_lbl = model.role_ids_lbl.split(",");
    }
    model.role_ids_lbl = model.role_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        base_role t
      where
        t.lbl in ${ args.push(model.role_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.role_ids = models.map((item: { id: string }) => item.id);
  }
  
  const oldModel = await findByUnique(model, options);
  if (oldModel) {
    const result = await checkByUnique(model, oldModel, options?.uniqueType, options);
    if (result) {
      return result;
    }
  }
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    insert into base_usr(
      id
      ,create_time
  `;
  if (model.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  if (model.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (model.username !== undefined) {
    sql += `,username`;
  }
  if (isNotEmpty(model.password)) {
    sql += `,password`;
  }
  if (model.default_dept_id !== undefined) {
    sql += `,default_dept_id`;
  }
  if (model.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (model.is_enabled !== undefined) {
    sql += `,is_enabled`;
  }
  if (model.rem !== undefined) {
    sql += `,rem`;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(reqDate()) }`;
  if (model.tenant_id != null) {
    sql += `,${ args.push(model.tenant_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (model.create_usr_id != null && model.create_usr_id !== "-") {
    sql += `,${ args.push(model.create_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.username !== undefined) {
    sql += `,${ args.push(model.username) }`;
  }
  if (isNotEmpty(model.password)) {
    sql += `,${ args.push(await authDao.getPassword(model.password)) }`;
  }
  if (model.default_dept_id !== undefined) {
    sql += `,${ args.push(model.default_dept_id) }`;
  }
  if (model.is_locked !== undefined) {
    sql += `,${ args.push(model.is_locked) }`;
  }
  if (model.is_enabled !== undefined) {
    sql += `,${ args.push(model.is_enabled) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  // 拥有部门
  await many2manyUpdate(model, "dept_ids", { mod: "base", table: "usr_dept", column1: "usr_id", column2: "dept_id" });
  // 拥有角色
  await many2manyUpdate(model, "role_ids", { mod: "base", table: "usr_role", column1: "usr_id", column2: "role_id" });
  
  await delCache();
  
  return model.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "base_usr";
  const method = "delCache";
  
  const cacheKey1 = `dao.sql.${ table }`;
  await delCacheCtx(cacheKey1);
  const foreignTables: string[] = [
    "usr_dept",
    "dept",
    "dept",
    "usr_role",
    "role",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    const cacheKey1 = `dao.sql.${ foreignTable }`;
    await delCacheCtx(cacheKey1);
  }
}

/**
 * 根据id修改租户id
 * @param {string} id
 * @param {string} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      base_usr
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {UsrInput} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: UsrInput,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "base_usr";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!model) {
    throw new Error("updateById: model cannot be empty");
  }
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 修改租户id
  if (isNotEmpty(model.tenant_id)) {
    await updateTenantById(id, model.tenant_id);
  }

  // 拥有部门
  if (!model.dept_ids && model.dept_ids_lbl) {
    if (typeof model.dept_ids_lbl === "string" || model.dept_ids_lbl instanceof String) {
      model.dept_ids_lbl = model.dept_ids_lbl.split(",");
    }
    model.dept_ids_lbl = model.dept_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        base_dept t
      where
        t.lbl in ${ args.push(model.dept_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.dept_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 默认部门
  if (isNotEmpty(model.default_dept_id_lbl) && model.default_dept_id === undefined) {
    model.default_dept_id_lbl = String(model.default_dept_id_lbl).trim();
    const deptModel = await deptDao.findOne({ lbl: model.default_dept_id_lbl });
    if (deptModel) {
      model.default_dept_id = deptModel.id;
    }
  }
  
  // 锁定
  if (isNotEmpty(model.is_locked_lbl) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model.is_locked_lbl)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(model.is_enabled_lbl) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model.is_enabled_lbl)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }

  // 拥有角色
  if (!model.role_ids && model.role_ids_lbl) {
    if (typeof model.role_ids_lbl === "string" || model.role_ids_lbl instanceof String) {
      model.role_ids_lbl = model.role_ids_lbl.split(",");
    }
    model.role_ids_lbl = model.role_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        base_role t
      where
        t.lbl in ${ args.push(model.role_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.role_ids = models.map((item: { id: string }) => item.id);
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("修改失败, 数据已被删除");
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update base_usr set
  `;
  let updateFldNum = 0;
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(model.lbl) },`;
      updateFldNum++;
    }
  }
  if (model.username !== undefined) {
    if (model.username != oldModel.username) {
      sql += `username = ${ args.push(model.username) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(model.password)) {
    sql += `password = ?,`;
    args.push(await authDao.getPassword(model.password));
    updateFldNum++;
  }
  if (model.default_dept_id !== undefined) {
    if (model.default_dept_id != oldModel.default_dept_id) {
      sql += `default_dept_id = ${ args.push(model.default_dept_id) },`;
      updateFldNum++;
    }
  }
  if (model.is_locked !== undefined) {
    if (model.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(model.is_locked) },`;
      updateFldNum++;
    }
  }
  if (model.is_enabled !== undefined) {
    if (model.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled = ${ args.push(model.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel.rem) {
      sql += `rem = ${ args.push(model.rem) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (model.update_usr_id != null && model.update_usr_id !== "-") {
      sql += `update_usr_id = ${ args.push(model.update_usr_id) },`;
    } else {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
  }
  
  updateFldNum++;
  // 拥有部门
  await many2manyUpdate({ ...model, id }, "dept_ids", { mod: "base", table: "usr_dept", column1: "usr_id", column2: "dept_id" });
  
  updateFldNum++;
  // 拥有角色
  await many2manyUpdate({ ...model, id }, "role_ids", { mod: "base", table: "usr_role", column1: "usr_id", column2: "role_id" });
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    
    const is_locked = await getIsLockedById(id);
    if (is_locked) {
      continue;
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      update
        base_usr
      set
        is_deleted = 1,
        delete_time = ${ args.push(reqDate()) }
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找是否已启用
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: string,
  options?: {
  },
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  return is_enabled;
}

/**
 * 根据 ids 启用或者禁用数据
 * @param {string[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "enableByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      base_usr
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += /*sql*/ `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += /*sql*/ `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找是否已锁定
 * 已锁定的记录不能修改和删除
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: string,
  options?: {
  },
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  return is_locked;
}

/**
 * 根据 ids 锁定或者解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      base_usr
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += /*sql*/ `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += /*sql*/ `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "create";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = /*sql*/ `
      update
        base_usr
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
  const method = "create";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = /*sql*/ `
        select
          *
        from
          base_usr
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        base_usr
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  await delCache();
  
  return num;
}
