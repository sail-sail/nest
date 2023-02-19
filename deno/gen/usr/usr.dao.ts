// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars ban-types
import {
  escapeId,
  escape,
} from "sqlstring";

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
  type PartialNull,
} from "/typings/types.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import {
  _internals as dictSrcDao,
} from "/src/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  _internals as authDao,
} from "/lib/auth/auth.dao.ts";

import {
  _internals as usrDaoSrc,
} from "/src/usr/usr.dao.ts";

import {
  _internals as tenantDao,
} from "/gen/tenant/tenant.dao.ts";

import {
  many2manyUpdate,
  setModelIds,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type UsrModel,
  type UsrSearch,
} from "./usr.model.ts";

import {
  _internals as deptDao,
} from "/gen/dept/dept.dao.ts";

export const _internals = {
  findCount,
  findAll,
  getUniqueKeys,
  findByUnique,
  equalsByUnique,
  checkByUnique,
  findOne,
  findById,
  exist,
  existById,
  create,
  delCache,
  updateTenantById,
  updateById,
  deleteByIds,
  getIs_lockedById,
  lockByIds,
  revertByIds,
  forceDeleteByIds,
};

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
  if (isNotEmpty(search?.lblLike)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lblLike) + "%") }`;
  }
  if (search?.username !== undefined) {
    whereQuery += ` and t.username = ${ args.push(search.username) }`;
  }
  if (isNotEmpty(search?.usernameLike)) {
    whereQuery += ` and t.username like ${ args.push(sqlLike(search?.usernameLike) + "%") }`;
  }
  if (search?.password !== undefined) {
    whereQuery += ` and t.password = ${ args.push(search.password) }`;
  }
  if (isNotEmpty(search?.passwordLike)) {
    whereQuery += ` and t.password like ${ args.push(sqlLike(search?.passwordLike) + "%") }`;
  }
  if (search?.default_dept_id && !Array.isArray(search?.default_dept_id)) {
    search.default_dept_id = [ search.default_dept_id ];
  }
  if (search?.default_dept_id && search?.default_dept_id.length > 0) {
    whereQuery += ` and _default_dept_id.id in ${ args.push(search.default_dept_id) }`;
  }
  if (search?._default_dept_id && !Array.isArray(search?._default_dept_id)) {
    search._default_dept_id = [ search._default_dept_id ];
  }
  if (search?._default_dept_id && search._default_dept_id?.length > 0) {
    whereQuery += ` and _default_dept_id in ${ args.push(search._default_dept_id) }`;
  }
  if (search?.is_enabled && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.remLike)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.remLike) + "%") }`;
  }
  if (search?.dept_ids && !Array.isArray(search?.dept_ids)) {
    search.dept_ids = [ search.dept_ids ];
  }
  if (search?.dept_ids && search?.dept_ids.length > 0) {
    whereQuery += ` and dept.id in ${ args.push(search.dept_ids) }`;
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.role_ids && !Array.isArray(search?.role_ids)) {
    search.role_ids = [ search.role_ids ];
  }
  if (search?.role_ids && search?.role_ids.length > 0) {
    whereQuery += ` and role.id in ${ args.push(search.role_ids) }`;
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
    \`usr\` t
    left join dept _default_dept_id
      on _default_dept_id.id = t.default_dept_id
    left join \`usr_dept\`
      on \`usr_dept\`.usr_id = t.id
      and \`usr_dept\`.is_deleted = 0
    left join \`dept\`
      on \`usr_dept\`.dept_id = dept.id
      and dept.is_deleted = 0
    left join (
      select
        json_arrayagg(dept.id) dept_ids,
        json_arrayagg(dept.lbl) _dept_ids,
        usr.id usr_id
      from \`usr_dept\`
      inner join dept
        on dept.id = \`usr_dept\`.dept_id
        and dept.is_deleted = 0
      inner join usr
        on usr.id = \`usr_dept\`.usr_id
        and usr.is_deleted = 0
      where
      \`usr_dept\`.is_deleted = 0
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join \`usr_role\`
      on \`usr_role\`.usr_id = t.id
      and \`usr_role\`.is_deleted = 0
    left join \`role\`
      on \`usr_role\`.role_id = role.id
      and role.is_deleted = 0
    left join (
      select
        json_arrayagg(role.id) role_ids,
        json_arrayagg(role.lbl) _role_ids,
        usr.id usr_id
      from \`usr_role\`
      inner join role
        on role.id = \`usr_role\`.role_id
        and role.is_deleted = 0
      inner join usr
        on usr.id = \`usr_role\`.usr_id
        and usr.is_deleted = 0
      where
      \`usr_role\`.is_deleted = 0
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
async function findCount(
  search?: UsrSearch,
  options?: {
  },
): Promise<number> {
  const table = "usr";
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
async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "usr";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
      ,_default_dept_id.lbl _default_dept_id
      ,max(dept_ids) dept_ids
      ,max(_dept_ids) _dept_ids
      ,max(role_ids) role_ids
      ,max(_role_ids) _role_ids
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
    is_enabledDict, // 启用
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "is_enabled",
    "is_locked",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    // 密码
    model.password = "";
    
    // 启用
    let _is_enabled = model.is_enabled.toString();
    if (model.is_enabled !== undefined && model.is_enabled !== null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === model.is_enabled.toString());
      if (dictItem) {
        _is_enabled = dictItem.lbl;
      }
    }
    model._is_enabled = _is_enabled;
    
    // 锁定
    let _is_locked = model.is_locked.toString();
    if (model.is_locked !== undefined && model.is_locked !== null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        _is_locked = dictItem.lbl;
      }
    }
    model._is_locked = _is_locked;
  }
  
  return result;
}

/**
 * 获得表的唯一字段名列表
 * @return {{ uniqueKeys: (keyof UsrModel)[]; uniqueComments: { [key: string]: string }; }}
 */
function getUniqueKeys(): {
  uniqueKeys: (keyof UsrModel)[];
  uniqueComments: { [key: string]: string };
} {
  const uniqueKeys: (keyof UsrModel)[] = [
    "lbl",
  ];
  const uniqueComments = {
    lbl: "名称",
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {UsrSearch | PartialNull<UsrModel>} search0
 */
async function findByUnique(
  search0: UsrSearch | PartialNull<UsrModel>,
  options?: {
  },
) {
  if (search0.id) {
    const model = await findOne({ id: search0.id }, options);
    return model;
  }
  const { uniqueKeys } = getUniqueKeys();
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
  const model = await findOne(search, options);
  return model;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {UsrModel} oldModel
 * @param {PartialNull<UsrModel>} model
 * @return {boolean}
 */
function equalsByUnique(
  oldModel: UsrModel,
  model: PartialNull<UsrModel>,
): boolean {
  if (!oldModel || !model) return false;
  const { uniqueKeys } = getUniqueKeys();
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
 * @param {PartialNull<UsrModel>} model
 * @param {UsrModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
async function checkByUnique(
  model: PartialNull<UsrModel>,
  oldModel: UsrModel,
  uniqueType: "ignore" | "throw" | "update" = "throw",
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      const { uniqueKeys, uniqueComments } = getUniqueKeys();
      const lbl = uniqueKeys.map((key) => uniqueComments[key]).join(", ");
      throw new UniqueException(`${ lbl } 的值已经存在!`);
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
async function findOne(
  search?: UsrSearch,
  options?: {
  },
) {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(search, page, undefined, options);
  if (result && result.length > 0) {
    return result[0];
  }
  return;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string | null,
  options?: {
  },
) {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id }, options);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {UsrSearch} search?
 */
async function exist(
  search?: UsrSearch,
  options?: {
  },
) {
  const model = await findOne(search, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断数据是否存在
 * @param {string} id
 */
async function existById(
  id?: string | null,
) {
  const table = "usr";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      usr t
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
 * @param {PartialNull<UsrModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
async function create(
  model: PartialNull<UsrModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string> {
  const table = "usr";
  const method = "create";
  
  const [
    is_enabledDict, // 启用
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "is_enabled",
    "is_locked",
  ]);
  
  
  // 默认部门
  if (isNotEmpty(model._default_dept_id) && model.default_dept_id === undefined) {
    model._default_dept_id = String(model._default_dept_id).trim();
    const deptModel = await deptDao.findOne({ lbl: model._default_dept_id });
    if (deptModel) {
      model.default_dept_id = deptModel.id;
    }
  }
  
  // 启用
  if (isNotEmpty(model._is_enabled) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model._is_enabled)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }
  
  // 拥有部门
  if (!model.dept_ids && model._dept_ids) {
    if (typeof model._dept_ids === "string" || model._dept_ids instanceof String) {
      model._dept_ids = model._dept_ids.split(",");
    }
    model._dept_ids = model._dept_ids.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        dept t
      where
        t.lbl in ${ args.push(model._dept_ids) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.dept_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 锁定
  if (isNotEmpty(model._is_locked) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model._is_locked)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
  }
  
  // 拥有角色
  if (!model.role_ids && model._role_ids) {
    if (typeof model._role_ids === "string" || model._role_ids instanceof String) {
      model._role_ids = model._role_ids.split(",");
    }
    model._role_ids = model._role_ids.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        role t
      where
        t.lbl in ${ args.push(model._role_ids) }
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
    insert into usr(
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
    sql += `,\`lbl\``;
  }
  if (model.username !== undefined) {
    sql += `,\`username\``;
  }
  if (isNotEmpty(model.password)) {
    sql += `,\`password\``;
  }
  if (model.default_dept_id !== undefined) {
    sql += `,\`default_dept_id\``;
  }
  if (model.is_enabled !== undefined) {
    sql += `,\`is_enabled\``;
  }
  if (model.rem !== undefined) {
    sql += `,\`rem\``;
  }
  if (model.is_locked !== undefined) {
    sql += `,\`is_locked\``;
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
  if (model.create_usr_id != null) {
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
  if (model.is_enabled !== undefined) {
    sql += `,${ args.push(model.is_enabled) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
  }
  if (model.is_locked !== undefined) {
    sql += `,${ args.push(model.is_locked) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  // 拥有部门
  await many2manyUpdate(model, "dept_ids", { table: "usr_dept", column1: "usr_id", column2: "dept_id" });
  // 拥有角色
  await many2manyUpdate(model, "role_ids", { table: "usr_role", column1: "usr_id", column2: "role_id" });
  
  await delCache();
  
  return model.id;
}

/**
 * 删除缓存
 */
async function delCache() {
  const table = "usr";
  const method = "delCache";
  
  const cacheKey1 = `dao.sql.${ table }`;
  await delCacheCtx(cacheKey1);
  const foreignTables: string[] = [
    "dept",
    "usr_dept",
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
async function updateTenantById(
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "usr";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      usr
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
 * @param {PartialNull<UsrModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<string>}
 */
async function updateById(
  id: string,
  model: PartialNull<UsrModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "usr";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  const [
    is_enabledDict, // 启用
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "is_enabled",
    "is_locked",
  ]);
  
  const is_locked = await getIs_lockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的数据";
  }
  
  // 修改租户id
  if (isNotEmpty(model.tenant_id)) {
    await updateTenantById(id, model.tenant_id);
  }
  
  // 默认部门
  if (isNotEmpty(model._default_dept_id) && model.default_dept_id === undefined) {
    model._default_dept_id = String(model._default_dept_id).trim();
    const deptModel = await deptDao.findOne({ lbl: model._default_dept_id });
    if (deptModel) {
      model.default_dept_id = deptModel.id;
    }
  }
  
  // 启用
  if (isNotEmpty(model._is_enabled) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model._is_enabled)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }

  // 拥有部门
  if (!model.dept_ids && model._dept_ids) {
    if (typeof model._dept_ids === "string" || model._dept_ids instanceof String) {
      model._dept_ids = model._dept_ids.split(",");
    }
    model._dept_ids = model._dept_ids.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        dept t
      where
        t.lbl in ${ args.push(model._dept_ids) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.dept_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 锁定
  if (isNotEmpty(model._is_locked) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model._is_locked)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
  }

  // 拥有角色
  if (!model.role_ids && model._role_ids) {
    if (typeof model._role_ids === "string" || model._role_ids instanceof String) {
      model._role_ids = model._role_ids.split(",");
    }
    model._role_ids = model._role_ids.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        role t
      where
        t.lbl in ${ args.push(model._role_ids) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.role_ids = models.map((item: { id: string }) => item.id);
  }
  
  const oldModel = await findByUnique(model);
  if (oldModel) {
    if (oldModel.id !== id && options?.uniqueType !== "create") {
      const result = await checkByUnique(model, oldModel, options?.uniqueType);
      if (result) {
        return result;
      }
    }
  } else {
    if (options?.uniqueType === "create") {
      const result = await create({ ...model, id });
      return result;
    }
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update usr set
  `;
  let updateFldNum = 0;
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `,\`lbl\` = ${ args.push(model.lbl) }`;
      updateFldNum++;
    }
  }
  if (model.username !== undefined) {
    if (model.username != oldModel?.username) {
      sql += `,\`username\` = ${ args.push(model.username) }`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(model.password)) {
    sql += `,password = ?`;
    args.push(await authDao.getPassword(model.password));
    updateFldNum++;
  }
  if (model.default_dept_id !== undefined) {
    if (model.default_dept_id != oldModel?.default_dept_id) {
      sql += `,\`default_dept_id\` = ${ args.push(model.default_dept_id) }`;
      updateFldNum++;
    }
  }
  if (model.is_enabled !== undefined) {
    if (model.is_enabled != oldModel?.is_enabled) {
      sql += `,\`is_enabled\` = ${ args.push(model.is_enabled) }`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
      sql += `,\`rem\` = ${ args.push(model.rem) }`;
      updateFldNum++;
    }
  }
  if (model.is_locked !== undefined) {
    if (model.is_locked != oldModel?.is_locked) {
      sql += `,\`is_locked\` = ${ args.push(model.is_locked) }`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (model.update_usr_id != null) {
      sql += `,update_usr_id = ${ args.push(model.update_usr_id) }`;
    } else {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `,update_usr_id = ${ args.push(authModel.id) }`;
      }
    }
    sql += `,update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
  }
  
  updateFldNum++;
  // 拥有部门
  await many2manyUpdate({ ...model, id }, "dept_ids", { table: "usr_dept", column1: "usr_id", column2: "dept_id" });
  
  updateFldNum++;
  // 拥有角色
  await many2manyUpdate({ ...model, id }, "role_ids", { table: "usr_role", column1: "usr_id", column2: "role_id" });
  
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
async function deleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "usr";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const args = new QueryArgs();
    const id = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    
    const is_locked = await getIs_lockedById(id);
    if (is_locked) {
      continue;
    }
    const sql = /*sql*/ `
      update
        usr
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
 * 根据 ID 查找是否已锁定
 * 已锁定的记录不能修改和删除
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
async function getIs_lockedById(
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
async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "usr";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      usr
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
async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "usr";
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
        usr
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
async function forceDeleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "usr";
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
          usr
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        usr
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
