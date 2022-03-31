import { createPool, Pool, PoolConnection, ResultSetHeader } from "mysql2/promise";
import config, { _PROJECT_PATH } from "../common/config";
// import { includeFtl, isEmpty as isEmpty0 } from "./util/StringUitl";
// import * as dayjs from "dayjs";
// import * as sqlstring from "sqlstring";
import { AuthModel } from "./auth/auth.constants";
// import { createClient } from "redis";
import * as Minio from "minio";
import { Readable } from "stream";
import { GraphQLError } from "graphql";
// import { shortUuidV4 } from "./util/uuid";

let shortUuidV4 = undefined;
let sqlstring = undefined;
let createClient = undefined;
let dayjs = undefined;

let pool: Pool;

const db = config.database;

export function getPool(): Pool {
  if (!pool) {
    const opt: any = {
      user: db.username,
      database: db.database,
      password: db.password,
    };
    if (db.socketPath) {
      opt.socketPath = db.socketPath;
    } else {
      opt.host = db.host;
      opt.port = db.port;
    }
    if (db.waitForConnections != null) {
      opt.waitForConnections = db.waitForConnections;
    }
    if (db.connectionLimit != null) {
      opt.connectionLimit = db.connectionLimit;
    }
    if (db.debug != null) {
      opt.debug = db.debug;
    }
    if (db.stream != null) {
      opt.stream = db.stream;
    }
    if (db.dateStrings != null) {
      opt.dateStrings = db.dateStrings;
    } else {
      opt.dateStrings = true;
    }
    pool = createPool(opt);
  }
  return pool;
}

export class Context {
  
  private is_tran: boolean = false;
  
  private conn: PoolConnection;
  
  private req_id = 0;
  
  public req: any;
  public res: any;
  
  public authModel: AuthModel;
  
  public reqDate: Date;
  
  constructor() {
    const t = this;
    const dateNow = new Date();
    t.reqDate = dateNow;
    t.req_id = dateNow.getTime();
  }
  
  private _redisClient: any;
  
  private async getCacheClient() {
    const t = this;
    if (config.cache && config.cache.type === "redis" && !t._redisClient) {
      if (!createClient) {
        createClient = require("redis").createClient;
      }
      const client = createClient(config.cache);
      client.on("error", (err: Error) => {
        console.log(err.message);
      });
      await client.connect();
      t._redisClient = client;
      return client;
    } else {
      return t._redisClient;
    }
  }
  
  
  /**
   * 读取缓存
   * @param {string} cacheKey1
   * @param {string} cacheKey2
   * @return {*} 
   * @memberof Context
   */
  async getCache(
    cacheKey1: string,
    cacheKey2: string,
  ): Promise<any> {
    const t = this;
    if (!cacheKey1 || !cacheKey2) return;
    const client = await t.getCacheClient();
    if (client) {
      const str = await client.hGet(cacheKey1, cacheKey2);
      if (str) {
        const data = JSON.parse(str);
        t.log(`getCache: ${ cacheKey1 }: `, data);
        return data;
      }
    }
    return;
  }
  
  private cacheKey1s: string[] = [ ];
  
