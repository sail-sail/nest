import { readdir, stat, readFile } from "fs-extra";
import * as path from "path";
import { parse } from "fast-csv";
import { Context } from "../lib/information_schema";
import { isEmpty } from "../lib/StringUitl";

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

async function execCsvFile(context: Context, item: string) {
  let tableName = path.basename(item, path.extname(item));
  tableName = path.basename(tableName, path.extname(tableName));
  const str = await readFile(item, "utf8");
  const rows: any[][] = await new Promise(function(resolve, reject) {
    const rows = [ ];
    const stream = parse({ headers: false })
      .on("error", (error) => reject(error))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows));
    stream.write(str);
    stream.end();
  });
  const keys = rows[0];
  for (let k = 1; k < rows.length; k++) {
    const row = rows[k];
    let sql = `insert ignore into \`${ tableName }\`(`;
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      sql += "`"+key+"`";
      if (j !== keys.length - 1) {
        sql += ",";
      }
    }
    sql += ") values (";
    for (let j = 0; j < keys.length; j++) {
      let val = row[j];
      if (val == null) {
        val = "NULL";
      } else if (val == "default" || val == "NULL") {
        val = val;
      } else {
        val = `'${ val }'`;
      }
      sql += val;
      if (j !== keys.length - 1) {
        sql += ",";
      }
    }
    sql += ")";
    await context.pool.execute(sql);
  }
}

async function exec() {
  console.time("sql");
  const context = new Context();
  
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
