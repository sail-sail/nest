/**
 * 代码执行沙箱冒烟：越界读写、子进程、环境变量、超时、跨调用持久化。
 * 运行：pnpm smoke:sandbox
 *
 * 这里断言的是"隔离真的生效"，不是"代码能跑"——后者随便跑一段就行，
 * 前者才是这个工具能不能上生产的前提。
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const usrId = "smoke-user";
const conversationId = "smoke-conv";

process.env.AGENT_SANDBOX = "true";
process.env.AGENT_SANDBOX_TIMEOUT_MS = "5000";

const { sandbox, sandboxDir } = await import("../src/sandbox.ts");
const { config } = await import("../src/config.ts");

await sandbox.init();

const run = (code: string, timeoutMs?: number) =>
  sandbox.run({ usrId, conversationId, code, timeoutMs });

// 1. 正常执行
const basic = await run(`console.log(2 + 2)`);
assert.equal(basic.ok, true, `基础执行应成功：${basic.stderr}`);
assert.equal(basic.stdout, "4");

// 2. 跨调用持久化：同会话的产物下一轮还在
await run(`import fs from "node:fs"; fs.writeFileSync("mid.txt", "hello")`);
const reopen = await run(`import fs from "node:fs"; console.log(fs.readFileSync("mid.txt", "utf8"))`);
assert.equal(reopen.ok, true);
assert.equal(reopen.stdout, "hello");
assert.ok(reopen.files.includes("mid.txt"), "产物应出现在 files 列表里");

// 3. 读宿主 .env：拒绝，且内容不能泄漏
const envFile = JSON.stringify(path.join(root, ".env"));
const readEnv = await run(`import fs from "node:fs"; console.log(fs.readFileSync(${envFile}, "utf8"))`);
assert.equal(readEnv.ok, false, "读 .env 必须失败");
assert.match(readEnv.stderr, /ERR_ACCESS_DENIED|Access to this API has been restricted/);
assert.doesNotMatch(readEnv.stdout, /sk-|DEEPSEEK/);
assert.ok(readEnv.stdout.length < 200, "拒绝时不应回显文件内容");

// 4. 写工作区之外
const outside = JSON.stringify(path.join(root, ".dsh", "escape.txt"));
const writeOutside = await run(`import fs from "node:fs"; fs.writeFileSync(${outside}, "x")`);
assert.equal(writeOutside.ok, false, "越界写必须失败");
assert.equal(fs.existsSync(path.join(root, ".dsh", "escape.txt")), false);

// 5. 读另一个会话的目录
const other = await sandbox.run({
  usrId,
  conversationId: "other-conv",
  code: `import fs from "node:fs"; fs.writeFileSync("secret.txt", "other-data")`,
});
assert.equal(other.ok, true);
const otherPath = JSON.stringify(path.join(sandboxDir(usrId, "other-conv"), "secret.txt"));
const crossRead = await run(`import fs from "node:fs"; console.log(fs.readFileSync(${otherPath}, "utf8"))`);
assert.equal(crossRead.ok, false, "跨会话读必须失败");
assert.doesNotMatch(crossRead.stdout, /other-data/);

// 6. 子进程
const spawnBlocked = await run(
  `import cp from "node:child_process"; console.log(cp.execSync("whoami").toString())`,
);
assert.equal(spawnBlocked.ok, false, "child_process 必须失败");

// 7. 环境变量不得带出凭据
const envKeys = await run(`console.log(JSON.stringify(Object.keys(process.env)))`);
assert.equal(envKeys.ok, true);
const keys = JSON.parse(envKeys.stdout) as string[];
assert.equal(keys.some((key) => /KEY|SECRET|TOKEN|PASSWORD/i.test(key)), false, `泄漏了：${keys}`);
assert.equal(keys.includes("NODE_OPTIONS"), false, "NODE_OPTIONS 不应继承");

// 8. 超时回收
const loop = await run(`while (true) {}`, 1_500);
assert.equal(loop.timedOut, true, "死循环应被超时杀掉");
assert.equal(loop.ok, false);

// 9. 网络放行（产品决定）：只断言不是权限拒绝
const net = await run(
  `try { await fetch("https://example.com", { signal: AbortSignal.timeout(3000) }); console.log("net-ok") }
   catch (e) { console.log("net-err", e.code ?? e.name) }`,
  10_000,
);
assert.equal(net.ok, true);
assert.doesNotMatch(net.stdout + net.stderr, /ERR_ACCESS_DENIED/);

// 10. 报错不得泄漏宿主绝对路径（会暴露 .dsh 结构与用户桶哈希）
const syntax = await run(`console.log("unclosed"`);
assert.equal(syntax.ok, false);
assert.match(syntax.stderr, /main\.mjs/);
assert.doesNotMatch(syntax.stderr, /\.dsh/i);
assert.doesNotMatch(syntax.stderr, /hugjs/i);

// 清理本次冒烟产生的目录
const bucket = path.join(
  config.sandboxRoot,
  createHash("sha256").update(usrId).digest("hex").slice(0, 16),
);
fs.rmSync(bucket, { recursive: true, force: true });

console.log("sandbox smoke: 10 组断言全部通过");
