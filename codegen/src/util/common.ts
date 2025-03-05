import {
  readFile,
} from "fs-extra";

import {
  createHash,
} from "node:crypto";

import * as path from "node:path";
import { parse } from "fast-csv";

import type {
  Context,
} from "../lib/information_schema";

import {
  isEmpty,
} from "../lib/StringUitl";

import type {
  S3Bucket,
} from "../lib/S3/mod";

import {
  S3,
} from "../lib/S3/mod";

import cfg from "../lib/nest_config";

import {
  isUseI18n,
} from "../tables/tables";

let _bucket: S3Bucket | undefined;

async function getBucket() {
  if (_bucket) {
    return _bucket;
  }
  const accessKeyID = cfg.oss_accesskey;
  const secretKey = cfg.oss_secretkey;
  const endpointURL = cfg.oss_endpoint;
  const s3 = new S3({
    accessKeyID,
    secretKey,
    region: "us-east-1",
    endpointURL,
  });
  const oss_bucket = cfg.oss_bucket;
  try {
    await s3.createBucket(oss_bucket)
  // deno-lint-ignore no-empty
  } catch (_err) { }
  _bucket = s3.getBucket(oss_bucket);
  return _bucket;
}

const textEncoder = new TextEncoder();

export async function execCsvFile(context: Context, item: string) {
  let tableName = path.basename(item, path.extname(item));
  tableName = tableName.split(".")[0];
  {
    const idx = tableName.indexOf("-");
    if (idx !== -1) {
      tableName = tableName.substring(0, idx);
    }
  }
  if (!isUseI18n) {
    if (
      tableName === "base_i18n" ||
      tableName.endsWith("_lang")
    ) {
      return;
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
  if (tableName === "base_icon") {
    if (!keys.includes("id")) {
      keys.unshift("id");
      for (let k = 1; k < rows.length; k++) {
        rows[k].unshift(null);
      }
    }
    for (let k = 1; k < rows.length; k++) {
      const row = rows[k];
      const hash = createHash("sha256");
      let val = row[keys.indexOf("img")];
      if (val.startsWith("/")) {
        val = await readFile(__dirname + "/../../.." + val, "utf8");
      }
      val = `data:image/svg+xml;utf8,${ encodeURIComponent(val) }`;
      hash.update(val);
      const id = hash.digest("base64").substring(0, 22);
      row[keys.indexOf("id")] = id;
    }
  }
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
        if (tableName === "base_icon" && key === "img") {
          if (!val) {
            throw new Error("base_icon.img is empty");
          }
          let filename = "";
          if (val.startsWith("/")) {
            filename = path.basename(val);
            val = await readFile(__dirname + "/../../.." + val, "utf8");
          }
          val = `data:image/svg+xml;utf8,${ encodeURIComponent(val) }`;
          const hash = createHash("sha256");
          hash.update(val);
          const id = hash.digest("base64").substring(0, 22);
          
          const bucket = await getBucket();
          
          const stat = await bucket.headObject(id);
          if (!stat) {
            if (!filename) {
              filename = id + ".svg";
            }
            filename = encodeURIComponent(filename);
            const meta: {
              filename?: string;
              once?: string;
              db?: string;
              is_public: "0" | "1";
              tenant_id?: string;
            } = {
              filename,
              db: "base_icon",
              is_public: "1",
            };
            await bucket.putObject(id, textEncoder.encode(val), {
              contentType: "image/svg+xml",
              meta,
            });
          }
          val = id;
        }
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