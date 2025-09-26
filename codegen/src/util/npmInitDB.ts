import fsExtraPkg from "fs-extra";

import {
  initContext,
  type Context,
} from "../lib/information_schema.ts";

import {
  isEmpty,
} from "../lib/StringUitl.ts";

import {
  execCsvFile,
} from "./common.ts";

import {
  isUseI18n,
} from "../tables/tables.ts";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// 获取当前文件的目录路径 (ES 模块中 __dirname 的等效方法)
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const {
  readdir,
  stat,
  readFile,
} = fsExtraPkg;

const root = `${ __dirname }/../tables/`;

async function getSqlFiles(dir: string, sqlFiles: string[], csvFiles: string[]) {
  const files = await readdir(root+dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file === "node_modules") continue;
    if (!isUseI18n) {
      if (
        file.endsWith("_lang.sql.csv") ||
        file.endsWith(".i18n.sql") ||
        file.endsWith(".en-US.sql.csv") ||
        file.endsWith(".zh-CN.sql.csv")
      ) continue;
    }
    const stats = await stat(root+dir+"/"+file);
    if (stats.isDirectory()) {
      await getSqlFiles(dir+"/"+file, sqlFiles, csvFiles);
      continue;
    }
    if (stats.isFile()) {
      if (
        file.endsWith(".sql") &&
        !file.endsWith(".tsdb.sql")
      ) {
        if (file === "init.sql") {
          sqlFiles.unshift(root+dir+"/"+file);
        } else {
          sqlFiles.push(root+dir+"/"+file);
        }
      } else if (file.endsWith(".sql.csv")) {
        csvFiles.push(root+dir+"/"+file);
      }
    }
  }
}

async function execSqlFile(context: Context, sqlFile: string) {
  const str = await readFile(sqlFile, "utf8");
  const sqlArr = str.split(/;[\s\S]?\n/gm);
  for (let i = 0; i < sqlArr.length; i++) {
    let sql = sqlArr[i].trim();
    sql = sql.replace(/--[\s\S]*?\n/gm, "");
    if (isEmpty(sql)) continue;
    try {
      await context.pool.execute(sql);
    } catch (err) {
      console.error(err);
    }
  }
};

async function exec() {
  console.time("sql");
  const context = await initContext();
  
  const sqlFiles = [];
  const csvFiles = [];
  await getSqlFiles("", sqlFiles, csvFiles);
  for (let i = 0; i < sqlFiles.length; i++) {
    const sqlFile = sqlFiles[i];
    await execSqlFile(context, sqlFile);
  }
  
  for (let i = 0; i < csvFiles.length; i++) {
    const item = csvFiles[i];
    await execCsvFile(context, item);
  }
  
  if (!isUseI18n) {
    let sql = `
      update base_menu set is_enabled = 0
      where route_path in ('/base/lang', '/base/i18n')
    `;
    await context.pool.execute(sql);
  }
  
  console.timeEnd("sql");
  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
});
