import { readFile, stat, writeFile, constants as fs_constants, access, readdir, mkdir, copy, copyFile } from "fs-extra";
import * as ejsexcel from "ejsexcel";
import { Context } from "./information_schema";
import { includeFtl, isEmpty as isEmpty0, uniqueID as uniqueID0, formatMsg as formatMsg0 } from "./StringUitl";
import { basename, dirname, resolve, normalize } from "path";
import * as chalk from "chalk";
import * as shelljs from "shelljs";
import * as uuid from "uuid";
import tables from "../tables/tables";
import { createHash } from "crypto";
import { unlink } from "fs/promises";
import { TablesConfigItem } from "../config";

if (!shelljs.which("git")) {
  shelljs.echo("请先安装git: https://git-scm.com");
  process.exit(1);
}

if (shelljs.env["LESSCHARSET"] !== "utf-8") {
  shelljs.echo("请先设置全局环境变量 LESSCHARSET 为 utf-8");
  process.exit(1);
}

const out = resolve(`${ __dirname }/../../__out__/`).replace(/\\/gm, "/");
const rootPh = resolve(`${ __dirname }/../template`).replace(/\\/gm, "/");
const projectPh = resolve(`${ __dirname }/../../../`).replace(/\\/gm, "/");

console.log(`${chalk.gray("工程路径:")} ${chalk.blue(projectPh)}`);

// 是否有graphql文件内容发生改变
let graphqlHasChanged = false;

