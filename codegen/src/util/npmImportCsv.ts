// npm run importCsv -- wx/*
import {
  readdirSync,
  statSync,
} from "node:fs";

import {
  readFile,
  writeFile,
} from "node:fs/promises";

import { parse } from "fast-csv";

import {
  normalize,
  basename,
  dirname,
} from "node:path";

import {
  execCsvFile,
} from "./common.ts";

import {
  initContext,
} from "../lib/information_schema.ts";

import * as crypto from "node:crypto";

import {
  isEmpty,
} from "../lib/StringUitl.ts";

import { fileURLToPath } from "node:url";

// 获取当前文件的目录路径 (ES 模块中 __dirname 的等效方法)
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let argv2 = process.argv[2];
if (!argv2) {
  console.log("npm run importCsv -- [文件路径]");
  process.exit(1);
}

const root = `${ __dirname }/../tables/`;

const fileArr2: string[] = [ ];

let fileArr = argv2.split(",");
fileArr = fileArr.filter((file) => !isEmpty(file));
fileArr.forEach((file, i) => {
  if (file.endsWith("/") || file.endsWith("/*")) {
    if (file.endsWith("/*")) {
      file = file.substring(0, file.length - 1);
    }
    function tmpFn(file: string) {
      const fileTmps = readdirSync(`${ root }/${ file }`);
      for (const fileTmp of fileTmps) {
        if (!fileTmp.endsWith(".sql.csv")) {
          continue;
        }
        const stat = statSync(`${ root }/${ file }/${ fileTmp }`);
        if (stat.isDirectory()) {
          tmpFn(`${ file }/${ fileTmp }`);
        } else {
          fileArr2.push(`${ file }/${ fileTmp }`);
        }
      }
    }
    tmpFn(file);
    return;
  }
  if (!file.endsWith(".sql.csv")) {
    fileArr[i] += ".sql.csv";
    fileArr2.push(fileArr[i]);
  }
});
fileArr = fileArr2;

async function exec() {
  console.time("csv");
  
  const csvFiles = [
    ...fileArr.map((file) => normalize(`${ root }/${ file }`)),
  ];
  for (let i = 0; i < csvFiles.length; i++) {
    const file = csvFiles[i];
    if (file.includes("\\base_menu.")) {
      const str = await readFile(file, "utf8");
      const rows: any[] = await new Promise(function(resolve, reject) {
        const rows = [ ];
        const stream = parse({ headers: true })
          .on("error", (error) => reject(error))
          .on("data", (row) => rows.push(row))
          .on("end", () => resolve(rows));
        stream.write(str);
        stream.end();
      });
      const base_role_menu_ids: string[] = [ ];
      const base_tenant_menu_ids: string[] = [ ];
      for (const row of rows) {
        const role_buffer = Buffer.from(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(JSON.stringify({
          key: "base_role_menu",
          id: row.id,
        }))));
        const tenant_buffer = Buffer.from(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(JSON.stringify({
          key: "base_tenant_menu",
          id: row.id,
        }))));
        base_role_menu_ids.push(role_buffer.toString("base64").substring(0, 22));
        base_tenant_menu_ids.push(tenant_buffer.toString("base64").substring(0, 22));
      }
      const mod_name = basename(dirname(file));
      let base_role_menu = "id,role_id,menu_id,tenant_id,order_by\n";
      for (let k = 0; k < base_role_menu_ids.length; k++) {
        const base_role_menu_id = base_role_menu_ids[k];
        base_role_menu += base_role_menu_id + "," 
        base_role_menu += "T/A58UzxTzK0thbZH7aZhw,";
        base_role_menu += rows[k].id + ",";
        base_role_menu += "ZDbZlC1OT8KaDg6soxMCBQ,";
        base_role_menu += rows[k].order_by + "\n";
      }
      const base_role_menu_path = `${ dirname(file) }/base_role_menu${ mod_name === "base" ? "" : ("." + mod_name) }.sql.csv`;
      await writeFile(base_role_menu_path, base_role_menu);
      if (!csvFiles.includes(base_role_menu_path)) {
        csvFiles.push(base_role_menu_path);
      }
      
      let base_tenant_menu = "id,tenant_id,menu_id,order_by\n";
      for (let k = 0; k < base_tenant_menu_ids.length; k++) {
        const base_tenant_menu_id = base_tenant_menu_ids[k];
        base_tenant_menu += base_tenant_menu_id + "," 
        base_tenant_menu += "ZDbZlC1OT8KaDg6soxMCBQ,";
        base_tenant_menu += rows[k].id + ",";
        base_tenant_menu += rows[k].order_by + "\n";
      }
      const base_tenant_menu_path = `${ dirname(file) }/base_tenant_menu${ mod_name === "base" ? "" : ("." + mod_name) }.sql.csv`;
      await writeFile(base_tenant_menu_path, base_tenant_menu);
      if (!csvFiles.includes(base_tenant_menu_path)) {
        csvFiles.push(base_tenant_menu_path);
      }
    }
  }
  
  const context = await initContext();
  for (let i = 0; i < csvFiles.length; i++) {
    const item = csvFiles[i];
    await execCsvFile(context, item);
  }
  
  console.timeEnd("csv");
  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
});
