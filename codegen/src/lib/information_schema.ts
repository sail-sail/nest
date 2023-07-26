import * as mysql from "mysql2";
import { Pool, PoolConnection } from "mysql2/promise";
import nestConfig from "./nest_config";
import tables from "../tables/tables";
import config, { TableCloumn, TablesConfigItem } from "../config";
import { isEmpty } from "./StringUitl";

export class Context {
  pool: Pool;
  conn: PoolConnection;
}

function getPool(): Pool {
  const db = nestConfig.database;
  console.log({
    host: db.host,
    user: db.username,
    database: db.database,
    port: Number(db.port) || 3306,
  });
  const pool0 = mysql.createPool({
    host: db.host,
    user: db.username,
    database: db.database,
    port: Number(db.port) || 3306,
    password: db.password,
    connectTimeout: 20 * 1000,
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
  // 是否有系统字段 is_sys
  const hasIs_sys = records.some((item: TableCloumn) => [ "is_sys" ].includes(item.COLUMN_NAME));
  const records2: TableCloumn[] = [ ];
  if (!tables[table_name]?.columns) {
    throw new Error(`table: ${ table_name } columns is empty!`);
  }
  const idColumn = records.find((item: TableCloumn) => item.COLUMN_NAME === "id");
  if (idColumn) {
    records2.push(idColumn);
  }
  for (let j = 0; j < tables[table_name].columns.length; j++) {
    const column = tables[table_name].columns[j];
    for (let k = 0; k < records.length; k++) {
      const record = records[k];
      if (record.COLUMN_NAME === "id") {
        continue;
      }
      if (column.COLUMN_NAME === record.COLUMN_NAME) {
        records2.push(record);
        break;
      }
    }
  }
  const tenant_idColumn = records.find((item: TableCloumn) => item.COLUMN_NAME === "tenant_id");
  if (tenant_idColumn) {
    records2.push(tenant_idColumn);
  }
  const org_idColumn = records.find((item: TableCloumn) => item.COLUMN_NAME === "org_id");
  if (org_idColumn && !records2.some((item: TableCloumn) => item.COLUMN_NAME === "org_id")) {
    records2.push(org_idColumn);
  }
  const is_deletedColumn = records.find((item: TableCloumn) => item.COLUMN_NAME === "is_deleted");
  if (is_deletedColumn) {
    records2.push(is_deletedColumn);
  }
  if (hasIs_sys && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "is_sys")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "is_sys",
      COLUMN_TYPE: "tinyint(1) unsigned",
      DATA_TYPE: "tinyint",
      COLUMN_COMMENT: "系统字段",
      dict: "is_sys",
      onlyCodegenDeno: true,
    });
  }
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const item = tables[table_name].columns[i];
    const column_name = item.COLUMN_NAME;
    if ([ "org_id", "tenant_id", "is_deleted" ].includes(column_name)) {
      item.isVirtual = true;
      item.ignoreCodegen = false;
    } else if ([ "create_usr_id", "create_time", "update_usr_id", "update_time", "is_deleted"  ].includes(column_name)) {
      item.ignoreCodegen = false;
      item.noAdd = true;
      item.noEdit = true;
    }
    if ([ "create_usr_id", "update_usr_id" ].includes(column_name)) {
      item.foreignKey = item.foreignKey || { };
      item.foreignKey.table = "usr";
      item.foreignKey.column = "id";
      item.foreignKey.lbl = item.foreignKey.lbl || "lbl";
      if (item.width == null) {
        item.width = 120;
      }
      if (item.align == null) {
        item.align = "left";
      }
    }
    if ([ "create_time", "update_time" ].includes(column_name)) {
      if (item.width == null) {
        item.width = 150;
      }
    }
    if (column_name === "lbl") {
      if (item.width == null) {
        item.width = 200;
      }
      if (item.require == null) {
        item.require = true;
      }
      if (item.search == null) {
        item.search = true;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = true;
      }
      if (item.align == null) {
        item.align = "left";
      }
      if (item.fixed === undefined) {
        item.fixed = "left";
      } else if (item.fixed === null) {
        delete item.fixed;
      }
    }
    if (column_name === "code") {
      if (item.width == null) {
        item.width = 140;
      }
      if (item.require == null) {
        item.require = true;
      }
      if (item.search == null) {
        item.search = true;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = true;
      }
      if (item.align == null) {
        item.align = "left";
      }
      if (item.fixed === undefined) {
        item.fixed = "left";
      } else if (item.fixed === null) {
        delete item.fixed;
      }
    }
    if ([ "is_locked" ].includes(column_name)) {
      if (item.noAdd == null) {
        item.noAdd = true;
      }
      if (item.noEdit == null) {
        item.noEdit = true;
      }
      if (item.require == null) {
        item.require = true;
      }
      if (item.width == null) {
        item.width = 60;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
    }
    if ([ "is_enabled" ].includes(column_name)) {
      if (item.noAdd == null) {
        item.noAdd = true;
      }
      if (item.noEdit == null) {
        item.noEdit = true;
      }
      if (item.require == null) {
        item.require = true;
      }
      if (item.width == null) {
        item.width = 60;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
    }
    if (column_name.startsWith("is_")) {
      if (item.width == null) {
        item.width = 60;
      }
      if (item.isSwitch == null) {
        item.isSwitch = true;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
      if (item.align == null) {
        item.align = "center";
      }
      if (item.require == null) {
        item.require = true;
      }
    }
    if ([ "order_by" ].includes(column_name)) {
      if (item.width == null) {
        item.width = 100;
      }
      if (item.align == null) {
        item.align = "right";
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
    }
    if ([ "rem" ].includes(column_name)) {
      if (item.width == null) {
        item.width = 280;
      }
      if (item.align == null) {
        item.align = "left";
      }
      if (item.isTextarea == null) {
        item.isTextarea = true;
      }
    }
    if (
      (column_name === "img" || column_name.endsWith("_img"))
      || (column_name === "att" || column_name.endsWith("_att"))
    ) {
      if (column_name === "img" || column_name.endsWith("_img")) {
        if (item.isImg == null) {
          item.isImg = true;
        }
      } else if (column_name === "att" || column_name.endsWith("_att")) {
        if (item.isAtt == null) {
          item.isAtt = true;
        }
      }
      if (item.width == null) {
        let column_comment = item.COLUMN_COMMENT || "";
        if (column_comment) {
          if (column_comment.indexOf("[") !== -1) {
            column_comment = column_comment.substring(0, column_comment.indexOf("["));
          }
          item.width = 16 + column_comment.length * 14;
        } else {
          item.width = 100;
        }
      }
      if (item.align == null) {
        item.align = "center";
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
      if (item.attMaxSize == null) {
        const COLUMN_TYPE = item.COLUMN_TYPE;
        if (COLUMN_TYPE) {
          const columnSize = Number(COLUMN_TYPE.replace("varchar(", "").replace(")", ""));
          item.attMaxSize = Math.floor((columnSize + 1) / 23);
        }
      }
    }
    if (
      (
        item.foreignKey
        && (item.foreignKey.multiple || item.COLUMN_NAME.endsWith("_ids"))
        && (item.foreignKey.showType === "tag" || !item.foreignKey.showType)
      )
      || item.COLUMN_NAME.endsWith("_ids")
    ) {
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
    }
    if (
      item.foreignKey
      && (item.foreignKey.multiple || item.COLUMN_NAME.endsWith("_ids"))
      && (item.foreignKey.showType === "dialog")
    ) {
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
      if (item.width == null) {
        item.width = 80;
      }
    }
  }
  return records2;
}

export async function getSchema(
  context: Context,
  table_name: string,
  table_names: string[],
): Promise<TablesConfigItem> {
  const records = await getSchema0(context, table_name);
  tables[table_name] = tables[table_name] || { opts: { }, columns: [ ] };
  tables[table_name].columns = tables[table_name].columns || [ ];
  tables[table_name].opts = tables[table_name].opts || { };
  tables[table_name].opts.table = table_name;
  // tables[table_name].opts.tableUp = table_name.substring(0,1).toUpperCase() + table_name.substring(1);
  tables[table_name].opts.table_comment = await getTableComment(context, table_name);
  const hasTenant_id = records.some((item: TableCloumn) => item.COLUMN_NAME === "tenant_id");
  tables[table_name].opts.hasTenant_id = hasTenant_id;
  const columns = [ ];
  
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    column.ORDINAL_POSITION = i + 1;
  }
  
  for (let k = 0; k < records.length; k++) {
    const record = records[k];
    let column: TableCloumn = tables[table_name].columns.find((column: any) => column.COLUMN_NAME === record.COLUMN_NAME);
    if (column) {
      Object.assign(record, column);
    }
    columns.push(record);
    // 处理 comment
    let comment = record.COLUMN_COMMENT;
    if (isEmpty(comment)) {
      throw new Error(`table: ${ table_name }, column: ${ record.COLUMN_NAME } comment is empty!`);
    }
    comment = comment.trim();
    // 启用,dict:is_enabled
    if (!comment.endsWith("]")) {
      const arr = comment.substring(comment.lastIndexOf(",") + 1).trim().split(":");
      if (arr.length === 2) {
        const action = arr[0];
        const value = arr[1];
        if (action === "dict") {
          record.dict = value;
        } else if (action === "dictbiz") {
          record.dictbiz = value;
        }
        comment = comment.substring(0, comment.lastIndexOf(","));
        record.COLUMN_COMMENT = comment;
      }
    }
    if (config.ignoreCodegen.includes(record.COLUMN_NAME) && record.ignoreCodegen == null) {
      record.ignoreCodegen = true;
    }
    if (!record.foreignKey && !record.notForeignKeyById) {
      if (record.COLUMN_NAME.endsWith("_ids")) {
        const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_ids".length);
        const defaultSort = tables[table2]?.opts?.defaultSort;
        record.foreignKey = { table: table2, column: "id", lbl: undefined, multiple: true, type: "json", defaultSort };
        // record.many2many = { table: `${ table_name }_${ table2 }`, column1: `${ table_name }_id`, column2: `${ table2 }_id` };
      } else if (record.COLUMN_NAME.endsWith("_id")) {
        const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_id".length);
        const defaultSort = tables[table2]?.opts?.defaultSort;
        record.foreignKey = { table: table2, column: "id", lbl: undefined, multiple: false, defaultSort };
      }
    }
    if (record.foreignKey) {
      if (!record.foreignKey.table) {
        if (record.COLUMN_NAME.endsWith("_ids")) {
          const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_ids".length);
          record.foreignKey.table = table2;
        } else if (record.COLUMN_NAME.endsWith("_id")) {
          const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_id".length);
          record.foreignKey.table = table2;
        }
      }
      record.foreignKey.table = table_names.find((item) => {
        return item.substring(item.indexOf("_") + 1) === record.foreignKey.table;
      });
      if (!record.foreignKey.lbl) {
        const records = await getSchema0(context, record.foreignKey.table);
        if (records.some((item) => item.COLUMN_NAME === "lbl")) {
          record.foreignKey.lbl = "lbl";
        }
      }
      if (!record.foreignKey.defaultSort) {
        record.foreignKey.defaultSort = tables[record.foreignKey.table]?.opts?.defaultSort;
      }
      if (!record.foreignKey.column) {
        record.foreignKey.column = "id";
      }
      const mod_slash_table = record.foreignKey.table.replace("_", "/");
      record.foreignKey.mod_slash_table = mod_slash_table;
      record.foreignKey.mod = record.foreignKey.table.substring(0, record.foreignKey.table.indexOf("_"));
      record.foreignKey.table = record.foreignKey.table.substring(record.foreignKey.table.indexOf("_") + 1);
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
        const table2_name = table_names.find((item) => item.substring(item.indexOf("_") + 1) === table2);
        if (!table2_name) {
          throw new Error(`table2_name not found: ${ table2 }`);
        }
        const mod2 = table2_name.substring(0, table2_name.indexOf("_"));
        const defaultSort = tables[table2_name]?.opts?.defaultSort;
        column.foreignKey = { mod: mod2, table: table2, column: "id", lbl: "lbl", multiple: true, type: "many2many", defaultSort };
        const table = table_name.substring(table_name.indexOf("_") + 1);
        const mod = table_names.find((item) => item.substring(item.indexOf("_") + 1) === table)?.substring(0, table_name.indexOf("_"));
        if (!column.many2many) {
          column.many2many = { mod, table: `${ table }_${ table2 }`, column1: `${ table }_id`, column2: `${ table2 }_id` };
        }
        if (!column.many2many.mod) {
          column.many2many.mod = mod;
        }
        if (!column.many2many.table) {
          column.many2many.table = `${ table }_${ table2 }`;
        }
        if (!column.many2many.column1) {
          column.many2many.column1 = `${ table }_id`;
        }
        if (!column.many2many.column2) {
          column.many2many.column2 = `${ table2 }_id`;
        }
      } else if (column.COLUMN_NAME.endsWith("_id")) {
        const table2 = column.COLUMN_NAME.substring(0, column.COLUMN_NAME.length - "_id".length);
        const table2_name = table_names.find((item) => item.substring(item.indexOf("_") + 1) === table2);
        if (!table2_name) {
          throw new Error(`table2_name not found: ${ table2 }`);
        }
        const mod2 = table2_name.substring(0, table_name.indexOf("_"));
        const defaultSort = tables[table2_name]?.opts?.defaultSort;
        column.foreignKey = { mod: mod2, table: table2, column: "id", lbl: "lbl", multiple: false, defaultSort };
      }
    }
    if (column.foreignKey && !column.foreignKey.table) {
      let table2: string = "";
      if (column.COLUMN_NAME.endsWith("_ids")) {
        table2 = column.COLUMN_NAME.substring(0, column.COLUMN_NAME.length - "_ids".length);
      } else if (column.COLUMN_NAME.endsWith("_id")) {
        table2 = column.COLUMN_NAME.substring(0, column.COLUMN_NAME.length - "_id".length);
      }
      const mod2 = table_names.find((item) => item.substring(item.indexOf("_") + 1) === table2)?.substring(0, table_name.indexOf("_"));
      column.foreignKey.table = table2;
      column.foreignKey.mod = mod2;
    }
    if (column.foreignKey && !column.foreignKey.type) {
      if (column.COLUMN_NAME.endsWith("_ids")) {
        column.foreignKey.type = "many2many";
      }
    }
    if (column.COLUMN_NAME.endsWith("_ids") && !column.many2many) {
      const table = table_name.substring(table_name.indexOf("_") + 1);
      const table2 = column.foreignKey.table;
      const mod = table_names.find((item) => item.substring(item.indexOf("_") + 1) === table)?.substring(0, table_name.indexOf("_"));
      column.many2many = { mod, table: `${ table }_${ table2 }`, column1: `${ table }_id`, column2: `${ table2 }_id` };
    }
    if (column.many2many && !column.many2many.table) {
      const table = table_name.substring(table_name.indexOf("_") + 1);
      column.many2many.table = `${ table }_${ column.foreignKey.table }`;
    }
    if (column.many2many && !column.many2many.column1) {
      const table = table_name.substring(table_name.indexOf("_") + 1);
      column.many2many.column1 = `${ table }_id`;
    }
    if (column.many2many && !column.many2many.column2) {
      column.many2many.column2 = `${ column.foreignKey.table }_id`;
    }
    if (column.foreignKey && !column.foreignKey.column) {
      column.foreignKey.column = "id";
    }
    if (column.foreignKey && !column.foreignKey.lbl) {
      column.foreignKey.lbl = "lbl";
    }
    if (column.foreignKey && column.foreignKey.multiple == null) {
      if (column.COLUMN_NAME.endsWith("_ids")) {
        column.foreignKey.multiple = true;
      } else if (column.COLUMN_NAME.endsWith("_id")) {
        column.foreignKey.multiple = false;
      }
    }
    if (column.foreignKey && !column.foreignKey.defaultSort) {
      column.foreignKey.defaultSort = tables[column.foreignKey.table]?.opts?.defaultSort;
    }
    if (column.foreignTabs) {
      for (let i = 0; i < column.foreignTabs.length; i++) {
        const foreignTab = column.foreignTabs[i];
        if (!foreignTab.mod_slash_table) {
          foreignTab.mod_slash_table = `${ foreignTab.mod }/${ foreignTab.table }`;
        }
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
  let defaultSort = tables[table_name]?.opts?.defaultSort;
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
  if (tables[table_name] && defaultSort)  {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.defaultSort = defaultSort;
  }
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
