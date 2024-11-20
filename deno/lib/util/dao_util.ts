import {
  escapeId,
} from "sqlstring";

import {
  query,
  queryOne,
  execute,
  reqDate,
  type QueryArgs,
} from "/lib/context.ts";

import {
  encodeBase64,
  decodeBase64,
} from "@std/encoding/base64";

import { getEnv } from "/lib/env.ts";

import { shortUuidV4 } from "/lib/util/string_util.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

export type SearchExtra = (args: QueryArgs) => Promise<string> | string | undefined | null;

export async function setModelIds(
  // deno-lint-ignore no-explicit-any
  models: any[],
  flds: { table: string, fld: string, lbl: string }[],
) {
  for (let f = 0; f < flds.length; f++) {
    const item = flds[f];
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      if (model[item.fld]) {
        if (!Array.isArray(model[item.fld]) && model[item.fld].includes(",")) {
          model[item.fld] = model[item.fld].split(",");
        }
        if (!Array.isArray(model[item.fld]) && item.lbl) {
          const id = model[item.fld];
          const _id = (await queryOne<{ lbl: string }>(`
            select t.${ item.lbl } as lbl
            from ${ item.table } t
            where
              t.is_deleted = 0
              and id = ?
          `, [ id ]))?.lbl;
          model[`_${ item.fld }`] = _id;
        } else if (item.lbl) {
          const _ids = [ ];
          for (let k = 0; k < model[item.fld].length; k++) {
            const id = model[item.fld][k];
            if (!id) {
              _ids.push(undefined);
            } else {
              const lbl = (await queryOne<{ lbl: string }>(`
                select t.${ item.lbl } as lbl
                from ${ item.table } t
                where
                  t.is_deleted = 0
                  and id = ?
              `, [ id ]))?.lbl;
              _ids.push(lbl);
            }
          }
          model[`_${ item.fld }`] = _ids;
        }
      }
    }
  }
}

export async function many2manyUpdate(
  // deno-lint-ignore no-explicit-any
  model: { [key: string]: any },
  column_name: string,
  many: {
    mod: string;
    table: string;
    column1: string;
    column2: string;
  },
): Promise<boolean> {
  const column2Ids: string[] = model[column_name];
  if (!column2Ids) {
    return false;
  }
  const authModel = await getAuthModel();
  const usr_id: UsrId | undefined = authModel?.id;
  const tenant_id = await usrDaoSrc.getTenant_id(usr_id);
  type Model = {
    id: string,
    column2Id: string,
    is_deleted: 0|1,
    order_by: number,
  }
  let hasChange = false;
  let models: Model[] = [ ];
  if (model.id) {
    models = await query<Model>(`
      select
        t.id,
        t.${ escapeId(many.column2) } column2Id,
        t.is_deleted,
        t.order_by
      from ${ escapeId(many.mod + "_" +many.table) } t
      where
        t.${ escapeId(many.column1) } = ?
    `, [ model.id ]);
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const idx = column2Ids.indexOf(model.column2Id);
      if (idx === -1) {
        if (model.is_deleted === 0) {
          const sql = `
            update
              ${ escapeId(many.mod + "_" + many.table) }
            set
              is_deleted = ?
              ,delete_time = ?
            where
              id = ?
          `;
          hasChange = true;
          await execute(
            sql,
            [
              1,
              reqDate(),
              model.id,
            ],
          );
        }
        continue;
      }
      if (model.is_deleted === 1 || model.order_by !== idx + 1) {
        const sql = `
          update
            ${ escapeId(many.mod + "_" + many.table) }
          set
            is_deleted = ?
            ,order_by = ?
          where
            id = ?
        `;
        hasChange = true;
        await execute(
          sql,
          [
            0,
            idx + 1,
            model.id,
          ],
        );
      }
    }
  }
  const column2Ids2 = column2Ids.filter((column2Id) => models.every((model) => model.column2Id !== column2Id));
  if (column2Ids2.length > 0) {
    hasChange = true;
  }
  for (let i = 0; i < column2Ids2.length; i++) {
    const column2Id = column2Ids2[i];
    const id = shortUuidV4();
    {
      const args = [ ];
      let sql = `
        insert into ${ many.mod }_${ many.table }(
          id
          ,create_time
          ,order_by
      `;
      if (many.column1 !== "tenant_id" && many.column2 !== "tenant_id") {
        if (tenant_id) {
          sql += `,tenant_id`;
        }
      }
      if (usr_id) {
        sql += `,create_usr_id`;
      }
      sql += `,${ many.column1 },${ many.column2 }`;
      sql += `) values(?,?,?`;
      args.push(id);
      args.push(reqDate());
      args.push(column2Ids.indexOf(column2Id) + 1);
      if (many.column1 !== "tenant_id" && many.column2 !== "tenant_id") {
        if (tenant_id) {
          sql += `,?`;
          args.push(tenant_id);
        }
      }
      if (usr_id) {
        sql += `,?`;
        args.push(usr_id);
      }
      sql += `,?`;
      args.push(model.id);
      sql += `,?`;
      args.push(column2Id);
      sql += `)`;
      await execute(sql, args);
    }
  }
  return hasChange;
}

let cryptoKey: CryptoKey | undefined;

const database_crypto_key_path = await getEnv("database_crypto_key_path");

let database_crypto_key: Uint8Array | undefined;

try {
  if (database_crypto_key_path) {
    database_crypto_key = await Deno.readFile(database_crypto_key_path);
  }
} catch (_) {
  // console.error(error);
}

if (database_crypto_key) {
  cryptoKey = await crypto.subtle.importKey(
    "raw",
    database_crypto_key,
    {
      name: "AES-CBC",
    },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * 对字符串进行加密
 * @param str 要加密的字符串
 * @returns 加密后的字符串
 */
export async function encrypt(
  str: string,
) {
  if (!cryptoKey) {
    return "";
  }
  const salt = shortUuidV4<string>().substring(0, 16);
  const ivStr = shortUuidV4<string>().substring(0, 16);
  const iv = new TextEncoder().encode(ivStr);
  const buf = await crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv,
    },
    cryptoKey,
    new TextEncoder().encode(salt + str),
  );
  return ivStr + encodeBase64(buf);
}

/**
 * 解密字符串
 * @param str 要解密的字符串
 * @returns 解密后的字符串
 */
export async function decrypt(
  str: string,
) {
  if (!cryptoKey || !str || str.length < 16) {
    return "";
  }
  const ivStr = str.substring(0, 16);
  const iv = new TextEncoder().encode(ivStr);
  try {
    const buf = await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv,
      },
      cryptoKey,
      decodeBase64(str.substring(16)),
    );
    return (new TextDecoder().decode(buf)).substring(16);
  } catch (_err) {
    return "";
  }
}

export function getDebugSearch(
  // deno-lint-ignore no-explicit-any
  search?: any,
) {
  if (!search) {
    return "";
  }
  const search2 = {
    ...search,
  };
  if (search.is_deleted == 0) {
    delete search2.is_deleted;
  }
  return JSON.stringify(search2);
}

export const FIND_ALL_IDS_LIMIT = 5000;

export const SPLIT_SQL_INSERT_LEN = 1000;

export function splitArr<T>(
  arr: T[],
  size: number,
): T[][] {
  if (size <= SPLIT_SQL_INSERT_LEN) {
    return [ arr ];
  }
  const res = [ ];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export function splitCreateArr<T>(
  arr: T[],
) {
  return splitArr(arr, SPLIT_SQL_INSERT_LEN);
}
