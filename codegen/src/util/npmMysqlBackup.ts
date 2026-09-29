import {
  backupDatabase,
  loadMysqlEnvConfig,
  resolveBackupFilePath,
  resolveEnvPath,
} from "./mysqlBackupRestore.ts";

async function main() {
  const envArg = process.argv[2];
  if (!envArg) {
    throw new Error("请传入 .env 文件路径，例如: pnpm run mysql_backup -- ../deno/.env.dev");
  }
  const envFilePath = resolveEnvPath(envArg);
  const outputPath = process.argv[3];
  const config = await loadMysqlEnvConfig(envFilePath);
  const backupFile = resolveBackupFilePath(outputPath);
  await backupDatabase(config, backupFile);
  console.log(`已备份数据库 ${config.database} 到 ${backupFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
