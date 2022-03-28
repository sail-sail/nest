import * as mysql from "mysql2";
import { Pool, PoolConnection } from "mysql2/promise";
import nestConfig from "./nest_config";
import tables from "../tables";
import config, { TableCloumn, TablesConfigItem } from "../config";

export class Context {
  pool: Pool;
  conn: PoolConnection;
}

function getPool(): Pool {
  const db = nestConfig.database;
  const pool0 = mysql.createPool({
    host: db.host,
    user: db.username,
    database: db.database,
    port: db.port,
    password: db.password,
    debug: db.debug,
  });
  const pool = pool0.promise();
  return pool;
}

export async function initContext() {
  const context = new Context();
  const pool = getPool();
  context.pool = pool;
  const conn = await pool.getConnection();
  context.conn = conn;
  return context;
}

let schemaTables: {
  TABLE_NAME: string;
  TABLE_COMMENT: string;
}[] = undefined;

export async function getTableComment(context: Context, table_name: string) {
  if (!schemaTables) {
    const sql = `
      select
        t.TABLE_NAME,
        t.TABLE_COMMENT
      from
        information_schema.TABLES t
      where
        t.TABLE_SCHEMA=(select database())
    `;
    const result = await context.conn.query(sql);
    schemaTables = <any[]>result[0];
  }
  const table_comment = schemaTables.find(item => item.TABLE_NAME === table_name).TABLE_COMMENT || table_name;
  return table_comment;
}

let allTableSchemaRecords: TableCloumn[] = undefined;

async function getSchema0(
  context: Context,
  table_name: string,
): Promise<TableCloumn[]> {
  if (!allTableSchemaRecords) {
    let sql = `
      select
        t.*
      from information_schema.COLUMNS t
      where
        t.table_schema = (select database())
      order by t.ORDINAL_POSITION
    `;
    const result = await context.conn.query(sql);
    allTableSchemaRecords = <TableCloumn[]>result[0];
  }
  const records = allTableSchemaRecords.filter((item: TableCloumn) => item.TABLE_NAME === table_name);
  return records;
}

export async function getSchema(
  context: Context,
  table_name: string,
): Promise<TablesConfigItem> {
  const records = await getSchema0(context, table_name);
  tables[table_name] = tables[table_name] || { opts: { }, columns: [ ] };
  tables[table_name].columns = tables[table_name].columns || [ ];
  tables[table_name].opts = tables[table_name].opts || { };
  tables[table_name].opts.table = table_name;
  tables[table_name].opts.tableUp = table_name.substring(0,1).toUpperCase() + table_name.substring(1);
  tables[table_name].opts.table_comment = await getTableComment(context, table_name);
  const hasTenant_id = records.some((item: any) => item.COLUMN_NAME === "tenant_id");
  tables[table_name].opts.hasTenant_id = hasTenant_id;
  const columns = [ ];
  for (let k = 0; k < records.length; k++) {
    const record = records[k];
    let column: TableCloumn = tables[table_name].columns.find((column: any) => column.COLUMN_NAME === record.COLUMN_NAME);
    if (column) {
      Object.assign(record, column);
    }
    if (config.ignoreCodegen.includes(record.COLUMN_NAME)) {
      continue;
    } else {
      columns.push(record);
    }
    if (!record.foreignKey) {
      if (record.COLUMN_NAME.endsWith("_ids")) {
        const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_ids".length);
        const defaultSort = tables[table2].opts?.defaultSort;
        record.foreignKey = { table: table2, column: "id", lbl: "lbl", multiple: true, type: "json", defaultSort };
        // record.many2many = { table: `${ table_name }_${ table2 }`, column1: `${ table_name }_id`, column2: `${ table2 }_id` };
      } else if (record.COLUMN_NAME.endsWith("_id")) {
        const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_id".length);
        const defaultSort = tables[table2].opts?.defaultSort;
        record.foreignKey = { table: table2, column: "id", lbl: "lbl", multiple: false, defaultSort };
      }
    }
    if (record.COLUMN_NAME === "lbl") {
      if (!column) {
        record.require = true;
        record.search = true;
      }
    }
    if (record.COLUMN_NAME === "img" || record.COLUMN_NAME.endsWith("_img")) {
      if (!column) {
        record.isImg = true;
      }
    } else if (record.COLUMN_NAME === "att" || record.COLUMN_NAME.endsWith("_att")) {
      if (!column) {
        record.isAtt = true;
      }
    }
    if (record.isAtt || record.isImg) {
      if (!record.width) {
        let column_comment = record.COLUMN_COMMENT || "";
        if (column_comment.indexOf("[") !== -1) {
          column_comment = column_comment.substring(0, column_comment.indexOf("["));
        }
        record.width = 16 + column_comment.length * 14;
      }
      if (!record.attMaxSize) {
        const COLUMN_TYPE = record.COLUMN_TYPE;
        const columnSize = Number(COLUMN_TYPE.replace("varchar(", "").replace(")", ""));
        record.attMaxSize = Math.floor((columnSize + 1) / 23);
      }
    }
  }
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    const record = records.find((item: TableCloumn) => item.COLUMN_NAME === column.COLUMN_NAME);
    if (record) continue;
    if (!column.foreignKey) {
      if (column.COLUMN_NAME.endsWith("_ids")) {
        const table2 = column.COLUMN_NAME.substring(0, column.COLUMN_NAME.length - "_ids".length);
        const defaultSort = tables[table2].opts?.defaultSort;
        column.foreignKey = { table: table2, column: "id", lbl: "lbl", multiple: true, type: "many2many", defaultSort };
        column.many2many = { table: `${ table_name }_${ table2 }`, column1: `${ table_name }_id`, column2: `${ table2 }_id` };
      } else if (column.COLUMN_NAME.endsWith("_id")) {
        const table2 = column.COLUMN_NAME.substring(0, column.COLUMN_NAME.length - "_id".length);
        const defaultSort = tables[table2].opts?.defaultSort;
        column.foreignKey = { table: table2, column: "id", lbl: "lbl", multiple: false, defaultSort };
      }
    }
    columns.push({
      ...column,
    });
  }
  columns.sort(function(arg0, arg1) {
    if (arg0.ORDINAL_POSITION > arg1.ORDINAL_POSITION) return 1;
    if (arg0.ORDINAL_POSITION < arg1.ORDINAL_POSITION) return -1;
    if (arg0.ORDINAL_POSITION === arg1.ORDINAL_POSITION) return 0;
    return 0;
  });
  tables[table_name].columns = columns;
  let defaultSort = tables[table_name].opts?.defaultSort;
  const orderByColumn = columns.find((item) => item.COLUMN_NAME === "order_by");
  if (orderByColumn) {
    if (orderByColumn.sortable == null) {
      orderByColumn.sortable = true;
    }
    if (!defaultSort) {
      defaultSort = {
        prop: "order_by",
        order: "ascending",
      };
    }
  }
  tables[table_name].opts.defaultSort = defaultSort;
  return tables[table_name];
}

export async function getAllTables(context: Context) {
  if (!schemaTables) {
    const sql = `
      select
        t.TABLE_NAME,
        t.TABLE_COMMENT
      from
        information_schema.TABLES t
      where
        t.TABLE_SCHEMA=(select database())
    `;
    const result = await context.conn.query(sql);
    schemaTables = <any[]>result[0];
  }
  return schemaTables;
}