export async function codegen(context: Context, schema: TablesConfigItem) {
  const opts = schema.opts;
  let { tableUp, table, table_comment, defaultSort, hasTenant_id, cache } = opts;
  const columns = schema.columns;
  const formatMsg = formatMsg0;
  const uniqueID = uniqueID0;
  const isEmpty = isEmpty0;
  console.log(`${chalk.gray("生成表:")} ${chalk.green(table)}`);
  async function treeDir(dir: string, writeFnArr: Function[]) {
		if(dir.endsWith(".bak")) return;
    const dir2 = dir.replace(new RegExp("\\[\\[([\\s\\S]*?)\\]\\]","gm"), function(str) {
			str = str.trim();
			str = str.substring(2, str.length-2);
			return eval(`(${str})`);
		});
    const fileTng = `${rootPh}${dir}`;
    const stats = await stat(fileTng);
    if (stats.isFile()) {
      if(dir.endsWith(".xlsx")) {
        // let isExist = true;
        // try {
        //   await access(`${out}/${dir2}`);
        // } catch (err) {
        //   isExist = false;
        // }
        // if (isExist) {
        //   console.log(`忽略: ${dir2}`);
        //   return;
        // }
        const hasForeignTabs = columns.some((item) => item.foreignTabs?.length > 0);
				const buffer = await readFile(fileTng);
        const fields = [ ];
        const lbls = [ ];
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          const column_name = column.COLUMN_NAME;
          if (column_name === "id") continue;
          let data_type = column.DATA_TYPE;
          let column_type = column.COLUMN_TYPE;
          let column_comment = column.COLUMN_COMMENT || "";
          let selectList = [ ];
          let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
          if (selectStr) {
            selectList = eval(`(${ selectStr })`);
          }
          if (column_comment.indexOf("[") !== -1) {
            column_comment = column_comment.substring(0, column_comment.indexOf("["));
          }
          const isPassword = column.isPassword;
          if (isPassword) continue;
          lbls.push(column_comment);
          let str = "";
          if (fields.length === 0) {
            str += "<%forRow model in _data_.models%>";
          }
          str += "<%";
          if (data_type === "varchar") {
            str += "=";
          } else if (data_type === "int") {
            str += "~";
          } else if (data_type === "decimal") {
            str += "~";
          } else if (data_type === "date") {
            str += "~";
          } else if (data_type === "datetime") {
            str += "~";
          } else {
            str += "=";
          }
          str += "model.";
          const foreignKey = column.foreignKey;
          if (foreignKey || selectList.length > 0) {
            str += "_" + column_name;
          } else {
            str += column_name;
          }
          str += "%>";
          fields.push(str);
        }
        const buffer2 = await ejsexcel.renderExcel(buffer, { lbls, fields });
        let buffer0: Buffer;
        try {
          buffer0 = await readFile(`${out}/${dir2}`);
        } catch (errTmp) {
        }
        if (!buffer0 || createHash("md5").update(buffer2).digest("base64") !== createHash("md5").update(buffer0).digest("base64")) {
          writeFnArr.push(async function() {
            await writeFile(`${out}/${dir2}`, buffer2);
          });
        }
        return;
      }
      if (dir.startsWith("/nest/")) {
        return;
      }
      if (dir === "/deno/gen/graphql.ts") {
        return;
      }
      if (dir === "/pc/src/router/gen.ts") {
        return;
      }
      if (opts.onlyCodegenDeno && dir.startsWith("/pc/")) {
        return;
      }
      if (dir === "/pc/src/views/[[table]]/ForeignList.vue") {
        if (hasForeignTabs) {
          return;
        }
      }
      let htmlStr = includeFtl(await readFile(fileTng ,"utf8"), "<#", "#>");
      try {
        if(basename(dir2).startsWith("--")) {
          const dir3 = dirname(dir2) + "/" + basename(dir2).replace("--", "");
          let isExist = true;
          try {
            await access(`${out}/${dir3}`, fs_constants.R_OK);
          } catch (errTmp) {
            isExist = false;
          }
          if(!isExist) {
            let str2 = eval(htmlStr);
            let str0: string;
            try {
              str0 = await readFile(`${out}/${dir3}`, "utf8");
            } catch (err) {
            }
            if (!str0 || str2 !== str0) {
              writeFnArr.push(async function() {
                await writeFile(`${out}/${dir3}`, str2);
                console.log(`${chalk.gray("生成文件:")} ${chalk.green(normalize(`${out}/${dir3}`))}`);
              });
            }
          }
        } else {
          let str2 = eval(htmlStr);
          let str0: string;
          try {
            str0 = await readFile(`${out}/${dir2}`, "utf8");
          } catch (err) {
          }
          if (!str0 || str0 !== str2) {
            if (dir2.endsWith(".graphql.ts")) {
              graphqlHasChanged = true;
            }
            writeFnArr.push(async function() {
              await writeFile(`${out}/${dir2}`, str2);
              console.log(`${chalk.gray("生成文件:")} ${chalk.green(normalize(`${out}/${dir2}`))}`);
            });
          }
        }
        try {
          await unlink(`${ projectPh }/error.js`);
        } catch (errTmp) {
        }
      } catch(err) {
        await writeFile(`${ projectPh }/error.js`, htmlStr);
        throw err;
      }
      return;
    }
    const dirTngArr = dir2.split("/");
		let dirTng = "";
		for(const dirTp of dirTngArr) {
			dirTng += "/"+dirTp;
			try {
				await mkdir(`${out}/${dirTng}`);
			} catch(err) { }
		}
		const fileArr = await readdir(fileTng);
		for(let file of fileArr) {
      try {
        await treeDir(dir+"/"+file, writeFnArr);
      } catch (err) {
        console.error(err);
        throw err;
      }
		}
  }
  const writeFnArr = [ ];
  await treeDir("", writeFnArr);
  for (let i = 0; i < writeFnArr.length; i++) {
    const writeFn = writeFnArr[i];
    writeFn();
  }
}

function shortUuidV4() {
  return Buffer.from(uuid.v4().replace(/-/gm, ""), "hex").toString("base64").substring(0, 22);
}

export async function genMenu(context: Context) {
  let orderBy = 999;
  const prnMenuId = shortUuidV4();
  const create_time = new Date();
  const [ menu ] = <any>(await context.conn.execute(`
    select t.*
    from menu t
    where t.lbl = '自动生成'
  `))[0];
  if (!menu) {
    await context.conn.execute(`
      insert into menu(id, lbl, route_path, tenant_id, order_by, create_time)
      values (?, '自动生成', '', 'ZDbZlC1OT8KaDg6soxMCBQ', ?, ?)
    `, [ prnMenuId, orderBy++, create_time ]);
  }
  const result = await context.conn.query(`
    select
      t.TABLE_NAME
      ,t.TABLE_COMMENT
    from information_schema.TABLES t
    where t.table_schema = (select database())
  `);
  const records: {TABLE_NAME: string, TABLE_COMMENT: string}[] = <any>result[0];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const [ menu ] = <any>(await context.conn.query(`
      select t.* from menu t
      where t.route_path = ?
    `, [ `/${ record.TABLE_NAME }` ]))[0];
    if (menu) continue;
    await context.conn.execute(`
      insert into menu(id, menu_id, lbl, route_path, tenant_id, order_by, create_time)
      values (?, ?, ?, ?, ?, ?, ?)
    `, [ shortUuidV4(), prnMenuId, record.TABLE_COMMENT, `/${ record.TABLE_NAME }`, 'ZDbZlC1OT8KaDg6soxMCBQ', orderBy++, create_time ]);
  }
}

