import {
  getSchema,
  initContext,
  type Context,
} from "../lib/information_schema";

import { Command } from "commander";
import { Chalk } from "chalk";

import {
  removeExcelTemplate,
  codegen,
  genRouter,
  // genMenu,
  denoGenTypes,
} from "../lib/codegen";

import tables from "../tables/tables";

import {
  gitDiffOut,
} from "../lib/codegen";

import {
  execSync,
} from "child_process";

const chalk = new Chalk();

async function exec(context: Context, table_names0: string[]) {
  const table_names: string[] = Object.keys(tables).filter((item) => item);
  
  if (!table_names0) {
    table_names0 = table_names;
  }
  for (let i = 0; i < table_names0.length; i++) {
    const table_name = table_names0[i];
    if (!tables[table_name]) continue;
    await getSchema(context, table_name, table_names);
  }
  for (let i = 0; i < table_names0.length; i++) {
    const table_name = table_names0[i];
    if (!tables[table_name]) continue;
    const schema = await getSchema(context, table_name, table_names);
    if (schema.opts.ignoreCodegen) continue;
    await codegen(context, schema, table_names);
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

/**
 * 查看git是否有未加入暂存区的文件, 如果有, 则退出
 */
function validateGitStaging() {
  const status = execSync("git status").toString();
  if (status.includes("Changes not staged for commit:")) {
    throw new Error("git有未加入暂存区的文件, 请先加入暂存区");
  }
}

(async function() {
  try {
    validateGitStaging();
    let table = options.table;
    if (table) {
      table = table.split(",");
      table = table.map((item: string) => item.trim());
    }
    console.log(`table:`, table);
    await removeExcelTemplate();
    const context = await initContext();
    await exec(context, table);
    await gitDiffOut();
    await denoGenTypes();
  } catch(err) {
    console.error(chalk.red(err));
  } finally {
    process.exit(0);
  }
})();
