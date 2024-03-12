// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  log,
  error,
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
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import {
  deepCompare,
} from "/lib/util/object_util.ts";

import * as validators from "/lib/validators/mod.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OperationRecordInput,
  OperationRecordModel,
  OperationRecordSearch,
  OperationRecordFieldComment,
  OperationRecordId,
} from "./operation_record.model.ts";

const route_path = "/base/operation_record";

async function getWhereQuery(
  args: QueryArgs,
  search?: OperationRecordSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id == null) {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.module != null) {
    whereQuery += ` and t.module = ${ args.push(search.module) }`;
  }
  if (isNotEmpty(search?.module_like)) {
    whereQuery += ` and t.module like ${ args.push("%" + sqlLike(search?.module_like) + "%") }`;
  }
  if (search?.module_lbl != null) {
    whereQuery += ` and t.module_lbl = ${ args.push(search.module_lbl) }`;
  }
  if (isNotEmpty(search?.module_lbl_like)) {
    whereQuery += ` and t.module_lbl like ${ args.push("%" + sqlLike(search?.module_lbl_like) + "%") }`;
  }
  if (search?.method != null) {
    whereQuery += ` and t.method = ${ args.push(search.method) }`;
  }
  if (isNotEmpty(search?.method_like)) {
    whereQuery += ` and t.method like ${ args.push("%" + sqlLike(search?.method_like) + "%") }`;
  }
  if (search?.method_lbl != null) {
    whereQuery += ` and t.method_lbl = ${ args.push(search.method_lbl) }`;
  }
  if (isNotEmpty(search?.method_lbl_like)) {
    whereQuery += ` and t.method_lbl like ${ args.push("%" + sqlLike(search?.method_lbl_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.time != null) {
    if (search.time[0] != null) {
      whereQuery += ` and t.time >= ${ args.push(search.time[0]) }`;
    }
    if (search.time[1] != null) {
      whereQuery += ` and t.time <= ${ args.push(search.time[1]) }`;
    }
  }
  if (search?.old_data != null) {
    whereQuery += ` and t.old_data = ${ args.push(search.old_data) }`;
  }
  if (isNotEmpty(search?.old_data_like)) {
    whereQuery += ` and t.old_data like ${ args.push("%" + sqlLike(search?.old_data_like) + "%") }`;
  }
  if (search?.new_data != null) {
    whereQuery += ` and t.new_data = ${ args.push(search.new_data) }`;
  }
  if (isNotEmpty(search?.new_data_like)) {
    whereQuery += ` and t.new_data like ${ args.push("%" + sqlLike(search?.new_data_like) + "%") }`;
  }
  if (search?.create_usr_id != null && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and create_usr_id_lbl.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
  }
  return whereQuery;
}

async function getFromQuery(
  args: QueryArgs,
  search?: OperationRecordSearch,
  options?: {
  },
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `base_operation_record t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找操作记录总数
 * @param { OperationRecordSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OperationRecordSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_operation_record";
  const method = "findCount";
  
  let msg = `${ table }.${ method }: `;
  if (search && Object.keys(search).length > 0) {
    msg += `search:${ JSON.stringify(search) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  const args = new QueryArgs();
  let sql = `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = Number(model?.total || 0);
  
  return result;
}

/**
 * 根据搜索条件和分页查找操作记录列表
 * @param {OperationRecordSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: OperationRecordSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<OperationRecordModel[]> {
  const table = "base_operation_record";
  const method = "findAll";
  
  let msg = `${ table }.${ method }: `;
  if (search && Object.keys(search).length > 0) {
    msg += `search:${ JSON.stringify(search) } `;
  }
  if (page && Object.keys(page).length > 0) {
    msg += `page:${ JSON.stringify(page) } `;
  }
  if (sort && Object.keys(sort).length > 0) {
    msg += `sort:${ JSON.stringify(sort) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "create_time",
        order: SortOrderEnum.Desc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "create_time",
    order: SortOrderEnum.Desc,
  });
  sort.push({
    prop: "create_time",
    order: SortOrderEnum.Desc,
  });
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
  
  const result = await query<OperationRecordModel>(
    sql,
    args,
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 操作时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (isNaN(create_time.toDate().getTime())) {
        model.create_time_lbl = (model.create_time || "").toString();
      } else {
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.create_time_lbl = "";
    }
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: OperationRecordInput,
) {
}

/**
 * 获取操作记录字段注释
 */
export async function getFieldComments(): Promise<OperationRecordFieldComment> {
  const n = initN(route_path);
  const fieldComments: OperationRecordFieldComment = {
    id: await n("ID"),
    module: await n("模块"),
    module_lbl: await n("模块名称"),
    method: await n("方法"),
    method_lbl: await n("方法名称"),
    lbl: await n("操作"),
    time: await n("耗时(毫秒)"),
    old_data: await n("操作前数据"),
    new_data: await n("操作后数据"),
    create_usr_id: await n("操作人"),
    create_usr_id_lbl: await n("操作人"),
    create_time: await n("操作时间"),
    create_time_lbl: await n("操作时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得操作记录列表
 * @param {OperationRecordInput} search0
 */
export async function findByUnique(
  search0: OperationRecordInput,
  options?: {
  },
): Promise<OperationRecordModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: OperationRecordModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {OperationRecordModel} oldModel
 * @param {OperationRecordInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: OperationRecordModel,
  input: OperationRecordInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查操作记录是否已经存在
 * @param {OperationRecordInput} input
 * @param {OperationRecordModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<OperationRecordId | undefined>}
 */
export async function checkByUnique(
  input: OperationRecordInput,
  oldModel: OperationRecordModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<OperationRecordId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("操作记录")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: OperationRecordId = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        {
          ...options,
        },
      );
      return id;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

/**
 * 根据条件查找第一个操作记录
 * @param {OperationRecordSearch} search?
 */
export async function findOne(
  search?: OperationRecordSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<OperationRecordModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort, options);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找操作记录
 * @param {OperationRecordId} id
 */
export async function findById(
  id?: OperationRecordId | null,
  options?: {
  },
): Promise<OperationRecordModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id }, undefined, options);
  return model;
}

/**
 * 根据搜索条件判断操作记录是否存在
 * @param {OperationRecordSearch} search?
 */
export async function exist(
  search?: OperationRecordSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断操作记录是否存在
 * @param {OperationRecordId} id
 */
export async function existById(
  id?: OperationRecordId | null,
  options?: {
  },
) {
  const table = "base_operation_record";
  const method = "existById";
  
  let msg = `${ table }.${ method }: `;
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      base_operation_record t
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

/** 校验操作记录是否存在 */
export async function validateOption(
  model?: OperationRecordModel,
) {
  if (!model) {
    throw `${ await ns("操作记录") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 操作记录增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: OperationRecordInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 模块
  await validators.chars_max_length(
    input.module,
    50,
    fieldComments.module,
  );
  
  // 模块名称
  await validators.chars_max_length(
    input.module_lbl,
    50,
    fieldComments.module_lbl,
  );
  
  // 方法
  await validators.chars_max_length(
    input.method,
    50,
    fieldComments.method,
  );
  
  // 方法名称
  await validators.chars_max_length(
    input.method_lbl,
    50,
    fieldComments.method_lbl,
  );
  
  // 操作
  await validators.chars_max_length(
    input.lbl,
    100,
    fieldComments.lbl,
  );
  
  // 操作人
  await validators.chars_max_length(
    input.create_usr_id,
    22,
    fieldComments.create_usr_id,
  );
  
}

/**
 * 创建操作记录
 * @param {OperationRecordInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<OperationRecordId>} 
 */
export async function create(
  input: OperationRecordInput,
  options?: {
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<OperationRecordId> {
  const table = "base_operation_record";
  const method = "create";
  
  let msg = `${ table }.${ method }: `;
  if (input) {
    msg += `input:${ JSON.stringify(input) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: OperationRecordId | undefined = undefined;
    for (const oldModel of oldModels) {
      id = await checkByUnique(
        input,
        oldModel,
        options?.uniqueType,
        options,
      );
      if (id) {
        break;
      }
    }
    if (id) {
      return id;
    }
  }
  
  while (true) {
    input.id = shortUuidV4<OperationRecordId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_operation_record(
      id
      ,create_time
      ,update_time
  `;
  if (input.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id`;
    }
  }
  if (input.module !== undefined) {
    sql += `,module`;
  }
  if (input.module_lbl !== undefined) {
    sql += `,module_lbl`;
  }
  if (input.method !== undefined) {
    sql += `,method`;
  }
  if (input.method_lbl !== undefined) {
    sql += `,method_lbl`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.time !== undefined) {
    sql += `,time`;
  }
  if (input.old_data !== undefined) {
    sql += `,old_data`;
  }
  if (input.new_data !== undefined) {
    sql += `,new_data`;
  }
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;
  if (input.tenant_id != null) {
    sql += `,${ args.push(input.tenant_id) }`;
  } else {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.module !== undefined) {
    sql += `,${ args.push(input.module) }`;
  }
  if (input.module_lbl !== undefined) {
    sql += `,${ args.push(input.module_lbl) }`;
  }
  if (input.method !== undefined) {
    sql += `,${ args.push(input.method) }`;
  }
  if (input.method_lbl !== undefined) {
    sql += `,${ args.push(input.method_lbl) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.time !== undefined) {
    sql += `,${ args.push(input.time) }`;
  }
  if (input.old_data !== undefined) {
    sql += `,${ args.push(input.old_data) }`;
  }
  if (input.new_data !== undefined) {
    sql += `,${ args.push(input.new_data) }`;
  }
  sql += `)`;
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  return input.id;
}

/**
 * 操作记录根据id修改租户id
 * @param {OperationRecordId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: OperationRecordId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "base_operation_record";
  const method = "updateTenantById";
  
  let msg = `${ table }.${ method }: `;
  if (id) {
    msg += `id:${ id } `;
  }
  if (tenant_id) {
    msg += `tenant_id:${ tenant_id } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_operation_record
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
 * 根据 id 修改操作记录
 * @param {OperationRecordId} id
 * @param {OperationRecordInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<OperationRecordId>}
 */
export async function updateById(
  id: OperationRecordId,
  input: OperationRecordInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<OperationRecordId> {
  const table = "base_operation_record";
  const method = "updateById";
  
  let msg = `${ table }.${ method }: `;
  if (id) {
    msg += `id:${ id } `;
  }
  if (input) {
    msg += `input:${ JSON.stringify(input) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id as unknown as TenantId);
  }
  
  await setIdByLbl(input);
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("操作记录"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("操作记录"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_operation_record set
  `;
  let updateFldNum = 0;
  if (input.module !== undefined) {
    if (input.module != oldModel.module) {
      sql += `module = ${ args.push(input.module) },`;
      updateFldNum++;
    }
  }
  if (input.module_lbl !== undefined) {
    if (input.module_lbl != oldModel.module_lbl) {
      sql += `module_lbl = ${ args.push(input.module_lbl) },`;
      updateFldNum++;
    }
  }
  if (input.method !== undefined) {
    if (input.method != oldModel.method) {
      sql += `method = ${ args.push(input.method) },`;
      updateFldNum++;
    }
  }
  if (input.method_lbl !== undefined) {
    if (input.method_lbl != oldModel.method_lbl) {
      sql += `method_lbl = ${ args.push(input.method_lbl) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.time !== undefined) {
    if (input.time != oldModel.time) {
      sql += `time = ${ args.push(input.time) },`;
      updateFldNum++;
    }
  }
  if (input.old_data !== undefined) {
    if (input.old_data != oldModel.old_data) {
      sql += `old_data = ${ args.push(input.old_data) },`;
      updateFldNum++;
    }
  }
  if (input.new_data !== undefined) {
    if (input.new_data != oldModel.new_data) {
      sql += `new_data = ${ args.push(input.new_data) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除操作记录
 * @param {OperationRecordId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OperationRecordId[],
  options?: {
  },
): Promise<number> {
  const table = "base_operation_record";
  const method = "deleteByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: OperationRecordId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_operation_record
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
 * 根据 ids 还原操作记录
 * @param {OperationRecordId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OperationRecordId[],
  options?: {
  },
): Promise<number> {
  const table = "base_operation_record";
  const method = "revertByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: OperationRecordId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_operation_record
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 检查数据的唯一索引
    {
      const old_model = await findById(id);
      if (!old_model) {
        continue;
      }
      const input = {
        ...old_model,
        id: undefined,
      };
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("操作记录"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除操作记录
 * @param {OperationRecordId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OperationRecordId[],
  options?: {
  },
): Promise<number> {
  const table = "base_operation_record";
  const method = "forceDeleteByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `
        select
          *
        from
          base_operation_record
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_operation_record
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
