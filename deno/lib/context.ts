export { defineGraphql } from "/lib/oak/gql.ts";
import { connect as redisConnect } from "redis";
import dayjs from "dayjs";
import * as mysql2 from "mysql2/mod.ts";
import type { PoolOptions, ResultSetHeader } from "mysql2/typings/mysql/index.d.ts";
import { Context as OakContext } from "oak";

import { createPool as genericCreatePool } from "generic_pool";
import { QueryArgs } from "/lib/query_args.ts";

declare global {
  interface Window {
    process: {
      env: {
        NODE_ENV: string;
      };
    };
  }
}

let cache_ECONNREFUSED = false;

// redis连接池
const redisClientPool = genericCreatePool({
  async create() {
    if (cache_ECONNREFUSED) return;
    let client: Awaited<ReturnType<typeof redisConnect>> | undefined;
    const option = {
      hostname: Deno.env.get("cache_hostname") || "127.0.0.1",
      port: Deno.env.get("cache_port") || 6379,
      db: Number(Deno.env.get("cache_db")) || 0,
    };
    try {
      client = await redisConnect(option);
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        cache_ECONNREFUSED = true;
        console.error(`redis连接失败`, option);
      } else {
        console.error(err);
      }
    }
    return client;
  },
  async destroy(client: Awaited<ReturnType<typeof redisConnect>>) {
    await client.close();
  },
}, { max: 10, min: 0 });

let pool: mysql2.Pool;

export function getPool(): mysql2.Pool {
  if (!pool) {
    const opt: PoolOptions = {
      user: Deno.env.get("database_username"),
      database: Deno.env.get("database_database"),
      password: Deno.env.get("database_password"),
    };
    const socketPath = Deno.env.get("database_socketPath");
    if (socketPath) {
      opt.socketPath = socketPath;
    } else {
      opt.host = Deno.env.get("database_host");
      opt.port = Number(Deno.env.get("database_port"));
    }
    const waitForConnections = Deno.env.get("database_waitForConnections") === "true";
    if (waitForConnections != null) {
      opt.waitForConnections = waitForConnections;
    }
    const connectionLimit = Deno.env.get("database_connectionLimit");
    if (connectionLimit != null) {
      opt.connectionLimit = Number(connectionLimit);
    }
    const debug = Deno.env.get("database_debug") === "true";
    if (debug != null) {
      opt.debug = debug;
    }
    // const stream = Deno.env.get("database_stream") === "true";
    // if (stream != null) {
    //   opt.stream = stream;
    // }
    const dateStrings = Deno.env.get("database_dateStrings") === "true";
    if (dateStrings != null) {
      opt.dateStrings = dateStrings;
    } else {
      opt.dateStrings = true;
    }
    opt.supportBigNumbers = true;
    opt.bigNumberStrings = true;
    opt.stringifyObjects = true;
    // console.log(opt);
    pool = mysql2.createPool(opt);
  }
  return pool;
}

export class Context {
  
  #is_tran = false;
  #conn: mysql2.PoolConnection|undefined;
  #req_id = 0;
  
  reqDate: Date;
  
  oakCtx: OakContext;
  
  // deno-lint-ignore no-explicit-any
  cacheMap: Map<any, any> = new Map();
  
  constructor(oakCtx: OakContext) {
    this.oakCtx = oakCtx;
    const dateNow = new Date();
    this.reqDate = dateNow;
    this.#req_id = dateNow.getTime();
  }
  
  async getCache(
    cacheKey1: string|undefined,
    cacheKey2: string|undefined,
  // deno-lint-ignore no-explicit-any
  ): Promise<any> {
    if (!cacheKey1 || !cacheKey2) return;
    const client = await redisClientPool.acquire();
    if (!client) return;
    let str: string|undefined;
    try {
      str = await client.hget(cacheKey1, cacheKey2);
      await redisClientPool.release(client);
    } catch (err) {
      await redisClientPool.destroy(client);
      throw err;
    }
    if (str) {
      const data = JSON.parse(str);
      // t.log(`getCache: ${ cacheKey1 }: `, data);
      // t.log(`getCache: ${ cacheKey1 }`);
      return data;
    }
    return;
  }
  
  #cacheKey1s: string[] = [ ];
  
  /**
   * 设置缓存
   * @param {string} cacheKey1
   * @param {string} cacheKey2
   * @param {*} data
   * @return {Promise<void>}
   * @memberof Context
   */
  async setCache(
    cacheKey1: string|undefined,
    cacheKey2: string|undefined,
    // deno-lint-ignore no-explicit-any
    data: any,
  ): Promise<void> {
    if (data === undefined || !cacheKey1 || !cacheKey2) return;
    const str = JSON.stringify(data);
    const client = await redisClientPool.acquire();
    if (!client) return;
    try {
      await client.hset(cacheKey1, cacheKey2, str);
      await redisClientPool.release(client);
    } catch (err) {
      await redisClientPool.destroy(client);
      throw err;
    }
  }
  
