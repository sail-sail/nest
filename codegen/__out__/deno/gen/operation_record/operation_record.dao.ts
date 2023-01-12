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
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

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
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type Operation_RecordModel,
  type Operation_RecordSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

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
  updateTenantById,
  updateById,
  deleteByIds,
  revertByIds,
  forceDeleteByIds,
};

async function getWhereQuery(
  args: QueryArgs,
  search?: Operation_RecordSearch & {
    $extra?: SearchExtra[];
    tenant_id?: string | null;
  },
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
  } else {
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
  if (search?.mod !== undefined) {
    whereQuery += ` and t.mod = ${ args.push(search.mod) }`;
  }
  if (isNotEmpty(search?.modLike)) {
    whereQuery += ` and t.mod like ${ args.push(sqlLike(search?.modLike) + "%") }`;
  }
  if (search?.mod_lbl !== undefined) {
    whereQuery += ` and t.mod_lbl = ${ args.push(search.mod_lbl) }`;
  }
  if (isNotEmpty(search?.mod_lblLike)) {
    whereQuery += ` and t.mod_lbl like ${ args.push(sqlLike(search?.mod_lblLike) + "%") }`;
  }
  if (search?.method !== undefined) {
    whereQuery += ` and t.method = ${ args.push(search.method) }`;
  }
  if (isNotEmpty(search?.methodLike)) {
    whereQuery += ` and t.method like ${ args.push(sqlLike(search?.methodLike) + "%") }`;
  }
  if (search?.method_lbl !== undefined) {
    whereQuery += ` and t.method_lbl = ${ args.push(search.method_lbl) }`;
  }
  if (isNotEmpty(search?.method_lblLike)) {
    whereQuery += ` and t.method_lbl like ${ args.push(sqlLike(search?.method_lblLike) + "%") }`;
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
  if (search?.create_usr_id && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id && search?.create_usr_id.length > 0) {
    whereQuery += ` and _create_usr_id.id in ${ args.push(search.create_usr_id) }`;
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
    \`operation_record\` t
    left join usr _create_usr_id
      on _create_usr_id.id = t.create_usr_id
    left join usr _update_usr_id
      on _update_usr_id.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { & { $extra?: SearchExtra[] }} search?
 * @return {Promise<number>}
 */
async function findCount(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  options?: {
  },
): Promise<number> {
  const table = "operation_record";
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
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
async function findAll(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "operation_record";
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
  
  let result = await query<Operation_RecordModel>(sql, args);
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
  }
  
  return result;
}

/**
 * 获得表的唯一字段名列表
 * @return {{ uniqueKeys: (keyof Operation_RecordModel)[]; uniqueComments: { [key: string]: string }; }}
 */
function getUniqueKeys(): {
  uniqueKeys: (keyof Operation_RecordModel)[];
  uniqueComments: { [key: string]: string };
  } {
  const uniqueKeys: (keyof Operation_RecordModel)[] = [
  ];
  const uniqueComments = {
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] } | PartialNull<Operation_RecordModel>} search0
 */
async function findByUnique(
  search0: Operation_RecordSearch & { $extra?: SearchExtra[] } | PartialNull<Operation_RecordModel>,
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
  const search: Operation_RecordSearch & { $extra?: SearchExtra[] } = { };
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
 * @param {Operation_RecordModel} oldModel
 * @param {PartialNull<Operation_RecordModel>} model
 * @return {boolean}
 */
function equalsByUnique(
  oldModel: Operation_RecordModel,
  model: PartialNull<Operation_RecordModel>,
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
 * @param {PartialNull<Operation_RecordModel>} model
 * @param {Operation_RecordModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
async function checkByUnique(
  model: PartialNull<Operation_RecordModel>,
  oldModel: Operation_RecordModel,
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
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search?
 */
async function findOne(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  options?: {
  },
) {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(search, page, undefined, options);
  const model = result[0] as Operation_RecordModel | undefined;
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string,
  options?: {
  },
) {
  if (!id) return;
  const model = await findOne({ id }, options);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search?
 */
async function exist(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
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
  id: string,
) {
  const table = "operation_record";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      operation_record t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,
  );
  let result = !!model?.e;
  
  return result;
}

/**
 * 创建数据
 * @param {PartialNull<Operation_RecordModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string | undefined>} 
 */
async function create(
  model: PartialNull<Operation_RecordModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string | undefined> {
  if (!model) {
    return;
  }
  const table = "operation_record";
  const method = "create";
  
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
    insert into operation_record(
      id
      ,create_time
  `;
  {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.mod !== undefined) {
    sql += `,\`mod\``;
  }
  if (model.mod_lbl !== undefined) {
    sql += `,\`mod_lbl\``;
  }
  if (model.method !== undefined) {
    sql += `,\`method\``;
  }
  if (model.method_lbl !== undefined) {
    sql += `,\`method_lbl\``;
  }
  if (model.lbl !== undefined) {
    sql += `,\`lbl\``;
  }
  if (model.rem !== undefined) {
    sql += `,\`rem\``;
  }
  if (model.update_usr_id !== undefined) {
    sql += `,\`update_usr_id\``;
  }
  if (model.update_time !== undefined) {
    sql += `,\`update_time\``;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(reqDate()) }`;
  {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.mod !== undefined) {
    sql += `,${ args.push(model.mod) }`;
  }
  if (model.mod_lbl !== undefined) {
    sql += `,${ args.push(model.mod_lbl) }`;
  }
  if (model.method !== undefined) {
    sql += `,${ args.push(model.method) }`;
  }
  if (model.method_lbl !== undefined) {
    sql += `,${ args.push(model.method_lbl) }`;
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
  }
  if (model.update_usr_id !== undefined) {
    sql += `,${ args.push(model.update_usr_id) }`;
  }
  if (model.update_time !== undefined) {
    sql += `,${ args.push(model.update_time) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  
  return model.id;
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
  const table = "operation_record";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      operation_record
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {PartialNull<Operation_RecordModel>} model
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
  model: PartialNull<Operation_RecordModel> & {
    tenant_id?: string | null;
  },
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string | undefined> {
  const table = "operation_record";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  // 修改租户id
  if (isNotEmpty(model.tenant_id)) {
    await updateTenantById(id, model.tenant_id);
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
    update operation_record set update_time = ${ args.push(reqDate()) }
  `;
  let updateFldNum = 0;
  if (model.mod !== undefined) {
    if (model.mod != oldModel?.mod) {
      sql += `,\`mod\` = ${ args.push(model.mod) }`;
      updateFldNum++;
    }
  }
  if (model.mod_lbl !== undefined) {
    if (model.mod_lbl != oldModel?.mod_lbl) {
      sql += `,\`mod_lbl\` = ${ args.push(model.mod_lbl) }`;
      updateFldNum++;
    }
  }
  if (model.method !== undefined) {
    if (model.method != oldModel?.method) {
      sql += `,\`method\` = ${ args.push(model.method) }`;
      updateFldNum++;
    }
  }
  if (model.method_lbl !== undefined) {
    if (model.method_lbl != oldModel?.method_lbl) {
      sql += `,\`method_lbl\` = ${ args.push(model.method_lbl) }`;
      updateFldNum++;
    }
  }
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
  if (updateFldNum > 0) {
    {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `,update_usr_id = ${ args.push(authModel.id) }`;
      }
    }
    sql += /*sql*/ ` where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
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
  const table = "operation_record";
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
    const sql = /*sql*/ `
      update
        operation_record
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
  const table = "operation_record";
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
        operation_record
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
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
  const table = "operation_record";
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
          operation_record
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        operation_record
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
