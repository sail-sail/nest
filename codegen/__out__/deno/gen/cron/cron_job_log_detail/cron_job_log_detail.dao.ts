// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
  splitCreateArr,
} from "/lib/util/dao_util.ts";

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
  getParsedEnv,
} from "/lib/env.ts";

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

import {
  findOne as findOneCronJobLog,
} from "/gen/cron/cron_job_log/cron_job_log.dao.ts";

const route_path = "/cron/cron_job_log_detail";

async function getWhereQuery(
  args: QueryArgs,
  search?: CronJobLogDetailSearch,
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
  if (search?.cron_job_log_id != null && !Array.isArray(search?.cron_job_log_id)) {
    search.cron_job_log_id = [ search.cron_job_log_id ];
  }
  if (search?.cron_job_log_id != null) {
    whereQuery += ` and cron_job_log_id_lbl.id in ${ args.push(search.cron_job_log_id) }`;
  }
  if (search?.cron_job_log_id_is_null) {
    whereQuery += ` and cron_job_log_id_lbl.id is null`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
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
  if (search?.update_usr_id != null && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and update_usr_id_lbl.id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time >= ${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time <= ${ args.push(search.update_time[1]) }`;
    }
  }
  return whereQuery;
}

async function getFromQuery(
  args: QueryArgs,
  search?: CronJobLogDetailSearch,
  options?: {
  },
) {
  let fromQuery = `cron_cron_job_log_detail t
    left join cron_cron_job_log cron_job_log_id_lbl
      on cron_job_log_id_lbl.id = t.cron_job_log_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找任务执行日志明细总数
 * @param { CronJobLogDetailSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CronJobLogDetailSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "cron_cron_job_log_detail";
  const method = "findCount";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
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
 * 根据搜索条件和分页查找任务执行日志明细列表
 * @param {CronJobLogDetailSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: CronJobLogDetailSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<CronJobLogDetailModel[]> {
  const table = "cron_cron_job_log_detail";
  const method = "findAll";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (page && Object.keys(page).length > 0) {
      msg += ` page:${ JSON.stringify(page) }`;
    }
    if (sort && Object.keys(sort).length > 0) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search?.ids?.length === 0) {
    return [ ];
  }
  // 任务执行日志
  if (search && search.cron_job_log_id != null && search.cron_job_log_id.length === 0) {
    return [ ];
  }
  // 创建人
  if (search && search.create_usr_id != null && search.create_usr_id.length === 0) {
    return [ ];
  }
  // 更新人
  if (search && search.update_usr_id != null && search.update_usr_id.length === 0) {
    return [ ];
  }
  
  const args = new QueryArgs();
  let sql = `
    select f.* from (
    select t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
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
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<CronJobLogDetailModel>(
    sql,
    args,
    {
      debug,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 创建时间
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
  input: CronJobLogDetailInput,
) {
}

/**
 * 获取任务执行日志明细字段注释
 */
export async function getFieldComments(): Promise<CronJobLogDetailFieldComment> {
  const n = initN(route_path);
  const fieldComments: CronJobLogDetailFieldComment = {
    id: await n("ID"),
    cron_job_log_id: await n("任务执行日志"),
    cron_job_log_id_lbl: await n("任务执行日志"),
    lbl: await n("日志明细"),
    create_time: await n("创建时间"),
    create_time_lbl: await n("创建时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得任务执行日志明细列表
 * @param {CronJobLogDetailInput} search0
 */
export async function findByUnique(
  search0: CronJobLogDetailInput,
  options?: {
    debug?: boolean;
  },
): Promise<CronJobLogDetailModel[]> {
  
  const table = "cron_cron_job_log_detail";
  const method = "findByUnique";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: CronJobLogDetailModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {CronJobLogDetailModel} oldModel
 * @param {CronJobLogDetailInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: CronJobLogDetailModel,
  input: CronJobLogDetailInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查任务执行日志明细是否已经存在
 * @param {CronJobLogDetailInput} input
 * @param {CronJobLogDetailModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<CronJobLogDetailId | undefined>}
 */
export async function checkByUnique(
  input: CronJobLogDetailInput,
  oldModel: CronJobLogDetailModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<CronJobLogDetailId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("任务执行日志明细")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: CronJobLogDetailId = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        options,
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
 * 根据条件查找第一个任务执行日志明细
 * @param {CronJobLogDetailSearch} search?
 */
export async function findOne(
  search?: CronJobLogDetailSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<CronJobLogDetailModel | undefined> {
  const table = "cron_cron_job_log_detail";
  const method = "findOne";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  
  if (search?.id === "") {
    return;
  }
  if (search?.ids?.length === 0) {
    return;
  }
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort, options);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找任务执行日志明细
 * @param {CronJobLogDetailId} id
 */
export async function findById(
  id?: CronJobLogDetailId | null,
  options?: {
    debug?: boolean;
  },
): Promise<CronJobLogDetailModel | undefined> {
  const table = "cron_cron_job_log_detail";
  const method = "findById";
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id }, undefined, options);
  return model;
}

/**
 * 根据搜索条件判断任务执行日志明细是否存在
 * @param {CronJobLogDetailSearch} search?
 */
export async function exist(
  search?: CronJobLogDetailSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "cron_cron_job_log_detail";
  const method = "exist";
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断任务执行日志明细是否存在
 * @param {CronJobLogDetailId} id
 */
export async function existById(
  id?: CronJobLogDetailId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "cron_cron_job_log_detail";
  const method = "existById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from cron_cron_job_log_detail t where t.id = ${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,
  );
  const result = !!model?.e;
  
  return result;
}

/** 校验任务执行日志明细是否存在 */
export async function validateOption(
  model?: CronJobLogDetailModel,
) {
  if (!model) {
    throw `${ await ns("任务执行日志明细") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 任务执行日志明细增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CronJobLogDetailInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 任务执行日志
  await validators.chars_max_length(
    input.cron_job_log_id,
    22,
    fieldComments.cron_job_log_id,
  );
  
}

/**
 * 创建任务执行日志明细
 * @param {CronJobLogDetailInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<CronJobLogDetailId>} 
 */
export async function create(
  input: CronJobLogDetailInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CronJobLogDetailId> {
  const table = "cron_cron_job_log_detail";
  const method = "create";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [ id ] = await _creates([ input ], options);
  
  return id;
}

/**
 * 批量创建任务执行日志明细
 * @param {CronJobLogDetailInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<CronJobLogDetailId[]>} 
 */
export async function creates(
  inputs: CronJobLogDetailInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CronJobLogDetailId[]> {
  const table = "cron_cron_job_log_detail";
  const method = "creates";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: CronJobLogDetailInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CronJobLogDetailId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "cron_cron_job_log_detail";
  
  const ids2: CronJobLogDetailId[] = [ ];
  const inputs2: CronJobLogDetailInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: CronJobLogDetailId | undefined = undefined;
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
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
    const id = shortUuidV4<CronJobLogDetailId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into cron_cron_job_log_detail(id,create_time,tenant_id,create_usr_id,cron_job_log_id,lbl)values`;
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (input.create_time != null) {
        sql += `,${ args.push(input.create_time) }`;
      } else {
        sql += `,${ args.push(reqDate()) }`;
      }
      if (input.tenant_id != null) {
        sql += `,${ args.push(input.tenant_id) }`;
      } else {
        const authModel = await getAuthModel();
        const tenant_id = await getTenant_id(authModel?.id);
        if (tenant_id) {
          sql += `,${ args.push(tenant_id) }`;
        } else {
          sql += ",default";
        }
      }
      if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
        sql += `,${ args.push(input.create_usr_id) }`;
      } else {
        const authModel = await getAuthModel();
        if (authModel?.id != null) {
          sql += `,${ args.push(authModel.id) }`;
        } else {
          sql += ",default";
        }
      }
      if (input.cron_job_log_id != null) {
        sql += `,${ args.push(input.cron_job_log_id) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
  }
  
  return ids2;
}

/**
 * 任务执行日志明细根据id修改租户id
 * @param {CronJobLogDetailId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: CronJobLogDetailId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "cron_cron_job_log_detail";
  const method = "updateTenantById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id } `;
    }
    if (tenant_id) {
      msg += ` tenant_id:${ tenant_id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      cron_cron_job_log_detail
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
 * 根据 id 修改任务执行日志明细
 * @param {CronJobLogDetailId} id
 * @param {CronJobLogDetailInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<CronJobLogDetailId>}
 */
export async function updateById(
  id: CronJobLogDetailId,
  input: CronJobLogDetailInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<CronJobLogDetailId> {
  
  const table = "cron_cron_job_log_detail";
  const method = "updateById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
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
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("任务执行日志明细"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("任务执行日志明细"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update cron_cron_job_log_detail set
  `;
  let updateFldNum = 0;
  if (input.cron_job_log_id != null) {
    if (input.cron_job_log_id != oldModel.cron_job_log_id) {
      sql += `cron_job_log_id = ${ args.push(input.cron_job_log_id) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await getAuthModel();
      if (authModel?.id != null) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    if (input.update_time) {
      sql += `update_time = ${ args.push(input.update_time) }`;
    } else {
      sql += `update_time = ${ args.push(reqDate()) }`;
    }
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await execute(sql, args);
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除任务执行日志明细
 * @param {CronJobLogDetailId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CronJobLogDetailId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "cron_cron_job_log_detail";
  const method = "deleteByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `update cron_cron_job_log_detail set is_deleted=1,delete_time=${ args.push(reqDate()) } where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

/**
 * 根据 ids 还原任务执行日志明细
 * @param {CronJobLogDetailId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CronJobLogDetailId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "cron_cron_job_log_detail";
  const method = "revertByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: CronJobLogDetailId = ids[i];
    const args = new QueryArgs();
    const sql = `update cron_cron_job_log_detail set is_deleted = 0 where id = ${ args.push(id) } limit 1`;
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
        throw await ns("此 {0} 已经存在", await ns("任务执行日志明细"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除任务执行日志明细
 * @param {CronJobLogDetailId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CronJobLogDetailId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "cron_cron_job_log_detail";
  const method = "forceDeleteByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `select * from cron_cron_job_log_detail where id = ${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from cron_cron_job_log_detail where id = ${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