  /**
   * 删除缓存
   * @param {string} cacheKey1
   * @return {Promise<void>}
   * @memberof Context
   */
  async delCache(
    cacheKey1: string,
  ): Promise<void> {
    if (!cacheKey1) return;
    if (this.#cacheKey1s.includes(cacheKey1)) {
      return;
    }
    this.#cacheKey1s.push(cacheKey1);
    this.log(`delCache: ${ cacheKey1 }`);
    const client = await redisClientPool.acquire();
    if (!client) return;
    try {
      await client.del(cacheKey1);
      await redisClientPool.release(client);
    } catch (err) {
      await redisClientPool.destroy(client);
      throw err;
    }
    this.#cacheKey1s = this.#cacheKey1s.filter((item) => item !== cacheKey1);
  }
  
  /**
   * 清空整个缓存数据库
   * @return {Promise<void>}
   * @memberof Context
   */
  async clearCache(): Promise<void> {
    this.log(`clearCache`);
    const client = await redisClientPool.acquire();
    if (!client) return;
    try {
      await client.flushdb();
      await redisClientPool.release(client);
    } catch (err) {
      await redisClientPool.destroy(client);
      throw err;
    }
  }
  
  /**
   * 拼装返回的resful成功协议结构
   * @param {*} data
   * @return {{ code: 0|1, data: any }}
   * @memberof Context
   */
  // deno-lint-ignore no-explicit-any
  resSuc(data: any): { code: 0, data: any } {
    return { code: 0, data };
  }
  
  /**
   * 拼装返回的resful错误协议结构
   * @param {string} msg
   * @return {{ code: 1, msg: string }}
   * @memberof Context
   */
  resErr(msg: string): { code: 1, msg: string } {
    return { code: 1, msg };
  }
  
