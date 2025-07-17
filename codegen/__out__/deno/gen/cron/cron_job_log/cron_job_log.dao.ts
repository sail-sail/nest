// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
  splitCreateArr,
  FIND_ALL_IDS_LIMIT,
} from "/lib/util/dao_util.ts";

import {
  log,
  error,
  escapeDec,
  reqDate,
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existByIdTenant,
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

import {
  findOneCronJob,
} from "/gen/cron/cron_job/cron_job.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<CronJobLogSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id=${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id=${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.cron_job_id != null) {
    whereQuery += ` and t.cron_job_id in (${ args.push(search.cron_job_id) })`;
  }
  if (search?.cron_job_id_is_null) {
    whereQuery += ` and t.cron_job_id is null`;
  }
  if (search?.cron_job_id_lbl != null) {
    whereQuery += ` and cron_job_id_lbl.lbl in (${ args.push(search.cron_job_id_lbl) })`;
  }
  if (isNotEmpty(search?.cron_job_id_lbl_like)) {
    whereQuery += ` and cron_job_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.cron_job_id_lbl_like) + "%") }`;
  }
  if (search?.exec_state != null) {
    whereQuery += ` and t.exec_state in (${ args.push(search.exec_state) })`;
  }
  if (search?.exec_result != null) {
    whereQuery += ` and t.exec_result=${ args.push(search.exec_result) }`;
  }
  if (isNotEmpty(search?.exec_result_like)) {
    whereQuery += ` and t.exec_result like ${ args.push("%" + sqlLike(search?.exec_result_like) + "%") }`;
  }
  if (search?.begin_time != null) {
    if (search.begin_time[0] != null) {
      whereQuery += ` and t.begin_time>=${ args.push(search.begin_time[0]) }`;
    }
    if (search.begin_time[1] != null) {
      whereQuery += ` and t.begin_time<=${ args.push(search.begin_time[1]) }`;
    }
  }
  if (search?.end_time != null) {
    if (search.end_time[0] != null) {
      whereQuery += ` and t.end_time>=${ args.push(search.end_time[0]) }`;
    }
    if (search.end_time[1] != null) {
      whereQuery += ` and t.end_time<=${ args.push(search.end_time[1]) }`;
    }
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in (${ args.push(search.create_usr_id) })`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and t.create_usr_id_lbl in (${ args.push(search.create_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.create_usr_id_lbl_like)) {
    whereQuery += ` and t.create_usr_id_lbl like ${ args.push("%" + sqlLike(search.create_usr_id_lbl_like) + "%") }`;
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and t.update_usr_id in (${ args.push(search.update_usr_id) })`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
  }
  if (search?.update_usr_id_lbl != null) {
    whereQuery += ` and t.update_usr_id_lbl in (${ args.push(search.update_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.update_usr_id_lbl_like)) {
    whereQuery += ` and t.update_usr_id_lbl like ${ args.push("%" + sqlLike(search.update_usr_id_lbl_like) + "%") }`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time>=${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time<=${ args.push(search.update_time[1]) }`;
    }
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<CronJobLogSearch>,
  options?: {
  },
) {
  let fromQuery = `cron_cron_job_log t
  left join cron_cron_job cron_job_id_lbl on cron_job_id_lbl.id=t.cron_job_id`;
  return fromQuery;
}

