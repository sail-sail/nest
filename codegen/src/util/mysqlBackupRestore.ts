import {
  mkdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";

import {
  dirname,
  isAbsolute,
  join,
  resolve,
} from "node:path";

import { parse } from "dotenv";

import { createConnection } from "mysql2/promise";

export interface MysqlEnvConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export function resolveEnvPath(inputPath?: string) {
  if (!inputPath) {
    return resolve(process.cwd(), "../deno/.env.dev");
  }
  if (isAbsolute(inputPath)) {
    return inputPath;
  }
  return resolve(process.cwd(), inputPath);
}

export async function loadMysqlEnvConfig(envFilePath: string): Promise<MysqlEnvConfig> {
  const envText = await readFile(envFilePath, "utf8");
  const env = parse(envText);
  const host = env.database_hostname;
  const port = Number(env.database_port || 3306);
  const user = env.database_username;
  const password = env.database_password;
  const database = env.database_database;

  if (!host || !user || !database) {
    throw new Error(`无法从 ${envFilePath} 中读取数据库配置`);
  }

  return {
    host,
    port,
    user,
    password: password || "",
    database,
  };
}

export async function createMysqlConnection(config: MysqlEnvConfig) {
  return createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true,
  });
}

export function resolveBackupFilePath(outputPath?: string) {
  if (outputPath) {
    return resolve(process.cwd(), outputPath);
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return resolve(process.cwd(), "tmp", "mysql-backup", `${stamp}.sql`);
}

function getValueByCaseInsensitive(record: Record<string, unknown>, target: string) {
  const key = Object.keys(record).find((item) => item.toLowerCase() === target.toLowerCase());
  return key ? record[key] : undefined;
}

export function escapeIdentifier(identifier: string) {
  return `\`${identifier.replace(/`/g, "``")}\``;
}

export function escapeSqlValue(value: unknown) {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  if (value instanceof Date) {
    return `'${value.toISOString().replace(/'/g, "''")}'`;
  }
  if (Buffer.isBuffer(value)) {
    return `0x${value.toString("hex")}`;
  }
  const text = String(value).replace(/'/g, "''");
  return `'${text}'`;
}

export async function backupDatabase(config: MysqlEnvConfig, outputFile: string) {
  const connection = await createMysqlConnection(config);
  try {
    const [tables] = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ? ORDER BY table_name",
      [config.database],
    );
    const tableNames = (tables as Array<Record<string, unknown>>)
      .map((item) => getValueByCaseInsensitive(item, "table_name"))
      .filter((item): item is string => typeof item === "string" && item.length > 0);
    const lines: string[] = [
      `-- MySQL backup generated for ${config.database}`,
      `-- Generated at ${new Date().toISOString()}`,
      "SET NAMES utf8mb4;",
      "SET FOREIGN_KEY_CHECKS = 0;",
      "",
    ];

    for (const tableName of tableNames) {
      const [createResult] = await connection.query(
        `SHOW CREATE TABLE ${escapeIdentifier(tableName)}`,
      );
      const createRows = createResult as Array<Record<string, unknown>>;
      const createSql = getValueByCaseInsensitive(createRows[0] as Record<string, unknown>, "Create Table") as string | undefined;
      if (createSql) {
        lines.push(`DROP TABLE IF EXISTS ${escapeIdentifier(tableName)};`);
        lines.push(createSql + ";");
        lines.push("");
      }

      const [rows] = await connection.query(
        `SELECT * FROM ${escapeIdentifier(tableName)}`,
      );
      const rowList = rows as Array<Record<string, unknown>>;
      if (rowList.length === 0) {
        continue;
      }

      const columns = Object.keys(rowList[0]);
      const columnList = columns.map((column) => escapeIdentifier(column)).join(", ");
      for (const row of rowList) {
        const values = columns.map((column) => escapeSqlValue(row[column])).join(", ");
        lines.push(`INSERT INTO ${escapeIdentifier(tableName)} (${columnList}) VALUES (${values});`);
      }
      lines.push("");
    }

    lines.push("SET FOREIGN_KEY_CHECKS = 1;");

    await mkdir(dirname(outputFile), { recursive: true });
    await writeFile(outputFile, lines.join("\n"));
    return outputFile;
  } finally {
    await connection.end();
  }
}

export async function restoreDatabase(config: MysqlEnvConfig, backupFile: string, execute = false) {
  const sqlText = await readFile(backupFile, "utf8");
  if (!execute) {
    return {
      executed: false,
      backupFile,
      statementCount: sqlText.split(";").filter(Boolean).length,
      message: "已跳过实际恢复，当前为预览模式。使用 --execute 才会真正执行 SQL。",
    };
  }

  const connection = await createMysqlConnection(config);
  try {
    await connection.query(sqlText);
    return {
      executed: true,
      backupFile,
      statementCount: sqlText.split(";").filter(Boolean).length,
      message: "恢复已执行",
    };
  } finally {
    await connection.end();
  }
}

export async function findLatestBackupFile(backupDir: string) {
  const entries = await readFile(join(backupDir, "../.."), "utf8").catch(() => "");
  void entries;
  const dir = resolve(process.cwd(), backupDir);
  try {
    const statInfo = await stat(dir);
    if (!statInfo.isDirectory()) {
      throw new Error(`${dir} 不是目录`);
    }
  } catch (_err) {
    return undefined;
  }

  const imported = await import("node:fs/promises");
  const files = await imported.readdir(dir);
  const sqlFiles = files.filter((item) => item.endsWith(".sql")).sort().reverse();
  if (sqlFiles.length === 0) {
    return undefined;
  }
  return join(dir, sqlFiles[0]);
}
