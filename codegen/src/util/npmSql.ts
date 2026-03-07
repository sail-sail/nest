import {
  initContext,
} from "../lib/information_schema.ts";

const argv = process.argv.slice(2);

type Options = {
  sql?: string;
  file?: string;
  confirm: boolean;
  limit: number;
};

function getArgValue(argv: string[], index: number) {
  const value = argv[index + 1];
  if (!value) {
    throw new Error(`参数缺少值: ${ argv[index] }`);
  }
  return value;
}

function parseArgs(argv: string[]) {
  const options: Options = {
    confirm: false,
    limit: 20,
  };
  const sqlParts: string[] = [ ];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--confirm") {
      options.confirm = true;
      continue;
    }
    if (arg === "--file") {
      options.file = getArgValue(argv, i);
      i++;
      continue;
    }
    if (arg === "--limit") {
      const limit = Number(getArgValue(argv, i));
      if (!Number.isInteger(limit) || limit <= 0) {
        throw new Error("--limit 必须是正整数");
      }
      options.limit = limit;
      i++;
      continue;
    }
    sqlParts.push(arg);
  }
  if (sqlParts.length > 0) {
    options.sql = sqlParts.join(" ").trim();
  }
  return options;
}

async function getSql(options: Options) {
  if (options.sql && options.file) {
    throw new Error("--file 与直接传 SQL 只能二选一");
  }
  if (options.sql) {
    return options.sql.trim();
  }
  if (options.file) {
    const fs = await import("node:fs/promises");
    const sql = await fs.readFile(options.file, "utf8");
    return sql.trim();
  }
  throw new Error("请传入 SQL 字符串，或使用 --file 指定 .sql 文件");
}

function normalizeSql(sql: string) {
  return sql
    .replace(/^\uFEFF/, "")
    .replace(/\/\*[\s\S]*?\*\//gm, " ")
    .replace(/--.*$/gm, " ")
    .trim();
}

function getFirstKeyword(sql: string) {
  const normalized = normalizeSql(sql);
  const match = normalized.match(/^([a-zA-Z]+)/);
  return match?.[1]?.toUpperCase() || "";
}

function isReadOnlySql(sql: string) {
  const keyword = getFirstKeyword(sql);
  return [
    "SELECT",
    "SHOW",
    "DESC",
    "DESCRIBE",
    "EXPLAIN",
    "WITH",
  ].includes(keyword);
}

function isMultiStatement(sql: string) {
  const normalized = normalizeSql(sql);
  return normalized.includes(";");
}

function formatRows(rows: any[], limit: number) {
  const previewRows = rows.slice(0, limit);
  return {
    rowCount: rows.length,
    previewCount: previewRows.length,
    truncated: rows.length > previewRows.length,
    rows: previewRows,
  };
}

async function exec() {
  const options = parseArgs(argv);
  if (!options.confirm) {
    console.error("执行被拒绝: 运行前必须先人工确认 SQL，再显式添加 --confirm");
    process.exit(1);
  }
  const sql = await getSql(options);
  if (!sql) {
    throw new Error("SQL 不能为空");
  }
  if (isMultiStatement(sql)) {
    throw new Error("仅允许执行单条 SQL，禁止多语句");
  }
  const readOnly = isReadOnlySql(sql);
  const rawConsoleLog = console.log;
  let context = undefined as Awaited<ReturnType<typeof initContext>>;
  try {
    console.log = function() { };
    context = await initContext();
  } finally {
    console.log = rawConsoleLog;
  }
  try {
    const startedAt = Date.now();
    const result = await context.pool.query(sql);
    const elapsedMs = Date.now() - startedAt;
    if (readOnly) {
      const rows = Array.isArray(result[0]) ? result[0] as any[] : [ ];
      console.log(JSON.stringify({
        ok: true,
        type: "query",
        elapsedMs,
        ...formatRows(rows, options.limit),
      }));
      return;
    }
    const meta = result[0] as {
      affectedRows?: number;
      changedRows?: number;
      insertId?: number;
      warningStatus?: number;
    };
    console.log(JSON.stringify({
      ok: true,
      type: "exec",
      elapsedMs,
      affectedRows: meta?.affectedRows ?? 0,
      changedRows: meta?.changedRows ?? 0,
      insertId: meta?.insertId ?? 0,
      warningStatus: meta?.warningStatus ?? 0,
    }));
  } finally {
    context.conn.release();
    await context.pool.end();
  }
}

exec().catch((err) => {
  console.error(JSON.stringify({
    ok: false,
    error: err instanceof Error ? err.message : String(err),
  }));
  process.exit(1);
});
