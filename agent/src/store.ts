import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { HarnessSession } from "@deepseek-ai/dsh-sdk-client";
import { decodeClaims } from "./auth.ts";
import { config } from "./config.ts";
import { log } from "./logger.ts";

export interface ConversationRecord {
  id: string;
  dshSessionId: string;
  usrId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface PublicConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface SessionStats {
  live: number;
  busy: number;
  max: number;
  ttlMs: number;
}

interface SessionEntry {
  session: HarnessSession;
  /** 最后一次被使用的时间，用于 TTL 与 LRU */
  lastUsed: number;
  /** 正在跑一轮：不允许被淘汰 */
  busy: boolean;
}

function toPublic(record: ConversationRecord): PublicConversation {
  return {
    id: record.id,
    title: record.title,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export class ConversationStore {
  private readonly records = new Map<string, ConversationRecord>();
  /** dshSessionId → record 反向索引：桥工具调用按 sessionId 反查用户，避免每次全量扫描 */
  private readonly byDshSessionId = new Map<string, ConversationRecord>();
  private readonly tokens = new Map<string, string>();
  /** dshSessionId → 会话句柄；Map 的插入顺序即 LRU 顺序（最旧在前） */
  private readonly sessions = new Map<string, SessionEntry>();
  /** 会话独占锁：生成或删除期间阻止另一独占操作；SSE 断开不会提前释放生成锁 */
  private readonly busy = new Set<string>();
  private saveTimer: NodeJS.Timeout | undefined;
  private saveQueue: Promise<void> = Promise.resolve();
  private readonly tokenSweeper: NodeJS.Timeout;
  private readonly sessionSweeper: NodeJS.Timeout;

  constructor() {
    // 定期清掉过期/无效 token，减少敏感凭据的内存驻留时间
    this.tokenSweeper = setInterval(() => this.sweepTokens(), 10 * 60_000);
    this.tokenSweeper.unref();
    // 定期回收长时间没用的会话句柄，避免多用户长跑把内存堆满
    this.sessionSweeper = setInterval(() => this.sweepSessions(), 60_000);
    this.sessionSweeper.unref();
  }

  /** decodeClaims 对过期或格式损坏的 token 都会抛错，抛错即可安全移除 */
  private sweepTokens(): void {
    for (const [sessionId, token] of this.tokens) {
      try {
        decodeClaims(token);
      } catch {
        this.tokens.delete(sessionId);
      }
    }
  }

  load(): void {
    try {
      const raw = fs.readFileSync(config.dataFile, "utf8");
      const parsed = JSON.parse(raw) as { conversations?: ConversationRecord[] };
      for (const record of parsed.conversations ?? []) {
        if (!record?.id || !record.dshSessionId || !record.usrId) continue;
        this.records.set(record.id, record);
        this.byDshSessionId.set(record.dshSessionId, record);
      }
      log.info("conversations loaded", { count: this.records.size });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        log.warn("conversation store load failed", { error: String(error) });
      }
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = undefined;
      void this.save();
    }, 300);
  }

  /** 快照按调用顺序异步串行落盘；定时保存与关闭保存不能同时写同一个 tmp 文件 */
  save(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
    }
    const payload = JSON.stringify({ conversations: [...this.records.values()] }, null, 2);
    const dataFile = config.dataFile;
    this.saveQueue = this.saveQueue.then(async () => {
      try {
        await fsp.mkdir(path.dirname(dataFile), { recursive: true });
        const tmp = `${dataFile}.tmp`;
        await fsp.writeFile(tmp, payload, "utf8");
        await fsp.rename(tmp, dataFile);
      } catch (error) {
        log.error("conversation store save failed", { error: String(error) });
      }
    });
    return this.saveQueue;
  }

