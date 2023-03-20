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
  initN,
  ns,
} from "/src/i18n/i18n.ts";

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
  many2manyUpdate,
  setModelIds,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type DictModel,
  type DictSearch,
} from "./dict.model.ts";

import {
  _internals as usrDao,
} from "/gen/usr/usr.dao.ts";

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
  updateById,
  deleteByIds,
  getIs_lockedById,
  lockByIds,
  revertByIds,
  forceDeleteByIds,
  findLastOrderBy,
};

async function getWhereQuery(
  args: QueryArgs,
  search?: DictSearch,
  options?: {
  },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.code !== undefined) {
    whereQuery += ` and t.code = ${ args.push(search.code) }`;
  }
  if (search?.code === null) {
    whereQuery += ` and t.code is null`;
  }
  if (isNotEmpty(search?.codeLike)) {
    whereQuery += ` and t.code like ${ args.push(sqlLike(search?.codeLike) + "%") }`;
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lblLike)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lblLike) + "%") }`;
  }
  if (search?.type && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.order_by && search?.order_by?.length > 0) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by >= ${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by <= ${ args.push(search.order_by[1]) }`;
    }
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
  if (search?.rem === null) {
    whereQuery += ` and t.rem is null`;
  }
  if (isNotEmpty(search?.remLike)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.remLike) + "%") }`;
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.create_usr_id && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id && search?.create_usr_id.length > 0) {
    whereQuery += ` and _create_usr_id.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id === null) {
    whereQuery += ` and _create_usr_id.id is null`;
  }
  if (search?._create_usr_id && !Array.isArray(search?._create_usr_id)) {
    search._create_usr_id = [ search._create_usr_id ];
  }
  if (search?._create_usr_id && search._create_usr_id?.length > 0) {
    whereQuery += ` and _create_usr_id in ${ args.push(search._create_usr_id) }`;
  }
  if (search?.create_time && search?.create_time?.length > 0) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id && search?.update_usr_id.length > 0) {
    whereQuery += ` and _update_usr_id.id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id === null) {
    whereQuery += ` and _update_usr_id.id is null`;
  }
  if (search?._update_usr_id && !Array.isArray(search?._update_usr_id)) {
    search._update_usr_id = [ search._update_usr_id ];
  }
  if (search?._update_usr_id && search._update_usr_id?.length > 0) {
    whereQuery += ` and _update_usr_id in ${ args.push(search._update_usr_id) }`;
  }
  if (search?.update_time && search?.update_time?.length > 0) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time >= ${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time <= ${ args.push(search.update_time[1]) }`;
    }
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
    \`dict\` t
    left join usr _create_usr_id
      on _create_usr_id.id = t.create_usr_id
    left join usr _update_usr_id
      on _update_usr_id.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { DictSearch } search?
 * @return {Promise<number>}
 */
async function findCount(
  search?: DictSearch,
  options?: {
  },
): Promise<number> {
  const table = "dict";
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
 * @param {DictSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
async function findAll(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "dict";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
      ,_create_usr_id.lbl _create_usr_id
      ,_update_usr_id.lbl _update_usr_id
    from
      ${ getFromQuery() }
    where
      ${ await getWhereQuery(args, search, options) }
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
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  let result = await query<DictModel>(sql, args, { cacheKey1, cacheKey2 });
  
  const [
    typeDict, // 数据类型
    is_enabledDict, // 启用
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "dict_type",
    "is_enabled",
    "is_locked",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 数据类型
    let _type = model.type;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        _type = dictItem.lbl;
      }
    }
    model._type = _type;
    
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
 */
async function getUniqueKeys(): Promise<{
  uniqueKeys: (keyof DictModel)[];
  uniqueComments: { [key: string]: string };
}> {
  const n = initN("/i18n");
  const uniqueKeys: (keyof DictModel)[] = [
    "code",
  ];
  const uniqueComments = {
    code: await n("编码"),
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {DictSearch | PartialNull<DictModel>} search0
 */
async function findByUnique(
  search0: DictSearch | PartialNull<DictModel>,
  options?: {
  },
) {
  if (search0.id) {
    const model = await findOne({ id: search0.id }, options);
    return model;
  }
  const { uniqueKeys } = await getUniqueKeys();
  if (!uniqueKeys || uniqueKeys.length === 0) {
    return;
  }
  const search: DictSearch = { };
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
 * @param {DictModel} oldModel
 * @param {PartialNull<DictModel>} model
 * @return {boolean}
 */
async function equalsByUnique(
  oldModel: DictModel,
  model: PartialNull<DictModel>,
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
 * @param {PartialNull<DictModel>} model
 * @param {DictModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
async function checkByUnique(
  model: PartialNull<DictModel>,
  oldModel: DictModel,
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
 * @param {DictSearch} search?
 */
async function findOne(
  search?: DictSearch,
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
 * @param {DictSearch} search?
 */
async function exist(
  search?: DictSearch,
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
  const table = "dict";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      dict t
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
 * @param {PartialNull<DictModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
async function create(
  model: PartialNull<DictModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string> {
  const table = "dict";
  const method = "create";
  
  const [
    typeDict, // 数据类型
    is_enabledDict, // 启用
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "dict_type",
    "is_enabled",
    "is_locked",
  ]);
  
  
  // 数据类型
  if (isNotEmpty(model._type) && model.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === model._type)?.val;
    if (val !== undefined) {
      model.type = val;
    }
  }
  
  // 启用
  if (isNotEmpty(model._is_enabled) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model._is_enabled)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }
  
  // 锁定
  if (isNotEmpty(model._is_locked) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model._is_locked)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
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
    insert into dict(
      id
      ,create_time
  `;
  if (model.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.code !== undefined) {
    sql += `,\`code\``;
  }
  if (model.lbl !== undefined) {
    sql += `,\`lbl\``;
  }
  if (model.type !== undefined) {
    sql += `,\`type\``;
  }
  if (model.order_by !== undefined) {
    sql += `,\`order_by\``;
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
  if (model.update_usr_id !== undefined) {
    sql += `,\`update_usr_id\``;
  }
  if (model.update_time !== undefined) {
    sql += `,\`update_time\``;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(reqDate()) }`;
  if (model.create_usr_id != null && model.create_usr_id !== "-") {
    sql += `,${ args.push(model.create_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.code !== undefined) {
    sql += `,${ args.push(model.code) }`;
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.type !== undefined) {
    sql += `,${ args.push(model.type) }`;
  }
  if (model.order_by !== undefined) {
    sql += `,${ args.push(model.order_by) }`;
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
  if (model.update_usr_id !== undefined) {
    sql += `,${ args.push(model.update_usr_id) }`;
  }
  if (model.update_time !== undefined) {
    sql += `,${ args.push(model.update_time) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  
  await delCache();
  
  return model.id;
}

/**
 * 删除缓存
 */
async function delCache() {
  const table = "dict";
  const method = "delCache";
  
  const cacheKey1 = `dao.sql.${ table }`;
  await delCacheCtx(cacheKey1);
  const foreignTables: string[] = [
    "usr",
    "usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    const cacheKey1 = `dao.sql.${ foreignTable }`;
    await delCacheCtx(cacheKey1);
  }
}

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {PartialNull<DictModel>} model
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
  model: PartialNull<DictModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "dict";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  const [
    typeDict, // 数据类型
    is_enabledDict, // 启用
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "dict_type",
    "is_enabled",
    "is_locked",
  ]);
  
  // 数据类型
  if (isNotEmpty(model._type) && model.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === model._type)?.val;
    if (val !== undefined) {
      model.type = val;
    }
  }
  
  // 启用
  if (isNotEmpty(model._is_enabled) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model._is_enabled)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }
  
  // 锁定
  if (isNotEmpty(model._is_locked) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model._is_locked)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
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
    update dict set
  `;
  let updateFldNum = 0;
  if (model.code !== undefined) {
    if (model.code != oldModel?.code) {
      sql += `\`code\` = ${ args.push(model.code) },`;
      updateFldNum++;
    }
  }
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `\`lbl\` = ${ args.push(model.lbl) },`;
      updateFldNum++;
    }
  }
  if (model.type !== undefined) {
    if (model.type != oldModel?.type) {
      sql += `\`type\` = ${ args.push(model.type) },`;
      updateFldNum++;
    }
  }
  if (model.order_by !== undefined) {
    if (model.order_by != oldModel?.order_by) {
      sql += `\`order_by\` = ${ args.push(model.order_by) },`;
      updateFldNum++;
    }
  }
  if (model.is_enabled !== undefined) {
    if (model.is_enabled != oldModel?.is_enabled) {
      sql += `\`is_enabled\` = ${ args.push(model.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
      sql += `\`rem\` = ${ args.push(model.rem) },`;
      updateFldNum++;
    }
  }
  if (model.is_locked !== undefined) {
    if (model.is_locked != oldModel?.is_locked) {
      sql += `\`is_locked\` = ${ args.push(model.is_locked) },`;
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
  const table = "dict";
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
        dict
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
  const table = "dict";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      dict
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
  const table = "dict";
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
        dict
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
  const table = "dict";
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
          dict
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        dict
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
  
/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "dict";
  const method = "findLastOrderBy";
  
  let sql = /*sql*/ `
    select
      t.order_by order_by
    from
      dict t
  `;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += /*sql*/ `
    order by
      t.order_by desc
    limit 1
  `;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(sql, args);
  let result = model?.order_by ?? 0;
  
  return result;
}
