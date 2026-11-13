import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 生产构建：
 *   1. tsc 把 src 编译到 dist（相对导入的 .ts 会重写成 .js）
 *   2. 把 dsh 配置、技能、工作目录、MCP 模板等运行时资源复制进 dist
 *   3. 生成一份只含生产依赖的 package.json
 *
 * 产出 dist 是自包含的：上传后 npm install --omit=dev 即可 node index.js。
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function log(message) {
  process.stdout.write(`[build] ${message}\n`);
}

function copy(source, target) {
  const from = path.join(root, source);
  if (!fs.existsSync(from)) {
    log(`skip ${source}（不存在）`);
    return;
  }
  fs.cpSync(from, path.join(dist, target), { recursive: true });
  log(`copy ${source} -> dist/${target}`);
}

log("清理 dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

log("编译 TypeScript");
execFileSync(
  process.execPath,
  [path.join(root, "node_modules", "typescript", "bin", "tsc"), "-p", "tsconfig.build.json"],
  { cwd: root, stdio: "inherit" },
);

if (!fs.existsSync(path.join(dist, "index.js"))) {
  throw new Error("编译后没有找到 dist/index.js，请检查 tsconfig.build.json");
}

copy("dsh", "dsh");
copy("skills", "skills");
copy("workspace", "workspace");
copy("deploy", "deploy");
copy("mcp.config.example.json", "mcp.config.example.json");
copy(".env.example", ".env.example");

const source = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const production = {
  name: source.name,
  version: source.version,
  private: true,
  type: "module",
  engines: { node: ">=22" },
  scripts: {
    start: "node index.js",
  },
  dependencies: source.dependencies,
};

fs.writeFileSync(
  path.join(dist, "package.json"),
  `${JSON.stringify(production, null, 2)}\n`,
  "utf8",
);
log("写入 dist/package.json（只含生产依赖）");

// ecosystem.config.json
let ecosystem = fs.readFileSync(path.join(root, "ecosystem.config.json"), "utf8");
ecosystem = ecosystem.replaceAll("{env}", "prod");
fs.writeFileSync(path.join(dist, "ecosystem.config.json"), ecosystem, "utf8");
log("写入 ecosystem.config.json");

copy(".npmrc", ".npmrc");

const files = fs.readdirSync(dist).sort();
log(`完成：dist/ (${files.length} 项)`);
