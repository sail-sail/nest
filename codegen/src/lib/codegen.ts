import { readFile, stat, writeFile, constants as fs_constants, access, readdir, mkdir, copy, copyFile, type Stats, rm } from "fs-extra";
import * as ejsexcel from "ejsexcel";
import { Context, getAllTables, getDictModels, getDictbizModels } from "./information_schema";
import { includeFtl, isEmpty as isEmpty0, uniqueID as uniqueID0, formatMsg as formatMsg0 } from "./StringUitl";
import { basename, dirname, resolve, normalize } from "path";
import { Chalk } from "chalk";
import * as shelljs from "shelljs";
import * as uuid from "uuid";
import tables, { isUseI18n as isUseI18n0 } from "../tables/tables";
import { createHash } from "crypto";
import { unlink } from "fs/promises";
import { TablesConfigItem } from "../config";
import { getSchema } from "./information_schema";

if (!shelljs.which("git")) {
  shelljs.echo("请先安装git: https://git-scm.com");
  process.exit(1);
}

const isUseI18n = isUseI18n0;

// if (shelljs.env["LESSCHARSET"] !== "utf-8") {
//   shelljs.echo("请先设置全局环境变量 LESSCHARSET 为 utf-8");
//   process.exit(1);
// }

const chalk = new Chalk();

const out = resolve(`${ __dirname }/../../__out__/`).replace(/\\/gm, "/");
const rootPh = resolve(`${ __dirname }/../template`).replace(/\\/gm, "/");
const projectPh = resolve(`${ __dirname }/../../../`).replace(/\\/gm, "/");

console.log(`${chalk.gray("工程路径:")} ${chalk.blue(projectPh)}`);

// 是否有graphql文件内容发生改变
let graphqlHasChanged = false;

const rustKeys = [
  "as", "async", "await", "break", "const", "continue", "crate", "dyn", "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "return", "Self", "self", "static", "struct", "super", "trait", "true", "type", "union", "unsafe", "use", "where", "while", "abstract", "become", "box", "do", "final", "macro", "override", "priv", "try", "typeof", "unsized", "virtual", "yield"
];

function rustKeyEscape(key: string) {
  if (rustKeys.includes(key)) {
    return "r#" + key;
  }
  return key;
}

const mysqlKeys = [
  "select", "from", "where", "and", "or", "not", "insert", "into", "update", "delete", "create", "database", "alter", "create", "table", "alter", "drop", "create", "index", "drop", "null", "like", "in", "between", "join", "inner", "left", "right", "union", "group", "by", "order", "limit", "offset",
];

function mysqlKeyEscape(key: string) {
  key = key.toLowerCase();
  if (mysqlKeys.includes(key)) {
    return "`" + key + "`";
  }
  return key;
}

/**
 * 检查此表是否有selectInput
 * @param table 
 */
