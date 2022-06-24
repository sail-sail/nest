// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars require-await
import { Context } from "/lib/context.ts";
import { shortUuidV4 } from "/lib/string_util.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { isNotEmpty, isEmpty, sqlLike } from "/lib/string_util.ts";
import { QueryArgs } from "/lib/query_args.ts";
import { UniqueException } from "/lib/exceptions/unique.execption.ts";
import { getAuthModel, getPassword } from "/lib/auth/auth.dao.ts";
import { getTenant_id } from "/src/usr/usr.dao.ts";
import { many2manyUpdate, setModelIds } from "/lib/dao_util.ts";

import { MenuModel, MenuSearch } from "./menu.model.ts";

async function getWhereQuery(
  context: Context,
  args: QueryArgs,
  search?: MenuSearch,
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in (${ args.push(search.type) })`;
  }
  if (search?.menu_id && search?.menu_id.length > 0) {
    whereQuery += ` and _menu_id.id in (${ args.push(search.menu_id) })`;
  }
  if (search?._menu_id && search._menu_id?.length > 0) {
    whereQuery += ` and _menu_id in (${ args.push(search._menu_id) })`;
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lblLike)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lblLike) + "%") }`;
  }
  if (search?.route_path !== undefined) {
    whereQuery += ` and t.route_path = ${ args.push(search.route_path) }`;
  }
  if (isNotEmpty(search?.route_pathLike)) {
    whereQuery += ` and t.route_path like ${ args.push(sqlLike(search?.route_pathLike) + "%") }`;
  }
  if (search?.route_query !== undefined) {
    whereQuery += ` and t.route_query = ${ args.push(search.route_query) }`;
  }
  if (isNotEmpty(search?.route_queryLike)) {
    whereQuery += ` and t.route_query like ${ args.push(sqlLike(search?.route_queryLike) + "%") }`;
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in (${ args.push(search.is_enabled) })`;
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
  return whereQuery;
}

function getFromQuery(
  context: Context,
) {
  const fromQuery = `
    \`menu\` t
    left join menu _menu_id
      on _menu_id.id = t.menu_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param {MenuSearch} search?
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: MenuSearch,
): Promise<number> {
  const table = "menu";
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
 * @param {MenuSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 */
export async function findAll(
  context: Context,
  search?: MenuSearch,
  page?: Page,
  sort?: Sort|Sort[],
) {
  const table = "menu";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
        ,_menu_id.lbl _menu_id
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
        order: "ascending",
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item: Sort) => item.prop);
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
  
  let result = await context.query<MenuModel>(sql, args, { cacheKey1, cacheKey2 });
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    // 类型
    let _type = "";
    if (model.type === "pc") {
      _type = "电脑端";
    } else if (model.type === "mobile") {
      _type = "手机端";
    } else {
      _type = String(model.type);
    }
    model._type = _type;
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
 * @return {{ uniqueKeys: string[]; uniqueComments: { [key: string]: string }; }}
 */
export function getUniqueKeys(
  context: Context,
): {
  uniqueKeys: string[];
  uniqueComments: { [key: string]: string };
  } {
  const uniqueKeys: string[] = [
    "menu_id",
    "lbl",
  ];
  const uniqueComments = {
    menu_id: "父菜单",
    lbl: "名称",
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {MenuSearch} search0
 */
export async function findByUnique(
  context: Context,
  search0: MenuSearch | MenuModel,
) {
  const { uniqueKeys } = getUniqueKeys(context);
  if (!uniqueKeys || uniqueKeys.length === 0) return;
  const search: MenuSearch = { };
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
 * @param {MenuModel} oldModel
 * @param {MenuModel} model
 * @return {boolean}
 */
export function equalsByUnique(
  context: Context,
  oldModel: MenuModel,
  model: MenuModel,
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
 * @param {MenuModel} model
 * @param {MenuModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  context: Context,
  model: MenuModel,
  oldModel: MenuModel,
  uniqueType: "ignore" | "throw" | "update" = "throw",
): Promise<string | undefined> {
  const isEquals = equalsByUnique(context, oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      const { uniqueKeys, uniqueComments } = getUniqueKeys(context);
      const lbl = uniqueKeys.map((key) => `${ uniqueComments[key] }: ${ model[`_${ key }`] ?? model[key] }`).join("; ");
      throw new UniqueException(`${ lbl } 已存在!`);
    }
    if (uniqueType === "update") {
      const result = await updateById(context, oldModel.id!, { ...model, id: undefined });
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
 * @param {MenuSearch} search?
 * @return {Promise<MenuModel>} 
 */
export async function findOne(
  context: Context,
  search?: MenuSearch,
): Promise<MenuModel> {
  const page: Page = {
    pgOffset: 0,
    pgSize: 1,
  };
  const [ model ] = await findAll(context, search, page);
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<MenuModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<MenuModel | undefined> {
  if (!id) return;
  const model = await findOne(context, { id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {MenuSearch} search?
 * @return {Promise<boolean>} 
 */
export async function exist(
  context: Context,
  search?: MenuSearch,
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
  const table = "menu";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = `
    select 1 e from menu where id = ${ args.push(id) } limit 1
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
   * @param {MenuModel} model
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
  model: MenuModel,
  options?: {
    uniqueType?: "ignore" | "throw" | "update",
  },
): Promise<string | undefined> {
  if (!model) {
    return;
  }
  const table = "menu";
  const method = "create";
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  // 类型
  if (isNotEmpty(model._type) && model.type === undefined) {
    model._type = String(model._type).trim();
      if (model._type === "电脑端") {
      model.type = "pc";
    } else if (model._type === "手机端") {
      model.type = "mobile";
    }
  }
  
  // 父菜单
  if (isNotEmpty(model._menu_id) && model.menu_id === undefined) {
    model._menu_id = String(model._menu_id).trim();
    const menuModel = await findOne(context, { lbl: model._menu_id });
    if (menuModel) {
      model.menu_id = menuModel.id;
    }
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
  
  const oldModel = await findByUnique(context, model);
  if (oldModel) {
    const result = await checkByUnique(context, model, oldModel, options?.uniqueType);
    if (result) {
      return result;
    }
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into menu(
      id
      ,create_time
  `;
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.type !== undefined) {
    sql += `,\`type\``;
  }
  if (model.menu_id !== undefined) {
    sql += `,\`menu_id\``;
  }
  if (model.lbl !== undefined) {
    sql += `,\`lbl\``;
  }
  if (model.route_path !== undefined) {
    sql += `,\`route_path\``;
  }
  if (model.route_query !== undefined) {
    sql += `,\`route_query\``;
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
  if (model.type !== undefined) {
    sql += `,${ args.push(model.type) }`;
  }
  if (model.menu_id !== undefined) {
    sql += `,${ args.push(model.menu_id) }`;
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.route_path !== undefined) {
    sql += `,${ args.push(model.route_path) }`;
  }
  if (model.route_query !== undefined) {
    sql += `,${ args.push(model.route_query) }`;
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
  
  await delCache(context);
  
  return model.id;
}

/**
 * 删除缓存
 */
export async function delCache(
  context: Context,
) {
  const table = "menu";
  const method = "delCache";
  const cacheKey1 = `dao.sql.${ table }`;
  await context.delCache(cacheKey1);
  const foreignTables: string[] = [
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
   * @param {MenuModel} model
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
  model: MenuModel,
  options?: {
    uniqueType?: "ignore" | "throw" | "create",
  },
): Promise<string | undefined> {
  const table = "menu";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  // 类型
  if (isNotEmpty(model._type) && model.type === undefined) {
    model._type = String(model._type).trim();
      if (model._type === "电脑端") {
      model.type = "pc";
    } else if (model._type === "手机端") {
      model.type = "mobile";
    }
  }
  
  // 父菜单
  if (isNotEmpty(model._menu_id) && model.menu_id === undefined) {
    model._menu_id = String(model._menu_id).trim();
    const menuModel = await findOne(context, { lbl: model._menu_id });
    if (menuModel) {
      model.menu_id = menuModel.id;
    }
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
    update menu set update_time = ${ args.push(context.getReqDate()) }
  `;
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  if (model.type !== undefined) {
    if (model.type != oldModel?.type) {
      sql += `,\`type\` = ${ args.push(model.type) }`;
    }
  }
  if (model.menu_id !== undefined) {
    if (model.menu_id != oldModel?.menu_id) {
      sql += `,\`menu_id\` = ${ args.push(model.menu_id) }`;
    }
  }
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `,\`lbl\` = ${ args.push(model.lbl) }`;
    }
  }
  if (model.route_path !== undefined) {
    if (model.route_path != oldModel?.route_path) {
      sql += `,\`route_path\` = ${ args.push(model.route_path) }`;
    }
  }
  if (model.route_query !== undefined) {
    if (model.route_query != oldModel?.route_query) {
      sql += `,\`route_query\` = ${ args.push(model.route_query) }`;
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
  const table = "menu";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const args = new QueryArgs();
    const id = ids[i];
    const sql = `
      update
        menu
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
  const table = "menu";
  const method = "create";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        menu
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
  const table = "menu";
  const method = "findLastOrderBy";
  
  let sql = `
    select
      t.order_by order_by
    from
      menu t
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
