/**
 * 上下文边界冒烟：附件分流、转录脱敏、参数裁剪。
 * 运行：pnpm smoke:context
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { HarnessSession } from "@deepseek-ai/dsh-sdk-client";
import { attachments, stripAttachmentHints } from "../src/attachments.ts";
import { resolveUploadArgs } from "../src/bridge.ts";
import { config } from "../src/config.ts";
import { McpPool } from "../src/mcp-pool.ts";
import { redactToolArguments } from "../src/redact.ts";
import { store } from "../src/store.ts";
import { appendTranscript, clearTranscript, readTranscript } from "../src/transcript.ts";
import { usage } from "../src/usage.ts";
import { estimateTokens, renderWithinBudget } from "../dsh/tool-plugin.mjs";

const B64 = "A".repeat(200_000);

// 1. 脱敏：key 命中、超长字符串、嵌套
const redacted = redactToolArguments({
  query: "query { findAllUsr { id } }",
  contentBase64: B64,
  Authorization: "Bearer abcdefghijklmnop",
  nested: { text: "报".repeat(5_000), items: Array.from({ length: 80 }, (_v, i) => i) },
}) as Record<string, any>;

assert.equal(redacted.query, "query { findAllUsr { id } }", "GraphQL 不应被裁剪");
assert.equal(redacted.contentBase64, `[base64 已省略，原始 ${B64.length} 字符]`);
assert.equal(redacted.Authorization, "[已省略，原始 23 字符]");
assert.match(redacted.nested.text, /已省略 3000 字符/);
assert.equal(redacted.nested.items.length, 51);
console.log("redact ok");

// 2. 转录：落盘与回读都不含 base64
const conv = "conv_tmp_check";
await clearTranscript(conv);
const appendedCount = await appendTranscript(conv, {
  role: "tool_call",
  name: "oss_upload",
  callId: "call_1",
  args: { filename: "a.pdf", contentBase64: B64 },
});
assert.equal(appendedCount, 1, "新转录的首条记录不能重复计数");
const raw = fs.readFileSync(path.join(config.dshHome, "transcripts", `${conv}.jsonl`), "utf8");
assert.ok(!raw.includes(B64), "转录文件不得包含原始 base64");
const back = await readTranscript(conv);
assert.equal(back.length, 1);
assert.equal((back[0]!.args as Record<string, unknown>).contentBase64, `[base64 已省略，原始 ${B64.length} 字符]`);
console.log("transcript ok");

// 3. 附件：正常存取、归属校验、超限拒绝
const staged = await attachments.put("usr_a", {
  filename: "../../报告 [2026].pdf",
  contentType: "application/pdf; charset=binary",
  body: new Blob([Buffer.from("hello attachment")]).stream(),
});
assert.equal(staged.filename, "报告 2026.pdf");
assert.equal(staged.size, 16);
assert.equal(staged.contentType, "application/pdf");
assert.equal(await attachments.read("usr_b", staged.id), undefined, "跨用户不可读");

const read = await attachments.read("usr_a", staged.id);
assert.ok(read);
assert.equal(read.data.toString(), "hello attachment");

// 4. 分流：attachmentId 路径由宿主补 contentBase64
const hint = `[附件 ${staged.id} ${staged.filename}]`;
assert.equal(stripAttachmentHints(`${hint}\n\n查一下最近的订单`), "查一下最近的订单");
assert.equal(stripAttachmentHints(hint), "");

const resolved = await resolveUploadArgs("usr_a", {
  filename: "report.pdf",
  attachmentId: staged.id,
});
assert.equal(resolved.args.contentBase64, Buffer.from("hello attachment").toString("base64"));
assert.equal(resolved.args.attachmentId, undefined);
assert.equal(resolved.stagedId, staged.id);

// 5. 分流：超大内联 base64 拒绝
const original = config.attachmentMaxBytes;
(config as { attachmentMaxBytes: number }).attachmentMaxBytes = 1024;
try {
  await attachments.put("usr_c", {
    filename: "big.bin",
    body: new Blob([new Uint8Array(2_048)]).stream(),
  });
  assert.fail("应当拒绝超限附件");
} catch (error) {
  assert.equal((error as { code?: string }).code, "ATTACHMENT_TOO_LARGE");
}
(config as { attachmentMaxBytes: number }).attachmentMaxBytes = original;

await assert.rejects(
  () => resolveUploadArgs("usr_a", { filename: "x", contentBase64: B64 }),
  (error: { code?: string }) => error.code === "INLINE_BASE64_TOO_LARGE",
);

const small = await resolveUploadArgs("usr_a", { filename: "x.txt", contentBase64: "aGVsbG8=" });
assert.equal(small.args.contentBase64, "aGVsbG8=");
console.log("upload routing ok");

// 6. token 预算：估算、结构化裁剪、硬截断兜底
assert.equal(estimateTokens("abcd"), 1);
assert.equal(estimateTokens("你好"), 2);

const untouched = renderWithinBudget({ ok: true, rows: [1, 2, 3] }, 6_000);
assert.ok(!untouched.startsWith("[工具输出"), "小结果不应加裁剪说明");

const rows = Array.from({ length: 1_000 }, (_v, i) => ({
  id: i,
  name: `客户-${i}`,
  amount: 1234.56,
}));
const trimmed = renderWithinBudget({ data: { list: rows } }, 2_000);
assert.ok(estimateTokens(trimmed) <= 2_000, `裁剪后仍超预算：${estimateTokens(trimmed)}`);
assert.match(trimmed, /^\[工具输出超出 2000 tokens 预算/);
const parsed = JSON.parse(trimmed.slice(trimmed.indexOf("\n") + 1)) as {
  data: { list: unknown[] };
};
assert.ok(parsed.data.list.length < 1_000, "数组应被裁剪");
assert.equal(typeof parsed.data.list.at(-1), "string", "末尾应带省略标记");

const wide = Object.fromEntries(
  Array.from({ length: 5_000 }, (_v, i) => [`k${i}`, "value"]),
);
const hard = renderWithinBudget(wide, 1_000);
assert.ok(estimateTokens(hard) <= 1_000, `硬截断后仍超预算：${estimateTokens(hard)}`);
assert.match(hard, /已硬截断/);
console.log("output budget ok");

// 7. 会话句柄：LRU、TTL、busy 保护
// 会话索引写到临时目录，绝不碰真实的 .dsh/conversations.json
const storeDir = fs.mkdtempSync(path.join(os.tmpdir(), "agent-store-"));
(config as { dataFile: string }).dataFile = path.join(storeDir, "conversations.json");
const fakeSession = { run: async () => ({}) } as unknown as HarnessSession;
const originalMax = config.sessionMax;
const originalTtl = config.sessionTtlMs;
(config as { sessionMax: number }).sessionMax = 2;
(config as { sessionTtlMs: number }).sessionTtlMs = 60_000;

const lruA = store.create("usr_lru", "a");
const lruB = store.create("usr_lru", "b");
const lruC = store.create("usr_lru", "c");
store.setSession(lruA.dshSessionId, fakeSession);
store.setSession(lruB.dshSessionId, fakeSession);
store.getSession(lruA.dshSessionId);
store.setSession(lruC.dshSessionId, fakeSession);
assert.equal(store.getSession(lruB.dshSessionId), undefined, "最久未用的句柄应被淘汰");
assert.ok(store.getSession(lruA.dshSessionId));
assert.ok(store.getSession(lruC.dshSessionId));
assert.equal(store.sessionStats().live, 2);

// busy 的句柄即使超限也不淘汰（宁可先放下新句柄）
(config as { sessionMax: number }).sessionMax = 1;
store.markSessionBusy(lruA.dshSessionId, true);
const lruD = store.create("usr_lru", "d");
store.setSession(lruD.dshSessionId, fakeSession);
assert.ok(store.getSession(lruA.dshSessionId), "busy 句柄必须保留");
assert.equal(store.sessionStats().busy, 1);
assert.equal(store.sessionStats().live, 1);
store.markSessionBusy(lruA.dshSessionId, false);

// TTL：空闲超过阈值后 getSession 返回 undefined，交给上层 resume
(config as { sessionTtlMs: number }).sessionTtlMs = 1;
await new Promise((resolve) => setTimeout(resolve, 10));
assert.equal(store.getSession(lruA.dshSessionId), undefined, "TTL 到期应释放句柄");

// 生成/删除共用独占锁，持有期间另一个独占操作必须失败
const deleteLock = store.create("usr_lru", "delete-lock");
assert.equal(store.tryMarkBusy(deleteLock.id), true);
assert.equal(store.tryMarkBusy(deleteLock.id), false, "生成中的会话不能同时进入删除");
store.clearBusy(deleteLock.id);

(config as { sessionMax: number }).sessionMax = originalMax;
(config as { sessionTtlMs: number }).sessionTtlMs = originalTtl;
for (const record of [lruA, lruB, lruC, lruD, deleteLock]) store.remove(record.id, "usr_lru");
// 显式排空异步保存队列，再删临时目录
await store.save();
fs.rmSync(storeDir, { recursive: true, force: true });
console.log("session lifecycle ok");

// 8. MCP 连接池：相同 token 并发首次调用只创建并关闭一个连接
const pool = new McpPool("http://127.0.0.1:1/mcp");
let createdConnections = 0;
let closedConnections = 0;
(pool as unknown as { create: (token: string) => Promise<unknown> }).create = async () => {
  createdConnections += 1;
  await new Promise((resolve) => setTimeout(resolve, 20));
  return {
    client: {
      callTool: async () => ({ structuredContent: { ok: true } }),
    },
    transport: {
      close: async () => {
        closedConnections += 1;
      },
    },
    lastUsed: Date.now(),
  };
};
await Promise.all(
  Array.from({ length: 4 }, () =>
    pool.call("same-test-token", "session_me", {}, { retryable: false }),
  ),
);
assert.equal(createdConnections, 1, "并发首次调用必须共享同一次连接创建");
await pool.closeAll();
assert.equal(closedConnections, 1, "共享连接只能被关闭一次");
console.log("mcp pool singleflight ok");

// 9. 用量记账：按用户按天聚合 + 落盘
const usageDir = fs.mkdtempSync(path.join(os.tmpdir(), "agent-usage-"));
(config as { usageDir: string }).usageDir = usageDir;
usage.load();

await usage.record({
  usrId: "usr_usage",
  conversationId: "conv_usage",
  sessionId: "session_usage",
  provider: "deepseek-official",
  model: "deepseek-flash",
  ms: 1_200,
  ok: true,
  aborted: false,
  toolCalls: 2,
  tokens: { input: 100, output: 50, total: 150, cacheRead: 10 },
});
await usage.record({
  usrId: "usr_usage",
  conversationId: "conv_usage",
  sessionId: "session_usage",
  provider: "deepseek-official",
  model: "deepseek-flash",
  ms: 800,
  ok: false,
  aborted: true,
  toolCalls: 0,
  tokens: null,
});

const today = usage.today("usr_usage");
assert.equal(today.turns, 2);
assert.equal(today.ok, 1);
assert.equal(today.failed, 1);
assert.equal(today.aborted, 1);
assert.equal(today.unmeteredTurns, 1);
assert.equal(today.totalTokens, 150);
assert.equal(today.cacheReadTokens, 10);
assert.equal(today.toolCalls, 2);
assert.equal(today.ms, 2_000);
assert.equal(usage.summary("usr_usage", 7).length, 1);
assert.equal(usage.today("usr_other").turns, 0);

const usageFile = path.join(usageDir, `${today.day}.jsonl`);
const lines = fs.readFileSync(usageFile, "utf8").trim().split("\n");
assert.equal(lines.length, 2, "一轮一条账");
fs.rmSync(usageDir, { recursive: true, force: true });
console.log("usage accounting ok");

await attachments.remove(staged.id);
await clearTranscript(conv);
attachments.close();
console.log("all checks passed");