export async function genRouter(context: Context) {
  let optTables = tables;
  const result = await context.conn.query(`
    select
      t.TABLE_NAME
      ,t.TABLE_COMMENT
    from information_schema.TABLES t
    where t.table_schema = (select database())
  `);
  const records: any = result[0];
  const files = [
    "pc/src/router/gen.ts",
    "deno/gen/graphql.ts",
  ];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const htmlStr = includeFtl(await readFile(`${ rootPh }/${ file }` ,"utf8"), "<#", "#>");
    try {
      let str2 = eval(htmlStr);
      let str0: string;
      try {
        str0 = await readFile(`${ out }/${ file }`, "utf8");
      } catch (err) {
      }
      if (str0 !== str2) {
        await writeFile(`${ out }/${ file }`, str2);
      }
      try {
        await unlink(`${ projectPh }/error.js`);
      } catch (errTmp) {
      }
    } catch(err) {
      await writeFile(`${ projectPh }/error.js`, htmlStr);
      throw err;
    }
  }
}

export async function gitDiffOut() {
  await writeFile(`${ projectPh }/codegening.txt`, "");
  shelljs.cd(out);
  // 覆盖xlsx文件
  await copyXlsx(out);
  const diffFile = "__test__.diff";
  const diffStr = `git diff --full-index ./* > ${projectPh}/${ diffFile }`;
  console.log(diffStr);
  shelljs.exec(diffStr);
  let str = await readFile(`${ projectPh }/${ diffFile }`, "utf8");
  if (!isEmpty0(str)) {
    str = str.replace(/\/codegen\/__out__\//gm, "/");
    await writeFile(`${ projectPh }/${ diffFile }`, str);
    shelljs.cd(projectPh);
    shelljs.exec(`git apply ${ diffFile } --ignore-space-change --binary --whitespace=nowarn`);
  }
  await treeDir();
  await unlink(`${ projectPh }/codegening.txt`);
  console.log(`代码合并完毕!`);
}

async function copyXlsx(out: string = "") {
  let str = shelljs.exec(`git status`, { silent: true }).stdout;
  str = str.substring(str.lastIndexOf(`(use "git restore <file>..." to discard changes in working directory)`) + `(use "git restore <file>..." to discard changes in working directory)`.length);
  const arr = str.split("\n");
  for (let i = 0; i < arr.length; i++) {
    let line = arr[i];
    line = line.trim();
    if (line.indexOf("modified:") === 0) {
      const file = line.substring(line.indexOf("modified:") + "modified:".length).trim();
      if (file.endsWith(".xlsx")) {
        if (file.startsWith(".")) continue;
        await copyFile(`${ out }/${ file }`, `${ projectPh }/${ file }`);
        shelljs.exec(`git add ${ out }/${ file }`);
        shelljs.exec(`git add ${ projectPh }/${ file }`);
      }
    }
  };
}

// 新增加的文件
async function treeDir(dir: string = "") {
  if(dir.endsWith(".bak")) return;
  const files = await readdir(out+"/"+dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const stats = await stat(out+"/"+dir+"/"+file);
    if (stats.isDirectory()) {
      await treeDir(dir+"/"+file);
    } else if (stats.isFile()) {
      let isExist = true;
      try {
        await access(projectPh+"/"+dir+"/"+file);
      } catch (err) {
        isExist = false;
      }
      if (!isExist) {
        await copy(out+"/"+dir+"/"+file, projectPh+"/"+dir+"/"+file);
      }
    }
  }
}

export async function denoGenTypes() {
  if (!graphqlHasChanged) {
    return;
  }
  shelljs.cd(`${ projectPh }/deno`);
  shelljs.exec("npm run gqlgen");
}
