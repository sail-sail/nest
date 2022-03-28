import { getAllTables, getSchema, initContext } from "../lib/information_schema";
import { isEmpty } from "../lib/StringUitl";
import { Command } from "commander";
import { codegen, genMenu, genRouter } from "../lib/codegen";
import tables from "../tables";

async function exec(table_names: string[]) {
  const context = await initContext();
  if (!table_names) {
    table_names = (await getAllTables(context)).map((item: any) => item.TABLE_NAME);
  }
  for (let i = 0; i < table_names.length; i++) {
    const table_name = table_names[i];
    if (!tables[table_name]) continue;
    const schema = await getSchema(context, table_name);
    if (schema.opts.ignoreCodegen) continue;
    await codegen(context, schema);
  }
  await genRouter(context);
  // await genMenu(context);
}

const envArgs = process.argv;
const program = new Command();
program
  .option('-t, --table [value]', '表名')
  .parse(envArgs);

const options = program.opts();

(async function() {
  try {
    let table = options.table;
    if (table) {
      table = table.split(",");
      table = table.map((item: string) => item.trim());
    }
    await exec(table);
  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
