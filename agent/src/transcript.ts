import fsp from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "./config.ts";
import { log } from "./logger.ts";
import { redactToolArguments } from "./redact.ts";

export type TranscriptRole = "user" | "assistant" | "tool_call" | "tool_result";

export interface TranscriptEntry {
  id: string;
  role: TranscriptRole;
  time: number;
  text?: string;
  reasoning?: string;
  name?: string;
  callId?: string;
  args?: unknown;
  content?: string;
  isError?: boolean;
}

const dir = path.join(config.dshHome, "transcripts");

/** 常驻保留的条数上限；超过 COMPACT_THRESHOLD 时读文件会触发压缩 */
const KEEP_ENTRIES = 500;
const COMPACT_THRESHOLD = 1_000;

/** 每个会话的条数缓存：append 时维护，避免每条消息都全量读文件 */
const counts = new Map<string, number>();
/** 同一会话的追加、读取、压缩和删除串行执行，避免异步化后发生写读/写删竞态 */
const operations = new Map<string, Promise<void>>();

function fileOf(conversationId: string): string {
  const safe = conversationId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(dir, `${safe}.jsonl`);
}

function enqueue<T>(conversationId: string, operation: () => Promise<T>): Promise<T> {
  const previous = operations.get(conversationId) ?? Promise.resolve();
  const result = previous.then(operation);
  const settled = result.then(
    () => undefined,
    () => undefined,
  );
  operations.set(conversationId, settled);
  void settled.then(() => {
    if (operations.get(conversationId) === settled) operations.delete(conversationId);
  });
  return result;
}

async function countFile(conversationId: string): Promise<number> {
  try {
    const raw = await fsp.readFile(fileOf(conversationId), "utf8");
    return raw.split(/\r?\n/).filter((line) => line.trim()).length;
  } catch {
    return 0;
  }
}

async function compactFile(conversationId: string, kept: TranscriptEntry[]): Promise<void> {
  try {
    const tmp = `${fileOf(conversationId)}.tmp`;
    await fsp.writeFile(tmp, `${kept.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");
    await fsp.rename(tmp, fileOf(conversationId));
    log.info("transcript compacted", { conversationId, kept: kept.length });
  } catch (error) {
    log.warn("transcript compact failed", { error: String(error) });
  }
}

/**
 * 追加一条转录，返回该会话当前的总条数（供首轮判断等使用）。
 * 工具参数在落盘前脱敏：base64 / 凭据不进转录，超长字符串按体积截断。
 */
export function appendTranscript(
  conversationId: string,
  entry: Omit<TranscriptEntry, "id" | "time"> & { time?: number },
): Promise<number> {
  return enqueue(conversationId, async () => {
    // 进程重启后缓存为空：追加前先按文件实际行数校正，避免把新条目重复计数
    if (!counts.has(conversationId)) {
      counts.set(conversationId, await countFile(conversationId));
    }

    let appended = false;
    try {
      await fsp.mkdir(dir, { recursive: true });
      const full: TranscriptEntry = {
        id: `msg_${randomUUID().replaceAll("-", "")}`,
        time: entry.time ?? Date.now(),
        ...entry,
      };
      if (full.role === "tool_call") full.args = redactToolArguments(full.args);
      await fsp.appendFile(fileOf(conversationId), `${JSON.stringify(full)}\n`, "utf8");
      appended = true;
    } catch (error) {
      log.warn("transcript append failed", { error: String(error) });
    }

    if (!appended) {
      const actual = await countFile(conversationId);
      counts.set(conversationId, actual);
      return actual;
    }

    const next = (counts.get(conversationId) ?? 0) + 1;
    counts.set(conversationId, next);
    return next;
  });
}

export function readTranscript(
  conversationId: string,
  limit = KEEP_ENTRIES,
): Promise<TranscriptEntry[]> {
  return enqueue(conversationId, async () => {
    try {
      const raw = await fsp.readFile(fileOf(conversationId), "utf8");
      const entries: TranscriptEntry[] = [];
      for (const line of raw.split(/\r?\n/)) {
        if (!line.trim()) continue;
        try {
          const entry = JSON.parse(line) as TranscriptEntry;
          // 历史文件可能写入过未脱敏的 base64，读取时再兜一层
          if (entry.role === "tool_call") entry.args = redactToolArguments(entry.args);
          entries.push(entry);
        } catch {
          // skip broken line
        }
      }
      // 文件超阈值时压缩到 KEEP_ENTRIES，避免长会话无限增长
      if (entries.length > COMPACT_THRESHOLD) {
        const kept = entries.slice(-KEEP_ENTRIES);
        await compactFile(conversationId, kept);
        entries.splice(0, entries.length - kept.length);
      }
      counts.set(conversationId, entries.length);
      return entries.slice(-limit);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        counts.set(conversationId, 0);
      } else {
        log.warn("transcript read failed", { error: String(error) });
      }
      return [];
    }
  });
}

export function clearTranscript(conversationId: string): Promise<void> {
  return enqueue(conversationId, async () => {
    counts.delete(conversationId);
    try {
      await fsp.rm(fileOf(conversationId), { force: true });
    } catch {
      // ignore
    }
  });
}

/** 等待指定会话或全部会话已排队的转录操作完成，用于轮次收尾与优雅关闭 */
export async function waitForTranscripts(conversationId?: string): Promise<void> {
  if (conversationId) {
    await operations.get(conversationId);
    return;
  }
  await Promise.all([...operations.values()]);
}