  create(usrId: string, title = "新会话"): ConversationRecord {
    const now = Date.now();
    const record: ConversationRecord = {
      id: `conv_${randomUUID().replaceAll("-", "")}`,
      dshSessionId: `session-${randomUUID().replaceAll("-", "")}`,
      usrId,
      title,
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    this.byDshSessionId.set(record.dshSessionId, record);
    this.scheduleSave();
    return record;
  }

  list(usrId: string): PublicConversation[] {
    return [...this.records.values()]
      .filter((record) => record.usrId === usrId)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(toPublic);
  }

  get(id: string, usrId: string): ConversationRecord | undefined {
    const record = this.records.get(id);
    if (!record || record.usrId !== usrId) return undefined;
    return record;
  }

  remove(id: string, usrId: string): boolean {
    const record = this.get(id, usrId);
    if (!record) return false;
    this.records.delete(id);
    this.byDshSessionId.delete(record.dshSessionId);
    this.tokens.delete(record.dshSessionId);
    this.sessions.delete(record.dshSessionId);
    this.busy.delete(id);
    this.scheduleSave();
    return true;
  }

  /** 同一会话同时只允许一个生成/删除操作；占用成功返回 true，已占用返回 false */
  tryMarkBusy(conversationId: string): boolean {
    if (this.busy.has(conversationId)) return false;
    this.busy.add(conversationId);
    return true;
  }

  clearBusy(conversationId: string): void {
    this.busy.delete(conversationId);
  }

  bindToken(record: ConversationRecord, token: string): void {
    this.tokens.set(record.dshSessionId, token);
  }

  tokenFor(dshSessionId: string): string | undefined {
    return this.tokens.get(dshSessionId);
  }

  /** 反查 dsh 会话属于哪个用户：页面操作要按用户路由到正确的浏览器连接 */
  usrIdFor(dshSessionId: string): string | undefined {
    return this.byDshSessionId.get(dshSessionId)?.usrId;
  }

  touch(record: ConversationRecord, text: string): void {
    const trimmed = text.trim().replace(/\s+/g, " ");
    if (record.title === "新会话" && trimmed) {
      record.title = trimmed.length > 30 ? `${trimmed.slice(0, 30)}…` : trimmed;
    }
    record.updatedAt = Date.now();
    this.scheduleSave();
  }

  /** 取会话句柄并刷新 LRU；超过 TTL 的直接释放，交给上层 resumeSession 重建 */
  getSession(dshSessionId: string): HarnessSession | undefined {
    const entry = this.sessions.get(dshSessionId);
    if (!entry) return undefined;
    if (!entry.busy && Date.now() - entry.lastUsed > config.sessionTtlMs) {
      this.evictSession(dshSessionId, "ttl");
      return undefined;
    }
    entry.lastUsed = Date.now();
    // 重新插入把该句柄移到 Map 末尾，保持「最旧在前」
    this.sessions.delete(dshSessionId);
    this.sessions.set(dshSessionId, entry);
    return entry.session;
  }

  setSession(dshSessionId: string, session: HarnessSession): void {
    const existing = this.sessions.get(dshSessionId);
    if (existing) {
      existing.session = session;
      existing.lastUsed = Date.now();
      this.sessions.delete(dshSessionId);
      this.sessions.set(dshSessionId, existing);
    } else {
      this.sessions.set(dshSessionId, { session, lastUsed: Date.now(), busy: false });
    }
    this.evictOverflow();
  }

  /** 轮次开始/结束时标记；busy 的句柄不会被 TTL 或 LRU 回收 */
  markSessionBusy(dshSessionId: string, busy: boolean): void {
    const entry = this.sessions.get(dshSessionId);
    if (!entry) return;
    entry.busy = busy;
    entry.lastUsed = Date.now();
  }

  sessionStats(): SessionStats {
    let busy = 0;
    for (const entry of this.sessions.values()) {
      if (entry.busy) busy += 1;
    }
    return {
      live: this.sessions.size,
      busy,
      max: config.sessionMax,
      ttlMs: config.sessionTtlMs,
    };
  }

  private evictSession(dshSessionId: string, reason: "lru" | "ttl" | "delete"): void {
    const entry = this.sessions.get(dshSessionId);
    if (!entry) return;
    this.sessions.delete(dshSessionId);
    log.info("session evicted", {
      sessionId: dshSessionId,
      reason,
      idleMs: Date.now() - entry.lastUsed,
    });
  }

  private evictOverflow(): void {
    if (this.sessions.size <= config.sessionMax) return;
    for (const [sessionId, entry] of this.sessions) {
      if (this.sessions.size <= config.sessionMax) return;
      if (entry.busy) continue;
      this.evictSession(sessionId, "lru");
    }
  }

  private sweepSessions(): void {
    const now = Date.now();
    for (const [sessionId, entry] of this.sessions) {
      if (entry.busy) continue;
      if (now - entry.lastUsed > config.sessionTtlMs) {
        this.evictSession(sessionId, "ttl");
      }
    }
  }
}

export const store = new ConversationStore();
