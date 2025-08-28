import {
  log,
  QueryArgs,
} from "./context.ts";

import {
  getEnv,
} from "./env.ts";

import sqlstring from "sqlstring";
import Decimal from "decimal.js";

let _tsdbUrl: string | undefined = undefined;

async function getTsdbUrl(): Promise<string> {
  
  if (_tsdbUrl) {
    return _tsdbUrl;
  }
  
  const database_tsdb_type = await getEnv("database_tsdb_type");
  const database_tsdb_protocol = await getEnv("database_tsdb_protocol");
  const database_tsdb_hostname = await getEnv("database_tsdb_hostname");
  const database_tsdb_port = await getEnv("database_tsdb_port");
  const database_tsdb_username = await getEnv("database_tsdb_username");
  const database_tsdb_password = await getEnv("database_tsdb_password");
  const database_tsdb_database = await getEnv("database_tsdb_database");
  
  if (database_tsdb_type !== "cnosdb") {
    throw new Error("Only cnosdb is supported");
  }
  
  const url = `${
    database_tsdb_protocol
  }://${
    encodeURIComponent(database_tsdb_username)
  }:${
    encodeURIComponent(database_tsdb_password)
  }@${
    database_tsdb_hostname
  }:${
    database_tsdb_port
  }/api/v1/sql?db=${
    encodeURIComponent(database_tsdb_database)
  }`;
  
  _tsdbUrl = url;
  
  log("tsdb URL: " + url);
  
  return url;
}

/**
 * 时序数据库执行sql更新或删除语句
 */
export async function executeTs<T extends any>(
  sql: string,
  // deno-lint-ignore no-explicit-any
  args?: any[] | QueryArgs,
  opt?: {
    debug?: boolean,
    logResult?: boolean,
  },
): Promise<T> {
  
  const data = await queryTs<T>(sql, args, opt);
  
  return data;
}

/**
 * 时序数据库执行 sql
 */
export async function queryTs<T extends any>(
  sql: string,
  // deno-lint-ignore no-explicit-any
  args?: any[] | QueryArgs,
  opt?: {
    debug?: boolean,
    logResult?: boolean,
  },
): Promise<T> {
  
  if (args instanceof QueryArgs) {
    args = args.value;
  }
  
  // Decimal 转换成 string
  if (args) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] instanceof Decimal) {
        args[i] = args[i].toString();
      }
    }
  }
  
  sql = sqlstring.format(sql, args);
  
  if (opt?.debug !== false) {
    log(sql);
  }
  
  const url = await getTsdbUrl();
  
  const res = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
      body: sql,
    },
  );
  
  const text = await res.text();
  
  if (opt?.logResult) {
    log(text);
  }
  
  if (!res.ok) {
    throw new Error(
      `CnosDB execute failed: ${res.status} ${res.statusText} - ${text}`,
    );
  }
  
  let data: T;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`CnosDB execute failed: ${text}`);
  }
  
  return data;
}
