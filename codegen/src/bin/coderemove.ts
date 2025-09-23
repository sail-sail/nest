import { initContext } from "../lib/information_schema.ts";
import { Command } from "commander";
import { coderemove } from "../lib/coderemove.ts";

const envArgs = process.argv;
const program = new Command();
program
  .option('-t, --table [value]', '表名')
  .parse(envArgs);

const options = program.opts();

async function exec(table_names: string[]) {
  const context = await initContext();
  for (let i = 0; i < table_names.length; i++) {
    const table_name = table_names[i];
    await coderemove(context, table_name);
  }
}

(async function() {
  try {
    let table = options.table;
    if (table) {
      table = table.split(",");
      table = table.map((item: string) => item.trim());
    }
    if (!table || table.length === 0) {
      console.error("错误: 请输入需要删除的表名!");
      return;
    }
    console.log(`table:`, table);
    await exec(table);
  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();