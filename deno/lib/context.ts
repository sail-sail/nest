export { defineGraphql } from "/lib/oak/gql.ts";

import { AsyncHooksContextManager } from "./async_hooks/AsyncHooksContextManager.ts";

import type {
  Redis,
  RedisConnectOptions,
} from "redis";

import type {
  Client,
  ClientConfig,
} from "./mysql/mod.ts";

import type {
  PoolConnection,
} from "./mysql/src/pool.ts";

import type {
  FieldInfo,
} from "./mysql/src/packets/parsers/result.ts";

import { Context as OakContext } from "@oak/oak";

import { getEnv } from "/lib/env.ts";
import { AUTHORIZATION } from "./auth/auth.constants.ts";

import {
  SortOrderEnum,
  type InputMaybe,
} from "../gen/types.ts";

import {
  ServiceException,
} from "./exceptions/service.exception.ts";

import {
  ConnnectionError,
} from "./mysql/src/constant/errors.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

declare global {
  interface Window {
    process: {
      env: {
        NODE_ENV: string;
      };
    };
  }
}

export type ExecuteResult = {
  affectedRows: number;
  lastInsertId: number;
  fields?: FieldInfo[];
  // deno-lint-ignore no-explicit-any
  rows?: any[];
  // deno-lint-ignore no-explicit-any
  iterator?: any;
}

/** 临时文件路径 */
// export const TMP_PATH = `${ Deno.cwd() }/tmp/`;

/** redis连接池 */
let _redisClient: Redis | undefined = undefined;
let cache_ECONNREFUSED = false;

/** 获取redis缓存连接 */
export async function redisClient() {
  if (cache_ECONNREFUSED) {
    return;
  }
  if (_redisClient) {
    return _redisClient;
  }
  const context = useMaybeContext();
  if (context && !context.cacheEnabled) {
    return;
  }
  const cacheEnable = await getEnv("cache_enable");
  if (cacheEnable !== "true") {
    return;
  }
  const hostname = await getEnv("cache_hostname") || "127.0.0.1";
  const option: RedisConnectOptions = {
    hostname,
    port: Number(await getEnv("cache_port")) || 6379,
    db: Number(await getEnv("cache_db")) || 0,
  };
  const username = await getEnv("cache_username");
  const password = await getEnv("cache_password");
  if (!isEmpty(username)) {
    option.username = username;
    option.password = password;
  }
  try {
    const {
      connect: redisConnect,
    } = await import("redis");
    _redisClient = await redisConnect(option);
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      cache_ECONNREFUSED = true;
      _redisClient = undefined;
      console.error(`redis连接失败`, option);
    } else {
      console.error(err);
    }
  }
  return _redisClient;
}

const clientMap = new Map<string, Client | undefined>();

export async function getClient(
  database_name = "",
): Promise<Client> {
  
  const {
    Client,
    configLogger,
  } = await import("./mysql/mod.ts");
  
  let client = clientMap.get(database_name);
  if (!client) {
    let database_username_key = "database";
    if (database_name) {
      database_username_key += "_" + database_name;
    }
    database_username_key += "_username";
    
    let database_password_key = "database";
    if (database_name) {
      database_password_key += "_" + database_name;
    }
    database_password_key += "_password";
    
    let database_database_key = "database";
    if (database_name) {
      database_database_key += "_" + database_name;
    }
    database_database_key += "_database";
    
    let database_socketpath_key = "database";
    if (database_name) {
      database_socketpath_key += "_" + database_name;
    }
    database_socketpath_key += "_socketpath";
    
    let database_hostname_key = "database";
    if (database_name) {
      database_hostname_key += "_" + database_name;
    }
    database_hostname_key += "_hostname";
    
    let database_port_key = "database";
    if (database_name) {
      database_port_key += "_" + database_name;
    }
    database_port_key += "_port";
    
    let database_pool_size_key = "database";
    if (database_name) {
      database_pool_size_key += "_" + database_name;
    }
    database_pool_size_key += "_pool_size";
    
    const opt: ClientConfig = {
      username: await getEnv(database_username_key),
      password: await getEnv(database_password_key),
      db: await getEnv(database_database_key),
    };
    const socketPath = await getEnv(database_socketpath_key);
    if (socketPath) {
      opt.socketPath = socketPath;
    } else {
      opt.hostname = await getEnv(database_hostname_key);
      const portStr = await getEnv(database_port_key);
      if (portStr) {
        const port = Number(portStr);
        if (port > 0) {
          opt.port = port;
        }
      }
    }
    
    const debug = await getEnv("database_debug");
    if (debug === "true") {
      configLogger({ enable: true });
    } else {
      configLogger({ enable: false });
    }
    
    opt.dateStrings = false;
    opt.bigNumberStrings = true;
    // opt.stringifyObjects = true;
    // console.log(opt);
    const poolSizeStr = await getEnv(database_pool_size_key);
    if (poolSizeStr) {
      const poolSize = Number(poolSizeStr);
      if (poolSize > 0) {
        opt.poolSize = poolSize;
      }
    }
    opt.charset = opt.charset || "utf8mb4";
    client = await new Client().connect(opt);
    clientMap.set(database_name, client);
  }
  return client;
}

