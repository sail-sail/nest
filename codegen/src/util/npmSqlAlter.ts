import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import clipboardy from "clipboardy";

const repoRoot = path.resolve(process.cwd(), "..");

function git(args: string[]) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function isSqlFile(file: string) {
  return file.endsWith(".sql") || file.endsWith(".ddl");
}

function normalizePath(input: string) {
  return input.replace(/\\/g, "/").replace(/^\.\//, "").trim();
}

function parseUnstagedSqlFiles() {
  const unstagedText = git([
    "diff",
    "--name-only",
    "--diff-filter=ACM",
    "--",
    "*.sql",
    "*.ddl",
  ]);
  const unstagedFiles = unstagedText
    .split(/\r?\n/)
    .map((line) => normalizePath(line))
    .filter(Boolean);

  const untrackedText = git([
    "ls-files",
    "--others",
    "--exclude-standard",
    "--",
    "*.sql",
    "*.ddl",
  ]);
  const untrackedFiles = untrackedText
    .split(/\r?\n/)
    .map((line) => normalizePath(line))
    .filter(Boolean);

  return Array.from(new Set([...unstagedFiles, ...untrackedFiles]))
    .filter((file) => isSqlFile(file) && !file.includes("codegen/__out__"));
}

function stripComments(sql: string) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//gm, "")
    .replace(/--.*$/gm, "");
}

function splitSqlStatements(sql: string) {
  const statements: string[] = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let parenDepth = 0;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const prev = sql[i - 1];
    const next = sql[i + 1];
    if (ch === "'" && !inDoubleQuote && !(prev === "\\")) {
      inSingleQuote = !inSingleQuote;
      current += ch;
      continue;
    }
    if (ch === '"' && !inSingleQuote && !(prev === "\\")) {
      inDoubleQuote = !inDoubleQuote;
      current += ch;
      continue;
    }
    if (!inSingleQuote && !inDoubleQuote) {
      if (ch === "(") parenDepth += 1;
      if (ch === ")") parenDepth = Math.max(0, parenDepth - 1);
      if (ch === ";" && parenDepth === 0) {
        const trimmed = current.trim();
        if (trimmed) statements.push(trimmed);
        current = "";
        continue;
      }
    }
    if (ch === "\\" && next === "n") {
      current += ch;
      continue;
    }
    current += ch;
  }

  const finalChunk = current.trim();
  if (finalChunk) statements.push(finalChunk);
  return statements;
}

function parseTableName(raw: string) {
  const tableName = raw
    .trim()
    .replace(/^`|`$/g, "")
    .replace(/`/g, "")
    .replace(/^[\s"']+|[\s"']+$/g, "");
  return tableName.replace(/^.*\./, "");
}

function extractCreateTables(sql: string) {
  const statements = splitSqlStatements(stripComments(sql));
  const tables = new Map<string, Map<string, string>>();

  for (const statement of statements) {
    const match = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([`"\w.]+)/i);
    if (!match) continue;
    const tableName = parseTableName(match[1]);
    const openIndex = statement.indexOf("(");
    const closeIndex = statement.lastIndexOf(")");
    if (openIndex === -1 || closeIndex <= openIndex) continue;

    const body = statement.slice(openIndex + 1, closeIndex);
    const columnMap = new Map<string, string>();
    let current = "";
    let parenDepth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < body.length; i++) {
      const ch = body[i];
      const prev = body[i - 1];
      if (ch === "'" && !inDoubleQuote && prev !== "\\") {
        inSingleQuote = !inSingleQuote;
      } else if (ch === '"' && !inSingleQuote && prev !== "\\") {
        inDoubleQuote = !inDoubleQuote;
      }

      if (!inSingleQuote && !inDoubleQuote) {
        if (ch === "(") parenDepth += 1;
        if (ch === ")") parenDepth = Math.max(0, parenDepth - 1);
        if (ch === "," && parenDepth === 0) {
          const item = current.trim();
          current = "";
          if (!item) continue;
          const columnMatch = item.match(/^`?([A-Za-z0-9_]+)`?\s+(.*)$/);
          if (!columnMatch) continue;
          const colName = columnMatch[1];
          const colDef = columnMatch[2].trim();
          if (!/^PRIMARY\b|^UNIQUE\b|^KEY\b|^INDEX\b|^CONSTRAINT\b|^FULLTEXT\b|^SPATIAL\b/i.test(colDef)) {
            columnMap.set(colName, colDef);
          }
          continue;
        }
      }
      current += ch;
    }

    const tail = current.trim();
    if (tail) {
      const columnMatch = tail.match(/^`?([A-Za-z0-9_]+)`?\s+(.*)$/);
      if (columnMatch) {
        const colName = columnMatch[1];
        const colDef = columnMatch[2].trim();
        if (!/^PRIMARY\b|^UNIQUE\b|^KEY\b|^INDEX\b|^CONSTRAINT\b|^FULLTEXT\b|^SPATIAL\b/i.test(colDef)) {
          columnMap.set(colName, colDef);
        }
      }
    }

    if (columnMap.size > 0) {
      tables.set(tableName, columnMap);
    }
  }

  return tables;
}

