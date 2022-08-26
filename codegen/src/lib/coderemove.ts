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
  console.log(`删除: ${ out }/deno/gen/${ table_name }/`);
  await rm(`${ out }/deno/gen/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ out }/pc/src/views/${ table_name }/`);
  await rm(`${ out }/pc/src/views/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/deno/gen/${ table_name }/`);
  await rm(`${ projectPh }/deno/gen/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/pc/src/views/${ table_name }/`);
  await rm(`${ projectPh }/pc/src/views/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ buildPh }/deno/gen/${ table_name }/`);
  await rm(`${ buildPh }/deno/gen/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除表: ${ table_name }`);
  await dropTable(context, table_name);
}