let req_id = 0;

export class Context {
  
  #is_tran = false;
  #conn: PoolConnection | undefined;
  #req_id = "0";
  
  /** 不校验token是否过期, 默认校验 */
  notVerifyToken = false;
  
  /** 请求开始时间 */
  reqDate: Date;
  
  oakCtx?: OakContext;
  
  // deno-lint-ignore no-explicit-any
  cacheMap: Map<any, any> = new Map();
  
  /** 当前请求的语言 */
  lang = "zh-cn";
  
  /** token */
  authorization: string | null | undefined;
  
  /** 静默模式 */
  is_silent_mode = false;
  
  is_debug = true;
  
  /**
   * 是否处于创建模式, 默认为 false
   * 创建模式 updateById 时不自动修改 update_usr_id, update_usr_id_lbl 跟 update_time
   * 创建模式 deleteByIds 时不自动修改 delete_usr_id, delete_usr_id_lbl 跟 delete_time
   */
  is_creating: boolean | undefined;
  
  constructor(oakCtx?: OakContext) {
    this.oakCtx = oakCtx;
    const dateNow = new Date();
    this.reqDate = dateNow;
    if (req_id >= Number.MAX_SAFE_INTEGER) {
      req_id = 0;
    }
    req_id++;
    this.#req_id = req_id.toString(36);
  }
  
  get conn() {
    return this.#conn;
  }
  
  set conn(conn: PoolConnection | undefined) {
    this.#conn = conn;
  }
  
  get req_id() {
    return this.#req_id;
  }
  
  get ip() {
    const headers = this.oakCtx?.request.headers;
    const ip = headers?.get("x-real-ip");
    return ip || "127.0.0.1";
  }
  
  /**
   * 获取当前请求是否开启事务
   * @return {boolean} 
   * @memberof Context
   */
  get is_tran(): boolean {
    return this.#is_tran;
  }
  
  /**
   * 设置当前请求是否开启事务
   * @param {boolean} is_tran
   * @memberof Context
   */
  set is_tran(is_tran: boolean) {
    this.#is_tran = is_tran;
    log(`is_tran: ${ is_tran };`);
  }
  
  #cacheKey1s: string[] = [ ];
  
  get cacheKey1s() {
    return this.#cacheKey1s;
  }
  
  set cacheKey1s(val: string[]) {
    this.#cacheKey1s = val;
  }
  
  cacheEnabled = true;
  
}

export function get_is_debug(
  is_debug?: boolean,
) {
  if (is_debug != null) {
    return is_debug;
  }
  const context = useMaybeContext();
  return context?.is_debug ?? true;
}

export function get_is_silent_mode(
  is_silent_mode?: boolean,
) {
  if (is_silent_mode != null) {
    return is_silent_mode;
  }
  const context = useMaybeContext();
  return context?.is_silent_mode ?? false;
}

export function set_is_silent_mode(
  is_silent_mode: boolean,
) {
  const context = useContext();
  context.is_silent_mode = is_silent_mode;
}

export function get_is_creating(
  is_creating?: boolean,
) {
  if (is_creating != null) {
    return is_creating;
  }
  const context = useMaybeContext();
  return context?.is_creating ?? false;
}

export function set_is_creating(
  is_creating?: boolean,
) {
  const context = useContext();
  context.is_creating = is_creating;
}

export function set_is_tran(
  is_tran: boolean,
) {
  const context = useContext();
  context.is_tran = is_tran;
}

export class QueryArgs {
  
  // deno-lint-ignore no-explicit-any
  value: any[] = [ ];
  
  toJSON() {
    return this.value;
  }
  