function buildAlterStatementsFromSchema(prevSql: string, currSql: string) {
  const prevTables = extractCreateTables(prevSql);
  const currTables = extractCreateTables(currSql);
  const ops: string[] = [];

  function buildPositionClause(columnNames: string[], index: number) {
    if (index <= 0) {
      return " FIRST";
    }
    return ` AFTER \`${columnNames[index - 1]}\``;
  }

  for (const [tableName, currColumns] of currTables) {
    const prevColumns = prevTables.get(tableName);
    if (!prevColumns) continue;

    const currColumnEntries = Array.from(currColumns.entries());
    const currColumnNames = currColumnEntries.map(([colName]) => colName);

    for (let index = 0; index < currColumnEntries.length; index++) {
      const [colName, currDef] = currColumnEntries[index];
      const prevDef = prevColumns.get(colName);
      if (prevDef == null) {
        const positionClause = buildPositionClause(currColumnNames, index);
        ops.push(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${colName}\` ${currDef}${positionClause};`);
      } else if (prevDef.trim() !== currDef.trim()) {
        ops.push(`ALTER TABLE \`${tableName}\` MODIFY COLUMN \`${colName}\` ${currDef};`);
      }
    }

    for (const [colName] of prevColumns) {
      if (!currColumns.has(colName)) {
        ops.push(`ALTER TABLE \`${tableName}\` DROP COLUMN \`${colName}\`;`);
      }
    }
  }

  for (const [tableName] of prevTables) {
    if (!currTables.has(tableName)) {
      ops.push(`DROP TABLE IF EXISTS \`${tableName}\`;`);
    }
  }

  return ops;
}

function extractDirectAlterStatements(sqlText: string) {
  return splitSqlStatements(stripComments(sqlText))
    .filter((statement) => /\b(ALTER\s+TABLE|ADD\s+COLUMN|DROP\s+COLUMN|MODIFY\s+COLUMN|CHANGE\s+COLUMN)\b/i.test(statement));
}

function extractAlterFromDiff(diffText: string) {
  const addedSql = diffText
    .split(/\r?\n/)
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1).trim())
    .filter((line) => line && !line.startsWith("@@"))
    .join("\n");

  return extractDirectAlterStatements(addedSql);
}

async function readFileIfExists(file: string) {
  try {
    return await fs.readFile(path.join(repoRoot, file), "utf8");
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return "";
    }
    throw error;
  }
}

function readIndexFileIfExists(file: string) {
  const existsInIndex = git(["ls-files", "--cached", "--", file]);
  if (!existsInIndex.trim()) {
    return "";
  }
  return git(["show", `:${file}`]);
}

async function main() {
  const changedFiles = parseUnstagedSqlFiles();
  if (changedFiles.length === 0) {
    console.log("未检测到未暂存或未跟踪的 .sql 或 .ddl 改动。");
    return;
  }

  const generated: string[] = [];
  const generatedSet = new Set<string>();

  for (const file of changedFiles) {
    const diffOutput = git(["diff", "--unified=0", "--", file]);
    const direct = extractAlterFromDiff(diffOutput);
    if (direct.length > 0) {
      for (const sql of direct) {
        if (!generatedSet.has(sql)) {
          generatedSet.add(sql);
          generated.push(sql);
        }
      }
      continue;
    }

    const currentSql = await readFileIfExists(file);
    if (!currentSql.trim()) continue;

    if (!diffOutput.trim()) {
      const directFromFile = extractDirectAlterStatements(currentSql);
      if (directFromFile.length > 0) {
        for (const sql of directFromFile) {
          if (!generatedSet.has(sql)) {
            generatedSet.add(sql);
            generated.push(sql);
          }
        }
        continue;
      }
    }

    const previousSql = readIndexFileIfExists(file);

    if (!previousSql.trim()) {
      continue;
    }

    const alters = buildAlterStatementsFromSchema(previousSql, currentSql);
    if (alters.length > 0) {
      for (const sql of alters) {
        if (!generatedSet.has(sql)) {
          generatedSet.add(sql);
          generated.push(sql);
        }
      }
    }
  }

  if (generated.length === 0) {
    console.log("未识别到需要生成的 ALTER 语句。\n说明：脚本只处理未暂存/未跟踪变更；会优先提取新增 ALTER，CREATE TABLE 结构变更则基于 index（暂存区）版本对比。\n");
    return;
  }

  console.log("检测到 SQL 结构变更，建议生成的 ALTER 语句：");
  console.log("---");
  for (const sql of generated) {
    console.log(sql);
  }
  clipboardy.writeSync(generated.join("\n"));
  console.log("---");
  console.log("已复制到剪贴板。");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