  /**
   * 打印日志
   * @param {any[]} args
   * @memberof Context
   */
  // deno-lint-ignore no-explicit-any
  log(...args: any[]) {
    if (window.process.env.NODE_ENV !== "production") {
      args.unshift(`\u001b[90m${ this.#req_id }\u001b[39m`);
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
          str += this.stringify(arg);
        } else {
          str += arg;
        }
        if (i !== args.length - 1) {
          str += " ";
        }
      }
      console.log(`${ this.#req_id } ${ str }`);
    }
  }
  
  /**
   * 打印日志
   * @param {any[]} args
   * @memberof Context
   */
  // deno-lint-ignore no-explicit-any
  error(...args: any[]) {
    if (window.process.env.NODE_ENV !== "production") {
      args.unshift(`\u001b[90m${ this.#req_id }\u001b[39m\u001b[31m`);
      args.push(`\u001b[39m`);
      console.log.apply(console, args);
    } else {
      let str = "";
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg instanceof Error) {
          str += arg.stack;
        } else if (typeof arg === "object") {
          str += this.stringify(arg);
        } else {
          str += arg;
        }
        if (i !== args.length - 1) {
          str += " ";
        }
      }
      console.error(`${ this.#req_id } ${ str }`);
    }
  }
  
  // deno-lint-ignore no-explicit-any
  stringify(o: any, space?: string | number) {
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
   * 设置当前请求是否开启事务
   * @param {boolean} is_tran
   * @memberof Context
   */
  set is_tran(is_tran: boolean) {
    this.#is_tran = is_tran;
    this.log(`is_tran: ${ is_tran };`);
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
   * 开启事务, 如果事务已经开启则直接返回数据库链接
   * @memberof Context
   */
  async beginTran() {
    let conn = this.#conn;
    if (conn) return conn;
    const pool = getPool();
    conn = await pool.getConnection();
    this.#conn = conn;
    if (conn) {
      this.log("beginTran;" + " /* "+ conn.threadId +" */");
      await conn.beginTransaction();
    }
    return conn;
  }
  
  /**
   * 回滚事务
   * @return {Promise<void>} 
   * @memberof Context
   */
  async rollback(): Promise<void> {
    const conn = this.#conn;
    if (!conn) return;
    this.#conn = undefined;
    this.log("rollback;" + " /* "+ conn.threadId +" */");
    try {
      await conn.rollback();
    } finally {
      conn.release();
    }
  }
  
  /**
   * 提交事务
   * @return {Promise<void>} 
   * @memberof Context
   */
  async commit(): Promise<void> {
    const conn = this.#conn;
    if (!conn) return;
    this.#conn = undefined;
    this.log("commit;" + " /* "+ conn.threadId +" */");
    try {
      await conn.commit();
    } finally {
      conn.release();
    }
  }
  
  // deno-lint-ignore no-explicit-any
  escapeId(value: any, forbidQualified?: boolean) {
    return mysql2.escapeId(value, forbidQualified);
  }
  
  // deno-lint-ignore no-explicit-any
  escape(value: any, forbidQualified?: boolean, timeZone?: string) {
    return mysql2.escape(value, forbidQualified, timeZone);
  }
  
  escapeDec(orderDec?: string) {
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
   * @memberof Context
   */
   // deno-lint-ignore no-explicit-any
   private getDebugQuery(query: string, args: any[]|undefined): string {
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
        val = `'${ dayjs(parameter).format("YYYY-MM-DD HH:mm:ss") }'`;
      } else if (type === "[object Object]") {
        val = `'${ JSON.stringify(parameter).replace(/'/gm, "''") }'`;
      } else if (type === "[object Boolean]") {
        val = `${ parameter ? 1 : 0 }`;
      } else if (type === "[object Null]" || type === "[object Undefined]") {
        val = `NULL`;
      } else if (type === "[object Array]") {
        val = `'${ parameter.join("','") }'`;
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
  
  getReqDate() {
    return this.reqDate;
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
   * @memberof Context
   */
  // deno-lint-ignore no-explicit-any
  async queryOne<T = any>(
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
    sql = sql.trim();
    if (sql.endsWith(";")) {
      sql = sql.substring(0, sql.length - 1);
    }
    if (/\s+limit\s+\d+$/gm.test(sql)) {
      sql = sql.replace(/\s+limit\s+\d+$/gm, " limit 1");
    } else {
      if (/\s+LIMIT\s+\d+$/gm.test(sql)) {
        sql = sql.replace(/\s+LIMIT\s+\d+$/gm, " limit 1");
      } else {
        sql += " limit 1";
      }
    }
    const models = await this.query<T>(sql, args, opt);
    return models && models[0];
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
   * @memberof Context
   */
  // deno-lint-ignore no-explicit-any
  async query<T = any>(
    sql: string,
    // deno-lint-ignore no-explicit-any
    args?: any[]|QueryArgs,
    opt?: {
      debug?: boolean,
      // logResult?: boolean,
      cacheKey1?: string,
      cacheKey2?: string,
    },
  ): Promise<T[]> {
    if (args instanceof QueryArgs) {
      args = args.value;
    }
    sql = sql.trim();
    if (sql.endsWith(";")) {
      sql = sql.substring(0, sql.length - 1);
    }
    let result: T[] = await this.getCache(opt?.cacheKey1, opt?.cacheKey2);
    if (result != null) {
      return result;
    }
    // deno-lint-ignore no-explicit-any
    let result0: any;
    try {
      if (this.#is_tran) {
        const conn = await this.beginTran();
        if (!opt || opt.debug !== false) {
          this.log(this.getDebugQuery(sql, args) + " /* "+ conn.threadId +" */");
        }
        result0 = await conn.query(sql, args);
      } else {
        if (!opt || opt.debug !== false) {
          this.log(this.getDebugQuery(sql, args));
        }
        const pool = getPool();
        result0 = await pool.query(sql, args);
      }
    } catch (err) {
      if (err.code === "EHOSTUNREACH") {
        err.message = "连接数据库失败!";
      }
      throw err;
    }
    result = result0[0];
    await this.setCache(opt?.cacheKey1, opt?.cacheKey2, result);
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
   * @return {Promise<ResultSetHeader>}
   * @memberof Context
   */
  async execute(
    sql: string,
    // deno-lint-ignore no-explicit-any
    args?: any[]|QueryArgs,
    opt?: {
      debug?: boolean,
      // logResult?: boolean,
    },
  ): Promise<ResultSetHeader> {
    if (args instanceof QueryArgs) {
      args = args.value;
    }
    // deno-lint-ignore no-explicit-any
    let result: any;
    try {
      if (this.#is_tran) {
        const conn = await this.beginTran();
        if (!opt || opt.debug !== false) {
          this.log(this.getDebugQuery(sql, args) + " /* "+ conn.threadId +" */");
        }
        result = await conn.execute(sql, args);
      } else {
        if (!opt || opt.debug !== false) {
          this.log(this.getDebugQuery(sql, args));
        }
        const pool = getPool();
        result = await pool.execute(sql, args);
      }
    } catch (err) {
      if (err.code === "EHOSTUNREACH") {
        err.message = "连接数据库失败!";
      }
      throw err;
    }
    const result2 = result[0];
    // if ((!opt || opt.logResult !== false) && process.env.NODE_ENV === "production") {
    //   t.log(result2);
    // }
    return result2;
  }
  
}