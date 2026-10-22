import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "./config.ts";
import { log } from "./logger.ts";

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

function fileOf(conversationId: string): string {
  const safe = conversationId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(dir, `${safe}.jsonl`);
}

function countFile(conversationId: string): number {
  try {
    const raw = fs.readFileSync(fileOf(conversationId), "utf8");
    return raw.split(/\r?\n/).filter((line) => line.trim()).length;
  } catch {
    return 0;
  }
}

function compactFile(conversationId: string, kept: TranscriptEntry[]): void {
  try {
    const tmp = `${fileOf(conversationId)}.tmp`;
    fs.writeFileSync(tmp, `${kept.map((entry) => JSON.stringify(entry)).join("\n")}\n`, "utf8");
    fs.renameSync(tmp, fileOf(conversationId));
    log.info("transcript compacted", { conversationId, kept: kept.length });
  } catch (error) {
    log.warn("transcript compact failed", { error: String(error) });
  }
}

/** 追加一条转录，返回该会话当前的总条数（供首轮判断等使用） */
export function appendTranscript(
  conversationId: string,
  entry: Omit<TranscriptEntry, "id" | "time"> & { time?: number },
): number {
  let appended = false;
  try {
    fs.mkdirSync(dir, { recursive: true });
    const full: TranscriptEntry = {
      id: `msg_${randomUUID().replaceAll("-", "")}`,
      time: entry.time ?? Date.now(),
      ...entry,
    };
    fs.appendFileSync(fileOf(conversationId), `${JSON.stringify(full)}\n`, "utf8");
    appended = true;
  } catch (error) {
    log.warn("transcript append failed", { error: String(error) });
  }
  // 进程重启后缓存为空：先按文件实际行数校正一次
  if (!counts.has(conversationId)) {
    counts.set(conversationId, countFile(conversationId));
  }
  if (!appended) {
    const actual = countFile(conversationId);
    counts.set(conversationId, actual);
    return actual;
  }

  const next = (counts.get(conversationId) ?? 0) + 1;
  counts.set(conversationId, next);
  return next;
}

export function readTranscript(conversationId: string, limit = KEEP_ENTRIES): TranscriptEntry[] {
  try {
    const raw = fs.readFileSync(fileOf(conversationId), "utf8");
    const entries: TranscriptEntry[] = [];
    for (const line of raw.split(/\r?\n/)) {
      if (!line.trim()) continue;
      try {
        entries.push(JSON.parse(line) as TranscriptEntry);
      } catch {
        // skip broken line
      }
    }
    // 文件超阈值时压缩到 KEEP_ENTRIES，避免长会话无限增长
    if (entries.length > COMPACT_THRESHOLD) {
      const kept = entries.slice(-KEEP_ENTRIES);
      compactFile(conversationId, kept);
      entries.splice(0, entries.length - kept.length);
    }
    counts.set(conversationId, entries.length);
    return entries.slice(-limit);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      log.warn("transcript read failed", { error: String(error) });
    }
    return [];
  }
}

export function clearTranscript(conversationId: string): void {
  counts.delete(conversationId);
  try {
    fs.rmSync(fileOf(conversationId), { force: true });
  } catch {
    // ignore
  }
}
