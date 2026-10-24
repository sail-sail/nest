import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { config } from "./config.ts";
import { log } from "./logger.ts";

/**
 * 用量记账：按用户、按天聚合轮次、token、工具调用与耗时。
 *
 * 数据来源是 dsh 的 provider 精确用量（`assistant/message` 上的 usage），
 * 由 token-meter 的 deriveTurnTokenUsage 折叠成整轮；拿不到精确值时记 null，
 * 只保留时长与工具次数，不用启发式估算冒充账单。
 *
 * 落盘 `.dsh/usage/YYYY-MM-DD.jsonl`，一天一个文件，按保留天数清理。
 */

export interface TurnTokens {
  input: number;
  output: number;
  total: number;
  cacheRead?: number;
  cacheWrite?: number;
  reasoning?: number;
}

export interface TurnUsageInput {
  usrId: string;
  conversationId: string;
  sessionId: string;
  provider: string;
  model: string;
  ms: number;
  ok: boolean;
  aborted: boolean;
  toolCalls: number;
  /** null = 提供方没给出可用的精确用量 */
  tokens: TurnTokens | null;
}

export interface UsageDay {
  day: string;
  turns: number;
  ok: number;
  failed: number;
  aborted: number;
  /** 没有精确用量的轮次，避免把它们当成 0 token */
  unmeteredTurns: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  toolCalls: number;
  ms: number;
}

interface UsageRecord extends TurnUsageInput {
  time: number;
  day: string;
}

/** 本地时区的日期键：按用户看到的“今天”聚合，而不是 UTC */
function dayKey(time = Date.now()): string {
  const date = new Date(time);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function emptyDay(day: string): UsageDay {
  return {
    day,
    turns: 0,
    ok: 0,
    failed: 0,
    aborted: 0,
    unmeteredTurns: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    toolCalls: 0,
    ms: 0,
  };
}

class UsageStore {
  private readonly byUser = new Map<string, Map<string, UsageDay>>();
  private loaded = false;
  private writeQueue: Promise<void> = Promise.resolve();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    try {
      fs.mkdirSync(config.usageDir, { recursive: true });
      const cutoff = dayKey(Date.now() - config.usageRetentionDays * 86_400_000);
      const files = fs
        .readdirSync(config.usageDir)
        .filter((name) => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(name));

      let records = 0;
      for (const name of files) {
        const day = name.slice(0, 10);
        const file = path.join(config.usageDir, name);
        if (day < cutoff) {
          fs.rmSync(file, { force: true });
          continue;
        }
        const raw = fs.readFileSync(file, "utf8");
        for (const line of raw.split(/\r?\n/)) {
          if (!line.trim()) continue;
          try {
            this.apply(JSON.parse(line) as UsageRecord);
            records += 1;
          } catch {
            // 跳过损坏行，保留其余账目
          }
        }
      }
      log.info("usage loaded", { users: this.byUser.size, records });
    } catch (error) {
      log.warn("usage load failed", { error: String(error) });
    }
  }

  record(input: TurnUsageInput): Promise<void> {
    this.load();
    const time = Date.now();
    const record: UsageRecord = { ...input, time, day: dayKey(time) };
    this.apply(record);
    const file = path.join(config.usageDir, `${record.day}.jsonl`);
    const line = `${JSON.stringify(record)}\n`;
    this.writeQueue = this.writeQueue.then(async () => {
      try {
        await fsp.mkdir(path.dirname(file), { recursive: true });
        await fsp.appendFile(file, line, "utf8");
      } catch (error) {
        log.warn("usage append failed", { error: String(error) });
      }
    });
    return this.writeQueue;
  }

  /** 进程关闭前等待已经入账的异步写操作完成 */
  async flush(): Promise<void> {
    await this.writeQueue;
  }

  private apply(record: UsageRecord): void {
    if (!record.usrId || !record.day) return;
    const bucket = this.bucketOf(record.usrId, record.day);
    bucket.turns += 1;
    if (record.ok) bucket.ok += 1;
    else bucket.failed += 1;
    if (record.aborted) bucket.aborted += 1;
    bucket.toolCalls += Number.isFinite(record.toolCalls) ? record.toolCalls : 0;
    bucket.ms += Number.isFinite(record.ms) ? record.ms : 0;

    const tokens = record.tokens;
    if (!tokens) {
      bucket.unmeteredTurns += 1;
      return;
    }
    bucket.inputTokens += tokens.input || 0;
    bucket.outputTokens += tokens.output || 0;
    bucket.totalTokens += tokens.total || 0;
    bucket.cacheReadTokens += tokens.cacheRead || 0;
    bucket.cacheWriteTokens += tokens.cacheWrite || 0;
  }

  private bucketOf(usrId: string, day: string): UsageDay {
    let days = this.byUser.get(usrId);
    if (!days) {
      days = new Map();
      this.byUser.set(usrId, days);
    }
    let bucket = days.get(day);
    if (!bucket) {
      bucket = emptyDay(day);
      days.set(day, bucket);
    }
    return bucket;
  }

  /** 最近 N 天（含今天）；没有记录的日期不返回 */
  summary(usrId: string, days = 7): UsageDay[] {
    this.load();
    const result: UsageDay[] = [];
    const now = Date.now();
    const span = Math.max(1, Math.min(Math.trunc(days) || 7, 90));
    for (let offset = span - 1; offset >= 0; offset -= 1) {
      const bucket = this.byUser.get(usrId)?.get(dayKey(now - offset * 86_400_000));
      if (bucket) result.push({ ...bucket });
    }
    return result;
  }

  today(usrId: string): UsageDay {
    this.load();
    return { ...(this.byUser.get(usrId)?.get(dayKey()) ?? emptyDay(dayKey())) };
  }
}

export const usage = new UsageStore();