  /**
   * 设置缓存
   * @param {string} cacheKey1
   * @param {string} cacheKey2
   * @param {*} data
   * @return {Promise<void>}
   * @memberof Context
   */
  async setCache(
    cacheKey1: string,
    cacheKey2: string,
    data: any,
  ): Promise<void> {
    const t = this;
    if (data === undefined || !cacheKey1 || !cacheKey2) return;
    const client = await t.getCacheClient();
    if (client) {
      // t.log(`setCache: ${ cacheKey1 }: `, data);
      const str = JSON.stringify(data);
      await client.hSet(cacheKey1, cacheKey2, str);
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
    const t = this;
    if (!cacheKey1) return;
    if (t.cacheKey1s.includes(cacheKey1)) {
      return;
    }
    t.cacheKey1s.push(cacheKey1);
    const client = await t.getCacheClient();
    if (client) {
      t.log(`delCache: ${ cacheKey1 }`);
      await client.del(cacheKey1);
    }
    t.cacheKey1s = t.cacheKey1s.filter((item) => item !== cacheKey1);
  }
  
  /**
   * 清空整个缓存数据库
   * @return {*}  {Promise<void>}
   * @memberof Context
   */
  async clearCache(): Promise<void> {
    const t = this;
    const client = await t.getCacheClient();
    if (client) {
      await client.flushDb();
    }
  }
  
  async shortUuidV4(): Promise<string> {
    if (!shortUuidV4) {
      shortUuidV4 = require("./util/uuid").shortUuidV4;
    }
    return shortUuidV4();
  }
  
  private _minioClient = undefined;
  
  private async getMinioClient(): Promise<typeof client> {
    const t = this;
    if (t._minioClient) return t._minioClient;
    const client = new Minio.Client({
      endPoint: config.minio.endPoint,
      port: config.minio.port || 9000,
      useSSL: false,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
    });
    const _bucketExists = await client.bucketExists(config.minio.bucket);
    if (!_bucketExists) {
      await client.makeBucket(config.minio.bucket, config.minio.region || "us-east-1");
    }
    t._minioClient = client;
    return client;
  }
  
  async minioPutObject(objectName: string, stream: Readable|Buffer|string, size?: number, metaData?: { [key: string]: any }) {
    const t = this;
    const client = await t.getMinioClient();
    const uploadedObjectInfo = await client.putObject(config.minio.bucket, objectName, stream, size, metaData);
    return uploadedObjectInfo;
  }
  
  // streamToBuffer(stream: Readable): Promise<Buffer> { 
  //   return new Promise((resolve, reject) => {
  //     let buffers = [];
  //     stream.on('error', reject);
  //     stream.on('data', (data: any) => buffers.push(data));
  //     stream.on('end', () => resolve(Buffer.concat(buffers)));
  //   });
  // }
  
  async minioGetObject(objectName: string, bucket = config.minio.bucket) {
    const t = this;
    const client = await t.getMinioClient();
    const stream = await client.getObject(bucket, objectName);
    return stream;
  }
  
  async minioDeleteObject(objectName: string, bucket = config.minio.bucket) {
    const t = this;
    const client = await t.getMinioClient();
    await client.removeObject(bucket, objectName);
  }
  
  async minioStatObject(objectName: string, bucket = config.minio.bucket) {
    const t = this;
    const client = await t.getMinioClient();
    const stat = await client.statObject(bucket, objectName);
    return stat;
  }
  
  /**
   * 拼装返回的resful成功协议结构
   * @param {*} data
   * @return {{ code: 0|1, data: any }}
   * @memberof Context
   */
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
  
  getStackTrace() {
    const t = this;
    const obj = Object.create(null);
    Error.captureStackTrace(obj, t.getStackTrace);
    return <string>obj.stack || "";
  };
  
  /**
   * 打印日志
   * @param {any[]} args
   * @memberof Context
   */
  log(...args: any[]) {
    const t = this;
    if (process.env.NODE_ENV !== "production") {
      const stack2 = [ ];
      const stack = t.getStackTrace();
      const arr = stack.split("\n");
      for (let i = 0; i < arr.length; i++) {
        let line = arr[i];
        if (!/.+(Dao|Service|Resolver|Controller)\..+/.test(line)) {
          continue;
        }
        line = line.trim();
        const arrTmp = line.replace("at async ", "at ").split(" ");
        const method = arrTmp[1];
        let ph = arrTmp[2].substring(1, arrTmp[2].length - 1);
        // const num1 = ph.substring(ph.lastIndexOf(":") + 1, ph.length);
        // ph = ph.substring(0, ph.lastIndexOf(":"));
        // const num2 = ph.substring(ph.lastIndexOf(":") + 1, ph.length);
        // ph = ph.substring(0, ph.lastIndexOf(":"));
        // ph = ph.replace(_PROJECT_PATH.replace(/\//g, "\\"), "") + ":" + num1 + ":" + num2;
        stack2.push({ method, ph });
      }
      args.unshift(t.req_id);
      let maxTnum = 0;
      for (let k = 0; k < stack2.length; k++) {
        const itemTmp = stack2[k];
        let num = itemTmp.method.length;
        if (maxTnum < num) {
          maxTnum = num;
        }
      }
      let str2 = "";
      for (let k = 0; k < stack2.length; k++) {
        const itemTmp = stack2[k];
        str2 += "\t" + itemTmp.method + " ".repeat(maxTnum - itemTmp.method.length + 1) + itemTmp.ph;
        if (k !== stack2.length - 1) {
          str2 += "\n";
        }
      }
      if (str2) {
        console.log("%c" + str2, "color: gray;");
      }
      // eslint-disable-next-line prefer-spread
      console.log.apply(console, args);
    } else {
      let str = "";
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg instanceof Error) {
          str += arg.stack;
        } else if (typeof arg === "object") {
          str += t.stringify(arg);
        } else {
          str += arg;
        }
        if (i !== args.length - 1) {
          str += " ";
        }
      }
      console.log(`${ t.req_id } ${ str }`);
    }
  }
  
  /**
   * 打印错误日志
   * @param {any[]} args
   * @memberof Context
   */
  error(...args: any[]) {
    const t = this;
    if (process.env.NODE_ENV !== "production") {
      const args2 = [ ];
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg instanceof GraphQLError) {
          if (arg.stack.startsWith("GraphQLError: ")) {
            args2.push("GraphQLError: " + arg.toString());
          } else {
            continue;
          }
        } else if (arg instanceof Error) {
          args2.push(arg.stack);
        }
      }
      if (args2.length > 0) {
        args2.unshift(t.req_id);
        // eslint-disable-next-line prefer-spread
        console.error.apply(console, args2);
      }
    } else {
      let str = "";
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg instanceof GraphQLError) {
          if (arg.stack.startsWith("GraphQLError: ")) {
            str += "GraphQLError: " + arg.toString();
          } else {
            continue;
          }
        } else if (arg instanceof Error) {
          str += arg.stack;
        } else if (typeof arg === "object") {
          str += t.stringify(arg);
        } else {
          str += arg;
        }
        if (i !== args.length - 1) {
          str += " ";
        }
      }
      if (str) {
        console.error(`${ t.req_id } ${ str }`);
      }
    }
  }
  
  stringify(o: any, space?: string | number) {
    let cache = [ ];
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
  setIs_tran(is_tran: boolean) {
    const t = this;
    t.is_tran = is_tran;
    t.log(`setIs_tran: ${ is_tran };`);
  }
  
  /**
   * 获取当前请求是否开启事务
   * @return {boolean} 
   * @memberof Context
   */
  getIs_tran(): boolean {
    const t = this;
    return t.is_tran;
  }
  
  /**
   * 开启事务, 如果事务已经开启则直接返回数据库链接
   * @return {*}  {Promise<PoolConnection>}
   * @memberof Context
   */
  async beginTran(): Promise<PoolConnection> {
    const t = this;
    let conn = t.conn;
    if (conn) return conn;
    t.log("beginTran;");
    const pool = getPool();
    conn = await pool.getConnection();
    t.conn = conn;
    await conn.beginTransaction();
    return conn;
  }
  
  /**
   * 回滚事务
   * @return {Promise<void>} 
   * @memberof Context
   */
  async rollback(): Promise<void> {
    const t = this;
    let conn = t.conn;
    if (!conn) return;
    t.log("rollback;");
    try {
      conn = await t.beginTran();
      await conn.rollback();
    } finally {
      conn.release();
    }
  }
  
  /**
   * 提交事务
   * @return {*} 
   * @memberof Context
   */
  async commit(): Promise<void> {
    const t = this;
    let conn = t.conn;
    if (!conn) return;
    t.log("commit;");
    try {
      conn = await t.beginTran();
      await conn.commit();
    } finally {
      conn.release();
    }
  }
  
  escapeId(value: any, forbidQualified?: boolean) {
    if (value == null) return value;
    if (!sqlstring) {
      sqlstring = require("sqlstring");
    }
    return sqlstring.escapeId(value, forbidQualified);
  }
  
  escape(value: any, forbidQualified?: boolean, timeZone?: string) {
    if (value == null) return value;
    if (!sqlstring) {
      sqlstring = require("sqlstring");
    }
    return sqlstring.escape(value, forbidQualified, timeZone);
  }
  
  escapeDec(orderDec: string) {
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
   * @return {*}  {string}
   * @memberof Context
   */
  private getDebugQuery(query: string, args: any[]): string {
    let i = 0;
    if (!dayjs) {
      dayjs = require("dayjs");
    }
    const sql = query.replace(/\s+/gm, " ").replace(/\?/gm, () => {
      let val = null;
      let parameter = args && args[i];
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
  
  getUsr_id(): string {
    const t = this;
    return t.authModel?.id;
  }
  
  getReqDate() {
    const t = this;
    return t.reqDate;
  }
  
  /**
   * 查询一条数据,数据不存在则返回undefined
   * @template T
   * @param {string} sql sql语句
   * @param {any[]?} [args] 参数
   * @param {{ debug?: boolean, logResult?: boolean }} [opt]
   *   debug: 是否打印sql日志,默认为true
   *   logResult: 是否打印执行sql返回的结果,默认为true
   * @return {*}  {Promise<T>}
   * @memberof Context
   */
  async queryOne<T = any>(
    sql: string,
    args?: any[],
    opt?: {
      debug?: boolean,
      logResult?: boolean,
      cacheKey1?: string,
      cacheKey2?: string,
    },
  ): Promise<T> {
    const t = this;
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
    const models = await t.query<T>(sql, args, opt);
    return models && models[0];
  }
  
  /**
   * 执行sql查询语句
   * @template T
   * @param {string} sql sql语句
   * @param {any[]?} [args] 参数
   * @param {{ debug?: boolean, logResult?: boolean }} [opt]
   *   debug: 是否打印sql日志,默认为true
   *   logResult: 是否打印执行sql返回的结果,默认为true
   * @return {*}  {Promise<T[]>}
   * @memberof Context
   */
  async query<T = any>(
    sql: string,
    args?: any[],
    opt?: { debug?: boolean, logResult?: boolean, cacheKey1?: string, cacheKey2?: string },
  ): Promise<T[]> {
    const t = this;
    sql = sql.trim();
    if (sql.endsWith(";")) {
      sql = sql.substring(0, sql.length - 1);
    }
    let result: T[] = await t.getCache(opt?.cacheKey1, opt?.cacheKey2);
    if (result != null) {
      return result;
    }
    let result0: any;
    if (t.is_tran) {
      const conn = await t.beginTran();
      if (!opt || opt.debug !== false) {
        t.log(t.getDebugQuery(sql, args));
      }
      result0 = await conn.query(sql, args);
    } else {
      if (!opt || opt.debug !== false) {
        t.log(t.getDebugQuery(sql, args));
      }
      const pool = getPool();
      result0 = await pool.query(sql, args);
    }
    result = result0[0];
    await t.setCache(opt?.cacheKey1, opt?.cacheKey2, result);
    if ((!opt || opt.logResult !== false) && process.env.NODE_ENV === "production") {
      t.log(JSON.stringify(result));
    }
    return result;
  }
  
  /**
   * 执行sql更新或删除语句
   * @template T
   * @param {string} sql SQL语句
   * @param {any[]?} [args] 参数
   * @param {{ debug?: boolean, logResult?: boolean }} [opt]
   * @return {Promise<ResultSetHeader>}
   * @memberof Context
   */
  async execute(
    sql: string,
    args?: any[],
    opt?: { debug?: boolean, logResult?: boolean },
  ): Promise<ResultSetHeader> {
    const t = this;
    let result: any;
    if (t.is_tran) {
      const conn = await t.beginTran();
      if (!opt || opt.debug !== false) {
        t.log(t.getDebugQuery(sql, args));
      }
      result = await conn.execute(sql, args);
    } else {
      if (!opt || opt.debug !== false) {
        t.log(t.getDebugQuery(sql, args));
      }
      const pool = getPool();
      result = await pool.execute(sql, args);
    }
    const result2 = result[0];
    if ((!opt || opt.logResult !== false) && process.env.NODE_ENV === "production") {
      t.log(JSON.stringify(result2));
    }
    return result2;
  }
  
  get tenant_id(): string {
    const t = this;
    return t.authModel?.tenant_id;
  }
  
  /**
   * 根据当前登录用户获取租户id
   * @return {Promise<string>} 
   * @memberof Context
   */
  async setTenant_id(): Promise<string> {
    const t = this;
    if (t.authModel?.tenant_id) {
      return t.authModel.tenant_id;
    }
    let sql = `
      select
        t.tenant_id
      from usr t
      where
        t.id = ?
      limit 1
    `;
    const args = [ t.authModel.id ];
    let table = "usr";
    
    const client = await t.getCacheClient();
    const cacheKey1 = `dao.sql.${ table }`;
    if (client) {
      const cacheKey2 = JSON.stringify({ sql, args, key: cacheKey1 });
      const str = await client.hGet(cacheKey1, cacheKey2);
      if (str) {
        // t.log(`setTenant_id.getCache: ${ str }`);
        const data = JSON.parse(str);
        t.authModel.tenant_id = data;
        return data;
      }
    }
    
    let model: { tenant_id: string } = await t.queryOne(sql, args, { debug: false, logResult: false });
    t.authModel.tenant_id = model && model.tenant_id;
    let result = t.authModel.tenant_id;
    
    if (client && result !== undefined) {
      const cacheKey2 = JSON.stringify({ sql, args, key: cacheKey1 });
      const str = JSON.stringify(result);
      // t.log(`setTenant_id.setCache: ${ str }`);
      await client.hSet(cacheKey1, cacheKey2, str);
    }
    
    return result;
  }
  
}
