import {
  loadMysqlEnvConfig,
  resolveEnvPath,
  restoreDatabase,
} from "./mysqlBackupRestore.ts";

async function main() {
  const envArg = process.argv[2];
  if (!envArg) {
    throw new Error("请传入 .env 文件路径，例如: pnpm run mysql_restore -- ../deno/.env.dev");
  }
  const envFilePath = resolveEnvPath(envArg);
  const backupFile = process.argv[3];
  const execute = process.argv.includes("--execute");

  if (!backupFile) {
    throw new Error("请传入备份文件路径，例如: pnpm run mysql_restore -- ../deno/.env.dev ./tmp/mysql-backup/xxx.sql");
  }

  const config = await loadMysqlEnvConfig(envFilePath);
  const result = await restoreDatabase(config, backupFile, execute);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
