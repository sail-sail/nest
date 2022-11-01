import "/lib/env.ts";
import { Context } from "../context.ts";
import { QueryArgs } from "../query_args.ts";
import { ExecuteResult } from "../mysql/mod.ts";
import { PoolConnection } from "../mysql/src/pool.ts";

let watchTimeout: number|undefined = undefined;

function getMethods(str: string) {
  const methods: {[key: string]: string} = { };
  let methodBegin = false;
  let nowMethodStr = "";
  let nowMethodName = "";
  const lineArr = str.split("\n");
  for (let i = 0; i < lineArr.length; i++) {
    const line = lineArr[i];
    if (
      !methodBegin &&
      (
        (line.startsWith("export async function") && (line.trimEnd().endsWith("{") || line.trimEnd().endsWith("(")))
        || (line.startsWith("async function") && (line.trimEnd().endsWith("{") || line.trimEnd().endsWith("(")))
      )
    ) {
      methodBegin = true;
      if (line.startsWith("export async function")) {
        nowMethodName = line.substring(
          "export async function".length,
          line.indexOf("(")
        ).trim();
      } else {
        nowMethodName = line.substring(
          "async function".length,
          line.indexOf("(")
        ).trim();
      }
    }
    if (methodBegin && line.trimEnd() === "}") {
      methodBegin = false;
      methods[nowMethodName] = nowMethodStr;
      nowMethodStr = "";
      nowMethodName = "";
    }
    if (methodBegin) {
      nowMethodStr += line + "\n";
    }
  }
  return methods;
}

const _schemaColumns: {
  [key: string]: {
    TABLE_SCHEMA: string;
    TABLE_NAME: string;
    COLUMN_NAME: string;
    IS_NULLABLE: "NO"|"YES";
  }[];
} = { };

async function getSchemaColumn(
  conn: PoolConnection,
  schema: string,
  orgTable: string,
  orgName: string,
) {
  if (_schemaColumns[schema]) {
    return _schemaColumns[schema].filter((item) => item.TABLE_SCHEMA === schema && item.TABLE_NAME === orgTable && item.COLUMN_NAME === orgName)[0];
  }
  const sql = `
    select
      t.TABLE_SCHEMA,
      t.TABLE_NAME,
      t.COLUMN_NAME,
      t.IS_NULLABLE
    from information_schema.COLUMNS t
    where
      t.table_schema = '${ schema }'
    order by t.ORDINAL_POSITION
  `;
  const result: {
    TABLE_SCHEMA: string;
    TABLE_NAME: string;
    COLUMN_NAME: string;
    IS_NULLABLE: "NO"|"YES";
  // deno-lint-ignore no-explicit-any
  }[] = (await conn.query(sql)) as any;
  _schemaColumns[schema] = result;
  return _schemaColumns[schema].filter((item) => item.TABLE_SCHEMA === schema && item.TABLE_NAME === orgTable && item.COLUMN_NAME === orgName)[0];
}

export async function createContext() {
  const context = new Context();
  context.cacheEnabled = false;
  let str: string;
  try {
    str = await Deno.readTextFile(`${ Deno.cwd() }/graphql.config.json`);
  } catch (_err) {
    str = await Deno.readTextFile(`${ Deno.cwd() }/../graphql.config.json`);
  }
  const config = JSON.parse(str);
  const authorization = config?.projects?.pc?.extensions?.endpoints?.default?.headers?.authorization;
  // deno-lint-ignore no-explicit-any
  (context as any).oakCtx = context.oakCtx || { };
  // deno-lint-ignore no-explicit-any
  (context.oakCtx as any).request = context.oakCtx?.request || { };
  // deno-lint-ignore no-explicit-any
  (context.oakCtx as any).request.headers = context.oakCtx?.request?.headers || { };
  // deno-lint-ignore no-explicit-any
  (context.oakCtx as any).request.headers.get = (key: string) => {
    if (key.toLowerCase() === "authorization") {
      return authorization;
    }
  }
  return context;
}