// MARK: findCountCronJobLog
/** 根据条件查找定时任务日志总数 */
export async function findCountCronJobLog(
  search?: Readonly<CronJobLogSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "cron_cron_job_log";
  const method = "findCountCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return 0;
  }
  if (search && search.ids && search.ids.length === 0) {
    return 0;
  }
  // 定时任务
  if (search && search.cron_job_id != null) {
    const len = search.cron_job_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.cron_job_id.length > ${ ids_limit }`);
    }
  }
  // 执行状态
  if (search && search.exec_state != null) {
    const len = search.exec_state.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.exec_state.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select count(1) total from (select 1 from ${ await getFromQuery(args, search, options) }`;
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

// MARK: findAllCronJobLog
/** 根据搜索条件和分页查找定时任务日志列表 */
export async function findAllCronJobLog(
  search?: Readonly<CronJobLogSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<CronJobLogModel[]> {
  
  const table = "cron_cron_job_log";
  const method = "findAllCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
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
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 定时任务
  if (search && search.cron_job_id != null) {
    const len = search.cron_job_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.cron_job_id.length > ${ ids_limit }`);
    }
  }
  // 执行状态
  if (search && search.exec_state != null) {
    const len = search.exec_state.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.exec_state.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,cron_job_id_lbl.lbl cron_job_id_lbl
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  sort = sort ?? [ ];
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<CronJobLogModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  const [
    exec_stateDict, // 执行状态
  ] = await getDict([
    "cron_job_log_exec_state",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 定时任务
    model.cron_job_id_lbl = model.cron_job_id_lbl || "";
    
    // 执行状态
    let exec_state_lbl = model.exec_state as string;
    if (!isEmpty(model.exec_state)) {
      const dictItem = exec_stateDict.find((dictItem) => dictItem.val === model.exec_state);
      if (dictItem) {
        exec_state_lbl = dictItem.lbl;
      }
    }
    model.exec_state_lbl = exec_state_lbl || "";
    
    // 开始时间
    if (model.begin_time) {
      const begin_time = dayjs(model.begin_time);
      if (begin_time.isValid()) {
        model.begin_time = begin_time.format("YYYY-MM-DDTHH:mm:ss");
        model.begin_time_lbl = begin_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.begin_time_lbl = (model.begin_time || "").toString();
      }
    } else {
      model.begin_time_lbl = "";
    }
    
    // 结束时间
    if (model.end_time) {
      const end_time = dayjs(model.end_time);
      if (end_time.isValid()) {
        model.end_time = end_time.format("YYYY-MM-DDTHH:mm:ss");
        model.end_time_lbl = end_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.end_time_lbl = (model.end_time || "").toString();
      }
    } else {
      model.end_time_lbl = "";
    }
    
    // 创建时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (create_time.isValid()) {
        model.create_time = create_time.format("YYYY-MM-DDTHH:mm:ss");
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.create_time_lbl = (model.create_time || "").toString();
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (update_time.isValid()) {
        model.update_time = update_time.format("YYYY-MM-DDTHH:mm:ss");
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.update_time_lbl = (model.update_time || "").toString();
      }
    } else {
      model.update_time_lbl = "";
    }
  }
  
  return result;
}

// MARK: setIdByLblCronJobLog
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblCronJobLog(
  input: CronJobLogInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 开始时间
  if (!input.begin_time && input.begin_time_lbl) {
    const begin_time_lbl = dayjs(input.begin_time_lbl);
    if (begin_time_lbl.isValid()) {
      input.begin_time = begin_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsCronJobLog();
      throw `${ fieldComments.begin_time } 日期格式错误`;
    }
  }
  if (input.begin_time) {
    const begin_time = dayjs(input.begin_time);
    if (!begin_time.isValid()) {
      const fieldComments = await getFieldCommentsCronJobLog();
      throw `${ fieldComments.begin_time } 日期格式错误`;
    }
    input.begin_time = dayjs(input.begin_time).format("YYYY-MM-DD HH:mm:ss");
  }
  // 结束时间
  if (!input.end_time && input.end_time_lbl) {
    const end_time_lbl = dayjs(input.end_time_lbl);
    if (end_time_lbl.isValid()) {
      input.end_time = end_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsCronJobLog();
      throw `${ fieldComments.end_time } 日期格式错误`;
    }
  }
  if (input.end_time) {
    const end_time = dayjs(input.end_time);
    if (!end_time.isValid()) {
      const fieldComments = await getFieldCommentsCronJobLog();
      throw `${ fieldComments.end_time } 日期格式错误`;
    }
    input.end_time = dayjs(input.end_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    exec_stateDict, // 执行状态
  ] = await getDict([
    "cron_job_log_exec_state",
  ]);
  
  // 定时任务
  if (isNotEmpty(input.cron_job_id_lbl) && input.cron_job_id == null) {
    input.cron_job_id_lbl = String(input.cron_job_id_lbl).trim();
    const cron_jobModel = await findOneCronJob(
      {
        lbl: input.cron_job_id_lbl,
      },
      undefined,
      options,
    );
    if (cron_jobModel) {
      input.cron_job_id = cron_jobModel.id;
    }
  } else if (isEmpty(input.cron_job_id_lbl) && input.cron_job_id != null) {
    const cron_job_model = await findOneCronJob(
      {
        id: input.cron_job_id,
      },
      undefined,
      options,
    );
    if (cron_job_model) {
      input.cron_job_id_lbl = cron_job_model.lbl;
    }
  }
  
  // 执行状态
  if (isNotEmpty(input.exec_state_lbl) && input.exec_state == null) {
    const val = exec_stateDict.find((itemTmp) => itemTmp.lbl === input.exec_state_lbl)?.val;
    if (val != null) {
      input.exec_state = val as CronJobLogExecState;
    }
  } else if (isEmpty(input.exec_state_lbl) && input.exec_state != null) {
    const lbl = exec_stateDict.find((itemTmp) => itemTmp.val === input.exec_state)?.lbl || "";
    input.exec_state_lbl = lbl;
  }
  
  // 开始时间
  if (isNotEmpty(input.begin_time_lbl) && input.begin_time == null) {
    input.begin_time_lbl = String(input.begin_time_lbl).trim();
    input.begin_time = input.begin_time_lbl;
  }
  
  // 结束时间
  if (isNotEmpty(input.end_time_lbl) && input.end_time == null) {
    input.end_time_lbl = String(input.end_time_lbl).trim();
    input.end_time = input.end_time_lbl;
  }
}

// MARK: getFieldCommentsCronJobLog
/** 获取定时任务日志字段注释 */
export async function getFieldCommentsCronJobLog(): Promise<CronJobLogFieldComment> {
  const fieldComments: CronJobLogFieldComment = {
    id: "ID",
    cron_job_id: "定时任务",
    cron_job_id_lbl: "定时任务",
    exec_state: "执行状态",
    exec_state_lbl: "执行状态",
    exec_result: "执行结果",
    begin_time: "开始时间",
    begin_time_lbl: "开始时间",
    end_time: "结束时间",
    end_time_lbl: "结束时间",
    rem: "备注",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
  };
  return fieldComments;
}

// MARK: findByUniqueCronJobLog
/** 通过唯一约束获得定时任务日志列表 */
export async function findByUniqueCronJobLog(
  search0: Readonly<CronJobLogInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel[]> {
  
  const table = "cron_cron_job_log";
  const method = "findByUniqueCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search0.id) {
    const model = await findOneCronJobLog(
      {
        id: search0.id,
      },
      undefined,
      options,
    );
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: CronJobLogModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueCronJobLog(
  oldModel: Readonly<CronJobLogModel>,
  input: Readonly<CronJobLogInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueCronJobLog
/** 通过唯一约束检查 定时任务日志 是否已经存在 */
export async function checkByUniqueCronJobLog(
  input: Readonly<CronJobLogInput>,
  oldModel: Readonly<CronJobLogModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueCronJobLog(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 定时任务日志 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: CronJobLogId = await updateByIdCronJobLog(
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

// MARK: findOneCronJobLog
/** 根据条件查找第一定时任务日志 */
export async function findOneCronJobLog(
  search?: Readonly<CronJobLogSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel | undefined> {
  
  const table = "cron_cron_job_log";
  const method = "findOneCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
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
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const cron_job_log_models = await findAllCronJobLog(
    search,
    page,
    sort,
    options,
  );
  
  const cron_job_log_model = cron_job_log_models[0];
  
  return cron_job_log_model;
}

// MARK: findOneOkCronJobLog
/** 根据条件查找第一定时任务日志, 如果不存在则抛错 */
export async function findOneOkCronJobLog(
  search?: Readonly<CronJobLogSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel> {
  
  const table = "cron_cron_job_log";
  const method = "findOneOkCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
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
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const cron_job_log_models = await findAllCronJobLog(
    search,
    page,
    sort,
    options,
  );
  
  const cron_job_log_model = cron_job_log_models[0];
  
  if (!cron_job_log_model) {
    const err_msg = "此 定时任务日志 已被删除";
    throw new Error(err_msg);
  }
  
  return cron_job_log_model;
}

// MARK: findByIdCronJobLog
/** 根据 id 查找定时任务日志 */
export async function findByIdCronJobLog(
  id: CronJobLogId,
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel | undefined> {
  
  const table = "cron_cron_job_log";
  const method = "findByIdCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    return;
  }
  
  const cron_job_log_model = await findOneCronJobLog(
    {
      id,
    },
    undefined,
    options,
  );
  
  return cron_job_log_model;
}

// MARK: findByIdOkCronJobLog
/** 根据 id 查找定时任务日志, 如果不存在则抛错 */
export async function findByIdOkCronJobLog(
  id: CronJobLogId,
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel> {
  
  const table = "cron_cron_job_log";
  const method = "findByIdOkCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const cron_job_log_model = await findByIdCronJobLog(
    id,
    options,
  );
  
  if (!cron_job_log_model) {
    const err_msg = "此 定时任务日志 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return cron_job_log_model;
}

// MARK: findByIdsCronJobLog
/** 根据 ids 查找定时任务日志 */
export async function findByIdsCronJobLog(
  ids: CronJobLogId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel[]> {
  
  const table = "cron_cron_job_log";
  const method = "findByIdsCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || ids.length === 0) {
    return [ ];
  }
  
  const models = await findAllCronJobLog(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  const models2 = ids
    .map((id) => models.find((item) => item.id === id))
    .filter((item) => !!item);
  
  return models2;
}

// MARK: findByIdsOkCronJobLog
/** 根据 ids 查找定时任务日志, 出现查询不到的 id 则报错 */
export async function findByIdsOkCronJobLog(
  ids: CronJobLogId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<CronJobLogModel[]> {
  
  const table = "cron_cron_job_log";
  const method = "findByIdsOkCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const models = await findByIdsCronJobLog(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 定时任务日志 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 定时任务日志 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existCronJobLog
/** 根据搜索条件判断定时任务日志是否存在 */
export async function existCronJobLog(
  search?: Readonly<CronJobLogSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "cron_cron_job_log";
  const method = "existCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  const model = await findOneCronJobLog(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdCronJobLog
/** 根据id判断定时任务日志是否存在 */
export async function existByIdCronJobLog(
  id?: Readonly<CronJobLogId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "cron_cron_job_log";
  const method = "existByIdCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from cron_cron_job_log t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionCronJobLog
/** 校验定时任务日志是否存在 */
export async function validateOptionCronJobLog(
  model?: CronJobLogModel,
) {
  if (!model) {
    const err_msg = "定时任务日志 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateCronJobLog
/** 定时任务日志增加和修改时校验输入 */
export async function validateCronJobLog(
  input: Readonly<CronJobLogInput>,
) {
  const fieldComments = await getFieldCommentsCronJobLog();
  
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
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

// MARK: createReturnCronJobLog
/** 创建 定时任务日志 并返回 */
export async function createReturnCronJobLog(
  input: Readonly<CronJobLogInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CronJobLogModel> {
  
  const table = "cron_cron_job_log";
  const method = "createReturnCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  const model = await validateOptionCronJobLog(
    await findOneCronJobLog(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createCronJobLog
/** 创建 定时任务日志 */
export async function createCronJobLog(
  input: Readonly<CronJobLogInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CronJobLogId> {
  
  const table = "cron_cron_job_log";
  const method = "createCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

// MARK: createsReturnCronJobLog
/** 批量创建 定时任务日志 并返回 */
export async function createsReturnCronJobLog(
  inputs: CronJobLogInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CronJobLogModel[]> {
  
  const table = "cron_cron_job_log";
  const method = "createsReturnCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  const models = await findByIdsCronJobLog(ids, options);
  
  return models;
}

// MARK: createsCronJobLog
/** 批量创建 定时任务日志 */
export async function createsCronJobLog(
  inputs: CronJobLogInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CronJobLogId[]> {
  
  const table = "cron_cron_job_log";
  const method = "createsCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: CronJobLogInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CronJobLogId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "cron_cron_job_log";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: CronJobLogId[] = [ ];
  const inputs2: CronJobLogInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueCronJobLog(input, options);
    if (oldModels.length > 0) {
      let id: CronJobLogId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueCronJobLog(
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
    
    const id = shortUuidV4<CronJobLogId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into cron_cron_job_log(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,cron_job_id,exec_state,exec_result,begin_time,end_time,rem)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (!is_silent_mode) {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,${ args.push(reqDate()) }`;
        }
      } else {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,null`;
        }
      }
      if (input.update_time != null || input.update_time_save_null) {
        sql += `,${ args.push(input.update_time) }`;
      } else {
        sql += `,null`;
      }
      if (input.tenant_id == null) {
        const usr_id = await get_usr_id();
        const tenant_id = await getTenant_id(usr_id);
        if (tenant_id) {
          sql += `,${ args.push(tenant_id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.tenant_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.tenant_id) }`;
      }
      if (!is_silent_mode) {
        if (input.create_usr_id == null) {
          let usr_id = await get_usr_id();
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id, options);
            if (!usr_model) {
              usr_id = undefined;
            } else {
              usr_lbl = usr_model.lbl;
            }
          }
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
          sql += ",default";
        } else {
          let usr_id: UsrId | undefined = input.create_usr_id;
          let usr_lbl = "";
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
            usr_lbl = "";
          } else {
            usr_lbl = usr_model.lbl;
          }
          if (usr_id) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
        if (input.create_usr_id_lbl == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id_lbl) }`;
        }
      }
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.update_usr_id_lbl != null) {
        sql += `,${ args.push(input.update_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.cron_job_id != null) {
        sql += `,${ args.push(input.cron_job_id) }`;
      } else {
        sql += ",default";
      }
      if (input.exec_state != null) {
        sql += `,${ args.push(input.exec_state) }`;
      } else {
        sql += ",default";
      }
      if (input.exec_result != null) {
        sql += `,${ args.push(input.exec_result) }`;
      } else {
        sql += ",default";
      }
      if (input.begin_time != null || input.begin_time_save_null) {
        sql += `,${ args.push(input.begin_time) }`;
      } else {
        sql += ",default";
      }
      if (input.end_time != null || input.end_time_save_null) {
        sql += `,${ args.push(input.end_time) }`;
      } else {
        sql += ",default";
      }
      if (input.rem != null) {
        sql += `,${ args.push(input.rem) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  return ids2;
}

// MARK: updateTenantByIdCronJobLog
/** 定时任务日志 根据 id 修改 租户id */
export async function updateTenantByIdCronJobLog(
  id: CronJobLogId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "cron_cron_job_log";
  const method = "updateTenantByIdCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
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
    options = options ?? { };
    options.is_debug = false;
  }
  
  const tenantExist = await existByIdTenant(tenant_id, options);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update cron_cron_job_log set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdCronJobLog
/** 根据 id 修改 定时任务日志 */
export async function updateByIdCronJobLog(
  id: CronJobLogId,
  input: CronJobLogInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<CronJobLogId> {
  
  const table = "cron_cron_job_log";
  const method = "updateByIdCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
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
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    throw new Error("updateByIdCronJobLog: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdCronJobLog: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdCronJobLog(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueCronJobLog(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 定时任务日志 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdCronJobLog(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 定时任务日志 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update cron_cron_job_log set `;
  let updateFldNum = 0;
  if (input.cron_job_id != null) {
    if (input.cron_job_id != oldModel.cron_job_id) {
      sql += `cron_job_id=${ args.push(input.cron_job_id) },`;
      updateFldNum++;
    }
  }
  if (input.exec_state != null) {
    if (input.exec_state != oldModel.exec_state) {
      sql += `exec_state=${ args.push(input.exec_state) },`;
      updateFldNum++;
    }
  }
  if (input.exec_result != null) {
    if (input.exec_result != oldModel.exec_result) {
      sql += `exec_result=${ args.push(input.exec_result) },`;
      updateFldNum++;
    }
  }
  if (input.begin_time != null || input.begin_time_save_null) {
    if (input.begin_time != oldModel.begin_time) {
      sql += `begin_time=${ args.push(input.begin_time) },`;
      updateFldNum++;
    }
  }
  if (input.end_time != null || input.end_time_save_null) {
    if (input.end_time != oldModel.end_time) {
      sql += `end_time=${ args.push(input.end_time) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (input.create_time != null || input.create_time_save_null) {
    if (input.create_time != oldModel.create_time) {
      sql += `create_time=${ args.push(input.create_time) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.create_usr_id_lbl)) {
    sql += `create_usr_id_lbl=?,`;
    args.push(input.create_usr_id_lbl);
    updateFldNum++;
  }
  if (input.create_usr_id != null) {
    if (input.create_usr_id != oldModel.create_usr_id) {
      sql += `create_usr_id=${ args.push(input.create_usr_id) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        let usr_id = await get_usr_id();
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
        if (usr_lbl) {
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      } else if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
        let usr_id: UsrId | undefined = input.update_usr_id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      }
    } else {
      if (input.update_usr_id != null) {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
      if (input.update_usr_id_lbl != null) {
        sql += `update_usr_id_lbl=${ args.push(input.update_usr_id_lbl) },`;
      }
    }
    if (!is_silent_mode && !is_creating) {
      if (input.update_time != null || input.update_time_save_null) {
        sql += `update_time=${ args.push(input.update_time) },`;
      } else {
        sql += `update_time=${ args.push(reqDate()) },`;
      }
    } else if (input.update_time != null || input.update_time_save_null) {
      sql += `update_time=${ args.push(input.update_time) },`;
    }
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsCronJobLog
/** 根据 ids 删除 定时任务日志 */
export async function deleteByIdsCronJobLog(
  ids: CronJobLogId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "cron_cron_job_log";
  const method = "deleteByIdsCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdCronJobLog(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update cron_cron_job_log set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      let usr_id = await get_usr_id();
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }
      let usr_lbl = "";
      if (usr_id) {
        const usr_model = await findByIdUsr(usr_id, options);
        if (!usr_model) {
          usr_id = undefined;
        } else {
          usr_lbl = usr_model.lbl;
        }
      }
      if (usr_lbl) {
        sql += `,delete_usr_id_lbl=${ args.push(usr_lbl) }`;
      }
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
  }
  
  return affectedRows;
}

// MARK: revertByIdsCronJobLog
/** 根据 ids 还原 定时任务日志 */
export async function revertByIdsCronJobLog(
  ids: CronJobLogId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "cron_cron_job_log";
  const method = "revertByIdsCronJobLog";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOneCronJobLog(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdCronJobLog(
        id,
        options,
      );
    }
    if (!old_model) {
      continue;
    }
    {
      const input = {
        ...old_model,
        id: undefined,
      } as CronJobLogInput;
      const models = await findByUniqueCronJobLog(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 定时任务日志 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update cron_cron_job_log set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsCronJobLog
/** 根据 ids 彻底删除 定时任务日志 */
export async function forceDeleteByIdsCronJobLog(
  ids: CronJobLogId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "cron_cron_job_log";
  const method = "forceDeleteByIdsCronJobLog";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneCronJobLog(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (oldModel && !is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from cron_cron_job_log where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
