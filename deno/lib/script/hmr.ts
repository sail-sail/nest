import "/lib/env.ts";
import { Context } from "/lib/context.ts";
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
    const dao = await import("file:///" + filename);
    const str = await Deno.readTextFile(filename);
    let str2 = str;
    const methods = getMethods(str);
    const keys = Object.keys(methods);
    for (let j = 0; j < keys.length; j++) {
      const methodName = keys[j];
      const methodStr = methods[methodName];
      let methodStr2 = methodStr;
      methodStr2 = methodStr2.replace(/await context.query<\{[\s\S]*?\}>\(/gmi, "await context.query(");
      methodStr2 = methodStr2.replace(/await context.queryOne<\{[\s\S]*?}\>\(/gmi, "await context.queryOne(");
      let idx = methodStr2.lastIndexOf("await context.query(");
      let idxOne = methodStr2.lastIndexOf("await context.queryOne(");
      if (idx > 0 || idxOne > 0) {
        const oldQuery = context.query;
        let typeArr: { name: string, type: string }[] = [];
        context.query = async function(
          sql: string,
          // deno-lint-ignore no-explicit-any
          args?: any[],
          opt?: { debug?: boolean },
        // deno-lint-ignore no-explicit-any
        ): Promise<any> {
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
            // deno-lint-ignore no-explicit-any
            let result: any;
            try {
              result = await conn?.query(sql, args);
            } finally {
              await context?.rollback(conn, { debug: false });
            }
            // deno-lint-ignore no-explicit-any
            const fileds: any[] = result[1];
            for (let i = 0; i < fileds.length; i++) {
              const field = fileds[i];
              let type = "string";
              const columnType = field.columnType;
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
              typeArr.push({ name: field.name, type });
            }
            return result[0];
          }
          return [];
        }
        try {
          await dao[methodName](context);
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
            typeStr += `    ${ item.name }: ${ item.type },\n`;
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
          args?: any[],
          opt?: { debug?: boolean },
        // deno-lint-ignore no-explicit-any
        ): Promise<any> {
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
            // deno-lint-ignore no-explicit-any
            let result: any[]|undefined = [ [ ], [ ] ];
            const conn = await context?.beginTran({ debug: false });
            try {
              result = await conn?.query(sql, args);
            } catch (errTmp) {
              console.log(`sql错误 ${ methodName }: ${ sql }`);
              throw errTmp;
            } finally {
              await context?.rollback(conn, { debug: false });
            }
            return result?.[0];
          }
        }
        try {
          await dao[methodName](context);
          context.query = oldQuery;
        } catch (err) {
          context.query = oldQuery;
          hasErr = true;
          console.error(err);
          continue;
        }
      }
      if (str2 && str !== str2) {
        await Deno.writeFile(filename, new TextEncoder().encode(str2));
      }
    }
    if (isInnerContext) {
      await context.closePool();
    }
    if (!hasErr) {
      console.log("sql检查成功:", filenames.join("\n"));
    } else {
      console.log("sql错误:", filenames.join("\n"));
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
  watcher = Deno.watchFs(`${ Deno.cwd() }`, { recursive: true });
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
