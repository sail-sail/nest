import { resolve } from "path";
import { Context } from "./information_schema";
import { rm } from "fs/promises";

const out = resolve(`${ __dirname }/../../__out__/`).replace(/\\/gm, "/");
const projectPh = resolve(`${ __dirname }/../../../`).replace(/\\/gm, "/");
const buildPh = resolve(`${ __dirname }/../../../build/`).replace(/\\/gm, "/");

async function dropTable(
  context: Context,
  table_name: string,
): Promise<void> {
  const sql = `
    drop table if exists ${ table_name }
  `;
  await context.conn.execute(sql);
}

export async function coderemove(context: Context, table_name: string) {
  const mod_slash_table = table_name.replace("_", "/");
  
  console.log(`删除: ${ out }/deno/gen/${ mod_slash_table }/`);
  await rm(`${ out }/deno/gen/${ mod_slash_table }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ out }/rust/src/gen/${ mod_slash_table }/`);
  await rm(`${ out }/rust/src/gen/${ mod_slash_table }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ out }/pc/src/views/${ mod_slash_table }/`);
  await rm(`${ out }/pc/src/views/${ mod_slash_table }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ out }/pc/public/excel_template/${ mod_slash_table }.xlsx`);
  await rm(`${ out }/pc/public/excel_template/${ mod_slash_table }.xlsx`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/deno/gen/${ mod_slash_table }/`);
  await rm(`${ projectPh }/deno/gen/${ mod_slash_table }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/rust/src/gen/${ mod_slash_table }/`);
  await rm(`${ projectPh }/rust/src/gen/${ mod_slash_table }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/pc/src/views/${ mod_slash_table }/`);
  await rm(`${ projectPh }/pc/src/views/${ mod_slash_table }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/pc/public/excel_template/${ mod_slash_table }.xlsx`);
  await rm(`${ projectPh }/pc/public/excel_template/${ mod_slash_table }.xlsx`, { force: true, recursive: true });
  
  console.log(`删除表: ${ table_name }`);
  await dropTable(context, table_name);
}