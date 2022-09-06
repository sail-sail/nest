// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars require-await
import { type Context } from "/lib/context.ts";

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
  many2manyUpdate,
  setModelIds,
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type TenantModel,
  type TenantSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

async function getWhereQuery(
  context: Context,
  args: QueryArgs,
  search?: TenantSearch & { $extra?: SearchExtra[] },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lblLike)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lblLike) + "%") }`;
  }
  if (search?.host !== undefined) {
    whereQuery += ` and t.host = ${ args.push(search.host) }`;
  }
  if (isNotEmpty(search?.hostLike)) {
    whereQuery += ` and t.host like ${ args.push(sqlLike(search?.hostLike) + "%") }`;
  }
  if (search?.expiration && search?.expiration?.length > 0) {
    if (search.expiration[0] != null) {
      whereQuery += ` and t.expiration >= ${ args.push(search.expiration[0]) }`;
    }
    if (search.expiration[1] != null) {
      whereQuery += ` and t.expiration <= ${ args.push(search.expiration[1]) }`;
    }
  }
  if (search?.max_usr_num && search?.max_usr_num?.length > 0) {
    if (search.max_usr_num[0] != null) {
      whereQuery += ` and t.max_usr_num >= ${ args.push(search.max_usr_num[0]) }`;
    }
    if (search.max_usr_num[1] != null) {
      whereQuery += ` and t.max_usr_num <= ${ args.push(search.max_usr_num[1]) }`;
    }
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in (${ args.push(search.is_enabled) })`;
  }
  if (search?.menu_ids && search?.menu_ids.length > 0) {
    whereQuery += ` and _menu_ids.id in (${ args.push(search.menu_ids) })`;
  }
  if (search?._menu_ids && search._menu_ids?.length > 0) {
    whereQuery += ` and _menu_ids in (${ args.push(search._menu_ids) })`;
  }
  if (search?.order_by && search?.order_by?.length > 0) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by >= ${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by <= ${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.remLike)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.remLike) + "%") }`;
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
  const fromQuery = `
    \`tenant\` t
    left join \`tenant_menu\`
      on \`tenant_menu\`.tenant_id = t.id
      and \`tenant_menu\`.is_deleted = 0
    left join \`menu\`
      on \`tenant_menu\`.menu_id = menu.id
      and menu.is_deleted = 0
    left join (
      select
        json_arrayagg(menu.id) menu_ids,
        json_arrayagg(menu.lbl) _menu_ids,
        tenant.id tenant_id
      from \`tenant_menu\`
      inner join menu
        on menu.id = \`tenant_menu\`.menu_id
        and menu.is_deleted = 0
      inner join tenant
        on tenant.id = \`tenant_menu\`.tenant_id
        and tenant.is_deleted = 0
      where
      \`tenant_menu\`.is_deleted = 0
      group by tenant_id
    ) _menu
      on _menu.tenant_id = t.id
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
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const table = "tenant";
  const method = "findCount";
  
  const args = new QueryArgs();
  let sql = `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ getFromQuery(context) }
        where
          ${ await getWhereQuery(context, args, search) }
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
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
) {
  const table = "tenant";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
        ,max(menu_ids) menu_ids
        ,max(_menu_ids) _menu_ids
    from
      ${ getFromQuery(context) }
    where
      ${ await getWhereQuery(context, args, search) }
    group by t.id
  `;
  
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
  
  let result = await context.query<TenantModel>(sql, args, { cacheKey1, cacheKey2 });
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
 * @return {{ uniqueKeys: (keyof TenantModel)[]; uniqueComments: { [key: string]: string }; }}
 */
export function getUniqueKeys(
  context: Context,
): {
  uniqueKeys: (keyof TenantModel)[];
  uniqueComments: { [key: string]: string };
  } {
  const uniqueKeys: (keyof TenantModel)[] = [
    "lbl",
  ];
  const uniqueComments = {
    lbl: "名称",
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {TenantSearch & { $extra?: SearchExtra[] } | Partial<TenantModel>} search0
 */
export async function findByUnique(
  context: Context,
  search0: TenantSearch & { $extra?: SearchExtra[] } | Partial<TenantModel>,
) {
  const { uniqueKeys } = getUniqueKeys(context);
  if (!uniqueKeys || uniqueKeys.length === 0) return;
  const search: TenantSearch & { $extra?: SearchExtra[] } = { };
  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    const val = (search0 as any)[key];
    if (isEmpty(val)) {
      return;
    }
    (search as any)[key] = val;
  }
  const model = await findOne(context, search);
  return model;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {TenantModel} oldModel
 * @param {Partial<TenantModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  context: Context,
  oldModel: TenantModel,
  model: Partial<TenantModel>,
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
 * @param {Partial<TenantModel>} model
 * @param {TenantModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  context: Context,
  model: Partial<TenantModel>,
  oldModel: TenantModel,
  uniqueType: "ignore" | "throw" | "update" = "throw",
): Promise<string | undefined> {
  const isEquals = equalsByUnique(context, oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      const { uniqueKeys, uniqueComments } = getUniqueKeys(context);
      const lbl = uniqueKeys.map((key) => `${ uniqueComments[key] }: ${ (model as any)[`_${ key }`] ?? model[key] }`).join("; ");
      throw new UniqueException(`${ lbl } 已存在!`);
    }
    if (uniqueType === "update") {
      const result = await updateById(context, oldModel.id, { ...model, id: undefined });
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
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search?
 * @return {Promise<TenantModel>} 
 */
export async function findOne(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<TenantModel> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const [ model ] = await findAll(context, search, page);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<TenantModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<TenantModel | undefined> {
  if (!id) return;
  const model = await findOne(context, { id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {TenantSearch & { $extra?: SearchExtra[] }} search?
 * @return {Promise<boolean>} 
 */
export async function exist(
  context: Context,
  search?: TenantSearch & { $extra?: SearchExtra[] },
): Promise<boolean> {
  const model = await findOne(context, search);
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
): Promise<boolean> {
  const table = "tenant";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = `
    select 1 e from tenant where id = ${ args.push(id) } limit 1
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  interface Result {
    e: number,
  }
  let model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = model?.e === 1;
  
  return result;
}

