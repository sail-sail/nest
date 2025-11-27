import * as mysql from "mysql2";
import type { Pool, PoolConnection } from "mysql2/promise";
import nestConfig from "./nest_config.ts";
import tables from "../tables/tables.ts";
import config, { type TableCloumn, type TablesConfigItem } from "../config.ts";
import { isEmpty } from "./StringUitl.ts";
import { Chalk } from "chalk";

const chalk = new Chalk();

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
    schemaTables = result[0] as any[];
  }
  const table_schema = schemaTables.find(item => item.TABLE_NAME === table_name);
  if (!table_schema) {
    throw new Error(`表不存在: ${ table_name }`);
  }
  const table_comment = table_schema.TABLE_COMMENT || table_name;
  return table_comment;
}

let allTableSchemaRecords: TableCloumn[] = undefined;

async function getSchema0(
  context: Context,
  table_name: string,
): Promise<TableCloumn[]> {
  if (!table_name) {
    return [ ];
  }
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
    allTableSchemaRecords = result[0] as TableCloumn[];
  }
  const records = allTableSchemaRecords.filter((item: TableCloumn) => item.TABLE_NAME === table_name);
  if (!tables[table_name]) {
    throw `数据库中, 表: ${ table_name } 不存在!`;
  }
  const hasOrderBy = tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "order_by" && !item.onlyCodegenDeno);
  // 是否有系统字段 is_sys
  const hasIs_sys = records.some((item: TableCloumn) => [ "is_sys" ].includes(item.COLUMN_NAME));
  // 是否有隐藏字段
  const hasIsHidden = records.some((item: TableCloumn) => [ "is_hidden" ].includes(item.COLUMN_NAME));
  const hasOrgId = records.some((item: TableCloumn) => [ "org_id" ].includes(item.COLUMN_NAME));
  const hasOrgIdLbl = records.some((item: TableCloumn) => [ "org_id_lbl" ].includes(item.COLUMN_NAME));
  const hasCreateTime = records.some((item: TableCloumn) => [ "create_time" ].includes(item.COLUMN_NAME));
  const hasCreateUsrId = records.some((item: TableCloumn) => [ "create_usr_id" ].includes(item.COLUMN_NAME));
  const hasCreateUsrIdLbl = records.some((item: TableCloumn) => [ "create_usr_id_lbl" ].includes(item.COLUMN_NAME));
  const hasUpdateTime = records.some((item: TableCloumn) => [ "update_time" ].includes(item.COLUMN_NAME));
  const hasUpdateUsrId = records.some((item: TableCloumn) => [ "update_usr_id" ].includes(item.COLUMN_NAME));
  const hasUpdateUsrIdLbl = records.some((item: TableCloumn) => [ "update_usr_id_lbl" ].includes(item.COLUMN_NAME));
  const hasIsDeleted = records.some((item: TableCloumn) => [ "is_deleted" ].includes(item.COLUMN_NAME));
  const hasDeleteUsrId = records.some((item: TableCloumn) => [ "delete_usr_id" ].includes(item.COLUMN_NAME));
  const hasDeleteUsrIdLbl = records.some((item: TableCloumn) => [ "delete_usr_id_lbl" ].includes(item.COLUMN_NAME));
  const hasDeleteTime = records.some((item: TableCloumn) => [ "delete_time" ].includes(item.COLUMN_NAME));
  const hasVersion = records.some((item: TableCloumn) => [ "version" ].includes(item.COLUMN_NAME));
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
        record.canSearch = true;
        continue;
      }
      if (column.COLUMN_NAME === record.COLUMN_NAME) {
        records2.push(record);
        break;
      }
    }
  }
  const tenant_idColumn = records.find((item: TableCloumn) => item.COLUMN_NAME === "tenant_id");
  if (tenant_idColumn && !records2.some((item: TableCloumn) => item.COLUMN_NAME === "tenant_id")) {
    records2.push(tenant_idColumn);
  }
  const is_deletedColumn = records.find((item: TableCloumn) => item.COLUMN_NAME === "is_deleted");
  if (is_deletedColumn && !records2.some((item: TableCloumn) => item.COLUMN_NAME === "is_deleted")) {
    records2.push(is_deletedColumn);
  }
  if (hasIs_sys && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "is_sys")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "is_sys",
      COLUMN_TYPE: "tinyint(1) unsigned",
      DATA_TYPE: "tinyint",
      COLUMN_COMMENT: "系统字段",
      onlyCodegenDeno: true,
    });
  }
  // 隐藏记录
  if (hasIsHidden && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "is_hidden")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "is_hidden",
      COLUMN_TYPE: "tinyint(1) unsigned",
      DATA_TYPE: "tinyint",
      COLUMN_COMMENT: "隐藏记录",
      onlyCodegenDeno: true,
    });
  }
  // 组织
  if (hasOrgId && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "org_id")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "org_id",
      COLUMN_TYPE: "varchar(22)",
      DATA_TYPE: "varchar",
      COLUMN_COMMENT: "组织",
      onlyCodegenDeno: true,
      canSearch: true,
      foreignKey: {
        mod: "base",
        table: "org",
        column: "id",
        lbl: "lbl",
      },
    });
  }
  // 创建人
  if (hasCreateUsrId && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "create_usr_id")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "create_usr_id",
      COLUMN_TYPE: "varchar(22)",
      DATA_TYPE: "varchar",
      COLUMN_COMMENT: "创建人",
      onlyCodegenDeno: true,
      canSearch: true,
    });
  }
  // 创建时间
  if (hasCreateTime && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "create_time")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "create_time",
      COLUMN_TYPE: "datetime",
      DATA_TYPE: "datetime",
      COLUMN_COMMENT: "创建时间",
      onlyCodegenDeno: true,
    });
  }
  // 更新人
  if (hasUpdateUsrId && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "update_usr_id")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "update_usr_id",
      COLUMN_TYPE: "varchar(22)",
      DATA_TYPE: "varchar",
      COLUMN_COMMENT: "更新人",
      onlyCodegenDeno: true,
      canSearch: true,
    });
  }
  // 更新时间
  if (hasUpdateTime && !tables[table_name].columns.some((item: TableCloumn) => item.COLUMN_NAME === "update_time")) {
    tables[table_name].columns.push({
      COLUMN_NAME: "update_time",
      COLUMN_TYPE: "datetime",
      DATA_TYPE: "datetime",
      COLUMN_COMMENT: "更新时间",
      onlyCodegenDeno: true,
    });
  }
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const item = tables[table_name].columns[i];
    const column_name = item.COLUMN_NAME;
    if (column_name === "id") {
      item.canSearch = true;
    }
    const record = records2.find((item: TableCloumn) => item.COLUMN_NAME === column_name);
    if (column_name === "is_hidden") {
      if (item.onlyCodegenDeno != null) {
        item.onlyCodegenDeno = true;
      }
    }
    if (column_name === "org_id") {
      if (!item.COLUMN_DEFAULT) {
        item.COLUMN_DEFAULT = "CURRENT_ORG_ID";
      }
      if (hasOrgIdLbl) {
        item.modelLabel = "org_id_lbl";
      }
      if (item.require == null) {
        item.require = true;
      }
    }
    if ([ "tenant_id", "is_deleted" ].includes(column_name)) {
      item.isVirtual = true;
      item.ignoreCodegen = false;
    } else if ([ "create_usr_id", "create_time", "update_usr_id", "update_time", "is_deleted"  ].includes(column_name)) {
      item.ignoreCodegen = false;
      item.noAdd = true;
      item.noEdit = true;
      if (item.noDetail == null) {
        item.noDetail = true;
      }
    }
    if (column_name === "is_default") {
      if (item.width == null) {
        item.width = 85;
      }
      if (item.isSwitch == null) {
        item.isSwitch = true;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
      if (item.canSearch == null) {
        item.canSearch = true;
      }
    }
    if ([ "create_usr_id", "update_usr_id" ].includes(column_name)) {
      item.foreignKey = item.foreignKey || { };
      item.foreignKey.mod = "base";
      item.foreignKey.table = "usr";
      item.foreignKey.column = "id";
      item.foreignKey.lbl = item.foreignKey.lbl || "lbl";
      if (item.width == null) {
        item.width = 120;
      }
      if (item.align == null) {
        item.align = "center";
      }
      if (hasCreateUsrIdLbl && column_name === "create_usr_id") {
        item.modelLabel = "create_usr_id_lbl";
      } else if (hasUpdateUsrIdLbl && column_name === "update_usr_id") {
        item.modelLabel = "update_usr_id_lbl";
      }
      if (item.canSearch == null) {
        item.canSearch = true;
      }
    }
    if ([ "create_time", "update_time" ].includes(column_name)) {
      if (item.width == null) {
        item.width = 160;
      }
    }
    if (column_name === "lbl") {
      if (item.width == null && item.minWidth == null) {
        item.width = 200;
      }
      if (item.require == null) {
        item.require = true;
      }
      if (item.search == null) {
        item.search = true;
        if (item.canSearch == null) {
          item.canSearch = true;
        }
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = true;
      }
      if (item.align == null) {
        item.align = "left";
      }
      if (item.fixed == null) {
        item.fixed = "left";
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
        if (item.canSearch == null) {
          item.canSearch = true;
        }
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = true;
      }
      if (item.align == null) {
        item.align = "left";
      }
      if (item.fixed == null) {
        item.fixed = "left";
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
        item.width = 85;
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
        item.width = 85;
      }
      if (item.showOverflowTooltip == null) {
        item.showOverflowTooltip = false;
      }
      if (item.search == null) {
        item.search = true;
        if (item.canSearch == null) {
          item.canSearch = true;
        }
      }
      if (item.noDetail == null) {
        item.noDetail = true;
      }
    }
    if (column_name.startsWith("is_")
      || record?.COLUMN_TYPE.toLowerCase() === "tinyint(1) unsigned"
      || record?.COLUMN_TYPE.toLowerCase() === "tinyint unsigned"
    ) {
      if (item.width == null) {
        item.width = 85;
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
      if (item.searchMultiple == null) {
        item.searchMultiple = false;
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
      if (item.require == null) {
        item.require = true;
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
      || (column_name === "icon" || column_name.endsWith("_icon"))
    ) {
      if (column_name === "img" || column_name.endsWith("_img")) {
        if (item.isImg == null) {
          item.isImg = true;
        }
      } else if (column_name === "att" || column_name.endsWith("_att")) {
        if (item.isAtt == null) {
          item.isAtt = true;
        }
      } else if (column_name === "icon" || column_name.endsWith("_icon")) {
        if (item.isIcon == null) {
          item.isIcon = true;
        }
      }
      if (item.isIcon) {
        if (item.require == null) {
          item.require = true;
        }
        if (item.isPublicAtt == null) {
          item.isPublicAtt = true;
        }
      }
      if (item.width == null) {
        let column_comment = item.COLUMN_COMMENT || "";
        if (column_comment) {
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
    // 默认 create_time 跟 update_time 都是可以排序的, 如果有 order_by 字段, 则 order_by 字段优先级最高
    if (item.COLUMN_NAME === "create_time" || item.COLUMN_NAME === "update_time") {
      if (item.sortable == null) {
        item.sortable = true;
      }
    }
    // 是否不显示导入导出中的下拉框, 若不设置, create_usr_id 跟 update_usr_id 默认为 true
    if (
      (item.COLUMN_NAME === "create_usr_id" || item.COLUMN_NAME === "update_usr_id") &&
      item.notImportExportList == null
    ) {
      item.notImportExportList = true;
    }
    if (record && record.DATA_TYPE === "date") {
      if (item.width == null) {
        item.width = 100;
      }
    }
    if (record && record.DATA_TYPE === "datetime") {
      if (item.width == null) {
        item.width = 160;
      }
    }
    
    // 是否省市县区选择控件
    if (item.COLUMN_NAME === "province_code" || item.COLUMN_NAME.endsWith("_province_code")) {
      if (item.isProvinceCode === undefined) {
        item.isProvinceCode = true;
      }
    }
    if (item.COLUMN_NAME === "province_lbl" || item.COLUMN_NAME.endsWith("_province_lbl")) {
      if (item.isProvinceLbl === undefined) {
        item.isProvinceLbl = true;
      }
    }
    if (item.COLUMN_NAME === "city_code" || item.COLUMN_NAME.endsWith("_city_code")) {
      if (item.isCityCode === undefined) {
        item.isCityCode = true;
      }
    }
    if (item.COLUMN_NAME === "city_lbl" || item.COLUMN_NAME.endsWith("_city_lbl")) {
      if (item.isCityLbl === undefined) {
        item.isCityLbl = true;
      }
    }
    if (item.COLUMN_NAME === "county_code" || item.COLUMN_NAME.endsWith("_county_code")) {
      if (item.isCountyCode === undefined) {
        item.isCountyCode = true;
      }
    }
    if (item.COLUMN_NAME === "county_lbl" || item.COLUMN_NAME.endsWith("_county_lbl")) {
      if (item.isCountyLbl === undefined) {
        item.isCountyLbl = true;
      }
    }
    if (item.COLUMN_NAME === "address" || item.COLUMN_NAME.endsWith("_address")) {
      if (item.isAddress === undefined) {
        item.isAddress = true;
      }
    }
    if (
      item.isProvinceCode || item.isProvinceLbl ||
      item.isCityCode || item.isCityLbl ||
      item.isCountyCode
    ) {
      if (item.onlyCodegenDeno == null) {
        item.onlyCodegenDeno = true;
      }
      if (item.onlyCodegenDenoButApi == null) {
        item.onlyCodegenDenoButApi = true;
      }
    }
    if (item.isCountyLbl) {
      if (item.width == null) {
        item.width = 200;
      }
      if (item.align == null) {
        item.align = "left";
      }
    }
    if (item.isAddress) {
      if (item.width == null) {
        item.width = 220;
      }
      if (item.align == null) {
        item.align = "left";
      }
      if (item.isTextarea == null) {
        item.isTextarea = true;
      }
    }
    
    // 自动编码默认固定生成唯一索引配置
    if (item.autoCode && !item.autoCode.dateSeq) {
      tables[table_name].opts = tables[table_name].opts || { };
      tables[table_name].opts.uniques = tables[table_name].opts.uniques || [ ];
      if (
        !tables[table_name].opts.uniques.some(
          (uniqueItem) => {
            if (uniqueItem.length !== 1) {
              return false;
            }
            return uniqueItem[0] === column_name;
          }
        )
      ) {
        tables[table_name].opts.uniques.push([ column_name ]);
      }
    } else if (item.autoCode && item.autoCode.dateSeq) {
      tables[table_name].opts = tables[table_name].opts || { };
      tables[table_name].opts.uniques = tables[table_name].opts.uniques || [ ];
      if (
        !tables[table_name].opts.uniques.some(
          (uniqueItem) => {
            if (uniqueItem.length !== 2) {
              return false;
            }
            return uniqueItem[0] === item.autoCode.dateSeq && uniqueItem[1] === column_name;
          }
        )
      ) {
        tables[table_name].opts.uniques.push([ item.autoCode.dateSeq, column_name ]);
      }
    }
    
    if (item.isFluentEditor) {
      if (item.noList == null) {
        item.noList = true;
      }
    }
    
    // 关键字搜索
    if (tables[table_name]?.opts?.searchByKeyword) {
      const fields = tables[table_name].opts.searchByKeyword.fields;
      if (fields && fields.includes(column_name)) {
        if (item.canSearch == null) {
          item.canSearch = true;
        }
      }
    }
    
  }
  
  // 校验
  for (let i = 0; i < records2.length; i++) {
    const record = records2[i];
    if (record.validators) {
      continue;
    }
    const column_name = record.COLUMN_NAME;
    const column = tables[table_name].columns.find((item: TableCloumn) => item.COLUMN_NAME === column_name);
    if (column) {
      const isIcon = column.isIcon;
      if (isIcon) {
        record.validators = [ ];
        continue;
      }
    }
    record.validators = [ ];
    if (record.COLUMN_NAME === "id") {
      record.validators.push({
        chars_max_length: 22,
        chars_min_length: 22,
      });
    } else if (record.foreignKey && !record.foreignKey.multiple) {
      record.validators.push({
        chars_max_length: 22,
        chars_min_length: 22,
      });
    } else if (record.foreignKey && record.foreignKey.multiple) {
      record.validators.push({
        max_items: Math.floor(record.CHARACTER_MAXIMUM_LENGTH / 22),
      });
    } else if (record.DATA_TYPE === "varchar" || record.DATA_TYPE === "char") {
      if (record.CHARACTER_MAXIMUM_LENGTH) {
        record.validators.push({
          chars_max_length: record.CHARACTER_MAXIMUM_LENGTH,
        });
      }
    }
  }
  // 用于显示的字段
  if (!tables[table_name]?.opts?.lbl_field && records2.some((item: TableCloumn) => item.COLUMN_NAME === "lbl")) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.lbl_field = "lbl";
  }
  // 如果没有设置默认排序, 则设置默认排序为 create_time desc, 如果有 order_by 字段则其优先级最高
  if (
    !hasOrderBy
    && (!tables[table_name]?.opts?.defaultSort)
  ) {
    tables[table_name].opts = tables[table_name].opts || { };
    if (hasCreateTime) {
      tables[table_name].opts.defaultSort = {
        prop: "create_time",
        order: "descending",
      };
    }
  } else if (
    hasOrderBy
    && (!tables[table_name]?.opts?.defaultSort)
  ) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.defaultSort = {
      prop: "order_by",
      order: "ascending",
    };
  }
  if (hasOrgId && tables[table_name]?.opts?.hasOrgId == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasOrgId = true;
  }
  if (hasOrgIdLbl && tables[table_name]?.opts?.hasOrgIdLbl == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasOrgIdLbl = true;
  }
  if (hasCreateTime && tables[table_name]?.opts?.hasCreateTime == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasCreateTime = true;
  }
  if (hasCreateUsrId && tables[table_name]?.opts?.hasCreateUsrId == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasCreateUsrId = true;
  }
  if (hasCreateUsrIdLbl && tables[table_name]?.opts?.hasCreateUsrIdLbl == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasCreateUsrIdLbl = true;
  }
  if (hasUpdateTime && tables[table_name]?.opts?.hasUpdateTime == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasUpdateTime = true;
  }
  if (hasUpdateUsrId && tables[table_name]?.opts?.hasUpdateUsrId == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasUpdateUsrId = true;
  }
  if (hasUpdateUsrIdLbl && tables[table_name]?.opts?.hasUpdateUsrIdLbl == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasUpdateUsrIdLbl = true;
  }
  if (hasIsDeleted && tables[table_name]?.opts?.hasIsDeleted == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasIsDeleted = true;
  }
  if (hasDeleteUsrId && tables[table_name]?.opts?.hasDeleteUsrId == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasDeleteUsrId = true;
  }
  if (hasDeleteUsrIdLbl && tables[table_name]?.opts?.hasDeleteUsrIdLbl == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasDeleteUsrIdLbl = true;
  }
  if (hasDeleteTime && tables[table_name]?.opts?.hasDeleteTime == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasDeleteTime = true;
  }
  if (hasVersion && tables[table_name]?.opts?.hasVersion == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.hasVersion = true;
  }
  if (tables[table_name]?.opts?.hasVersion === true && tables[table_name]?.opts?.isRealData == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.isRealData = true;
  }
  if (tables[table_name]?.opts?.inlineForeignTabs?.length > 0) {
    for (let i = 0; i < tables[table_name].opts.inlineForeignTabs.length; i++) {
      const item = tables[table_name].opts.inlineForeignTabs[i];
      if (!item.column_name) {
        item.column_name = item.table;
      }
      if (!item.foreign_type) {
        item.foreign_type = "one2many";
      }
    }
  }
  // Detail.vue 中表单文本框的宽度, 默认为: 380px
  if (tables[table_name]?.opts?.detailFormWidth == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.detailFormWidth = "380px";
  }
  // List.vue 中表单中表单文本框的宽度, 默认为: 340px
  if (tables[table_name]?.opts?.searchFormWidth == null) {
    tables[table_name].opts = tables[table_name].opts || { };
    tables[table_name].opts.searchFormWidth = "340px";
  }
  return records2;
}

let tablesConfigItemMap: {
  [key: string]: TablesConfigItem;
} = { };

export async function getSchema(
  context: Context,
  table_name: string,
  table_names: string[],
): Promise<TablesConfigItem> {
  if (tablesConfigItemMap[table_name]) {
    return tablesConfigItemMap[table_name];
  }
  const records = await getSchema0(context, table_name);
  tables[table_name] = tables[table_name] || { opts: { }, columns: [ ] };
  tables[table_name].columns = tables[table_name].columns || [ ];
  tables[table_name].opts = tables[table_name].opts || { };
  tables[table_name].opts.table_name = table_name;
  const mod = table_name.substring(0, table_name.indexOf("_"));
  const table = table_name.substring(table_name.indexOf("_") + 1);
  tables[table_name].opts.mod = mod;
  tables[table_name].opts.table = table;
  tables[table_name].opts.tableUp = table.substring(0,1).toUpperCase() + table.substring(1);
  tables[table_name].opts.table_comment = await getTableComment(context, table_name);
  const hasTenant_id = records.some((item: TableCloumn) => item.COLUMN_NAME === "tenant_id");
  tables[table_name].opts.hasTenant_id = hasTenant_id;
  const columns = [ ];
  
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    column.ORDINAL_POSITION = i + 1;
    
    // 检查是否有重复的列
    let isDuplicate = false;
    for (let j = i + 1; j < tables[table_name].columns.length; j++) {
      const item = tables[table_name].columns[j];
      if (item.COLUMN_NAME === column.COLUMN_NAME) {
        isDuplicate = true;
        break;
      }
    }
    if (isDuplicate) {
      throw new Error(`表: ${ table_name }, 列: ${ column.COLUMN_NAME } 重复了!`);
    }
  }
  
  const dictModels = await getDictModels(context);
  const dictbizModels = await getDictbizModels(context);
  
  const dictHeadModels = await getDictHeadModels(context);
  const dictbizHeadModels = await getDictbizHeadModels(context);
  
  for (let k = 0; k < records.length; k++) {
    const record = records[k];
    let column: TableCloumn = tables[table_name].columns.find((column: any) => column.COLUMN_NAME === record.COLUMN_NAME);
    if (column) {
      Object.assign(record, column);
    }
    columns.push(record);
    // 处理 comment
    let comment = record.COLUMN_COMMENT;
    const oldComment = comment;
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
    // 系统字典, 业务字典
    if (record.dict) {
      const dictModels0 = dictModels.filter((item) => item.code === record.dict);
      record.dict_models = dictModels0;
      record.dict_head_model = dictHeadModels.find((item) => item.code === record.dict);
    } else if (record.dictbiz) {
      const dictbizModels0 = dictbizModels.filter((item) => item.code === record.dictbiz);
      record.dict_models = dictbizModels0;
      record.dict_head_model = dictbizHeadModels.find((item) => item.code === record.dictbiz);
    }
    if ((record.dict || record.dictbiz) && !record.dict_head_model) {
      // throw new Error(`table: ${ table_name }, column: ${ record.COLUMN_NAME }, 业务字典: ${ record.dict || record.dictbiz } 不存在!`);
    } else if (record.dict_head_model && record.dictHasSelectAdd == null && record.dict_head_model.is_add) {
      record.dictHasSelectAdd = true;
    }
    // 检查系统字典, 业务字典的数据类型是否正确
    const data_type = record.DATA_TYPE.toLowerCase();
    if (
      record.dict_head_model && !record.dict_head_model.is_add && record.dict_head_model.is_sys
      && data_type !== "tinyint" && data_type !== "int" && data_type !== "bigint" && data_type !== "decimal"
    ) {
      const column_type = record.COLUMN_TYPE;
      const enumItems = [ ];
      if (data_type === "enum") {
        const enumItems0 = column_type.substring(column_type.indexOf("(") + 1, column_type.indexOf(")")).split(",");
        for (let i = 0; i < enumItems0.length; i++) {
          enumItems.push(enumItems0[i].substring(1, enumItems0[i].length - 1));
        }
      }
      const enumItemsDict = [ ];
      if (record.dict_models) {
        for (let i = 0; i < record.dict_models.length; i++) {
          enumItemsDict.push(record.dict_models[i].val);
        }
      }
      let defaultValue = record.COLUMN_DEFAULT;
      // 如果 enumItems 跟 enumItemsDict 不一致, 则报错并给出正确的 enum 数据类型
      let isMatch = true;
      if (!enumItemsDict.includes(defaultValue)) {
        isMatch = false;
      } else if (enumItems.length !== enumItemsDict.length) {
        isMatch = false;
      } else {
        for (let i = 0; i < enumItems.length; i++) {
          if (!enumItemsDict.includes(enumItems[i])) {
            isMatch = false;
            break;
          }
        }
      }
      if (!isMatch) {
        if (!enumItemsDict.includes(defaultValue)) {
          defaultValue = enumItemsDict[0];
        }
        let errMsg = `
错误: 表: ${ table_name }, 列: ${ record.COLUMN_NAME }, 数据类型应该为:`;
        errMsg += `

ALTER TABLE \`${ table_name }\` CHANGE COLUMN \`${ record.COLUMN_NAME }\`
\`${ record.COLUMN_NAME }\` ENUM('${ enumItemsDict.join("', '") }') NOT NULL DEFAULT '${ defaultValue }' COMMENT '${ oldComment }';
`;
        throw chalk.red(errMsg);
      }
    }
    if (data_type === "enum") {
      record.DATA_TYPE = "varchar";
      record.COLUMN_TYPE = `varchar(${ record.CHARACTER_MAXIMUM_LENGTH })`;
    }
    if (config.ignoreCodegen.includes(record.COLUMN_NAME) && record.ignoreCodegen == null) {
      record.ignoreCodegen = true;
    }
    if (!record.foreignKey && !record.notForeignKeyById) {
      if (record.COLUMN_NAME.endsWith("_ids")) {
        const table2 = record.COLUMN_NAME.substring(0, record.COLUMN_NAME.length - "_ids".length);
        const defaultSort = tables[table2]?.opts?.defaultSort;
        record.foreignKey = { table: table2, column: "id", lbl: undefined, multiple: true, type: "many2many", defaultSort };
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
        if (records.length === 0) {
          throw new Error(`表: ${ table_name }, 列: ${ record.COLUMN_NAME }, 对应的外键关联表不存在: foreignKey: ${ JSON.stringify(record.foreignKey) }`);
        }
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
        if (record.canSearch == null) {
          record.canSearch = true;
        }
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
    if (record.isEncrypt) {
      record.search = false;
      record.canSearch = false;
    }
    // 业务字典, 系统字典, 外键关联字段 都默认为必填
    if (!record.noAdd && !record.noEdit) {
      if (record.dict || record.dictbiz || (record.foreignKey && !record.foreignKey.multiple)) {
        if (record.require == null) {
          record.require = true;
        }
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
          throw new Error(`${ table_name }.${ column.COLUMN_NAME } table2_name not found: ${ table2 }`);
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
    if (column.foreignKey && column.foreignKey.lbl === undefined) {
      const columnsTmp = tables[column.foreignKey.mod + "_" + column.foreignKey.table]?.columns || [ ];
      if (columnsTmp.some((item) => item.COLUMN_NAME === "lbl")) {
        column.foreignKey.lbl = "lbl";
      }
    }
    if (column.foreignKey && column.foreignKey.multiple == null) {
      if (column.COLUMN_NAME.endsWith("_ids")) {
        column.foreignKey.multiple = true;
      } else if (column.COLUMN_NAME.endsWith("_id")) {
        column.foreignKey.multiple = false;
      }
    }
    // 主表删除数据时是否级联删除, 默认为 false
    if (column.foreignKey && !column.foreignKey.defaultSort) {
      column.foreignKey.defaultSort = tables[column.foreignKey.mod + "_" + column.foreignKey.table]?.opts?.defaultSort;
    }
    if (column.foreignTabs) {
      for (let i = 0; i < column.foreignTabs.length; i++) {
        const foreignTab = column.foreignTabs[i];
        if (!foreignTab.mod_slash_table) {
          foreignTab.mod_slash_table = `${ foreignTab.mod }/${ foreignTab.table }`;
        }
      }
    }
    if (column.foreignKey) {
      if (column.canSearch == null) {
        column.canSearch = true;
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
  // 外键关联表的默认排序
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const item = tables[table_name].columns[i];
    if (item.foreignKey && !item.foreignKey.defaultSort) {
      let defaultSort = tables[item.foreignKey.mod + "_" + item.foreignKey.table]?.opts?.defaultSort;
      for (const columnTmp of tables[item.foreignKey.mod + "_" + item.foreignKey.table]?.columns || []) {
        if (columnTmp.COLUMN_NAME === "order_by") {
          if (!defaultSort) {
            defaultSort = {
              prop: "order_by",
              order: "ascending",
            };
          }
          break;
        }
      }
      item.foreignKey.defaultSort = {
        ...defaultSort,
      };
    }
  }
  
  // 外键关联的默认width
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    if (column.foreignKey && !column.foreignKey.multiple && (column.width == null || column.align == null)) {
      const foreignKey = column.foreignKey;
      const foreignSchema = tables[foreignKey.mod + "_" + foreignKey.table];
      if (!foreignSchema?.columns) {
        throw new Error(`表: ${ table_name }, 列: ${ column.COLUMN_NAME }, 对应的外键关联表不存在: foreignKey: ${ JSON.stringify(foreignKey) }`);
      }
      let foreignLbl = foreignKey.lbl || "lbl";
      if (Array.isArray(foreignLbl)) {
        foreignLbl = foreignLbl[0];
      }
      const foreignColumn = foreignSchema.columns.find((item) => item.COLUMN_NAME === foreignLbl);
      if (foreignColumn) {
        if (column.width == null && foreignColumn.width != null) {
          column.width = foreignColumn.width;
        }
        if (column.align == null && foreignColumn.align != null) {
          column.align = foreignColumn.align;
        }
      }
    }
  }
  
  // canSearch
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    if (column.canSearch == null) {
      if (column.search) {
        column.canSearch = true;
      } else {
        if (column.foreignKey) {
          column.canSearch = true;
        }
      }
    }
  }
  
  // canSortInApi
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    if (column.canSortInApi == null && column.sortable || tables[table_name]?.opts?.defaultSort?.prop === column.COLUMN_NAME) {
      column.canSortInApi = true;
    }
  }
  
  // langTable
  if (!tables[table_name].opts.langTable) {
    const all_table_names = await getAllTables(context);
    for (let i = 0; i < all_table_names.length; i++) {
      const table_name2 = all_table_names[i].TABLE_NAME;
      if (table_name2 === `${ mod }_${ table }_lang`) {
        (tables[table_name].opts.langTable as any) = tables[table_name].opts.langTable || { };
        (tables[table_name].opts.langTable.opts as any) = tables[table_name].opts.langTable.opts || { };
        tables[table_name].opts.langTable.opts.mod = mod;
        tables[table_name].opts.langTable.opts.table = `${ table }_lang`;
        tables[table_name].opts.langTable.opts.table_name = table_name2;
        tables[table_name].opts.langTable.records = allTableSchemaRecords.filter((item: TableCloumn) => item.TABLE_NAME === table_name2);
      }
    }
  }
  
  // 审核
  if (tables[table_name].opts.audit) {
    const audit = tables[table_name].opts.audit;
    if (audit.auditTable) {
      const auditMod = audit.auditMod || mod;
      const auditTable = audit.auditTable;
      const auditTableSchema = await getSchema(context, auditMod + "_" + auditTable, table_names);
      if (!auditTableSchema) {
        throw new Error(`表: ${ table_name } 的审核表: ${ auditTable } 不存在!`);
      }
      audit.auditTableSchema = auditTableSchema;
    }
    // 复核
    const auditColumnName = audit.column;
    const auditColumn = tables[table_name].columns.find((item) => item.COLUMN_NAME === auditColumnName);
    const dict_models = auditColumn.dict_models;
    if (dict_models && dict_models.some((item) => item.val === "reviewed")) {
      audit.hasReviewed = true;
    }
    // 审核字段默认为不可改
    if (auditColumn && auditColumn.readonly == null) {
      auditColumn.readonly = true;
    }
  }
  
  // 校验 modelLabel 对应的字段是否在外键关联表中存在
  const oldRecords = allTableSchemaRecords.filter((item: TableCloumn) => item.TABLE_NAME === table_name);
  for (let i = 0; i < tables[table_name].columns.length; i++) {
    const column = tables[table_name].columns[i];
    if (column.modelLabel && column.foreignKey) {
      if (!oldRecords.some((item0: TableCloumn) => item0.COLUMN_NAME === column.modelLabel)) {
        throw new Error(`表: ${ table_name } 中, 字段: ${ column.COLUMN_NAME } 的 modelLabel: ${ column.modelLabel } 不存在!`);
      }
      continue;
    }
    if (!column.modelLabel && column.foreignKey
      && oldRecords.some((item0: TableCloumn) => item0.COLUMN_NAME === `${ column.COLUMN_NAME }_lbl`)
    ) {
      throw new Error(`表: ${ table_name } 中, 字段: ${ column.COLUMN_NAME } 的 modelLabel 未设置, 但却存在 ${ column.COLUMN_NAME }_lbl 字段!`);
    }
  }
  
  tablesConfigItemMap[table_name] = tables[table_name];
  return tablesConfigItemMap[table_name];
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
    schemaTables = result[0] as any[];
  }
  return schemaTables;
}

export type DictModel = {
  id: string;
  code: string;
  lbl: string;
  val: string;
  type: string;
};

export type DictHeadModel = {
  id: string;
  code: string;
  lbl: string;
  type: string;
  is_enabled: 0 | 1;
  is_sys: 0 | 1;
  is_add: 0 | 1;
};

let _dictModels: DictModel[] = undefined;

export async function getDictModels(context: Context) {
  if (!_dictModels) {
    const sql = `
      select
        t.id,
        base_dict.code,
        t.lbl,
        t.val,
        base_dict.type,
        base_dict.is_add
      from
        base_dict_detail t
      inner join base_dict
        on base_dict.id = t.dict_id
        and base_dict.is_deleted = 0
        and base_dict.is_sys = 1
      where
        t.is_deleted = 0
        and t.is_sys = 1
      order by
        base_dict.code asc,
        t.order_by asc,
        t.create_time asc
    `;
    const result = await context.conn.query(sql);
    _dictModels = result[0] as any[];
  }
  return _dictModels;
}

let _dictbizModels: DictModel[] = undefined;

export async function getDictbizModels(context: Context) {
  if (!_dictbizModels) {
    let tenant_id = "";
    {
      const sql = `
        select t.id
        from base_tenant t
        where t.is_deleted = 0 and t.is_sys = 1
        order by t.order_by asc, t.create_time asc
        limit 1
      `
      const result = await context.conn.query(sql);
      const records = result[0] as any[];
      if (records.length === 0) {
        throw new Error(`租户不存在`);
      }
      tenant_id = records[0].id;
    }
    if (!tenant_id) {
      throw new Error(`系统租户不存在`);
    }
    const sql = `
      select
        t.id,
        base_dictbiz.code,
        t.lbl,
        t.val,
        base_dictbiz.type,
        base_dictbiz.is_add
      from
        base_dictbiz_detail t
      inner join base_dictbiz
        on base_dictbiz.id = t.dictbiz_id
        and base_dictbiz.is_deleted = 0
        and base_dictbiz.is_sys = 1
      where
        t.is_deleted = 0
        and t.is_sys = 1
        and t.tenant_id = ?
      order by
        base_dictbiz.code asc,
        t.order_by asc,
        t.create_time asc
    `;
    const result = await context.conn.query(sql, [ tenant_id ]);
    _dictbizModels = result[0] as any[];
  }
  return _dictbizModels;
}

let _dictHeadModels: DictHeadModel[] = undefined;

export async function getDictHeadModels(context: Context) {
  if (!_dictHeadModels) {
    const sql = `
      select
        t.id,
        t.code,
        t.lbl,
        t.type,
        t.is_enabled,
        t.is_sys,
        t.is_add
      from
        base_dict t
      where
        t.is_deleted = 0
        and t.is_sys = 1
      order by
        t.order_by asc
    `;
    const result = await context.conn.query(sql);
    _dictHeadModels = result[0] as any[];
  }
  return _dictHeadModels;
}

let _dictbizHeadModels: DictHeadModel[] = undefined;

export async function getDictbizHeadModels(context: Context) {
  if (!_dictbizHeadModels) {
    const sql = `
      select
        t.id,
        t.code,
        t.lbl,
        t.type,
        t.is_enabled,
        t.is_sys,
        t.is_add
      from
        base_dictbiz t
      where
        t.is_deleted = 0
        and t.is_sys = 1
      order by
        t.order_by asc
    `;
    const result = await context.conn.query(sql);
    _dictbizHeadModels = result[0] as any[];
  }
  return _dictbizHeadModels;
}

/**
 * 检查此表是否有selectInput
 */
export function hasSelectInputFn(
  table_name: string,
) {
  let hasSelectInput = tables[table_name].opts?.hasSelectInput;
  if (hasSelectInput != null) {
    return hasSelectInput;
  }
  const keys = Object.keys(tables);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const columns = tables[key].columns;
    let hasSelectInput = false;
    for (const column of columns) {
      if (!column.foreignKey) continue;
      if (column.foreignKey.mod + "_" + column.foreignKey.table === table_name) {
        if (column.foreignKey.selectType === "selectInput" || column.foreignKey.isSearchBySelectInput) {
          hasSelectInput = true;
          break;
        }
      }
    }
    if (hasSelectInput) {
      return true;
    }
  }
  return false;
}