function hasSelectInputFn(
  mod: string,
  table_name: string,
) {
  let hasSelectInput = tables[mod + "_" + table_name].opts?.hasSelectInput;
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
      if (column.foreignKey.table === table_name) {
        if (column.foreignKey.selectType === "selectInput") {
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

export async function codegen(context: Context, schema: TablesConfigItem, table_names: string[]) {
  const opts = schema.opts;
  let {
    mod,
    table,
    table_name,
    table_comment,
    defaultSort,
    hasTenant_id,
    hasOrgId,
    hasCreateUsrId,
    hasCreateUsrIdLbl,
    hasCreateTime,
    hasUpdateUsrId,
    hasUpdateUsrIdLbl,
    hasUpdateTime,
    hasIsDeleted,
    hasDeleteUsrId,
    hasDeleteUsrIdLbl,
    hasDeleteTime,
    hasVersion,
    cache,
    log,
    list_page,
    list_tree,
  } = opts;
  if (list_page == null) {
    list_page = true;
  }
  const columns = schema.columns;
  const formatMsg = formatMsg0;
  const uniqueID = uniqueID0;
  const isEmpty = isEmpty0;
  console.log(`${chalk.gray("生成表:")} ${chalk.green(table_name)}`);
  const mod_table = table_name;
  const mod_slash_table = table_name.replace("_", "/");
  const tableUp = table.substring(0, 1).toUpperCase() + table.substring(1);
  const Table_Up_IN = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  
  function hasDataPermit() {
    if (schema.opts.dataPermit === true) {
      return true;
    }
    return false;
  }
  
  let optTables = tables;
  const allTables = await getAllTables(context);
  const dictModels = await getDictModels(context);
  const dictbizModels = await getDictbizModels(context);
  
  async function treeDir(dir: string, writeFnArr: Function[]) {
		if(dir.endsWith(".bak")) return;
    const dir2 = dir.replace(new RegExp("\\[\\[([\\s\\S]*?)\\]\\]","gm"), function(str) {
			str = str.trim();
			str = str.substring(2, str.length-2);
			return eval(`(${str})`);
		});
    const fileTng = `${rootPh}${dir}`;
    const stats = await stat(fileTng);
    const hasForeignTabs = columns.some((item) => item.foreignTabs?.length > 0);
    const hasSelectInput = hasSelectInputFn(mod, table);
    if (stats.isFile()) {
      if (opts.onlyCodegenDeno && dir.startsWith("/pc/")) {
        return;
      }
      if(dir.endsWith(".xlsx")) {
				const buffer = await readFile(fileTng);
        const fields = [ ];
        const lbls = [ ];
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          const column_name = column.COLUMN_NAME;
          if (column_name === "id") continue;
          if (column_name === "version") {
            continue;
          }
          if (column.onlyCodegenDeno) continue;
          // if (column.isAtt || column.isImg) continue;
          const isImport = dir.startsWith("/pc/public/import_template/");
          if (
            isImport && 
            (
              [
                "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                "tenant_id", "tenant_id_lbl",
              ].includes(column_name)
              || column.readonly
              || column.noAdd
            )
          ) continue;
          if (
            [
              "is_deleted", "is_sys",
              "tenant_id", "tenant_id_lbl",
            ].includes(column_name)
            || column.noList
            || column.noExport
          ) continue;
          let data_type = column.DATA_TYPE;
          const column_type = column.COLUMN_TYPE;
          const column_comment = column.COLUMN_COMMENT || "";
          const isPassword = column.isPassword;
          if (isPassword) continue;
          const require = column.require;
          const foreignKey = column.foreignKey;
          const foreignTable = foreignKey && foreignKey.table;
          const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
          const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          let lbl = "";
          if (!isImport) {
            if (lbls.length === 0) {
              lbl += `<%initJs:`;
              lbl += ` const data = _data_.data; const sheetName = _data_.sheetName; const selectList = { };`;
              lbl += ` const columns = _data_.columns;`;
              lbl += ` columns.sort((a,b) => { if (a.fixed && !b.fixed) return -1; if (!a.fixed && b.fixed) return 1; return 0; });`;
              lbl += ` var xSplit = columns.findIndex((column) => !column.fixed); if (xSplit === -1) { xSplit = 0; }`;
              lbl += ` %>`;
              lbl += `<%_freezePane_({ xSplit, ySplit: 1, topLeftCell: _charPlus_(_col,xSplit)+"2" })%>`;
              lbl += `<%_setSheetName_(sheetName)%>`;
            }
            lbl += `<% var prop = "`;
            if (
              (foreignKey || column.dict || column.dictbiz)
              || (data_type === "date" || data_type === "datetime")
            ) {
              lbl += column_name + "_lbl";
            } else {
              lbl += column_name;
            }
            lbl += `"; var column = columns.find((column) => column.prop === prop); var idx = columns.indexOf(column);`;
            lbl += ` _col = idx !== -1 ? _charPlus_("A", idx) : _col;`;
            lbl += ` %>`;
            lbl += `<%_setC_(_col)%>`;
            lbl += `<%=column.label%>`;
            lbl += `<%_cols_({ min: _col, width: column.width, hidden: column.hidden })%>`;
            // Excel里面的下拉框
            if (
              !column.notImportExportList &&
              (foreignKey && !foreignKey.multiple && (foreignKey.selectType === "select" || foreignKey.selectType == null))
              || (column.dict || column.dictbiz)
            ) {
              if (foreignKey && !foreignKey.multiple && (foreignKey.selectType === "select" || foreignKey.selectType == null)) {
                lbl += `<%selectList.${ column_name } = data.findAll${ Foreign_Table_Up }?.map((item) => item.${ foreignKey.lbl }) || [ ]%>`;
              } else if (column.dict) {
                lbl += `<%selectList.${ column_name } = data.getDict.find((item) => item[0]?.code === "${ column.dict }")?.map((item) => item.lbl) || [ ]%>`;
              } else if (column.dictbiz) {
                lbl += `<%selectList.${ column_name } = data.getDictbiz.find((item) => item[0]?.code === "${ column.dictbiz }")?.map((item) => item.lbl) || [ ]%>`;
              }
              lbl += `<%selectList.${ column_name } && selectList.${ column_name }.length > 0 && _dataValidation_({ sqref: \`\${ _col }2:\${ _col }\${ _lastRow }\`, formula1: \`"\${ selectList.${ column_name }.join(",") }"\``;
              if (require) {
                lbl += `, allowBlank: '0'`;
              }
              lbl += ` })%>`;
            }
          } else {
            if (foreignKey && foreignKey.notSetIdByLbl) {
              continue;
            }
            if (lbls.length === 0) {
              lbl += `<%initJs: const data = _data_.data; const sheetName = _data_.sheetName; const selectList = { }; const comment = data.getFieldComments${ Table_Up_IN };%>`;
              lbl += `<%_setSheetName_(sheetName)%>`;
            }
            lbl += `<%=comment.`;
            if (
              (foreignKey || column.dict || column.dictbiz)
              || (data_type === "date" || data_type === "datetime")
            ) {
              lbl += column_name + "_lbl";
            } else {
              lbl += column_name;
            }
            lbl += `%>`;
            // Excel里面的下拉框
            if (
              !column.notImportExportList &&
              (foreignKey && !foreignKey.multiple && (foreignKey.selectType === "select" || foreignKey.selectType == null))
              || (column.dict || column.dictbiz)
            ) {
              if (foreignKey && !foreignKey.multiple && (foreignKey.selectType === "select" || foreignKey.selectType == null)) {
                lbl += `<%selectList.${ column_name } = data.findAll${ Foreign_Table_Up }?.map((item) => item.${ foreignKey.lbl }) || [ ]%>`;
              } else if (column.dict) {
                lbl += `<%selectList.${ column_name } = data.getDict.find((item) => item[0]?.code === "${ column.dict }")?.map((item) => item.lbl) || [ ]%>`;
              } else if (column.dictbiz) {
                lbl += `<%selectList.${ column_name } = data.getDictbiz.find((item) => item[0]?.code === "${ column.dictbiz }")?.map((item) => item.lbl) || [ ]%>`;
              }
              lbl += `<%selectList.${ column_name } && selectList.${ column_name }.length > 0 && _dataValidation_({ sqref: \`\${ _col }2:\${ _col }\${ _lastRow }\`, formula1: \`"\${ selectList.${ column_name }.join(",") }"\``;
              if (require) {
                lbl += `, allowBlank: '0'`;
              }
              lbl += ` })%>`;
            }
          }
          lbls.push(lbl);
          let str = "";
          if (fields.length === 0) {
            str += `<%forRow model in data.findAll${ Table_Up_IN }%>`;
          }
          str += `<% var prop = "`;
          if (foreignKey || column.dict || column.dictbiz
            || (data_type === "date" || data_type === "datetime")
          ) {
            str += column_name + "_lbl";
          } else {
            str += column_name;
          }
          str += `";`;
          if (!isImport) {
            str += ` var column = columns.find((column) => column.prop === prop); var idx = columns.indexOf(column);`;
            str += ` _col = idx !== -1 ? _charPlus_("A", idx) : _col;`;
            str += ` %>`;
            str += `<%_setC_(_col)%>`;
          }
          str += "<%";
          if (!column.isImg) {
            if (data_type === "varchar") {
              str += "=";
            } else if (data_type === "int") {
              str += "~";
            } else if (data_type === "decimal") {
              str += "~";
            }
            // else if (data_type === "date") {
            //   str += "~";
            // } else if (data_type === "datetime") {
            //   str += "~";
            // }
            else {
              str += "=";
            }
          }
          // if (data_type === "date" || data_type === "datetime") {
          //   str += `model[prop] ? new Date(model[prop]) : ""`;
          // } else {
          //   str += "model[prop]";
          // }
          if (column.isAtt) {
            str += `model[prop].split(",").length.toString()`;
          } else if (column.isImg) {
            str += `_img_({imgPh:model[prop+"_lbl"]})`;
          } else if (column.DATA_TYPE === "decimal") {
            str += `model[prop+"_lbl"]`;
          } else {
            str += "model[prop]";
          }
          str += `%>`;
          if (column.isImg) {
            str += `<%_setHt_(100)%>`;
          }
          fields.push(str);
        }
        const buffer2 = await ejsexcel.renderExcel(buffer, { lbls, fields });
        let stats: Stats | undefined;
        try {
          stats = await stat(`${projectPh}/${dir2}`);
        } catch (errTmp) { }
        // 如果文件大小不一样，或者md5不一样，就写入文件
        if (!stats || stats.size !== buffer2.length) {
          writeFnArr.push(async function() {
            await mkdir(dirname(`${projectPh}/${dir2}`), { recursive: true });
            await writeFile(`${projectPh}/${dir2}`, buffer2);
          });
        } else {
          let buffer0: Buffer;
          try {
            buffer0 = await readFile(`${projectPh}/${dir2}`);
          } catch (errTmp) {
          }
          if (!buffer0 || createHash("md5").update(buffer2).digest("base64") !== createHash("md5").update(buffer0).digest("base64")) {
            writeFnArr.push(async function() {
              await mkdir(dirname(`${projectPh}/${dir2}`), { recursive: true });
              await writeFile(`${projectPh}/${dir2}`, buffer2);
            });
          }
        }
        return;
      }
      if (dir === "/deno/gen/graphql.ts") {
        return;
      }
      if (dir === "/deno/lib/script/graphql_codegen_scalars.ts") {
        return;
      }
      if (dir === "/deno/lib/script/graphql_pc_ids.ts") {
        return;
      }
      if (dir === "/rust/src/common/script/graphql_codegen_scalars.ts") {
        return;
      }
      if (dir === "/rust/src/common/script/graphql_pc_ids.ts") {
        return;
      }
      if (dir === "/pc/src/router/gen.ts") {
        return;
      }
      if (dir === "/pc/src/typings/ids.d.ts") {
        return;
      }
      if (dir === "/uni/src/typings/ids.d.ts") {
        return;
      }
      if (dir === "/pc/src/views/[[mod_slash_table]]/ForeignTabs.vue") {
        if (!hasForeignTabs) {
          return;
        }
      }
      if (dir === "/pc/src/views/[[mod_slash_table]]/SelectInput.vue") {
        if (!hasSelectInput) {
          return;
        }
      }
      if (dir === "/pc/src/views/[[mod_slash_table]]/SelectList.vue") {
        if (!hasSelectInput) {
          return;
        }
      }
      if (dir === "/pc/src/views/[[mod_slash_table]]/TreeList.vue") {
        if (!list_tree) {
          return;
        }
      }
      let htmlStr = includeFtl(
        await readFile(fileTng ,"utf8"),
        "<#",
        "#>",
      );
      try {
        let str2 = await eval(`(async function() { ${ htmlStr }; return _out_; })`,)();
        
        let mustWrite = false;
        let stats: Stats | undefined;
        try {
          stats = await stat(`${out}/${dir2}`);
        } catch (errTmp) { }
        if (!stats || stats.size !== Buffer.from(str2).length) {
          mustWrite = true;
        } else {
          let str0: string;
          try {
            str0 = await readFile(`${out}/${dir2}`, "utf8");
          } catch (errTmp) { }
          if (!str0 || str0 !== str2) {
            mustWrite = true;
          }
        }
        if (mustWrite) {
          if (dir2.endsWith(".graphql.ts")) {
            graphqlHasChanged = true;
          }
          if (dir2.endsWith("_graphql.rs")) {
            graphqlHasChanged = true;
          }
          writeFnArr.push(async function() {
            await writeFile(`${out}/${dir2}`, str2);
            console.log(`${chalk.gray("生成文件:")} ${chalk.green(normalize(`${out}/${dir2}`))}`);
          });
        }
      } catch(err) {
        console.error(`${out}/${dir2}`);
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
  try {
    await unlink(`${ projectPh }/error.js`);
  } catch (errTmp) {
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
  const allTables: any = await getAllTables(context);
  for (let i = 0; i < allTables.length; i++) {
    const record = allTables[i];
    if (optTables[record.TABLE_NAME] == null) {
      continue;
    }
    Object.assign(record, optTables[record.TABLE_NAME]);
  }
  const files = [
    "pc/src/router/gen.ts",
    "deno/gen/graphql.ts",
    "deno/lib/script/graphql_codegen_scalars.ts",
    "deno/lib/script/graphql_pc_ids.ts",
    "rust/src/common/script/graphql_codegen_scalars.ts",
    "rust/src/common/script/graphql_pc_ids.ts",
    "pc/src/typings/ids.d.ts",
    "uni/src/typings/ids.d.ts",
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
        if (file === "deno/lib/script/graphql_codegen_scalars.ts") {
          graphqlHasChanged = true;
        }
        if (file === "rust/src/common/script/graphql_codegen_scalars.ts") {
          graphqlHasChanged = true;
        }
        console.log(`${chalk.gray("生成文件:")} ${chalk.green(normalize(`${out}/${file}`))}`);
        await writeFile(`${ out }/${ file }`, str2);
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
  // await copyXlsx(out);
  const diffFile = "__test__.diff";
  const diffStr = `git diff --full-index ./* > ${projectPh}/${ diffFile }`;
  shelljs.cd(projectPh);
  shelljs.exec(diffStr);
  shelljs.exec(`git add .`);
  let str = await readFile(`${ projectPh }/${ diffFile }`, "utf8");
  let applyHasErr = false;
  let applyErrMsg = "";
  if (!isEmpty0(str)) {
    str = str.replace(/\/codegen\/__out__\//gm, "/");
    await writeFile(`${ projectPh }/${ diffFile }`, str);
    shelljs.cd(projectPh);
    const applyRes = shelljs.exec(
      `git apply ${ diffFile } --3way --ignore-space-change --binary --whitespace=nowarn`,
      {
        silent: true,
      },
    );
    const applyErr = applyRes.stderr;
    if (applyErr && applyErr.includes("error: patch failed:")) {
      applyHasErr = true;
      console.log("");
      const errArr = applyErr.split("\n");
      for (let item of errArr) {
        if (!item.startsWith("error: ") || !item.endsWith(": patch does not apply")) continue;
        item = item.substring("error: ".length, item.length - ": patch does not apply".length);
        // 打开vscode的diff
        const cmdTmp = `code --diff "${ out }/${ item }" "${ projectPh }/${ item }"`;
        applyErrMsg += cmdTmp + "\n";
        shelljs.exec(cmdTmp);
      }
      console.log("");
    } else {
      const arr = applyErr.split("\n")
        .filter((item) => item && !item.startsWith("Applied patch to "));
      if (arr.length > 0) {
        applyHasErr = true;
        applyErrMsg = arr.join("\n");
      }
    }
      
  }
  await treeDir();
  await unlink(`${ projectPh }/codegening.txt`);
  console.log("");
  if (applyHasErr) {
    throw `代码合并失败:\n\n${ applyErrMsg }`;
  } else {
    console.log(chalk.green("代码合并成功!"));
  }
}

// async function copyXlsx(out: string = "") {
//   let str = shelljs.exec(`git status`, { silent: true }).stdout;
//   str = str.substring(str.lastIndexOf(`(use "git restore <file>..." to discard changes in working directory)`) + `(use "git restore <file>..." to discard changes in working directory)`.length);
//   const arr = str.split("\n");
//   for (let i = 0; i < arr.length; i++) {
//     let line = arr[i];
//     line = line.trim();
//     if (line.indexOf("modified:") === 0) {
//       const file = line.substring(line.indexOf("modified:") + "modified:".length).trim();
//       if (file.endsWith(".xlsx")) {
//         if (file.startsWith(".")) continue;
//         await copyFile(`${ out }/${ file }`, `${ projectPh }/${ file }`);
//         shelljs.exec(`git add ${ out }/${ file }`);
//         shelljs.exec(`git add ${ projectPh }/${ file }`);
//       }
//     }
//   };
// }

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

export async function removeExcelTemplate() {
  console.log("removeExcelTemplate");
  try {
    await rm(`${ projectPh }/pc/public/import_template/`, { force: true, recursive: true });
  } catch (err) {
  }
  try {
    await rm(`${ projectPh }/pc/public/excel_template/`, { force: true, recursive: true });
  } catch (err) {
  }
  try {
    await rm(`${ out }/pc/public/import_template/`, { force: true, recursive: true });
  } catch (err) {
  }
  try {
    await rm(`${ out }/pc/public/excel_template/`, { force: true, recursive: true });
  } catch (err) {
  }
}
