// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars ban-types
import {
  type Context,
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

import { QueryArgs } from "/lib/query_args.ts";
import { UniqueException } from "/lib/exceptions/unique.execption.ts";
import { getAuthModel, getPassword } from "/lib/auth/auth.dao.ts";
import { getTenant_id } from "/src/usr/usr.dao.ts";

import {
  existById as existByIdTenant,
} from "/gen/tenant/tenant.dao.ts";

import {
  many2manyUpdate,
  setModelIds,
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type RoleModel,
  type RoleSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

async function getWhereQuery(
  context: Context,
  args: QueryArgs,
  search?: RoleSearch & {
    $extra?: SearchExtra[];
    tenant_id?: string | null;
  },
  options?: {
  },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id === undefined) {
    const authModel = await getAuthModel(context);
    const tenant_id = await getTenant_id(context, authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if(search?.tenant_id !== null) {
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
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.remLike)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.remLike) + "%") }`;
  }
  if (search?.is_enabled && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.menu_ids && !Array.isArray(search?.menu_ids)) {
    search.menu_ids = [ search.menu_ids ];
  }
  if (search?.menu_ids && search?.menu_ids.length > 0) {
    whereQuery += ` and menu.id in ${ args.push(search.menu_ids) }`;
  }
  if (search?.$extra) {
    const extras = search.$extra;
    for (let i = 0; i < extras.length; i++) {
      const extra = extras[i];
      const queryTmp = await extra(context, args);
      if (queryTmp) {
        whereQuery += ` ${ queryTmp }`;
      }
    }
  }
  return whereQuery;
}

function getFromQuery(
  context: Context,
) {
  const fromQuery = /*sql*/ `
    \`role\` t
    left join \`role_menu\`
      on \`role_menu\`.role_id = t.id
      and \`role_menu\`.is_deleted = 0
    left join \`menu\`
      on \`role_menu\`.menu_id = menu.id
      and menu.is_deleted = 0
    left join (
      select
        json_arrayagg(menu.id) menu_ids,
        json_arrayagg(menu.lbl) _menu_ids,
        role.id role_id
      from \`role_menu\`
      inner join menu
        on menu.id = \`role_menu\`.menu_id
        and menu.is_deleted = 0
      inner join role
        on role.id = \`role_menu\`.role_id
        and role.is_deleted = 0
      where
      \`role_menu\`.is_deleted = 0
      group by role_id
    ) _menu
      on _menu.role_id = t.id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { & { $extra?: SearchExtra[] }} search?
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: RoleSearch & { $extra?: SearchExtra[] },
  options?: {
  },
): Promise<number> {
  const table = "role";
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
          ${ getFromQuery(context) }
        where
          ${ await getWhereQuery(context, args, search, options) }
        group by t.id
      ) t
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  interface Result {
    total: number,
  }
  const model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {Context} context
 * @param {RoleSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  context: Context,
  search?: RoleSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "role";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
        ,max(menu_ids) menu_ids
        ,max(_menu_ids) _menu_ids
    from
      ${ getFromQuery(context) }
    where
      ${ await getWhereQuery(context, args, search, options) }
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
    sql += ` ${ context.escapeId(item.prop) } ${ context.escapeDec(item.order) }`;
  }
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  let result = await context.query<RoleModel>(sql, args, { cacheKey1, cacheKey2 });
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    // 启用
    let _is_enabled = "";
    if (model.is_enabled === 1) {
      _is_enabled = "是";
    } else if (model.is_enabled === 0) {
      _is_enabled = "否";
    } else {
      _is_enabled = String(model.is_enabled);
    }
    model._is_enabled = _is_enabled;
  }
  
  return result;
}

/**
 * 获得表的唯一字段名列表
 * @return {{ uniqueKeys: (keyof RoleModel)[]; uniqueComments: { [key: string]: string }; }}
 */
export function getUniqueKeys(
  context: Context,
): {
  uniqueKeys: (keyof RoleModel)[];
  uniqueComments: { [key: string]: string };
  } {
  const uniqueKeys: (keyof RoleModel)[] = [
    "lbl",
  ];
  const uniqueComments = {
    lbl: "名称",
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {RoleSearch & { $extra?: SearchExtra[] } | PartialNull<RoleModel>} search0
 */
export async function findByUnique(
  context: Context,
  search0: RoleSearch & { $extra?: SearchExtra[] } | PartialNull<RoleModel>,
  options?: {
  },
) {
  if (search0.id) {
    const model = await findOne(context, { id: search0.id }, options);
    return model;
  }
  const { uniqueKeys } = getUniqueKeys(context);
  if (!uniqueKeys || uniqueKeys.length === 0) {
    return;
  }
  const search: RoleSearch & { $extra?: SearchExtra[] } = { };
  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    const val = (search0 as any)[key];
    if (isEmpty(val)) {
      return;
    }
    (search as any)[key] = val;
  }
  const model = await findOne(context, search, options);
  return model;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {RoleModel} oldModel
 * @param {PartialNull<RoleModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  context: Context,
  oldModel: RoleModel,
  model: PartialNull<RoleModel>,
): boolean {
  if (!oldModel || !model) return false;
  const { uniqueKeys } = getUniqueKeys(context);
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
 * @param {PartialNull<RoleModel>} model
 * @param {RoleModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  context: Context,
  model: PartialNull<RoleModel>,
  oldModel: RoleModel,
  uniqueType: "ignore" | "throw" | "update" = "throw",
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(context, oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      const { uniqueKeys, uniqueComments } = getUniqueKeys(context);
      const lbl = uniqueKeys.map((key) => `${ uniqueComments[key] }: ${ (model as any)[`_${ key }`] ?? model[key] }`).join("; ");
      throw new UniqueException(`${ lbl } 已存在!`);
    }
    if (uniqueType === "update") {
      const result = await updateById(
        context,
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
 * @param {RoleSearch & { $extra?: SearchExtra[] }} search?
 */
export async function findOne(
  context: Context,
  search?: RoleSearch & { $extra?: SearchExtra[] },
  options?: {
  },
) {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(context, search, page, undefined, options);
  const model: RoleModel | undefined = result[0];
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  context: Context,
  id?: string,
  options?: {
  },
) {
  if (!id) return;
  const model = await findOne(context, { id }, options);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {RoleSearch & { $extra?: SearchExtra[] }} search?
 */
export async function exist(
  context: Context,
  search?: RoleSearch & { $extra?: SearchExtra[] },
  options?: {
  },
) {
  const model = await findOne(context, search, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断数据是否存在
 * @param {string} id
 */
export async function existById(
  context: Context,
  id: string,
) {
  const table = "role";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      role t
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
  let model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = !!model?.e;
  
  return result;
}

/**
 * 创建数据
 * @param {PartialNull<RoleModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: PartialNull<RoleModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string | undefined> {
  if (!model) {
    return;
  }
  const table = "role";
  const method = "create";
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  // 启用
  if (isNotEmpty(model._is_enabled) && model.is_enabled === undefined) {
    model._is_enabled = String(model._is_enabled).trim();
      if (model._is_enabled === "是") {
      model.is_enabled = 1;
    } else if (model._is_enabled === "否") {
      model.is_enabled = 0;
    }
  }
  
  // 菜单
  if (!model.menu_ids && model._menu_ids) {
    if (typeof model._menu_ids === "string" || model._menu_ids instanceof String) {
      model._menu_ids = model._menu_ids.split(",");
    }
    model._menu_ids = model._menu_ids.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        menu t
      where
        t.lbl in ${ args.push(model._menu_ids) }
    `;
    interface Result {
      id: string;
    }
    const models = await context.query<Result>(sql, args);
    model.menu_ids = models.map((item: { id: string }) => item.id);
  }
  
  const oldModel = await findByUnique(context, model, options);
  if (oldModel) {
    const result = await checkByUnique(context, model, oldModel, options?.uniqueType, options);
    if (result) {
      return result;
    }
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    insert into role(
      id
      ,create_time
  `;
  {
    const authModel = await getAuthModel(context);
    const tenant_id = await getTenant_id(context, authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,\`lbl\``;
  }
  if (model.rem !== undefined) {
    sql += `,\`rem\``;
  }
  if (model.is_enabled !== undefined) {
    sql += `,\`is_enabled\``;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(context.getReqDate()) }`;
  {
    const authModel = await getAuthModel(context);
    const tenant_id = await getTenant_id(context, authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
  }
  if (model.is_enabled !== undefined) {
    sql += `,${ args.push(model.is_enabled) }`;
  }
  sql += `)`;
  
  const result = await context.execute(sql, args);
  // 菜单
  await many2manyUpdate(context, model, "menu_ids", { table: "role_menu", column1: "role_id", column2: "menu_id" });
  
  await delCache(context);
  
  return model.id;
}

/**
 * 删除缓存
 */
export async function delCache(
  context: Context,
) {
  const table = "role";
  const method = "delCache";
  const cacheKey1 = `dao.sql.${ table }`;
  await context.delCache(cacheKey1);
  const foreignTables: string[] = [
    "role_menu",
    "menu",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    const cacheKey1 = `dao.sql.${ foreignTable }`;
    await context.delCache(cacheKey1);
  }
}

/**
 * 根据id修改租户id
 * @export
 * @param {Context} context
 * @param {string} id
 * @param {string} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  context: Context,
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "role";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(context, tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      role
    set
      update_time = ${ args.push(context.getReqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await context.execute(sql, args);
  const num = result.affectedRows;
  
  await delCache(context);
  return num;
}

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {PartialNull<RoleModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<string>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: PartialNull<RoleModel> & {
    tenant_id?: string | null;
  },
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string | undefined> {
  const table = "role";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  // 修改租户id
  if (isNotEmpty(model.tenant_id)) {
    await updateTenantById(context, id, model.tenant_id);
  }
  
  
  // 启用
  if (isNotEmpty(model._is_enabled) && model.is_enabled === undefined) {
    model._is_enabled = String(model._is_enabled).trim();
      if (model._is_enabled === "是") {
      model.is_enabled = 1;
    } else if (model._is_enabled === "否") {
      model.is_enabled = 0;
    }
  }

  // 菜单
  if (!model.menu_ids && model._menu_ids) {
    if (typeof model._menu_ids === "string" || model._menu_ids instanceof String) {
      model._menu_ids = model._menu_ids.split(",");
    }
    model._menu_ids = model._menu_ids.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        menu t
      where
        t.lbl in ${ args.push(model._menu_ids) }
    `;
    interface Result {
      id: string;
    }
    const models = await context.query<Result>(sql, args);
    model.menu_ids = models.map((item: { id: string }) => item.id);
  }
  
  const oldModel = await findByUnique(context, model);
  if (oldModel) {
    if (oldModel.id !== id && options?.uniqueType !== "create") {
      const result = await checkByUnique(context, model, oldModel, options?.uniqueType);
      if (result) {
        return result;
      }
    }
  } else {
    if (options?.uniqueType === "create") {
      const result = await create(context, { ...model, id });
      return result;
    }
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update role set update_time = ${ args.push(context.getReqDate()) }
  `;
  let updateFldNum = 0;
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `,\`lbl\` = ${ args.push(model.lbl) }`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
      sql += `,\`rem\` = ${ args.push(model.rem) }`;
      updateFldNum++;
    }
  }
  if (model.is_enabled !== undefined) {
    if (model.is_enabled != oldModel?.is_enabled) {
      sql += `,\`is_enabled\` = ${ args.push(model.is_enabled) }`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    {
      const authModel = await getAuthModel(context);
      if (authModel?.id !== undefined) {
        sql += `,update_usr_id = ${ args.push(authModel.id) }`;
      }
    }
    sql += /*sql*/ ` where id = ${ args.push(id) } limit 1`;
    const result = await context.execute(sql, args);
  }
  
  updateFldNum++;
  // 菜单
  await many2manyUpdate(context, { ...model, id }, "menu_ids", { table: "role_menu", column1: "role_id", column2: "menu_id" });
  
  if (updateFldNum > 0) {
    await delCache(context);
  }
  
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  context: Context,
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "role";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const args = new QueryArgs();
    const id = ids[i];
    const isExist = await existById(context, id);
    if (!isExist) {
      continue;
    }
    const sql = /*sql*/ `
      update
        role
      set
        is_deleted = 1,
        delete_time = ${ args.push(context.getReqDate()) }
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await context.execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache(context);
  
  return num;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  context: Context,
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "role";
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
        role
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await context.execute(sql, args);
    num += result.affectedRows;
  }
  await delCache(context);
  
  return num;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
 export async function forceDeleteByIds(
  context: Context,
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "role";
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
          role
        where
          id = ${ args.push(id) }
      `;
      const model = await context.queryOne(sql, args);
      context.log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        role
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await context.execute(sql, args);
    num += result.affectedRows;
  }
  await delCache(context);
  
  return num;
}
