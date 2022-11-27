import { extension } from "std/media_types/mod.ts";
import { getXLSX } from "/deps.ts";

import {
  _internals as tmpfileDao,
} from "/lib/tmpfile/tmpfile.dao.ts";

export async function getTemplate(
  template: string,
): Promise<Uint8Array | undefined> {
  // deno-lint-ignore no-explicit-any
  if ((window as any).process.env.NODE_ENV === "development") {
    const tmpFn = async function(dir: string): Promise<Uint8Array | undefined> {
      for await (const dirEntry of Deno.readDir(dir)) {
        if (dirEntry.name === "node_modules" || dirEntry.name === "test") {
          continue;
        }
        if (dirEntry.isDirectory) {
          const buffer = await tmpFn(dir + "/" + dirEntry.name);
          if (buffer) {
            return buffer;
          }
        } else if (dirEntry.isFile) {
          if (!dirEntry.name.endsWith(".xlsx") && !dirEntry.name.endsWith(".xlsm")) {
            continue;
          }
          if (dirEntry.name === template) {
            const buffer: Uint8Array = await Deno.readFile(dir + "/" + dirEntry.name);
            return buffer;
          }
        }
      }
    }
    let buffer = await tmpFn(Deno.cwd()+"/gen/");
    if (!buffer) {
      buffer = await tmpFn(Deno.cwd()+"/src/");
    }
    return buffer;
  }
  const buffer = await Deno.readFile(`${ Deno.cwd() }/excel_template/${ template }`);
  return buffer;
}

// const unImportKeys = [
//   "tenant_id",
//   "create_usr_id",
//   "create_time",
//   "update_usr_id",
//   "update_time",
//   "is_deleted",
//   "delete_time",
// ];

/**
 * 第一行作为表头, 获得文件数据
 * @param {string} id
 */
 // deno-lint-ignore no-explicit-any
 export async function getImportFileRows<T extends { [key: string]: any }>(
  id: string,
  header?: {[key: string]: string},
): Promise<T[]> {
  const stats = await tmpfileDao.statObject(id);
  if (!stats || !stats.contentType) {
    throw "Excel文件不存在!";
  }
  const ext = extension(stats.contentType);
  if (ext !== "xlsx" && ext !== "xlsm" && ext !== "xls") {
    throw "Excel文件格式不正确!";
  }
  const objInfo = await tmpfileDao.getObject(id);
  if (!objInfo || !objInfo.body) {
    throw "Excel文件不存在!";
  }
  const XLSX = await getXLSX();
  const buffer = await new Response(objInfo.body).arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellFormula: false,
    cellHTML: false,
  });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: T[] = [ ];
  // deno-lint-ignore no-explicit-any
  const data: any = XLSX.utils.sheet_to_json(worksheet);
  const keys = Object.keys(data[0]);
  for (let i = 0; i < data.length; i++) {
    const vals = data[i];
    const row = <T>{ };
    for (let k = 0; k < keys.length; k++) {
      const key = String(keys[k]).trim();
      if (!key) continue;
      let val = vals[key];
      if (typeof val === "string") {
        val = val.trim();
      }
      if (val !== "-") {
        if (header && header[key]) {
          // deno-lint-ignore no-explicit-any
          (row as any)[header[key]] = val;
        } else {
          // deno-lint-ignore no-explicit-any
          (row as any)[key] = val;
        }
      }
    }
    rows.push(row);
  }
  return rows;
}
