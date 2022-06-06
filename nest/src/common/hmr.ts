import { accessSync, readFileSync, writeFileSync } from "fs";
import { _PROJECT_PATH } from "./config";
import { getPool } from "./context";
import { isEmpty } from "./util/StringUitl";

function getMethodStr(str: string, methodName: string) {
  let str2 = "";
  let isStart = false;
  const lineArr = str.split("\n");
  for (let i = 0; i < lineArr.length; i++) {
    const line = lineArr[i];
    if (line.startsWith(`  async ${ methodName }(`)) {
      isStart = true;
    }
    if (isStart) {
      str2 += line + "\n";
    }
    if (isStart && line.startsWith(`  }`)) {
      isStart = false;
      break;
    }
  }
  return str2;
}

let hasHmr = false;

export async function hmr() {
  if (hasHmr) return;
  hasHmr = true;
  const { Context } = require("./context");
  const context = new Context();
  const chokidar = require("chokidar");
  chokidar.watch(`${ _PROJECT_PATH }/../.git/HEAD`).on("change", async() => {
    console.log("git分支变更, 退出进程!");
    process.exit(3);
  });
  const watcher = chokidar.watch(
    `${ _PROJECT_PATH }/src/`,
    {
      ignored: [
        "**/node_modules",
        "**/package.json",
        "**/*.xlsx",
        `${ _PROJECT_PATH }/src/common/**`,
        `${ _PROJECT_PATH }/src/Mother.js`,
        `${ _PROJECT_PATH }/src/main.js`,
        `${ _PROJECT_PATH }/src/modules.gen.js`, 
        "**/*.controller.ts",
        "**/*.graphql",
        "**/*.model.ts",
        "**/*.module.ts",
        "**/*.resolver.ts",
      ],
      ignoreInitial: true,
    },
  );
  let stopWatching = false;
  let filenames = [ ];
  let timeout: NodeJS.Timeout = null;
  function callback(file: string) {
    if (stopWatching) return;
    if (!file) return;
    if (!file.endsWith(".service.ts") && !file.endsWith(".dao.ts")) return;
    try {
      accessSync("../../../codegening.txt");
      process.exit(0);
    } catch (errTmp) {
    }
    if (!filenames.includes(file)) {
      filenames.push(file);
    }
    clearTimeout(timeout);
    timeout = setTimeout(async function() {
      stopWatching = true;
      if (filenames.length > 5) {
        console.log("超过 5 个文件同时更新，退出进程!");
        process.exit(2);
      }
      console.log(filenames.join("\n"));
      try {
        const nestApplication = global.__nestApplication;
        let hasErr = false;
        for (let i = 0; i < filenames.length; i++) {
          const filename = filenames[i];
          let serviceObj = undefined;
          const oldClazz = require.cache[filename];
          delete require.cache[filename];
          try {
            serviceObj = require(filename);
            require.cache[filename] = oldClazz;
          } catch (e) {
            require.cache[filename] = oldClazz;
            console.error(e.stack);
            return;
          }
          const str = readFileSync(filename, "utf-8");
          let str2 = str;
          const keys = Object.keys(serviceObj);
          for (let k = 0; k < keys.length; k++) {
            const key = keys[k];
            if (key.endsWith("Service") || key.endsWith("Dao")) {
              const oldService = nestApplication.get(oldClazz.exports[key]);
              const methodNames = Object.getOwnPropertyNames(serviceObj[key].prototype);
              for (const methodName of methodNames) {
                if (methodName === "constructor") continue;
                oldService[methodName] = serviceObj[key].prototype[methodName].bind(oldService);
              }
              if (key.endsWith("Dao")) {
                const methodNames2 = methodNames.filter((item) => item !== "constructor" && item !== "getWhereQuery");
                for (let k = 0; k < methodNames2.length; k++) {
                  const methodName = methodNames2[k];
                  let methodStr = getMethodStr(str, methodName);
                  if (!methodStr) continue;
                  const regRltArr = methodStr.match(new RegExp(`\\s+async\\s+${ methodName }\\s*\\([\\s\\S]*?\\)[\\s\\S]*?\\{[\\s\\S]*?context\\.query[\\s\\S]*?return[\\s\\S]*?\\}\\s+`, "gmi"));
                  // if (!regRltArr) {
                  //   console.log(`${ methodName }: 未匹配成功,请检查方法的格式!`);
                  // }
                  if (!regRltArr || regRltArr.length === 0) {
                    const regRltArr = methodStr.match(new RegExp(`\\s+async\\s+${ methodName }\\s*\\([\\s\\S]*?\\)[\\s\\S]*?\\{[\\s\\S]*?context\\.queryOne[\\s\\S]*?return[\\s\\S]*?\\}\\s+`, "gmi"));
                    if (!regRltArr || regRltArr.length === 0) {
                      continue;
                    }
                  }
                  methodStr = regRltArr[0];
                  if (isEmpty(methodStr)) continue;
                  const regExecuteArr = methodStr.match(new RegExp(`\\s+async\\s+${ methodName }\\s*\\([\\s\\S]*?\\)[\\s\\S]*?\\{[\\s\\S]*?context\\.execute[\\s\\S]*?return[\\s\\S]*?\\}\\s+`, "gmi"));
                  if (regExecuteArr && regExecuteArr.length > 0) continue;
                  let methodStr2 = methodStr;
                  methodStr2 = methodStr2.replace(/await context.query<\{[\s\S]*?\}>\(/gmi, "await context.query(");
                  methodStr2 = methodStr2.replace(/await context.queryOne<\{[\s\S]*?}\>\(/gmi, "await context.queryOne(");
                  let idx = methodStr2.lastIndexOf("await context.query(");
                  let idxOne = methodStr2.lastIndexOf("await context.queryOne(");
                  if (idx > 0 || idxOne > 0) {
                    context.getRedisClient = function() { };
                    const oldQuery = context.query;
                    let typeArr: { name: string, type: string }[] = undefined;
                    context.query = async function(
                      sql: string,
                      args?: any[],
                      opt?: { debug?: boolean, logResult?: boolean },
                    ) {
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
                        console.log(`类型 ${ methodName }: ${ sql }`);
                        const pool = getPool();
                        const result = await pool.query(sql, args);
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
                    };
                    try {
                      const contextInterceptor = require("./interceptors/context.interceptor");
                      const oldUseContext = contextInterceptor.useContext;
                      contextInterceptor.useContext = function() {
                        return context;
                      };
                      await oldService[methodName]();
                      contextInterceptor.useContext = oldUseContext;
                    } catch (err) {
                      hasErr = true;
                      console.error(err.stack);
                      continue;
                    } finally {
                      context.query = oldQuery;
                    }
                    if (typeArr) {
                      let typeStr = "{\r\n";
                      for (let i = 0; i < typeArr.length; i++) {
                        const item = typeArr[i];
                        typeStr += `      ${ item.name }: ${ item.type },\r\n`;
                      }
                      typeStr += "    }";
                      let idx = methodStr2.lastIndexOf("await context.query(");
                      let idxOne = methodStr2.lastIndexOf("await context.queryOne(");
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
                    context.getRedisClient = function() { };
                    const oldQuery = context.query;
                    let typeArr: { name: string, type: string }[] = undefined;
                    context.query = async function(
                      sql: string,
                      args?: any[],
                      opt?: { debug?: boolean, logResult?: boolean },
                    ) {
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
                        let result = [ [ ], [ ] ];
                        const pool = getPool();
                        try {
                          result = await pool.query(sql, args);
                        } catch (errTmp) {
                          console.log(`sql错误 ${ methodName }: ${ sql }`);
                          throw errTmp;
                        }
                        return result[0];
                      }
                    };
                    try {
                      const contextInterceptor = require("./interceptors/context.interceptor");
                      const oldUseContext = contextInterceptor.useContext;
                      contextInterceptor.useContext = function() {
                        return context;
                      };
                      await oldService[methodName]();
                      contextInterceptor.useContext = oldUseContext;
                    } catch (err) {
                      hasErr = true;
                      console.error(err.stack);
                      continue;
                    } finally {
                      context.query = oldQuery;
                    }
                  }
                }
                if (str2 && str !== str2) {
                  writeFileSync(filename, str2);
                }
              }
            }
          }
        }
        if (!hasErr) {
          console.log("热重载成功:", filenames.join("\n"));
        } else {
          console.log("热重载完毕(有错误):", filenames.join("\n"));
        }
      } catch (err) {
        console.error("热重载失败 请重启程序:", filenames.join("\n"));
        console.error(err.stack);
      } finally {
        filenames = [ ];
        setTimeout(function() {
          stopWatching = false;
        }, 150);
      }
    }, 300);
  };
  watcher.on("change", callback);
  watcher.on("add", callback);
}