  reset() {
    this.value = [ ];
  }
  
  toString() {
    return this.value.join(",");
  }
  
  get length() {
    return this.value.length;
  }
  
  // deno-lint-ignore no-explicit-any
  push(val: any): "?" {
    if (val instanceof Promise) {
      throw new Error(`QueryArgs.push val can not be Promise: ${ val }`);
    }
    this.value.push(val);
    return `?`;
  }
  
  concat(args: QueryArgs) {
    this.value = this.value.concat(args.value);
    return this;
  }
  
}

export function newContext(
  oakContext?: OakContext,
) {
  const context = new Context(oakContext);
  if (oakContext) {
    // deno-lint-ignore no-explicit-any
    (oakContext as any)._context = context;
  }
  return context;
}

const asyncHooksContextManager = new AsyncHooksContextManager<Context>();

asyncHooksContextManager.enable();

export function runInAsyncHooks<A extends unknown[], F extends (...args: A) => ReturnType<F>>(
  context: Context,
  fn: F,
  thisArg?: ThisParameterType<F>,
  ...args: A
): ReturnType<F> {
  return asyncHooksContextManager.run(context, fn, thisArg, ...args);
}

export function useContext() {
  return asyncHooksContextManager.active();
}

export function useMaybeContext() {
  return asyncHooksContextManager.maybeActive();
}

// deno-lint-ignore no-explicit-any
export function stringify(o: any, space?: string | number) {
  // deno-lint-ignore no-explicit-any
  let cache: any = [ ];
  const str = JSON.stringify(o, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        return `[Circular(${ key })]`;
      }
      cache.push(value);
    }
    return value;
  }, space);
  cache = null;
  return str;
}

/**
 * 打印日志
 * @param {any[]} args
 */
// deno-lint-ignore no-explicit-any
export function log(...args: any[]) {
  const context = useMaybeContext();
  if (!context) {
    console.log.apply(console, args);
    return;
  }
  // deno-lint-ignore no-explicit-any
  if ((globalThis as any).process.env.NODE_ENV !== "production") {
    args.unshift(`\u001b[90m${ context.req_id }\u001b[39m`);
    // args.unshift("\u001b[34m");
    // args.push("\u001b[39m");
    console.log.apply(console, args);
  } else {
    let str = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg instanceof Error) {
        str += arg.stack;
      } else if (typeof arg === "object") {
        str += stringify(arg);
      } else {
        str += arg;
      }
      if (i !== args.length - 1) {
        str += " ";
      }
    }
    console.log(`${ context.req_id } ${ str }`);
  }
}
  
/**
 * 打印日志
 * @param {any[]} args
 * @memberof Context
 */
// deno-lint-ignore no-explicit-any
export function error(...args: any[]) {
  const context = useMaybeContext();
  if (!context) {
    console.error.apply(console, args);
    return;
  }
  // deno-lint-ignore no-explicit-any
  if ((globalThis as any).process.env.NODE_ENV !== "production") {
    args.unshift(`\u001b[90m${ context.req_id }\u001b[39m\u001b[31m`);
    args.push(`\u001b[39m`);
    console.error.apply(console, args);
  } else {
    let str = "";
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg instanceof Error) {
        str += arg.stack;
      } else if (typeof arg === "object") {
        str += stringify(arg);
      } else {
        str += arg;
      }
      if (i !== args.length - 1) {
        str += " ";
      }
    }
    console.error(`${ context.req_id } ${ str }`);
  }
}

/**
 * 设置缓存
 * @param {string} cacheKey1
 * @param {string} cacheKey2
 * @param {*} data
 * @return {Promise<void>}
 */
export async function setCache(
  cacheKey1: string | undefined,
  cacheKey2: string | undefined,
  // deno-lint-ignore no-explicit-any
  data: any,
): Promise<void> {
  const context = useMaybeContext();
  if (!context) {
    return;
  }
  if (!context.cacheEnabled) {
    return;
  }
  if (data === undefined || !cacheKey1 || !cacheKey2) return;
  const str = JSON.stringify(data);
  const client = await redisClient();
  if (!client) return;
  await client.hset(cacheKey1, cacheKey2, str);
}

/**
 * 删除缓存
 * @param {string} cacheKey1
 * @return {Promise<void>}
 */
