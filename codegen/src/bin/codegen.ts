import {
  getSchema,
  hasSelectInputFn,
  initContext,
  type Context,
} from "../lib/information_schema.ts";

import { Command } from "commander";
import { Chalk } from "chalk";

import {
  codegen,
  genRouter,
  // genMenu,
  denoGenTypes,
} from "../lib/codegen.ts";

import tables from "../tables/tables.ts";

import {
  gitDiffOut,
} from "../lib/codegen.ts";

import {
  execSync,
} from "child_process";

import {
  resolve,
  dirname,
} from "path";

import { fileURLToPath } from "url";

// 获取当前文件的目录路径 (ES 模块中 __dirname 的等效方法)
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectPh = resolve(`${ __dirname }/../../`).replace(/\\/gm, "/");

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
    // hasSelectInput
    if (tables[table_name].opts.hasSelectInput == null) {
      const hasSelectInput = hasSelectInputFn(table_name);
      tables[table_name].opts.hasSelectInput = hasSelectInput;
    }
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
  const status = execSync(
    "git status",
    {
      cwd: process.cwd() + "/../",
    },
  ).toString();
  if (status.includes("Changes not staged for commit:")) {
    // 忽略 codegen/__out__/ 目录下的文件
    let status2 = status.split("Changes not staged for commit:")[1];
    const arr = status2.split("\n")
      .map((item: string) => item.trim())
      .filter((item: string) => item && !item.startsWith("(use \"git ") && !item.includes(" codegen/__out__/"));
    if (arr.length > 0) {
      console.error("\n" + chalk.green(arr.join("\n")) + "\n");
      throw "git有未加入暂存区的文件, 请先加入暂存区";
    }
  }
}

(async function() {
  try {
    // validateGitStaging();
    
    execSync("git add -A", {
      cwd: projectPh,
    });
    
    let table = options.table;
    if (table) {
      table = table.split(",");
      table = table.map((item: string) => item.trim());
    }
    console.log(`table:`, table);
    
    const context = await initContext();
    try {
      await exec(context, table);
    } catch (err) {
      execSync("git restore . && git clean -fd", {
        cwd: projectPh,
      });
      throw err;
    }
    await gitDiffOut();
    await denoGenTypes();
    
  } catch(err) {
    if (err instanceof Error) {
      console.error(chalk.red(err.stack));
    } else {
      console.error(chalk.red(err));
    }
  } finally {
    process.exit(0);
  }
})();
