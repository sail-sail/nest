import {
  escapeId,
} from "sqlstring";

import {
  query,
  queryOne,
  useContext,
  execute,
  reqDate,
} from "/lib/context.ts";

import { shortUuidV4 } from "/lib/util/string_util.ts";
import { getAuthModel } from "/lib/auth/auth.dao.ts";
import { getTenant_id } from "/src/usr/usr.dao.ts";

import {
  type AuthModel,
} from "/lib/auth/auth.constants.ts";

import {
  type QueryArgs,
} from "../query_args.ts";

export type SearchExtra = (args?: QueryArgs) => Promise<string>;

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
    table: string,
    column1: string,
    column2: string,
  },
) {
  const column2Ids: string[] = model[column_name];
  if (!column2Ids) {
    return;
  }
  const context = useContext();
  const { id: usr_id } = await getAuthModel() as AuthModel;
  const tenant_id = await getTenant_id(usr_id);
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
      from ${ escapeId(many.table) } t
      where
        t.${ escapeId(many.column1) } = ?
    `, [ model.id ]);
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      if (column2Ids.includes(model.column2Id) && model.is_deleted === 1) {
        const sql = /*sql*/ `
          update
            ${ escapeId(many.table) }
          set
            is_deleted = 0
            ,delete_time = ?
          where
            id = ?
        `;
        await execute(sql, [ reqDate(), model.id ]);
      } else if (!column2Ids.includes(model.column2Id) && model.is_deleted === 0) {
        const sql = /*sql*/ `
          update
            ${ escapeId(many.table) }
          set
            is_deleted = 1
            ,delete_time = ?
          where
            id = ?
        `;
        await execute(sql, [ reqDate(), model.id ]);
      }
    }
  }
  const column2Ids2 = column2Ids.filter((column2Id) => models.every((model) => model.column2Id !== column2Id));
  for (let i = 0; i < column2Ids2.length; i++) {
    const column2Id = column2Ids2[i];
    const id = shortUuidV4();
    {
      const args = [ ];
      let sql = /*sql*/ `
        insert into ${ many.table }(
          id
          ,create_time
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
      sql += `) values(?,?`;
      args.push(id);
      args.push(reqDate());
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
