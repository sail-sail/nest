
// npm run db_charset your_db_name
import {
  initContext,
} from "../lib/information_schema.ts";
import {
  writeFile,
} from "node:fs/promises";
import {
  fileURLToPath,
} from "node:url";
import {
  dirname,
  join,
} from "node:path";

const argv = process.argv.slice(2);

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_CHARSET = "utf8mb4";
const TARGET_COLLATION = "utf8mb4_0900_as_cs";

type Options = {
  dbName: string;
  execute: boolean;
  output: string;
};

function getArgValue(argv: string[], index: number) {
  const value = argv[index + 1]?.trim();
  if (!value) {
    throw new Error(`参数缺少值: ${ argv[index] }`);
  }
  return value;
}

function parseArgs(argv: string[]): Options {
  let dbName = "";
  let execute = false;
  let output = "";
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--execute") {
      execute = true;
      continue;
    }
    if (arg === "--output") {
      output = getArgValue(argv, i);
      i++;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`不支持的参数: ${ arg }`);
    }
    if (dbName) {
      throw new Error("只允许传入一个数据库名");
    }
    dbName = arg.trim();
  }
  if (!dbName) {
    throw new Error("请传入数据库名，例如: npm run db_charset your_db_name");
  }
  if (!output) {
    output = join(__dirname, `db_charset_${ dbName }.sql`);
  }
  return {
    dbName,
    execute,
    output,
  };
}

function escapeIdentifier(value: string) {
  return `\`${ value.replace(/`/g, "``") }\``;
}

function buildSqlList(dbName: string, tableNames: string[]) {
  const dbNameSql = escapeIdentifier(dbName);
  const sqlList = [
    `ALTER DATABASE ${ dbNameSql } CHARACTER SET ${ TARGET_CHARSET } COLLATE ${ TARGET_COLLATION }`,
  ];
  for (let i = 0; i < tableNames.length; i++) {
    const tableNameSql = escapeIdentifier(tableNames[i]);
    sqlList.push(`ALTER TABLE ${ dbNameSql }.${ tableNameSql } CONVERT TO CHARACTER SET ${ TARGET_CHARSET } COLLATE ${ TARGET_COLLATION }`);
  }
  return sqlList;
}

async function exec() {
  console.time("sql");
  const options = parseArgs(argv);
  const { dbName } = options;
  const context = await initContext();

  try {
    const [
      tableRows,
    ] = await context.pool.execute(
      `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = ?
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `,
      [ dbName ]
    );

    const models = tableRows as { TABLE_NAME: string }[];
    const tableNames = models.map((model) => model.TABLE_NAME);
    const sqlList = buildSqlList(dbName, tableNames);
    const sqlText = `${ sqlList.join(";\n") };\n`;

    const [
      columnRows,
    ] = await context.pool.execute(
      `
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = ?
          AND character_set_name IS NOT NULL
        ORDER BY table_name, ordinal_position
      `,
      [ dbName ]
    );

    const columns = columnRows as {
      TABLE_NAME: string;
      COLUMN_NAME: string;
    }[];

    await writeFile(options.output, sqlText, "utf8");

    if (options.execute) {
      for (let i = 0; i < sqlList.length; i++) {
        await context.pool.execute(sqlList[i]);
      }
    }

    console.log({
      dbName,
      charset: TARGET_CHARSET,
      collation: TARGET_COLLATION,
      output: options.output,
      execute: options.execute,
      tableCount: tableNames.length,
      columnCount: columns.length,
    });

    console.timeEnd("sql");
  } finally {
    context.conn.release();
    await context.pool.end();
  }

  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
});