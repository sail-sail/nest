// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import sqlstring from "sqlstring";

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

import { ServiceException } from "/lib/exceptions/service.exception.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  InputMaybe,
  PageInput,
  SortInput,
  ServerLogLevel,
} from "/gen/types.ts";

import {
  getPagePathServerLog,
  getTableNameServerLog,
} from "./server_log.model.ts";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<ServerLogSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += " 1=1"
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.log_date != null) {
    if (search.log_date[0] != null) {
      whereQuery += ` and t.log_date>=${ args.push(search.log_date[0]) }`;
    }
    if (search.log_date[1] != null) {
      whereQuery += ` and t.log_date<=${ args.push(search.log_date[1]) }`;
    }
  }
  if (search?.log_time != null) {
    if (search.log_time[0] != null) {
      whereQuery += ` and t.log_time>=${ args.push(search.log_time[0]) }`;
    }
    if (search.log_time[1] != null) {
      whereQuery += ` and t.log_time<=${ args.push(search.log_time[1]) }`;
    }
  }
  if (search?.level != null) {
    whereQuery += ` and t.level in (${ args.push(search.level) })`;
  }
  if (search?.module != null) {
    whereQuery += ` and t.module=${ args.push(search.module) }`;
  }
  if (isNotEmpty(search?.module_like)) {
    whereQuery += ` and t.module like ${ args.push("%" + sqlLike(search?.module_like) + "%") }`;
  }
  if (search?.req_id != null) {
    whereQuery += ` and t.req_id=${ args.push(search.req_id) }`;
  }
  if (isNotEmpty(search?.req_id_like)) {
    whereQuery += ` and t.req_id like ${ args.push("%" + sqlLike(search?.req_id_like) + "%") }`;
  }
  if (search?.content != null) {
    whereQuery += ` and t.content=${ args.push(search.content) }`;
  }
  if (isNotEmpty(search?.content_like)) {
    whereQuery += ` and t.content like ${ args.push("%" + sqlLike(search?.content_like) + "%") }`;
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<ServerLogSearch>,
  options?: {
  },
) {
  let fromQuery = `base_server_log t`;
  return fromQuery;
}

