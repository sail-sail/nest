import {
  readFile,
} from "fs-extra";

import * as path from "path";
import { parse } from "fast-csv";

import type {
  Context,
} from "../lib/information_schema";

import {
  isEmpty,
} from "../lib/StringUitl";

export async function execCsvFile(context: Context, item: string) {
  let tableName = path.basename(item, path.extname(item));
  tableName = tableName.split(".")[0];
  {
    const idx = tableName.indexOf("-");
    if (idx !== -1) {
      tableName = tableName.substring(0, idx);
    }
  }
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
    if (isEmpty(row[keys.indexOf("id")])) {
      continue;
    }
    let sql = `insert ignore into \`${ tableName }\`(`;
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      if (isEmpty(key)) {
        continue;
      }
      if (key.startsWith("_") || key.endsWith("_")) {
        continue;
      }
      sql += "`"+key+"`";
      if (j !== keys.length - 1) {
        sql += ",";
      }
    }
    sql += ") values (";
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      let val = row[j];
      if (isEmpty(key)) {
        continue;
      }
      if (key.startsWith("_") || key.endsWith("_")) {
        continue;
      }
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