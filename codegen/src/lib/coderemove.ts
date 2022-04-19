import { resolve } from "path";
import { Context } from "./information_schema";
import { remove } from "fs-extra";

const out = resolve(`${ __dirname }/../../__out__/`).replace(/\\/gm, "/");
const projectPh = resolve(`${ __dirname }/../../../`).replace(/\\/gm, "/");

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
  await remove(`${ out }/nest/src/${ table_name }/`);
  
  console.log(`删除: ${ out }/nest/src/${ table_name }2/`);
  await remove(`${ out }/nest/src/${ table_name }2/`);
  
  console.log(`删除: ${ out }/pc/src/views/${ table_name }/`);
  await remove(`${ out }/pc/src/views/${ table_name }/`);
  
  console.log(`删除: ${ projectPh }/nest/src/${ table_name }/`);
  await remove(`${ projectPh }/nest/src/${ table_name }/`);
  
  console.log(`删除: ${ projectPh }/nest/src/${ table_name }2/`);
  await remove(`${ projectPh }/nest/src/${ table_name }2/`);
  
  console.log(`删除: ${ projectPh }/pc/src/views/${ table_name }/`);
  await remove(`${ projectPh }/pc/src/views/${ table_name }/`);
  
  console.log(`删除表: ${ table_name }`);
  await dropTable(context, table_name);
}