export async function delCache(
  cacheKey1: string,
): Promise<void> {
  const context = useMaybeContext();
  if (!context) {
    return;
  }
  if (!context.cacheEnabled) {
    return;
  }
  if (!cacheKey1) {
    return;
  }
  if (context.cacheKey1s.includes(cacheKey1)) {
    return;
  }
  context.cacheKey1s.push(cacheKey1);
  log(`delCache: ${ cacheKey1 }`);
  const client = await redisClient();
  if (!client) return;
  await client.del(cacheKey1);
  context.cacheKey1s = context.cacheKey1s.filter((item) => item !== cacheKey1);
}

/**
 * 清空整个缓存数据库
 * @return {Promise<void>}
 */
export async function clearCache(): Promise<void> {
  const context = useMaybeContext();
  if (!context) {
    return;
  }
  if (!context.cacheEnabled) {
    return;
  }
  log(`clearCache`);
  const client = await redisClient();
  if (!client) return;
  await client.flushdb();
}

/**
 * 拼装返回的resful成功协议结构
 * @param {*} data
 * @return {{ code: 0|1, data: any }}
 * @memberof Context
 */
// deno-lint-ignore no-explicit-any
export function resSuc(data: any): { code: 0, data: any } {
  return { code: 0, data };
}

/**
 * 拼装返回的resful错误协议结构
 * @param {string} msg
 * @return {{ code: 1, msg: string }}
 */
export function resErr(msg: string): { code: 1, msg: string } {
  return { code: 1, msg };
}

/**
 * 获取请求头中的 authorization
 * @returns 
 */
export function getAuthorization() {
  const context = useMaybeContext();
  if (!context) {
    return;
  }
  if (context.authorization) {
    return context.authorization;
  }
  const request = context.oakCtx?.request;
  const headers = request?.headers;
  let authorization: string|null|undefined = headers?.get(AUTHORIZATION);
  if (!authorization) {
    const searchParams = request?.url?.searchParams;
    authorization = searchParams?.get(AUTHORIZATION);
  }
  if (authorization && authorization.startsWith("Bearer ")) {
    authorization = authorization.substring(7);
  }
  context.authorization = authorization;
  return authorization;
}

/** 获取当前时间 */
export function getNow() {
  const context = useMaybeContext();
  if (!context) {
    throw new ServiceException("context is empty!");
  }
  return context.reqDate;
}

export async function getCache(
  cacheKey1: string | undefined,
  cacheKey2: string | undefined,
// deno-lint-ignore no-explicit-any
): Promise<any> {
  const context = useMaybeContext();
  if (!context) {
    return;
  }
  if (!context.cacheEnabled) {
    return;
  }
  if (!cacheKey1 || !cacheKey2) {
    return;
  }
  const client = await redisClient();
  if (!client) return;
  const str = await client.hget(cacheKey1, cacheKey2);
  if (str) {
    const data = JSON.parse(str);
    // log(`getCache: ${ cacheKey1 }: `, data);
    // log(`getCache: ${ cacheKey1 }`);
    return data;
  }
  return;
}

/**
 * 开启事务, 如果事务已经开启则直接返回数据库链接
 * @memberof Context
 */
export async function beginTran(opt?: { debug?: boolean }): Promise<PoolConnection> {
  const context = useContext();
  let conn = context.conn;
  if (conn) return conn;
  const client = await getClient();
  if (!client.pool) {
    throw new ServiceException("client pool is empty!");
  }
  conn = await client.poolConn?.pop();
  context.conn = conn;
  if (!conn) {
    throw new ServiceException("client pool conn is empty!");
  }
  if (!opt || opt.debug !== false) {
    log("beginTran;" + " /* "+ await conn.threadId() +" */");
  }
  if (conn) {
    await conn.execute("BEGIN");
  }
  return conn;
}

/**
 * 回滚事务
 * @return {Promise<void>} 
 * @memberof Context
 */
export async function rollback(conn?: PoolConnection, opt?: { debug?: boolean }): Promise<void> {
  const context = useContext();
  if (!conn) {
    conn = context.conn;
  }
  if (!conn) {
    return;
  }
  context.conn = undefined;
  if (!opt || opt.debug !== false) {
    log("rollback;" + " /* "+ await conn.threadId() +" */");
  }
  try {
    await conn.execute("rollback");
  } catch(err) {
    if (err instanceof ConnnectionError && err.message === "Connection is closed") {
      conn.close();
      context.conn = undefined;
      conn = undefined;
    }
    throw err;
  } finally {
    conn?.returnToPool();
  }
}

