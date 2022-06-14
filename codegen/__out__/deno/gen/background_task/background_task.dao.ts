// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars
import { Context } from "/lib/context.ts";
import { shortUuidV4 } from "/lib/string_util.ts";
import { Page, Sort } from "/lib/page.model.ts";
import { isNotEmpty, isEmpty, sqlLike } from "/lib/string_util.ts";
import { QueryArgs } from "/lib/query_args.ts";
import { UniqueException } from "/lib/exceptions/unique.execption.ts";
import { getAuthModel, getPassword } from "/lib/auth/auth.dao.ts";
import { getTenant_id } from "/src/usr/usr.dao.ts";
import { many2manyUpdate, setModelIds } from "/lib/dao_util.ts";

import { Background_taskModel, Background_taskSearch } from "./background_task.model.ts";
import * as usrDao from "/gen/usr/usr.dao.ts";

async function getWhereQuery(
  context: Context,
  args: QueryArgs,
  search?: Background_taskSearch,
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  {
    const authModel = await getAuthModel(context);
    const tenant_id = authModel && await getTenant_id(context, authModel.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
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
  if (search?.state && search?.state?.length > 0) {
    whereQuery += ` and t.state in (${ args.push(search.state) })`;
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in (${ args.push(search.type) })`;
  }
  if (search?.result !== undefined) {
    whereQuery += ` and t.result = ${ args.push(search.result) }`;
  }
  if (isNotEmpty(search?.resultLike)) {
    whereQuery += ` and t.result like ${ args.push(sqlLike(search?.resultLike) + "%") }`;
  }
  if (search?.err_msg !== undefined) {
    whereQuery += ` and t.err_msg = ${ args.push(search.err_msg) }`;
  }
  if (isNotEmpty(search?.err_msgLike)) {
    whereQuery += ` and t.err_msg like ${ args.push(sqlLike(search?.err_msgLike) + "%") }`;
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
  if (isNotEmpty(search?.remLike)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.remLike) + "%") }`;
  }
  if (search?.create_usr_id && search?.create_usr_id.length > 0) {
    whereQuery += ` and usr.id in (${ args.push(search.create_usr_id) })`;
  }
  if (search?._create_usr_id && search._create_usr_id?.length > 0) {
    whereQuery += ` and _create_usr_id in (${ args.push(search._create_usr_id) })`;
  }
  return whereQuery;
}

function getFromQuery(
  context: Context,
) {
  const fromQuery = `
    background_task t
    left join usr
      on usr.id = t.create_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param {Background_taskSearch} search?
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: Background_taskSearch,
): Promise<number> {
  const table = "background_task";
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
  
  interface Result {
    total: number,
  }
  const model = await context.queryOne<Result>(sql, args);
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {Context} context
 * @param {Background_taskSearch} search? 搜索条件
 * @param {Sort|Sort[]} sort? 排序
 */
export async function findAll(
  context: Context,
  search?: Background_taskSearch,
  page?: Page,
  sort?: Sort|Sort[],
) {
  const table = "background_task";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
        ,usr.lbl _create_usr_id
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
        prop: "begin_time",
        order: "descending",
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
  
  let result = await context.query<Background_taskModel>(sql, args);
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    // 状态
    let _state = "";
    if (model.state === "running") {
      _state = "运行中";
    } else if (model.state === "success") {
      _state = "成功";
    } else if (model.state === "fail") {
      _state = "失败";
    } else if (model.state === "cancel") {
      _state = "取消";
    } else {
      _state = String(model.state);
    }
    model._state = _state;
    // 类型
    let _type = "";
    if (model.type === "text") {
      _type = "文本";
    } else if (model.type === "download") {
      _type = "下载";
    } else if (model.type === "inline") {
      _type = "查看";
    } else if (model.type === "tag") {
      _type = "标签";
    } else {
      _type = String(model.type);
    }
    model._type = _type;
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
  ];
  const uniqueComments = {
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {Background_taskSearch} search0
 */
export async function findByUnique(
  context: Context,
  search0: Background_taskSearch | Background_taskModel,
) {
  const { uniqueKeys } = getUniqueKeys(context);
  if (!uniqueKeys || uniqueKeys.length === 0) return;
  const search: Background_taskSearch = { };
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
 * @param {Background_taskModel} oldModel
 * @param {Background_taskModel} model
 * @return {boolean}
 */
export function equalsByUnique(
  context: Context,
  oldModel: Background_taskModel,
  model: Background_taskModel,
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
 * @param {Background_taskModel} model
 * @param {Background_taskModel} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  context: Context,
  model: Background_taskModel,
  oldModel: Background_taskModel,
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
 * @param {Background_taskSearch} search?
 * @return {Promise<Background_taskModel>} 
 */
export async function findOne(
  context: Context,
  search?: Background_taskSearch,
): Promise<Background_taskModel> {
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
 * @return {Promise<Background_taskModel>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<Background_taskModel | undefined> {
  if (!id) return;
  const model = await findOne(context, { id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {Background_taskSearch} search?
 * @return {Promise<boolean>} 
 */
export async function exist(
  context: Context,
  search?: Background_taskSearch,
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
  const table = "background_task";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = `
    select 1 e from background_task where id = ${ args.push(id) } limit 1
  `;
  
  interface Result {
    e: number,
  }
  let model = await context.queryOne<Result>(sql, args);
  let result = model?.e === 1;
  
  return result;
}

/**
   * 创建数据
   * @param {Background_taskModel} model
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
  model: Background_taskModel,
  options?: {
    uniqueType?: "ignore" | "throw" | "update",
  },
): Promise<string | undefined> {
  if (!model) {
    return;
  }
  const table = "background_task";
  const method = "create";
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  // 状态
  if (isNotEmpty(model._state) && model.state === undefined) {
    model._state = String(model._state).trim();
      if (model._state === "运行中") {
      model.state = "running";
    } else if (model._state === "成功") {
      model.state = "success";
    } else if (model._state === "失败") {
      model.state = "fail";
    } else if (model._state === "取消") {
      model.state = "cancel";
    }
  }
  
  // 类型
  if (isNotEmpty(model._type) && model.type === undefined) {
    model._type = String(model._type).trim();
      if (model._type === "文本") {
      model.type = "text";
    } else if (model._type === "下载") {
      model.type = "download";
    } else if (model._type === "查看") {
      model.type = "inline";
    } else if (model._type === "标签") {
      model.type = "tag";
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
    insert into background_task(
      id
      ,create_time
  `;
  {
    const authModel = await getAuthModel(context);
    const tenant_id = authModel && await getTenant_id(context, authModel.id);
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
  sql += `) values(${ args.push(model.id) },${ args.push(context.getReqDate()) }`;
  {
    const authModel = await getAuthModel(context);
    const tenant_id = authModel && await getTenant_id(context, authModel.id);
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
  
  const result = await context.execute(sql, args);
  
  return model.id;
}

/**
   * 根据id修改一行数据
   * @param {string} id
   * @param {Background_taskModel} model
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
  model: Background_taskModel,
  options?: {
    uniqueType?: "ignore" | "throw" | "create",
  },
): Promise<string | undefined> {
  const table = "background_task";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
  }
  
  // 状态
  if (isNotEmpty(model._state) && model.state === undefined) {
    model._state = String(model._state).trim();
      if (model._state === "运行中") {
      model.state = "running";
    } else if (model._state === "成功") {
      model.state = "success";
    } else if (model._state === "失败") {
      model.state = "fail";
    } else if (model._state === "取消") {
      model.state = "cancel";
    }
  }
  
  // 类型
  if (isNotEmpty(model._type) && model.type === undefined) {
    model._type = String(model._type).trim();
      if (model._type === "文本") {
      model.type = "text";
    } else if (model._type === "下载") {
      model.type = "download";
    } else if (model._type === "查看") {
      model.type = "inline";
    } else if (model._type === "标签") {
      model.type = "tag";
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
    update background_task set update_time = ${ args.push(context.getReqDate()) }
  `;
  {
    const authModel = await getAuthModel(context);
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel?.lbl) {
      sql += `,lbl = ${ args.push(model.lbl) }`;
    }
  }
  if (model.state !== undefined) {
    if (model.state != oldModel?.state) {
      sql += `,state = ${ args.push(model.state) }`;
    }
  }
  if (model.type !== undefined) {
    if (model.type != oldModel?.type) {
      sql += `,type = ${ args.push(model.type) }`;
    }
  }
  if (model.result !== undefined) {
    if (model.result != oldModel?.result) {
      sql += `,result = ${ args.push(model.result) }`;
    }
  }
  if (model.err_msg !== undefined) {
    if (model.err_msg != oldModel?.err_msg) {
      sql += `,err_msg = ${ args.push(model.err_msg) }`;
    }
  }
  if (model.begin_time !== undefined) {
    if (model.begin_time != oldModel?.begin_time) {
      sql += `,begin_time = ${ args.push(model.begin_time) }`;
    }
  }
  if (model.end_time !== undefined) {
    if (model.end_time != oldModel?.end_time) {
      sql += `,end_time = ${ args.push(model.end_time) }`;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel?.rem) {
      sql += `,rem = ${ args.push(model.rem) }`;
    }
  }
  sql += ` where id = ${ args.push(id) } limit 1`;
  
  const result = await context.execute(sql, args);
  
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
  const table = "background_task";
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
        background_task
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
  const table = "background_task";
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
        background_task
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await context.execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
