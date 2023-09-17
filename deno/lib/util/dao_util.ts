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

import { shortUuidV4 } from "/lib/util/string_util.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

import {
  type AuthModel,
} from "/lib/auth/auth.constants.ts";

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
) {
  const column2Ids: string[] = model[column_name];
  if (!column2Ids) {
    return;
  }
  const { id: usr_id } = await authDao.getAuthModel() as AuthModel;
  const tenant_id = await usrDaoSrc.getTenant_id(usr_id);
  // deno-lint-ignore no-explicit-any
  let models: any[] = [ ];
  if (model.id) {
    models = await query<{
      id: string,
      column1Id: string,
      column2Id: string,
      is_deleted: 0|1,
    }>(/*sql*/ `
      select
        t.id,
        t.${ escapeId(many.column1) } column1Id,
        t.${ escapeId(many.column2) } column2Id,
        t.is_deleted
      from ${ escapeId(many.mod + "_" +many.table) } t
      where
        t.${ escapeId(many.column1) } = ?
    `, [ model.id ]);
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const idx = column2Ids.indexOf(model.column2Id);
      const sql = /*sql*/ `
        update
          ${ escapeId(many.mod + "_" + many.table) }
        set
          is_deleted = ?
          ,delete_time = ?
          ,order_by = ?
        where
          id = ?
      `;
      await execute(
        sql,
        [
          idx === -1 ? 1 : 0,
          reqDate(),
          idx + 1,
          model.id,
        ],
      );
    }
  }
  const column2Ids2 = column2Ids.filter((column2Id) => models.every((model) => model.column2Id !== column2Id));
  for (let i = 0; i < column2Ids2.length; i++) {
    const column2Id = column2Ids2[i];
    const id = shortUuidV4();
    {
      const args = [ ];
      let sql = /*sql*/ `
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
      args.push(models.length + i + 1);
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
}