export async function handelChg(context?: Context, filenames: string[] = []) {
  let isInnerContext = false;
  if (!context) {
    isInnerContext = true;
    context = await createContext();
  }
  let hasErr = false;
  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];
    if (!filename.endsWith(".dao.ts")) {
      continue;
    }
    // deno-lint-ignore no-explicit-any
    let dao: any;
    try {
      dao = await import("file:///" + filename);
    // deno-lint-ignore no-empty
    } catch (_err) {
    }
    if (!dao) {
      continue;
    }
    const str = await Deno.readTextFile(filename);
    let str2 = str;
    const methods = getMethods(str);
    const keys = Object.keys(methods);
    for (let j = 0; j < keys.length; j++) {
      const methodName = keys[j];
      let methodFn = dao[methodName];
      if (!methodFn && methodName.startsWith("_")) {
        methodFn = dao[methodName.substring(1, methodName.length)];
      }
      if (!methodFn && methodName.endsWith("_")) {
        methodFn = dao[methodName.substring(0, methodName.length - 1)];
      }
      if (!methodFn) {
        continue;
      }
      const methodStr = methods[methodName];
      let methodStr2 = methodStr;
      methodStr2 = methodStr2.replace(/await context.query<\{[\s\S]*?\}>\(/gmi, "await context.query(");
      methodStr2 = methodStr2.replace(/await context.queryOne<\{[\s\S]*?}\>\(/gmi, "await context.queryOne(");
      let idx = methodStr2.lastIndexOf("await context.query(");
      let idxOne = methodStr2.lastIndexOf("await context.queryOne(");
      if (idx > 0 || idxOne > 0) {
        const oldQuery = context.query;
        let typeArr: {
          name: string,
          type: string,
          schema: string,
          orgName: string,
          orgTable: string,
          IS_NULLABLE: "NO"|"YES";
        }[] = [];
        context.query = async function(
          sql: string,
          // deno-lint-ignore no-explicit-any
          args?: any[]|QueryArgs,
          opt?: { debug?: boolean },
        // deno-lint-ignore no-explicit-any
        ): Promise<any> {
          if (args instanceof QueryArgs) {
            args = args.value;
          }
          opt = opt || { };
          opt.debug = false;
          sql = sql.trim();
          if (sql.endsWith(";")) {
            sql = sql.substring(0, sql.length - 1);
          }
          if (sql.startsWith("select") || sql.startsWith("SELECT")) {
            typeArr = [];
            if (/\s+limit\s+\d+$/gm.test(sql)) {
              sql = sql.replace(/\s+limit\s+\d+$/gm, " limit 0");
            } else {
              if (/\s+LIMIT\s+\d+$/gm.test(sql)) {
                sql = sql.replace(/\s+LIMIT\s+\d+$/gm, " limit 0");
              } else {
                sql += " limit 0";
              }
            }
            // console.log(`类型 ${ methodName }: ${ sql }`);
            const conn = await context?.beginTran({ debug: false });
            let result: ExecuteResult|undefined = undefined;
            try {
              result = await conn?.execute(sql, args);
              const fileds = result?.fields || [ ];
              for (let i = 0; i < fileds.length; i++) {
                const field = fileds[i];
                let type = "string";
                const columnType = field.fieldType;
                if (columnType === 0x01 || columnType === 0x02 || columnType === 0x03 || columnType === 0x04 || columnType === 0x05 || columnType === 0x08 || columnType === 0x09 || columnType === 0x10 || columnType === 0xf6) {
                  type = "number";
                } else if (columnType === 0x06) {
                  type = "null";
                } else if (columnType === 0x07 || columnType === 0x0a || columnType === 0x0b || columnType === 0x0c || columnType === 0x0d || columnType === 0x0e) {
                  type = "string";
                } else if (columnType === 0x0f || columnType === 0x00 || columnType === 0x08 || columnType === 0x0f || columnType === 0xf6 || columnType === 0xf7 || columnType === 0xf8 || columnType === 0xfd || columnType === 0xfe || columnType === 0xff) {
                  type = "string";
                } else if (columnType === 0xf5) {
                  type = "any";
                } else if (columnType === 0xf9 || columnType === 0xfa || columnType === 0xfb || columnType === 0xfc) {
                  type = "Buffer";
                } else {
                  type = "string";
                }
                if (!field) continue;
                if (field.name.startsWith("is_")) {
                  type = "0|1";
                }
                const colInfo = await getSchemaColumn(conn!, field.schema, field.originTable, field.originName);
                let IS_NULLABLE: "NO"|"YES" = "NO";
                if (colInfo && colInfo.IS_NULLABLE) {
                  IS_NULLABLE = colInfo.IS_NULLABLE;
                }
                typeArr.push({
                  name: field.name,
                  type,
                  schema: field.schema,
                  orgName: field.originName,
                  orgTable: field.originTable,
                  IS_NULLABLE,
                });
              }
            } finally {
              await context?.rollback(conn, { debug: false });
            }
            return result?.rows || [ ];
          }
          return [ ];
        }
        try {
          let method = dao[methodName];
          if (!method && methodName.startsWith("_")) {
            method = dao[methodName.substring(1, methodName.length)];
          }
          if (!method && methodName.endsWith("_")) {
            method = dao[methodName.substring(0, methodName.length - 1)];
          }
          if (!method) {
            continue;
          }
          await method(context);
          context.query = oldQuery;
        } catch (err) {
          context.query = oldQuery;
          hasErr = true;
          console.error(err);
          continue;
        }
        if (typeArr) {
          let typeStr = "{\n";
          for (let i = 0; i < typeArr.length; i++) {
            const item = typeArr[i];
            typeStr += `    ${ item.name }${ item.IS_NULLABLE === "YES" ? "?" : "" }: ${ item.type },\n`;
          }
          typeStr += "  }";
          idx = methodStr2.lastIndexOf("await context.query(");
          idxOne = methodStr2.lastIndexOf("await context.queryOne(");
          if (idx > 0) {
            const str1 = methodStr2.substring(0, idx);
            const str2 = methodStr2.substring(idx + "await context.query(".length);
            methodStr2 = `${ str1 }await context.query<${ typeStr }>(${ str2 }`;
          } else if (idxOne > 0) {
            const str1 = methodStr2.substring(0, idxOne);
            const str2 = methodStr2.substring(idxOne + "await context.queryOne(".length);
            methodStr2 = `${ str1 }await context.queryOne<${ typeStr }>(${ str2 }`;
          }
          str2 = str2.replace(methodStr, methodStr2);
        }
      } else {
        const oldQuery = context.query;
        context.query = async function(
          sql: string,
          // deno-lint-ignore no-explicit-any
          args?: any[]|QueryArgs,
          opt?: { debug?: boolean },
        // deno-lint-ignore no-explicit-any
        ): Promise<any> {
          if (args instanceof QueryArgs) {
            args = args.value;
          }
          opt = opt || { };
          opt.debug = false;
          sql = sql.trim();
          if (sql.endsWith(";")) {
            sql = sql.substring(0, sql.length - 1);
          }
          if (sql.startsWith("select") || sql.startsWith("SELECT")) {
            if (/\s+limit\s+\d+$/gm.test(sql)) {
              sql = sql.replace(/\s+limit\s+\d+$/gm, " limit 0");
            } else {
              if (/\s+LIMIT\s+\d+$/gm.test(sql)) {
                sql = sql.replace(/\s+LIMIT\s+\d+$/gm, " limit 0");
              } else {
                sql += " limit 0";
              }
            }
            let result: ExecuteResult|undefined = undefined;
            const conn = await context?.beginTran({ debug: false });
            try {
              result = await conn?.execute(sql, args);
            } catch (errTmp) {
              // console.log(`sql错误 ${ methodName }: ${ sql }`);
              throw errTmp;
            } finally {
              await context?.rollback(conn, { debug: false });
            }
            return result?.rows || [ ];
          }
        }
        try {
          const method = dao[methodName];
          if (!method) {
            continue;
          }
          await method(context);
          context.query = oldQuery;
        } catch (err) {
          context.query = oldQuery;
          hasErr = true;
          console.error("sql错误: " + methodName + ": " + err.message);
          // console.error("methodName: " + methodName);
          continue;
        }
      }
      if (str2 && str !== str2) {
        await Deno.writeFile(filename, new TextEncoder().encode(str2));
      }
    }
    if (isInnerContext) {
      await context.close();
    }
    if (!hasErr) {
      console.log("sql检查成功:", filenames.join("\n"));
    } else {
      // console.log("sql错误:", filenames.join("\n"));
    }
  }
}

