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

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

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
  CronJobLogExecState,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  CronJobLogInput,
  CronJobLogModel,
  CronJobLogSearch,
  CronJobLogFieldComment,
  CronJobLogId,
} from "./cron_job_log.model.ts";

import * as cron_jobDao from "/gen/cron/cron_job/cron_job.dao.ts";

const route_path = "/cron/cron_job_log";

async function getWhereQuery(
  args: QueryArgs,
  search?: CronJobLogSearch,
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
  if (search?.cron_job_id != null && !Array.isArray(search?.cron_job_id)) {
    search.cron_job_id = [ search.cron_job_id ];
  }
  if (search?.cron_job_id != null) {
    whereQuery += ` and cron_job_id_lbl.id in ${ args.push(search.cron_job_id) }`;
  }
  if (search?.cron_job_id_is_null) {
    whereQuery += ` and cron_job_id_lbl.id is null`;
  }
  if (search?.exec_state != null && !Array.isArray(search?.exec_state)) {
    search.exec_state = [ search.exec_state ];
  }
  if (search?.exec_state != null) {
    whereQuery += ` and t.exec_state in ${ args.push(search.exec_state) }`;
  }
  if (search?.exec_result != null) {
    whereQuery += ` and t.exec_result = ${ args.push(search.exec_result) }`;
  }
  if (isNotEmpty(search?.exec_result_like)) {
    whereQuery += ` and t.exec_result like ${ args.push("%" + sqlLike(search?.exec_result_like) + "%") }`;
  }
  if (search?.begin_time != null) {
    if (search.begin_time[0] != null) {
      whereQuery += ` and t.begin_time >= ${ args.push(search.begin_time[0]) }`;
    }
    if (search.begin_time[1] != null) {
      whereQuery += ` and t.begin_time <= ${ args.push(search.begin_time[1]) }`;
    }
  }
  if (search?.end_time != null) {
    if (search.end_time[0] != null) {
      whereQuery += ` and t.end_time >= ${ args.push(search.end_time[0]) }`;
    }
    if (search.end_time[1] != null) {
      whereQuery += ` and t.end_time <= ${ args.push(search.end_time[1]) }`;
    }
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
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
  search?: CronJobLogSearch,
  options?: {
  },
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `cron_cron_job_log t
    left join cron_cron_job cron_job_id_lbl
      on cron_job_id_lbl.id = t.cron_job_id`;
  return fromQuery;
}

/**
 * 根据条件查找任务执行日志总数
 * @param { CronJobLogSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CronJobLogSearch,
  options?: {
  },
): Promise<number> {
  const table = "cron_cron_job_log";
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
 * 根据搜索条件和分页查找任务执行日志列表
 * @param {CronJobLogSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: CronJobLogSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<CronJobLogModel[]> {
  const table = "cron_cron_job_log";
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
  
  if (search?.id === "") {
    return [ ];
  }
  if (search?.ids?.length === 0) {
    return [ ];
  }
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,cron_job_id_lbl.lbl cron_job_id_lbl
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
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<CronJobLogModel>(
    sql,
    args,
    {
      debug,
    },
  );
  
  const [
    exec_stateDict, // 执行状态
  ] = await getDict([
    "cron_job_log_exec_state",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 执行状态
    let exec_state_lbl = model.exec_state as string;
    if (!isEmpty(model.exec_state)) {
      const dictItem = exec_stateDict.find((dictItem) => dictItem.val === model.exec_state);
      if (dictItem) {
        exec_state_lbl = dictItem.lbl;
      }
    }
    model.exec_state_lbl = exec_state_lbl;
    
    // 开始时间
    if (model.begin_time) {
      const begin_time = dayjs(model.begin_time);
      if (isNaN(begin_time.toDate().getTime())) {
        model.begin_time_lbl = (model.begin_time || "").toString();
      } else {
        model.begin_time_lbl = begin_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.begin_time_lbl = "";
    }
    
    // 结束时间
    if (model.end_time) {
      const end_time = dayjs(model.end_time);
      if (isNaN(end_time.toDate().getTime())) {
        model.end_time_lbl = (model.end_time || "").toString();
      } else {
        model.end_time_lbl = end_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.end_time_lbl = "";
    }
    
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
  input: CronJobLogInput,
) {
  // 开始时间
  if (!input.begin_time && input.begin_time_lbl) {
    const begin_time_lbl = dayjs(input.begin_time_lbl);
    if (begin_time_lbl.isValid()) {
      input.begin_time = begin_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.begin_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.begin_time) {
    const begin_time = dayjs(input.begin_time);
    if (!begin_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.begin_time } ${ await ns("日期格式错误") }`;
    }
    input.begin_time = dayjs(input.begin_time).format("YYYY-MM-DD HH:mm:ss");
  }
  // 结束时间
  if (!input.end_time && input.end_time_lbl) {
    const end_time_lbl = dayjs(input.end_time_lbl);
    if (end_time_lbl.isValid()) {
      input.end_time = end_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.end_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.end_time) {
    const end_time = dayjs(input.end_time);
    if (!end_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.end_time } ${ await ns("日期格式错误") }`;
    }
    input.end_time = dayjs(input.end_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    exec_stateDict, // 执行状态
  ] = await getDict([
    "cron_job_log_exec_state",
  ]);
  
  // 定时任务
  if (isNotEmpty(input.cron_job_id_lbl) && input.cron_job_id === undefined) {
    input.cron_job_id_lbl = String(input.cron_job_id_lbl).trim();
    const cron_jobModel = await cron_jobDao.findOne({ lbl: input.cron_job_id_lbl });
    if (cron_jobModel) {
      input.cron_job_id = cron_jobModel.id;
    }
  }
  
  // 执行状态
  if (isNotEmpty(input.exec_state_lbl) && input.exec_state === undefined) {
    const val = exec_stateDict.find((itemTmp) => itemTmp.lbl === input.exec_state_lbl)?.val;
    if (val !== undefined) {
      input.exec_state = val as CronJobLogExecState;
    }
  }
  
  // 开始时间
  if (isNotEmpty(input.begin_time_lbl) && input.begin_time === undefined) {
    input.begin_time_lbl = String(input.begin_time_lbl).trim();
    input.begin_time = input.begin_time_lbl;
  }
  
  // 结束时间
  if (isNotEmpty(input.end_time_lbl) && input.end_time === undefined) {
    input.end_time_lbl = String(input.end_time_lbl).trim();
    input.end_time = input.end_time_lbl;
  }
}

/**
 * 获取任务执行日志字段注释
 */
export async function getFieldComments(): Promise<CronJobLogFieldComment> {
  const n = initN(route_path);
  const fieldComments: CronJobLogFieldComment = {
    id: await n("ID"),
    cron_job_id: await n("定时任务"),
    cron_job_id_lbl: await n("定时任务"),
    exec_state: await n("执行状态"),
    exec_state_lbl: await n("执行状态"),
    exec_result: await n("执行结果"),
    begin_time: await n("开始时间"),
    begin_time_lbl: await n("开始时间"),
    end_time: await n("结束时间"),
    end_time_lbl: await n("结束时间"),
    rem: await n("备注"),
    create_time: await n("创建时间"),
    create_time_lbl: await n("创建时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得任务执行日志列表
 * @param {CronJobLogInput} search0
 */
export async function findByUnique(
  search0: CronJobLogInput,
  options?: {
  },
): Promise<CronJobLogModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: CronJobLogModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {CronJobLogModel} oldModel
 * @param {CronJobLogInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: CronJobLogModel,
  input: CronJobLogInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查任务执行日志是否已经存在
 * @param {CronJobLogInput} input
 * @param {CronJobLogModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<CronJobLogId | undefined>}
 */
export async function checkByUnique(
  input: CronJobLogInput,
  oldModel: CronJobLogModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<CronJobLogId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("任务执行日志")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: CronJobLogId = await updateById(
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
 * 根据条件查找第一个任务执行日志
 * @param {CronJobLogSearch} search?
 */
export async function findOne(
  search?: CronJobLogSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<CronJobLogModel | undefined> {
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
 * 根据 id 查找任务执行日志
 * @param {CronJobLogId} id
 */
export async function findById(
  id?: CronJobLogId | null,
  options?: {
  },
): Promise<CronJobLogModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id }, undefined, options);
  return model;
}

/**
 * 根据搜索条件判断任务执行日志是否存在
 * @param {CronJobLogSearch} search?
 */
export async function exist(
  search?: CronJobLogSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断任务执行日志是否存在
 * @param {CronJobLogId} id
 */
export async function existById(
  id?: CronJobLogId | null,
  options?: {
  },
) {
  const table = "cron_cron_job_log";
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
      cron_cron_job_log t
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

/** 校验任务执行日志是否存在 */
export async function validateOption(
  model?: CronJobLogModel,
) {
  if (!model) {
    throw `${ await ns("任务执行日志") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 任务执行日志增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CronJobLogInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 定时任务
  await validators.chars_max_length(
    input.cron_job_id,
    22,
    fieldComments.cron_job_id,
  );
  
  // 执行状态
  await validators.chars_max_length(
    input.exec_state,
    10,
    fieldComments.exec_state,
  );
  
  // 执行结果
  await validators.chars_max_length(
    input.exec_result,
    500,
    fieldComments.exec_result,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

/**
 * 创建任务执行日志
 * @param {CronJobLogInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<CronJobLogId>} 
 */
export async function create(
  input: CronJobLogInput,
  options?: {
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CronJobLogId> {
  const table = "cron_cron_job_log";
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
    let id: CronJobLogId | undefined = undefined;
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
    input.id = shortUuidV4<CronJobLogId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into cron_cron_job_log(
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
  if (input.cron_job_id !== undefined) {
    sql += `,cron_job_id`;
  }
  if (input.exec_state !== undefined) {
    sql += `,exec_state`;
  }
  if (input.exec_result !== undefined) {
    sql += `,exec_result`;
  }
  if (input.begin_time !== undefined) {
    sql += `,begin_time`;
  }
  if (input.end_time !== undefined) {
    sql += `,end_time`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
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
  if (input.cron_job_id !== undefined) {
    sql += `,${ args.push(input.cron_job_id) }`;
  }
  if (input.exec_state !== undefined) {
    sql += `,${ args.push(input.exec_state) }`;
  }
  if (input.exec_result !== undefined) {
    sql += `,${ args.push(input.exec_result) }`;
  }
  if (input.begin_time !== undefined) {
    sql += `,${ args.push(input.begin_time) }`;
  }
  if (input.end_time !== undefined) {
    sql += `,${ args.push(input.end_time) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const res = await execute(sql, args, {
    debug,
  });
  log(JSON.stringify(res));
  
  return input.id;
}

/**
 * 任务执行日志根据id修改租户id
 * @param {CronJobLogId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: CronJobLogId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "cron_cron_job_log";
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
      cron_cron_job_log
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
 * 根据 id 修改任务执行日志
 * @param {CronJobLogId} id
 * @param {CronJobLogInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<CronJobLogId>}
 */
export async function updateById(
  id: CronJobLogId,
  input: CronJobLogInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<CronJobLogId> {
  const table = "cron_cron_job_log";
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
        throw await ns("此 {0} 已经存在", await ns("任务执行日志"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("任务执行日志"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update cron_cron_job_log set
  `;
  let updateFldNum = 0;
  if (input.cron_job_id !== undefined) {
    if (input.cron_job_id != oldModel.cron_job_id) {
      sql += `cron_job_id = ${ args.push(input.cron_job_id) },`;
      updateFldNum++;
    }
  }
  if (input.exec_state !== undefined) {
    if (input.exec_state != oldModel.exec_state) {
      sql += `exec_state = ${ args.push(input.exec_state) },`;
      updateFldNum++;
    }
  }
  if (input.exec_result !== undefined) {
    if (input.exec_result != oldModel.exec_result) {
      sql += `exec_result = ${ args.push(input.exec_result) },`;
      updateFldNum++;
    }
  }
  if (input.begin_time !== undefined) {
    if (input.begin_time != oldModel.begin_time) {
      sql += `begin_time = ${ args.push(input.begin_time) },`;
      updateFldNum++;
    }
  }
  if (input.end_time !== undefined) {
    if (input.end_time != oldModel.end_time) {
      sql += `end_time = ${ args.push(input.end_time) },`;
      updateFldNum++;
    }
  }
  if (input.rem !== undefined) {
    if (input.rem != oldModel.rem) {
      sql += `rem = ${ args.push(input.rem) },`;
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
 * 根据 ids 删除任务执行日志
 * @param {CronJobLogId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CronJobLogId[],
  options?: {
  },
): Promise<number> {
  const table = "cron_cron_job_log";
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
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        cron_cron_job_log
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
 * 根据 ids 还原任务执行日志
 * @param {CronJobLogId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CronJobLogId[],
  options?: {
  },
): Promise<number> {
  const table = "cron_cron_job_log";
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
    const id: CronJobLogId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        cron_cron_job_log
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
        throw await ns("此 {0} 已经存在", await ns("任务执行日志"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除任务执行日志
 * @param {CronJobLogId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CronJobLogId[],
  options?: {
  },
): Promise<number> {
  const table = "cron_cron_job_log";
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
          cron_cron_job_log
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        cron_cron_job_log
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