/**
 * 提交事务
 * @return {Promise<void>} 
 * @memberof Context
 */
export async function commit(conn?: PoolConnection, opt?: { debug?: boolean }): Promise<void> {
  const context = useContext();
  if (!conn) {
    conn = context.conn;
  }
  if (!conn) {
    return;
  }
  context.conn = undefined;
  if (!opt || opt.debug !== false) {
    log("commit;" + " /* "+ await conn.threadId() +" */");
  }
  try {
    await conn.execute("commit");
  } finally {
    conn.returnToPool();
  }
}

export async function close(context: Context) {
  if (!context) {
    context = useContext();
  }
  if (context.conn) {
    const conn = context.conn;
    context.conn = undefined;
    // conn.close();
    conn.returnToPool();
  }
  const redisCln = await redisClient();
  redisCln?.close();
  for (const client of clientMap.values()) {
    await client?.close();
  }
}

export function escapeDec(orderDec?: InputMaybe<SortOrderEnum>|"asc"|"desc") {
  if (!orderDec) return "asc";
  if (orderDec.startsWith("asc")) return "asc";
  if (orderDec.startsWith("desc")) return "desc";
  return "asc";
}

/**
 * 拼装debug用的sql语句
 * @private
 * @param {string} query
 * @param {any[]} args
 * @return {string}
 */