// MARK: findCountServerLog
/** 根据条件查找系统日志总数 */
export async function findCountServerLog(
  search?: Readonly<ServerLogSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameServerLog();
  const method = "findCountServerLog";
  
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
  // 日志级别
  if (search && search.level != null) {
    const len = search.level.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.level.length > ${ ids_limit }`);
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

// MARK: findAllServerLog
/** 根据搜索条件和分页查找系统日志列表 */
export async function findAllServerLog(
  search?: Readonly<ServerLogSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<ServerLogModel[]> {
  
  const table = getTableNameServerLog();
  const method = "findAllServerLog";
  
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
  // 日志级别
  if (search && search.level != null) {
    const len = search.level.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.level.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
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
    prop: "log_time",
    order: SortOrderEnum.Desc,
  });
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<ServerLogModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  if (page?.isResultLimit !== false) {
    let find_all_result_limit = Number(getParsedEnv("server_find_all_result_limit")) || 1000;
    const len = result.length;
    if (len > find_all_result_limit) {
      throw new Error(`结果集过大, 超过 ${ find_all_result_limit }`);
    }
  }
  
  const [
    levelDict, // 日志级别
  ] = await getDict([
    "server_log_level",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 日志日期
    if (model.log_date) {
      const log_date = dayjs(model.log_date);
      if (log_date.isValid()) {
        model.log_date = log_date.format("YYYY-MM-DDTHH:mm:ss");
        model.log_date_lbl = log_date.format("YYYY-MM-DD");
      } else {
        model.log_date_lbl = (model.log_date || "").toString();
      }
    } else {
      model.log_date_lbl = "";
    }
    
    // 日志时间
    if (model.log_time) {
      const log_time = dayjs(model.log_time);
      if (log_time.isValid()) {
        model.log_time = log_time.format("YYYY-MM-DDTHH:mm:ss");
        model.log_time_lbl = log_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.log_time_lbl = (model.log_time || "").toString();
      }
    } else {
      model.log_time_lbl = "";
    }
    
    // 日志级别
    let level_lbl = model.level as string;
    if (!isEmpty(model.level)) {
      const dictItem = levelDict.find((dictItem) => dictItem.val === model.level);
      if (dictItem) {
        level_lbl = dictItem.lbl;
      }
    }
    model.level_lbl = level_lbl || "";
  }
  
  return result;
}

// MARK: setIdByLblServerLog
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblServerLog(
  input: ServerLogInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 日志日期
  if (!input.log_date && input.log_date_lbl) {
    const log_date_lbl = dayjs(input.log_date_lbl);
    if (log_date_lbl.isValid()) {
      input.log_date = log_date_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsServerLog();
      throw `${ fieldComments.log_date } 日期格式错误`;
    }
  }
  if (input.log_date) {
    const log_date = dayjs(input.log_date);
    if (!log_date.isValid()) {
      const fieldComments = await getFieldCommentsServerLog();
      throw `${ fieldComments.log_date } 日期格式错误`;
    }
    input.log_date = dayjs(input.log_date).format("YYYY-MM-DD HH:mm:ss");
  }
  // 日志时间
  if (!input.log_time && input.log_time_lbl) {
    const log_time_lbl = dayjs(input.log_time_lbl);
    if (log_time_lbl.isValid()) {
      input.log_time = log_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsServerLog();
      throw `${ fieldComments.log_time } 日期格式错误`;
    }
  }
  if (input.log_time) {
    const log_time = dayjs(input.log_time);
    if (!log_time.isValid()) {
      const fieldComments = await getFieldCommentsServerLog();
      throw `${ fieldComments.log_time } 日期格式错误`;
    }
    input.log_time = dayjs(input.log_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    levelDict, // 日志级别
  ] = await getDict([
    "server_log_level",
  ]);
  
  // 日志日期
  if (isNotEmpty(input.log_date_lbl) && input.log_date == null) {
    input.log_date_lbl = String(input.log_date_lbl).trim();
    input.log_date = input.log_date_lbl;
  }
  
  // 日志时间
  if (isNotEmpty(input.log_time_lbl) && input.log_time == null) {
    input.log_time_lbl = String(input.log_time_lbl).trim();
    input.log_time = input.log_time_lbl;
  }
  
  // 日志级别
  if (isNotEmpty(input.level_lbl) && input.level == null) {
    const val = levelDict.find((itemTmp) => itemTmp.lbl === input.level_lbl)?.val;
    if (val != null) {
      input.level = val as ServerLogLevel;
    }
  } else if (isEmpty(input.level_lbl) && input.level != null) {
    const lbl = levelDict.find((itemTmp) => itemTmp.val === input.level)?.lbl || "";
    input.level_lbl = lbl;
  }
}

// MARK: getFieldCommentsServerLog
/** 获取系统日志字段注释 */
export async function getFieldCommentsServerLog(): Promise<ServerLogFieldComment> {
  const field_comments: ServerLogFieldComment = {
    id: "ID",
    log_date: "日志日期",
    log_date_lbl: "日志日期",
    log_time: "日志时间",
    log_time_lbl: "日志时间",
    level: "日志级别",
    level_lbl: "日志级别",
    module: "模块",
    req_id: "请求ID",
    content: "日志内容",
  };
  
  return field_comments;
}

// MARK: findByUniqueServerLog
/** 通过唯一约束获得系统日志列表 */
export async function findByUniqueServerLog(
  search0: Readonly<ServerLogInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel[]> {
  
  const table = getTableNameServerLog();
  const method = "findByUniqueServerLog";
  
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
    const model = await findOneServerLog(
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
  const models: ServerLogModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueServerLog(
  oldModel: Readonly<ServerLogModel>,
  input: Readonly<ServerLogInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueServerLog
/** 通过唯一约束检查 系统日志 是否已经存在 */
export async function checkByUniqueServerLog(
  input: Readonly<ServerLogInput>,
  oldModel: Readonly<ServerLogModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueServerLog(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("系统日志 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: ServerLogId = await updateByIdServerLog(
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

// MARK: findOneServerLog
/** 根据条件查找第一系统日志 */
export async function findOneServerLog(
  search?: Readonly<ServerLogSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel | undefined> {
  
  const table = getTableNameServerLog();
  const method = "findOneServerLog";
  
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
  
  const server_log_models = await findAllServerLog(
    search,
    page,
    sort,
    options,
  );
  
  const server_log_model = server_log_models[0];
  
  return server_log_model;
}

// MARK: findOneOkServerLog
/** 根据条件查找第一系统日志, 如果不存在则抛错 */
export async function findOneOkServerLog(
  search?: Readonly<ServerLogSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel> {
  
  const table = getTableNameServerLog();
  const method = "findOneOkServerLog";
  
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
  
  const server_log_models = await findAllServerLog(
    search,
    page,
    sort,
    options,
  );
  
  const server_log_model = server_log_models[0];
  
  if (!server_log_model) {
    const err_msg = "此 系统日志 已被删除";
    throw new Error(err_msg);
  }
  
  return server_log_model;
}

// MARK: findByIdServerLog
/** 根据 id 查找系统日志 */
export async function findByIdServerLog(
  id: ServerLogId,
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel | undefined> {
  
  const table = getTableNameServerLog();
  const method = "findByIdServerLog";
  
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
  
  const server_log_model = await findOneServerLog(
    {
      id,
    },
    undefined,
    options,
  );
  
  return server_log_model;
}

// MARK: findByIdOkServerLog
/** 根据 id 查找系统日志, 如果不存在则抛错 */
export async function findByIdOkServerLog(
  id: ServerLogId,
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel> {
  
  const table = getTableNameServerLog();
  const method = "findByIdOkServerLog";
  
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
  
  const server_log_model = await findByIdServerLog(
    id,
    options,
  );
  
  if (!server_log_model) {
    const err_msg = "此 系统日志 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return server_log_model;
}

// MARK: findByIdsServerLog
/** 根据 ids 查找系统日志 */
export async function findByIdsServerLog(
  ids: ServerLogId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel[]> {
  
  const table = getTableNameServerLog();
  const method = "findByIdsServerLog";
  
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
  
  const models = await findAllServerLog(
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

// MARK: findByIdsOkServerLog
/** 根据 ids 查找系统日志, 出现查询不到的 id 则报错 */
export async function findByIdsOkServerLog(
  ids: ServerLogId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<ServerLogModel[]> {
  
  const table = getTableNameServerLog();
  const method = "findByIdsOkServerLog";
  
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
  
  const models = await findByIdsServerLog(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 系统日志 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 系统日志 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existServerLog
/** 根据搜索条件判断系统日志是否存在 */
export async function existServerLog(
  search?: Readonly<ServerLogSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameServerLog();
  const method = "existServerLog";
  
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
  const model = await findOneServerLog(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdServerLog
/** 根据id判断系统日志是否存在 */
export async function existByIdServerLog(
  id?: Readonly<ServerLogId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameServerLog();
  const method = "existByIdServerLog";
  
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
  const sql = `select 1 e from base_server_log t where t.id=${ args.push(id) } limit 1`;
  
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

// MARK: validateOptionServerLog
/** 校验系统日志是否存在 */
export async function validateOptionServerLog(
  model?: ServerLogModel,
) {
  if (!model) {
    const err_msg = "系统日志 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateServerLog
/** 系统日志增加和修改时校验输入 */
export async function validateServerLog(
  input: Readonly<ServerLogInput>,
) {
  const fieldComments = await getFieldCommentsServerLog();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 模块
  await validators.chars_max_length(
    input.module,
    255,
    fieldComments.module,
  );
  
  // 请求ID
  await validators.chars_max_length(
    input.req_id,
    45,
    fieldComments.req_id,
  );
  
}

// MARK: createReturnServerLog
/** 创建 系统日志 并返回 */
export async function createReturnServerLog(
  input: Readonly<ServerLogInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ServerLogModel> {
  
  const table = getTableNameServerLog();
  const method = "createReturnServerLog";
  
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
  
  const model = await validateOptionServerLog(
    await findOneServerLog(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createServerLog
/** 创建 系统日志 */
export async function createServerLog(
  input: Readonly<ServerLogInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ServerLogId> {
  
  const table = getTableNameServerLog();
  const method = "createServerLog";
  
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

// MARK: createsReturnServerLog
/** 批量创建 系统日志 并返回 */
export async function createsReturnServerLog(
  inputs: ServerLogInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ServerLogModel[]> {
  
  const table = getTableNameServerLog();
  const method = "createsReturnServerLog";
  
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
  
  const models = await findByIdsServerLog(ids, options);
  
  return models;
}

// MARK: createsServerLog
/** 批量创建 系统日志 */
export async function createsServerLog(
  inputs: ServerLogInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ServerLogId[]> {
  
  const table = getTableNameServerLog();
  const method = "createsServerLog";
  
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
  inputs: ServerLogInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ServerLogId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNameServerLog();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: ServerLogId[] = [ ];
  const inputs2: ServerLogInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueServerLog(input, options);
    if (oldModels.length > 0) {
      let id: ServerLogId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueServerLog(
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
    
    const id = shortUuidV4<ServerLogId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into base_server_log(id,log_date,log_time,level,module,req_id,content)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (input.log_date != null) {
        sql += `,${ args.push(input.log_date) }`;
      } else {
        sql += ",default";
      }
      if (input.log_time != null) {
        sql += `,${ args.push(input.log_time) }`;
      } else {
        sql += ",default";
      }
      if (input.level != null) {
        sql += `,${ args.push(input.level) }`;
      } else {
        sql += ",default";
      }
      if (input.module != null) {
        sql += `,${ args.push(input.module) }`;
      } else {
        sql += ",default";
      }
      if (input.req_id != null) {
        sql += `,${ args.push(input.req_id) }`;
      } else {
        sql += ",default";
      }
      if (input.content != null) {
        sql += `,${ args.push(input.content) }`;
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

// MARK: updateByIdServerLog
/** 根据 id 修改 系统日志 */
export async function updateByIdServerLog(
  id: ServerLogId,
  input: ServerLogInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<ServerLogId> {
  
  const table = getTableNameServerLog();
  const method = "updateByIdServerLog";
  
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
    throw new Error("updateByIdServerLog: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdServerLog: input cannot be null");
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueServerLog(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "系统日志 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdServerLog(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 系统日志 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update base_server_log set `;
  let updateFldNum = 0;
  if (input.log_date != null) {
    if (input.log_date != oldModel.log_date) {
      sql += `log_date=${ args.push(input.log_date) },`;
      updateFldNum++;
    }
  }
  if (input.log_time != null) {
    if (input.log_time != oldModel.log_time) {
      sql += `log_time=${ args.push(input.log_time) },`;
      updateFldNum++;
    }
  }
  if (input.level != null) {
    if (input.level != oldModel.level) {
      sql += `level=${ args.push(input.level) },`;
      updateFldNum++;
    }
  }
  if (input.module != null) {
    if (input.module != oldModel.module) {
      sql += `module=${ args.push(input.module) },`;
      updateFldNum++;
    }
  }
  if (input.req_id != null) {
    if (input.req_id != oldModel.req_id) {
      sql += `req_id=${ args.push(input.req_id) },`;
      updateFldNum++;
    }
  }
  if (input.content != null) {
    if (input.content != oldModel.content) {
      sql += `content=${ args.push(input.content) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    if (sqlSetFldNum > 0) {
      const is_debug = getParsedEnv("database_debug_sql") === "true";
      await execute(
        sql,
        args,
        {
          debug: is_debug,
        },
      );
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: updateByIdServerLog
/** 根据 id 更新系统日志, 并返回更新后的数据 */
export async function updateByIdReturnServerLog(
  id: ServerLogId,
  input: ServerLogInput,
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<ServerLogModel> {
  
  await updateByIdServerLog(
    id,
    input,
    options,
  );
  
  const model = await findByIdServerLog(
    id,
    options,
  );
  
  if (!model) {
    throw new Error(`系统日志 不存在`);
  }
  
  return model;
}

// MARK: deleteByIdsServerLog
/** 根据 ids 删除 系统日志 */
export async function deleteByIdsServerLog(
  ids: ServerLogId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameServerLog();
  const method = "deleteByIdsServerLog";
  
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const oldModels = await findByIdsOkServerLog(ids, options);
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = oldModels[i];
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from base_server_log where id=${ args.push(id) } limit 1`;
    const res = await execute(
      sql,
      args,
      {
        debug: is_debug_sql,
      },
    );
    affectedRows += res.affectedRows;
  }
  
  return affectedRows;
}
