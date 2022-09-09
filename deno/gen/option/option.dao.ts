// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars
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
  type OptionModel,
  type OptionSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

async function getWhereQuery(
  context: Context,
  args: QueryArgs,
  search?: OptionSearch & {
    $extra?: SearchExtra[];
    tenant_id?: string;
  },
  options?: {
    notVerifyToken?: boolean;
  },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id === undefined) {
    const authModel = await getAuthModel(context, options?.notVerifyToken);
    const tenant_id = await getTenant_id(context, authModel?.id, options);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if(search?.tenant_id !== null) {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
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
  if (search?.ky !== undefined) {
    whereQuery += ` and t.ky = ${ args.push(search.ky) }`;
  }
  if (isNotEmpty(search?.kyLike)) {
    whereQuery += ` and t.ky like ${ args.push(sqlLike(search?.kyLike) + "%") }`;
  }
  if (search?.val !== undefined) {
    whereQuery += ` and t.val = ${ args.push(search.val) }`;
  }
  if (isNotEmpty(search?.valLike)) {
    whereQuery += ` and t.val like ${ args.push(sqlLike(search?.valLike) + "%") }`;
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
  const fromQuery = /*sql*/ `
    \`option\` t
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
  search?: OptionSearch & { $extra?: SearchExtra[] },
  options?: {
    notVerifyToken?: boolean;
  },
): Promise<number> {
  const table = "option";
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
 * @param {OptionSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  context: Context,
  search?: OptionSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    notVerifyToken?: boolean;
  },
) {
  const table = "option";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
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
  
  let result = await context.query<OptionModel>(sql, args, { cacheKey1, cacheKey2 });
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
  }
  
  return result;
}

/**
 * 获得表的唯一字段名列表
 * @return {{ uniqueKeys: (keyof OptionModel)[]; uniqueComments: { [key: string]: string }; }}
 */
export function getUniqueKeys(
  context: Context,
): {
  uniqueKeys: (keyof OptionModel)[];
  uniqueComments: { [key: string]: string };
  } {
  const uniqueKeys: (keyof OptionModel)[] = [
    "ky",
  ];
  const uniqueComments = {
    ky: "键",
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {OptionSearch & { $extra?: SearchExtra[] } | Partial<OptionModel>} search0
 */
export async function findByUnique(
  context: Context,
  search0: OptionSearch & { $extra?: SearchExtra[] } | Partial<OptionModel>,
  options?: {
    notVerifyToken?: boolean;
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
  const search: OptionSearch & { $extra?: SearchExtra[] } = { };
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
 * @param {OptionModel} oldModel
 * @param {Partial<OptionModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  context: Context,
  oldModel: OptionModel,
  model: Partial<OptionModel>,
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
 * @param {Partial<OptionModel>} model
 * @param {OptionModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  context: Context,
  model: Partial<OptionModel>,
  oldModel: OptionModel,
  uniqueType: "ignore" | "throw" | "update" = "throw",
  options?: {
    notVerifyToken?: boolean;
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
 * @param {OptionSearch & { $extra?: SearchExtra[] }} search?
 */
export async function findOne(
  context: Context,
  search?: OptionSearch & { $extra?: SearchExtra[] },
  options?: {
    notVerifyToken?: boolean;
  },
) {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(context, search, page, undefined, options);
  const model: OptionModel | undefined = result[0];
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
    notVerifyToken?: boolean;
  },
) {
  if (!id) return;
  const model = await findOne(context, { id }, options);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {OptionSearch & { $extra?: SearchExtra[] }} search?
 */
export async function exist(
  context: Context,
  search?: OptionSearch & { $extra?: SearchExtra[] },
  options?: {
    notVerifyToken?: boolean;
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
  const table = "option";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      option
    where
      id = ${ args.push(id) }
    limit 1
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
   * @param {Partial<OptionModel>} model
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
  model: Partial<OptionModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
    notVerifyToken?: boolean;
  },
): Promise<string | undefined> {
  if (!model) {
    return;
  }
  const table = "option";
  const method = "create";
  
  if (!model.id) {
    model.id = shortUuidV4();
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
    insert into option(
      id
      ,create_time
  `;
  {
    const authModel = await getAuthModel(context, options?.notVerifyToken);
    const tenant_id = await getTenant_id(context, authModel?.id, options);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  {
    const authModel = await getAuthModel(context, options?.notVerifyToken);
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,\`lbl\``;
  }
  if (model.ky !== undefined) {
    sql += `,\`ky\``;
  }
  if (model.val !== undefined) {
    sql += `,\`val\``;
  }
  if (model.rem !== undefined) {
    sql += `,\`rem\``;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(context.getReqDate()) }`;
  {
    const authModel = await getAuthModel(context, options?.notVerifyToken);
    const tenant_id = await getTenant_id(context, authModel?.id, options);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  {
    const authModel = await getAuthModel(context, options?.notVerifyToken);
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.ky !== undefined) {
    sql += `,${ args.push(model.ky) }`;
  }
  if (model.val !== undefined) {
    sql += `,${ args.push(model.val) }`;
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
  const table = "option";
  const method = "delCache";
  const cacheKey1 = `dao.sql.${ table }`;
  await context.delCache(cacheKey1);
  const foreignTables: string[] = [
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
   * @param {Partial<OptionModel>} model
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
  model: Partial<OptionModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
    notVerifyToken?: boolean;
  },
): Promise<string | undefined> {
  const table = "option";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
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
    update option set update_time = ${ args.push(context.getReqDate()) }
  `;
  let updateFldNum = 0;
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `,\`lbl\` = ${ args.push(model.lbl) }`;
      updateFldNum++;
    }
  }
  if (model.ky !== undefined) {
    if (model.ky != oldModel?.ky) {
      sql += `,\`ky\` = ${ args.push(model.ky) }`;
      updateFldNum++;
    }
  }
  if (model.val !== undefined) {
    if (model.val != oldModel?.val) {
      sql += `,\`val\` = ${ args.push(model.val) }`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
      sql += `,\`rem\` = ${ args.push(model.rem) }`;
      updateFldNum++;
    }
  }
  if (updateFldNum === 0) {
    return id;
  }
  {
    const authModel = await getAuthModel(context, options?.notVerifyToken);
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += /*sql*/ ` where id = ${ args.push(id) } limit 1`;
  
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
  options?: {
    notVerifyToken?: boolean;
  },
): Promise<number> {
  const table = "option";
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
        option
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
    notVerifyToken?: boolean;
  },
): Promise<number> {
  const table = "option";
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
        option
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
