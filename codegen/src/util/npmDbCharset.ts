import {
  initContext,
} from "../lib/information_schema.ts";

async function exec() {
  console.time("sql");
  const context = await initContext();
  
  const sql = `SELECT table_name FROM information_schema.tables WHERE table_schema = (select database())`;
  
  const [
    rows,
  ] = await context.pool.execute(sql);
  
  const models = rows as { TABLE_NAME: string }[];
  const table_names = models.map((model) => model.TABLE_NAME);
  
  for (let i = 0; i < table_names.length; i++) {
    const table_name = table_names[i];
    const sql = `ALTER TABLE ${ table_name } CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`;
    await context.pool.execute(sql);
  }
  
  console.timeEnd("sql");
  await context.pool.end();
  
  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
});