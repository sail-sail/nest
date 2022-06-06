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
  let sql = `
    drop table if exists ${ table_name }
  `;
  await context.conn.execute(sql);
}

export async function coderemove(context: Context, table_name: string) {
  console.log(`删除: ${ out }/nest/src/${ table_name }/`);
  await rm(`${ out }/nest/src/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ out }/nest/src/${ table_name }2/`);
  await rm(`${ out }/nest/src/${ table_name }2/`, { force: true, recursive: true });
  
  console.log(`删除: ${ out }/pc/src/views/${ table_name }/`);
  await rm(`${ out }/pc/src/views/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/nest/src/${ table_name }/`);
  await rm(`${ projectPh }/nest/src/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/nest/src/${ table_name }2/`);
  await rm(`${ projectPh }/nest/src/${ table_name }2/`, { force: true, recursive: true });
  
  console.log(`删除: ${ projectPh }/pc/src/views/${ table_name }/`);
  await rm(`${ projectPh }/pc/src/views/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ buildPh }/nest/src/${ table_name }/`);
  await rm(`${ buildPh }/nest/src/${ table_name }/`, { force: true, recursive: true });
  
  console.log(`删除: ${ buildPh }/nest/src/${ table_name }2/`);
  await rm(`${ buildPh }/nest/src/${ table_name }2/`, { force: true, recursive: true });
  
  console.log(`删除表: ${ table_name }`);
  await dropTable(context, table_name);
}