/**
   * 创建数据
   * @param {Partial<TenantModel>} model
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
  model: Partial<TenantModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update",
  },
): Promise<string | undefined> {
  if (!model) {
    return;
  }
  const table = "tenant";
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
    const sql = `
      select
        t.id
      from
        menu t
      where
        t.lbl in (${ args.push(model._menu_ids) })
    `;
    interface Result {
      id: string;
    }
    const models = await context.query<Result>(sql, args);
    model.menu_ids = models.map((item: { id: string }) => item.id);
  }
  
  const oldModel = await findByUnique(context, model);
  if (oldModel) {
    const result = await checkByUnique(context, model, oldModel, options?.uniqueType);
    if (result) {
      return result;
    }
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into tenant(
      id
      ,create_time
  `;
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,\`lbl\``;
  }
  if (model.host !== undefined) {
    sql += `,\`host\``;
  }
  if (model.expiration !== undefined) {
    sql += `,\`expiration\``;
  }
  if (model.max_usr_num !== undefined) {
    sql += `,\`max_usr_num\``;
  }
  if (model.is_enabled !== undefined) {
    sql += `,\`is_enabled\``;
  }
  if (model.order_by !== undefined) {
    sql += `,\`order_by\``;
  }
  if (model.rem !== undefined) {
    sql += `,\`rem\``;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(context.getReqDate()) }`;
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.host !== undefined) {
    sql += `,${ args.push(model.host) }`;
  }
  if (model.expiration !== undefined) {
    sql += `,${ args.push(model.expiration) }`;
  }
  if (model.max_usr_num !== undefined) {
    sql += `,${ args.push(model.max_usr_num) }`;
  }
  if (model.is_enabled !== undefined) {
    sql += `,${ args.push(model.is_enabled) }`;
  }
  if (model.order_by !== undefined) {
    sql += `,${ args.push(model.order_by) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
  }
  sql += `)`;
  
  const result = await context.execute(sql, args);
  // 菜单
  await many2manyUpdate(context, model, "menu_ids", { table: "tenant_menu", column1: "tenant_id", column2: "menu_id" });
  
  await delCache(context);
  
  return model.id;
}

/**
 * 删除缓存
 */
export async function delCache(
  context: Context,
) {
  const table = "tenant";
  const method = "delCache";
  const cacheKey1 = `dao.sql.${ table }`;
  await context.delCache(cacheKey1);
  const foreignTables: string[] = [
    "tenant_menu",
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
   * 根据id修改一行数据
   * @param {string} id
   * @param {Partial<TenantModel>} model
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
  model: Partial<TenantModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create",
  },
): Promise<string | undefined> {
  const table = "tenant";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
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
    const sql = `
      select
        t.id
      from
        menu t
      where
        t.lbl in (${ args.push(model._menu_ids) })
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
  let sql = `
    update tenant set update_time = ${ args.push(context.getReqDate()) }
  `;
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `,\`lbl\` = ${ args.push(model.lbl) }`;
    }
  }
  if (model.host !== undefined) {
    if (model.host != oldModel?.host) {
      sql += `,\`host\` = ${ args.push(model.host) }`;
    }
  }
  if (model.expiration !== undefined) {
    if (model.expiration != oldModel?.expiration) {
      sql += `,\`expiration\` = ${ args.push(model.expiration) }`;
    }
  }
  if (model.max_usr_num !== undefined) {
    if (model.max_usr_num != oldModel?.max_usr_num) {
      sql += `,\`max_usr_num\` = ${ args.push(model.max_usr_num) }`;
    }
  }
  if (model.is_enabled !== undefined) {
    if (model.is_enabled != oldModel?.is_enabled) {
      sql += `,\`is_enabled\` = ${ args.push(model.is_enabled) }`;
    }
  }
  if (model.order_by !== undefined) {
    if (model.order_by != oldModel?.order_by) {
      sql += `,\`order_by\` = ${ args.push(model.order_by) }`;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
      sql += `,\`rem\` = ${ args.push(model.rem) }`;
    }
  }
  sql += ` where id = ${ args.push(id) } limit 1`;
  
  const result = await context.execute(sql, args);
  // 菜单
  await many2manyUpdate(context, { ...model, id }, "menu_ids", { table: "tenant_menu", column1: "tenant_id", column2: "menu_id" });
  
  await delCache(context);
  
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
): Promise<number> {
  const table = "tenant";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const args = new QueryArgs();
    const id = ids[i];
    const sql = /*sql*/ `
      update
        tenant
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
): Promise<number> {
  const table = "tenant";
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
        tenant
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
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  context: Context,
): Promise<number> {
  const table = "tenant";
  const method = "findLastOrderBy";
  
  let sql = `
    select
      t.order_by order_by
    from
      tenant t
  `;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += `
    order by
      t.order_by desc
    limit 1
  `;
  
  interface Result {
    order_by: number;
  }
  let model = await context.queryOne<Result>(sql, args);
  let result = model?.order_by || 1;
  
  return result;
}
