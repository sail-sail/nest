import {
  initContext,
  getAllTables,
  getSchema,
  type Context,
} from "../lib/information_schema.ts";

import * as crypto from "node:crypto";

import * as dayjs from "dayjs";

import tables_cnf from "../tables/tables.ts";

const old_tables_cnf = JSON.parse(JSON.stringify(tables_cnf)) as typeof tables_cnf;

interface MenuModel {
  id: string;
  parent_id: string;
  lbl: string;
  route_path: string;
}

interface FieldPermitModel {
  id: string;
  menu_id: string;
  code: string;
  lbl: string;
}

async function getMenus(context: Context): Promise<MenuModel[]> {
  const sql = "select id,parent_id,lbl,route_path from base_menu where is_deleted=0";
  const [ menu_models ] = await context.conn.query(sql);
  return menu_models as MenuModel[];
}

async function exec() {
  console.time("field_permit");
  
  const context = await initContext();
  
  const menu_models = await getMenus(context);
  
  const route_path_map = new Map<string, MenuModel>();
  
  for (const menu_model of menu_models) {
    route_path_map.set(menu_model.route_path, menu_model);
  }
  
  const sql = "select id,menu_id,code,lbl from base_field_permit order by order_by asc";
  const [ models ] = await context.conn.query(sql);
  const field_permit_models = models as FieldPermitModel[];
  
  const tables = await getAllTables(context);
  
  const table_names = tables.map((table) => table.TABLE_NAME)
    .filter((table_name) => !!old_tables_cnf[table_name]);
  
  for (let i = 0; i < table_names.length; i++) {
    const table_name = table_names[i];
    
    const route_path = "/" + table_name.substring(0, table_name.indexOf("_"))
    + "/" + table_name.substring(table_name.indexOf("_") + 1);
    const menu_model = route_path_map.get(route_path);
    if (!menu_model) {
      continue;
    }
    const menu_id = menu_model.id;
    
    const schema = await getSchema(context, table_name, table_names);
    const columns = schema.columns;
      
    let ignoreNum = 0;
    let updateNum = 0;
    let createNum = 0;
    
    for (let j = 0; j < columns.length; j++) {
      const column = columns[j];
      if (column.isVirtual) continue;
      if (column.onlyCodegenDeno) continue;
      if (!column.fieldPermit) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      
      if (!old_tables_cnf[table_name].columns.some((column) => column.COLUMN_NAME === column_name)) {
        continue;
      }
      
      const code = column_name;
      const lbl = column_comment.split(",")[0];
      
      const field_permit_model = field_permit_models.find((model) => model.code === code && model.menu_id === menu_id);
      
      if (field_permit_model && field_permit_model.lbl === lbl) {
        ignoreNum++;
      } else if (field_permit_model) {
        const sql = "update base_field_permit set lbl=? where id=?";
        await context.conn.query(sql, [ lbl, field_permit_model.id ]);
        updateNum++;
      } else {
        const id = crypto.createHash("md5").update(JSON.stringify({
          table_name,
          code,
        })).digest("base64").substring(0, 22);
        const order_by = j + 1;
        const sql = "insert into base_field_permit(id,menu_id,code,lbl,order_by) values(?,?,?,?,?)";
        await context.conn.query(sql, [id, menu_id, code, lbl, order_by]);
        createNum++;
      }
    }
    
    if (ignoreNum > 0 || updateNum > 0 || createNum > 0) {
      let msg = `${table_name}: `;
      if (ignoreNum > 0) {
        msg += `忽略: ${ignoreNum}, `;
      }
      if (updateNum > 0) {
        msg += `更新: ${updateNum}, `;
      }
      if (createNum > 0) {
        msg += `创建: ${createNum}, `;
      }
      if (msg.endsWith(", ")) {
        msg = msg.substring(0, msg.length - 2);
      }
      console.log(msg);
    }
    
  }
  
  console.timeEnd("field_permit");
  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
  process.exit(0);
});