// deno-lint-ignore no-explicit-any
function getDebugQuery(query: string, args: any[]|undefined): string {
  let i = 0;
  const sql = query.replace(/\s+/gm, " ").replace(/\?/gm, () => {
    let val = null;
    let parameter = args && args[i];
    // deno-lint-ignore no-prototype-builtins
    if (parameter && parameter.hasOwnProperty("value")) {
      parameter = parameter.value;
    }
    const type = Object.prototype.toString.call(parameter);
    if (type === "[object Number]") {
      val = parameter;
    } else if (type === "[object String]") {
      val = `'${ parameter.replace(/'/gm, "''").replace(/\n/gm, "\\n").replace(/\r/gm, "\\r").replace(/\t/gm, "\\t") }'`;
    } else if (type === "[object Date]") {
      val = `'${ parameter }'`;
    } else if (type === "[object Object]") {
      val = `'${ JSON.stringify(parameter).replace(/'/gm, "''") }'`;
    } else if (type === "[object Boolean]") {
      val = `${ parameter ? 1 : 0 }`;
    } else if (type === "[object Null]" || type === "[object Undefined]") {
      val = `NULL`;
    } else if (type === "[object Array]") {
      val = `('${ parameter.join("','") }')`;
    } else {
      let tmpVal = parameter;
      if (tmpVal == null) {
        tmpVal = null;
      } else {
        tmpVal = parameter.toString().replace(/'/gm, "''").replace(/\n/gm, "\\n").replace(/\r/gm, "\\r").replace(/\t/gm, "\\t");
      }
      val = `'${ tmpVal }'`;
    }
    i++;
    return val;
  }).trim() + ";";
  return sql;
}

/**
 * 查询一条数据,数据不存在则返回undefined
 * @template T
 * @param {string} sql sql语句
 * @param {any[]} args? 参数
 * @param {{ debug?: boolean, logResult?: boolean }} opt?
 *   debug: 是否打印sql日志,默认为true
 *   logResult: 是否打印执行sql返回的结果,默认为true
 * @return {Promise<T>}
 */
// deno-lint-ignore no-explicit-any
export async function queryOne<T = any>(
  sql: string,
  // deno-lint-ignore no-explicit-any
  args?: any[]|QueryArgs,
  opt?: {
    debug?: boolean,
    logResult?: boolean,
    cacheKey1?: string,
    cacheKey2?: string,
  },
): Promise<T | undefined> {
  // sql = sql.trim();
  // if (sql.endsWith(";")) {
  //   sql = sql.substring(0, sql.length - 1);
  // }
  // if (/\s+limit\s+\d+$/gm.test(sql)) {
  //   sql = sql.replace(/\s+limit\s+\d+$/gm, " limit 1");
  // } else {
  //   if (/\s+LIMIT\s+\d+$/gm.test(sql)) {
  //     sql = sql.replace(/\s+LIMIT\s+\d+$/gm, " limit 1");
  //   } else {
  //     sql += " limit 1";
  //   }
  // }
  const models = await query<T>(sql, args, opt);
  return models && models[0];
}

/**
 * 数据仓库执行sql查询语句
 * @template T
 * @param {string} sql sql语句
 * @param {any[]|QueryArgs} args? 参数
 * @param {{ debug?: boolean, logResult?: boolean }} opt?
 *   debug: 是否打印sql日志,默认为true
 *   logResult: 是否打印执行sql返回的结果,默认为true
 * @return {Promise<T[]>}
 */
// deno-lint-ignore no-explicit-any
export async function query_dw<T = any>(
  sql: string,
  // deno-lint-ignore no-explicit-any
  args?: any[]|QueryArgs,
  opt?: {
    debug?: boolean,
    // logResult?: boolean,
    cacheKey1?: string,
    cacheKey2?: string,
    database_name?: string,
  },
): Promise<T[]> {
  opt = opt || { };
  opt.database_name = "dw";
  return await query<T>(sql, args, opt);
}

/**
 * 执行sql查询语句
 * @template T
 * @param {string} sql sql语句
 * @param {any[]|QueryArgs} args? 参数
 * @param {{ debug?: boolean, logResult?: boolean }} opt?
 *   debug: 是否打印sql日志,默认为true
 *   logResult: 是否打印执行sql返回的结果,默认为true
 * @return {Promise<T[]>}
 */
// deno-lint-ignore no-explicit-any
export async function query<T = any>(
  sql: string,
  // deno-lint-ignore no-explicit-any
  args?: any[]|QueryArgs,
  opt?: {
    debug?: boolean,
    // logResult?: boolean,
    cacheKey1?: string,
    cacheKey2?: string,
    database_name?: string,
  },
): Promise<T[]> {
  const context = useContext();
  if (args instanceof QueryArgs) {
    args = args.value;
  }
  // sql = sql.trim();
  // if (sql.endsWith(";")) {
  //   sql = sql.substring(0, sql.length - 1);
  // }
  let result: T[] = await getCache(opt?.cacheKey1, opt?.cacheKey2);
  if (result != null) {
    return result;
  }
  // let debugSql = "";
  try {
    if (context.is_tran) {
      const conn = await beginTran();
      // if (!opt || opt.debug !== false) {
      //   debugSql = getDebugQuery(sql, args) + " /* "+ await conn.threadId() +" */";
      //   log(debugSql);
      // }
      result = (await conn.query(sql, args) as T[]);
    } else {
      // if (!opt || opt.debug !== false) {
      //   debugSql = getDebugQuery(sql, args);
      //   log(debugSql);
      // }
      const pool = await getClient(opt?.database_name);
      result = await pool.query(sql, args, { debug: opt?.debug });
    }
  } catch (err) {
    if (err.code === "EHOSTUNREACH") {
      err.message = "连接数据库失败!";
    }
    // if (debugSql) {
    //   error(debugSql);
    // }
    throw err;
  }
  await setCache(opt?.cacheKey1, opt?.cacheKey2, result);
  // if ((!opt || opt.logResult !== false) && process.env.NODE_ENV === "production") {
  //   t.log(result);
  // }
  return result;
}

/**
 * 执行sql更新或删除语句
 * @template T
 * @param {string} sql SQL语句
 * @param {any[]|QueryArgs} args? 参数
 * @param {{ debug?: boolean, logResult?: boolean }} opt?
 * @return {Promise<ExecuteResult>}
 */
export async function execute(
  sql: string,
  // deno-lint-ignore no-explicit-any
  args?: any[]|QueryArgs,
  opt?: {
    debug?: boolean,
    logResult?: boolean,
  },
): Promise<ExecuteResult> {
  const context = useContext();
  if (args instanceof QueryArgs) {
    args = args.value;
  }
  // deno-lint-ignore no-explicit-any
  let result: any;
  try {
    if (context.is_tran) {
      const conn = await beginTran();
      if (!opt || opt.debug !== false) {
        log(getDebugQuery(sql, args) + " /* "+ await conn.threadId() +" */");
      }
      result = await conn.execute(sql, args);
    } else {
      if (!opt || opt.debug !== false) {
        log(getDebugQuery(sql, args));
      }
      const pool = await getClient();
      result = await pool.execute(sql, args);
    }
  } catch (err) {
    if (err.code === "EHOSTUNREACH") {
      error(err);
      throw "连接数据库失败!";
    }
    throw err;
  }
  if (!opt || opt.logResult !== false) {
    log(result);
  }
  return result;
}

export function reqDate() {
  const context = useContext();
  return context.reqDate;
}
