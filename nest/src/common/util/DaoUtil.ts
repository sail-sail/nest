import { useContext } from "../interceptors/context.interceptor";
import { shortUuidV4 } from "./uuid";

export async function setModelIds(models: any[], flds: { table: string, fld: string, lbl: string }[]) {
  const context = useContext();
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
          const _id = (await context.queryOne<{ lbl: string }>(`
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
              const lbl = (await context.queryOne<{ lbl: string }>(`
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
  model: { [key: string]: any },
  column_name: string,
  many: {
    table: string,
    column1: string,
    column2: string,
  },
) {
  const context = useContext();
  let column2Ids: string[] = model[column_name];
  if (!column2Ids) {
    return;
  }
  let models: any[] = [ ];
  if (model.id) {
    models = await context.query<{
      id: string,
      column1Id: string,
      column2Id: string,
      is_deleted: 0|1,
    }>(`
      select
        t.id,
        t.${ context.escapeId(many.column1) } column1Id,
        t.${ context.escapeId(many.column2) } column2Id,
        t.is_deleted
      from ${ context.escapeId(many.table) } t
      where
        t.${ context.escapeId(many.column1) } = ?
    `, [ model.id ]);
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      if (column2Ids.includes(model.column2Id) && model.is_deleted === 1) {
        let sql = `
          update
            ${ context.escapeId(many.table) }
          set
            is_deleted = 0
            ,delete_time = ?
          where
            id = ?
        `;
        await context.execute(sql, [ context.getReqDate(), model.id ]);
      } else if (!column2Ids.includes(model.column2Id) && model.is_deleted === 0) {
        let sql = `
          update
            ${ context.escapeId(many.table) }
          set
            is_deleted = 1
            ,delete_time = ?
          where
            id = ?
        `;
        await context.execute(sql, [ context.getReqDate(), model.id ]);
      }
    }
  }
  const column2Ids2 = column2Ids.filter((column2Id) => models.every((model) => model.column2Id !== column2Id));
  for (let i = 0; i < column2Ids2.length; i++) {
    const column2Id = column2Ids2[i];
    const id = shortUuidV4();
    {
      const args = [ ];
      let sql = `
        insert into ${ many.table }(
          id
          ,create_time
      `;
      if (many.column1 !== "tenant_id" && many.column2 !== "tenant_id") {
        if (context.tenant_id) {
          sql += `,tenant_id`;
        }
      }
      if (context.getUsr_id() !== undefined) {
        sql += `,create_usr_id`;
      }
      sql += `,${ many.column1 },${ many.column2 }`;
      sql += `) values(?,?`;
      args.push(id);
      args.push(context.getReqDate());
      if (many.column1 !== "tenant_id" && many.column2 !== "tenant_id") {
        if (context.tenant_id) {
          sql += `,?`;
          args.push(context.tenant_id);
        }
      }
      if (context.getUsr_id() !== undefined) {
        sql += `,?`;
        args.push(context.getUsr_id());
      }
      sql += `,?`;
      args.push(model.id);
      sql += `,?`;
      args.push(column2Id);
      sql += `)`;
      await context.execute(sql, args);
    }
  }
}
