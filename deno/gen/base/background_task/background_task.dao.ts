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
  setModelIds,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type BackgroundTaskModel,
  type BackgroundTaskSearch,
} from "./background_task.model.ts";

import * as usrDao from "/gen/base/usr/usr.dao.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: BackgroundTaskSearch,
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
  if (search?.state && !Array.isArray(search?.state)) {
    search.state = [ search.state ];
  }
  if (search?.state && search?.state?.length > 0) {
    whereQuery += ` and t.state in ${ args.push(search.state) }`;
  }
  if (search?.type && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.result !== undefined) {
    whereQuery += ` and t.result = ${ args.push(search.result) }`;
  }
  if (search?.result === null) {
    whereQuery += ` and t.result is null`;
  }
  if (isNotEmpty(search?.result_like)) {
    whereQuery += ` and t.result like ${ args.push(sqlLike(search?.result_like) + "%") }`;
  }
  if (search?.err_msg !== undefined) {
    whereQuery += ` and t.err_msg = ${ args.push(search.err_msg) }`;
  }
  if (search?.err_msg === null) {
    whereQuery += ` and t.err_msg is null`;
  }
  if (isNotEmpty(search?.err_msg_like)) {
    whereQuery += ` and t.err_msg like ${ args.push(sqlLike(search?.err_msg_like) + "%") }`;
  }
  if (search?.begin_time && search?.begin_time?.length > 0) {
    if (search.begin_time[0] != null) {
      whereQuery += ` and t.begin_time >= ${ args.push(search.begin_time[0]) }`;
    }
    if (search.begin_time[1] != null) {
      whereQuery += ` and t.begin_time <= ${ args.push(search.begin_time[1]) }`;
    }
  }
  if (search?.end_time && search?.end_time?.length > 0) {
    if (search.end_time[0] != null) {
      whereQuery += ` and t.end_time >= ${ args.push(search.end_time[0]) }`;
    }
    if (search.end_time[1] != null) {
      whereQuery += ` and t.end_time <= ${ args.push(search.end_time[1]) }`;
    }
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
  if (search?.create_usr_id && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id && search?.create_usr_id.length > 0) {
    whereQuery += ` and create_usr_id_lbl.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id === null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_usr_id_lbl && !Array.isArray(search?.create_usr_id_lbl)) {
    search.create_usr_id_lbl = [ search.create_usr_id_lbl ];
  }
  if (search?.create_usr_id_lbl && search.create_usr_id_lbl?.length > 0) {
    whereQuery += ` and create_usr_id_lbl in ${ args.push(search.create_usr_id_lbl) }`;
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
    base_background_task t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { BackgroundTaskSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: BackgroundTaskSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
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
 * @param {BackgroundTaskSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "base_background_task";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
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
        prop: "begin_time",
        order: SortOrderEnum.Desc,
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
  
  let result = await query<BackgroundTaskModel>(sql, args);
  
  const [
    stateDict, // 状态
    typeDict, // 类型
  ] = await dictSrcDao.getDict([
    "background_task_state",
    "background_task_type",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 状态
    let state_lbl = model.state;
    if (!isEmpty(model.state)) {
      const dictItem = stateDict.find((dictItem) => dictItem.val === model.state);
      if (dictItem) {
        state_lbl = dictItem.lbl;
      }
    }
    model.state_lbl = state_lbl;
    
    // 类型
    let type_lbl = model.type;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl;
  }
  
  return result;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const n = initN("/background_task");
  const fieldComments = {
    lbl: await n("名称"),
    state: await n("状态"),
    state_lbl: await n("状态"),
    type: await n("类型"),
    type_lbl: await n("类型"),
    result: await n("执行结果"),
    err_msg: await n("错误信息"),
    begin_time: await n("开始时间"),
    end_time: await n("结束时间"),
    rem: await n("备注"),
    create_usr_id: await n("创建人"),
    create_usr_id_lbl: await n("创建人"),
  };
  return fieldComments;
}

/**
 * 获得表的唯一字段名列表
 */
export async function getUniqueKeys(): Promise<{
  uniqueKeys: (keyof BackgroundTaskModel)[];
  uniqueComments: { [key: string]: string };
}> {
  const n = initN("/i18n");
  const uniqueKeys: (keyof BackgroundTaskModel)[] = [
  ];
  const uniqueComments = {
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {BackgroundTaskSearch | PartialNull<BackgroundTaskModel>} search0
 */
export async function findByUnique(
  search0: BackgroundTaskSearch | PartialNull<BackgroundTaskModel>,
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
  const search: BackgroundTaskSearch = { };
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
 * @param {BackgroundTaskModel} oldModel
 * @param {PartialNull<BackgroundTaskModel>} model
 * @return {boolean}
 */
export async function equalsByUnique(
  oldModel: BackgroundTaskModel,
  model: PartialNull<BackgroundTaskModel>,
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
 * @param {PartialNull<BackgroundTaskModel>} model
 * @param {BackgroundTaskModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  model: PartialNull<BackgroundTaskModel>,
  oldModel: BackgroundTaskModel,
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
 * @param {BackgroundTaskSearch} search?
 */
export async function findOne(
  search?: BackgroundTaskSearch,
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
 * @param {BackgroundTaskSearch} search?
 */
export async function exist(
  search?: BackgroundTaskSearch,
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
  const table = "base_background_task";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      base_background_task t
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
 * @param {PartialNull<BackgroundTaskModel>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  model: PartialNull<BackgroundTaskModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string> {
  const table = "base_background_task";
  const method = "create";
  
  const [
    stateDict, // 状态
    typeDict, // 类型
  ] = await dictSrcDao.getDict([
    "background_task_state",
    "background_task_type",
  ]);
  
  
  // 状态
  if (isNotEmpty(model.state_lbl) && model.state === undefined) {
    const val = stateDict.find((itemTmp) => itemTmp.lbl === model.state_lbl)?.val;
    if (val !== undefined) {
      model.state = val;
    }
  }
  
  // 类型
  if (isNotEmpty(model.type_lbl) && model.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === model.type_lbl)?.val;
    if (val !== undefined) {
      model.type = val;
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
    insert into base_background_task(
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
  if (model.state !== undefined) {
    sql += `,state`;
  }
  if (model.type !== undefined) {
    sql += `,type`;
  }
  if (model.result !== undefined) {
    sql += `,result`;
  }
  if (model.err_msg !== undefined) {
    sql += `,err_msg`;
  }
  if (model.begin_time !== undefined) {
    sql += `,begin_time`;
  }
  if (model.end_time !== undefined) {
    sql += `,end_time`;
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
  if (model.state !== undefined) {
    sql += `,${ args.push(model.state) }`;
  }
  if (model.type !== undefined) {
    sql += `,${ args.push(model.type) }`;
  }
  if (model.result !== undefined) {
    sql += `,${ args.push(model.result) }`;
  }
  if (model.err_msg !== undefined) {
    sql += `,${ args.push(model.err_msg) }`;
  }
  if (model.begin_time !== undefined) {
    sql += `,${ args.push(model.begin_time) }`;
  }
  if (model.end_time !== undefined) {
    sql += `,${ args.push(model.end_time) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
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
export async function updateTenantById(
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      base_background_task
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
 * @param {PartialNull<BackgroundTaskModel>} model
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
  model: PartialNull<BackgroundTaskModel>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "base_background_task";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  const [
    stateDict, // 状态
    typeDict, // 类型
  ] = await dictSrcDao.getDict([
    "background_task_state",
    "background_task_type",
  ]);
  
  // 修改租户id
  if (isNotEmpty(model.tenant_id)) {
    await updateTenantById(id, model.tenant_id);
  }
  
  // 状态
  if (isNotEmpty(model.state_lbl) && model.state === undefined) {
    const val = stateDict.find((itemTmp) => itemTmp.lbl === model.state_lbl)?.val;
    if (val !== undefined) {
      model.state = val;
    }
  }
  
  // 类型
  if (isNotEmpty(model.type_lbl) && model.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === model.type_lbl)?.val;
    if (val !== undefined) {
      model.type = val;
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
    update base_background_task set
  `;
  let updateFldNum = 0;
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `lbl = ${ args.push(model.lbl) },`;
      updateFldNum++;
    }
  }
  if (model.state !== undefined) {
    if (model.state != oldModel?.state) {
      sql += `state = ${ args.push(model.state) },`;
      updateFldNum++;
    }
  }
  if (model.type !== undefined) {
    if (model.type != oldModel?.type) {
      sql += `type = ${ args.push(model.type) },`;
      updateFldNum++;
    }
  }
  if (model.result !== undefined) {
    if (model.result != oldModel?.result) {
      sql += `result = ${ args.push(model.result) },`;
      updateFldNum++;
    }
  }
  if (model.err_msg !== undefined) {
    if (model.err_msg != oldModel?.err_msg) {
      sql += `err_msg = ${ args.push(model.err_msg) },`;
      updateFldNum++;
    }
  }
  if (model.begin_time !== undefined) {
    if (model.begin_time != oldModel?.begin_time) {
      sql += `begin_time = ${ args.push(model.begin_time) },`;
      updateFldNum++;
    }
  }
  if (model.end_time !== undefined) {
    if (model.end_time != oldModel?.end_time) {
      sql += `end_time = ${ args.push(model.end_time) },`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
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
  const table = "base_background_task";
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
    const args = new QueryArgs();
    const sql = /*sql*/ `
      update
        base_background_task
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
export async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
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
        base_background_task
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
export async function forceDeleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
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
          base_background_task
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        base_background_task
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
