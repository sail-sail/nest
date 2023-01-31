import { readdir, stat, readFile } from "fs-extra";
import {
  initContext,
  type Context,
} from "../lib/information_schema";
import { isEmpty } from "../lib/StringUitl";

import {
  execCsvFile,
} from "./common";

const root = `${ __dirname }/../tables/`;

async function getSqlFiles(dir: string, sqlFiles: string[], csvFiles: string[]) {
  const files = await readdir(root+dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stats = await stat(root+dir+"/"+file);
    if (file === "node_modules" && stats.isDirectory()) continue;
    if (stats.isDirectory()) {
      await getSqlFiles(dir+"/"+file, sqlFiles, csvFiles);
      continue;
    }
    if (stats.isFile()) {
      if (file.endsWith(".sql")) {
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
  
  console.timeEnd("sql");
  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
});
