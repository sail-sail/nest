import { getAllTables, getSchema, initContext } from "../lib/information_schema";
import { Command } from "commander";
import {
  codegen,
  genRouter,
  // genMenu,
  denoGenTypes,
} from "../lib/codegen";
import tables from "../tables/tables";
import { gitDiffOut } from "../lib/codegen";

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
  await denoGenTypes(context);
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
    console.log(`table:`, table);
    await exec(table);
    await gitDiffOut();
  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