let watcher: Deno.FsWatcher|undefined = undefined;

export async function hmr() {
  if (watcher) {
    watcher.close();
  }
  const context = await createContext();
  let filenames: string[] = [ ];
  watcher = Deno.watchFs([
    `${ Deno.cwd() }/src`,
    `${ Deno.cwd() }/client`,
  ], { recursive: true });
  for await (const event of watcher) {
    for (let i = 0; i < event.paths.length; i++) {
      const file = event.paths[i];
      if (filenames.includes(file)) {
        continue;
      }
      filenames.push(file);
    }
    if (watchTimeout) {
      clearTimeout(watchTimeout);
    }
    watchTimeout = setTimeout(function() {
      handelChg(context, filenames);
      filenames = [ ];
    }, 20);
  }
}
// await hmr();

if (import.meta.main) {
  let filenamesStr = Deno.env.get("hmr_filenames") || "";
  if (!filenamesStr) {
    for (let i = 0; i < Deno.args.length; i++) {
      const item = Deno.args[i];
      if (item.startsWith("--hmr_filenames=")) {
        const value = item.replace(/^--hmr_filenames=/, "");
        if (value) {
          filenamesStr = value;
        }
      }
    }
  }
  const filenames = filenamesStr.split(",");
  if (filenames.length > 0) {
    handelChg(await createContext(), filenames);
  }
}
