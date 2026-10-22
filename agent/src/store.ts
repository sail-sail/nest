import fs from "node:fs";
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
  private readonly sessions = new Map<string, HarnessSession>();
  private readonly live = new Set<string>();
  /** 正在生成回答的会话：「断开」只关 SSE，轮次仍占用到结束，防止同一 dsh 会话并发 run */
  private readonly busy = new Set<string>();
  private saveTimer: NodeJS.Timeout | undefined;
  private readonly tokenSweeper: NodeJS.Timeout;

  constructor() {
    // 定期清掉过期/无效 token，减少敏感凭据的内存驻留时间
    this.tokenSweeper = setInterval(() => this.sweepTokens(), 10 * 60_000);
    this.tokenSweeper.unref();
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
      this.save();
    }, 300);
  }

  save(): void {
    try {
      fs.mkdirSync(path.dirname(config.dataFile), { recursive: true });
      const payload = JSON.stringify({ conversations: [...this.records.values()] }, null, 2);
      const tmp = `${config.dataFile}.tmp`;
      fs.writeFileSync(tmp, payload, "utf8");
      fs.renameSync(tmp, config.dataFile);
    } catch (error) {
      log.error("conversation store save failed", { error: String(error) });
    }
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
    this.live.delete(record.dshSessionId);
    this.busy.delete(id);
    this.scheduleSave();
    return true;
  }

  /** 同一会话同时只允许一轮生成；占用成功返回 true，已在生成中返回 false */
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

  isLive(dshSessionId: string): boolean {
    return this.live.has(dshSessionId);
  }

  markLive(dshSessionId: string): void {
    this.live.add(dshSessionId);
  }

  getSession(dshSessionId: string): HarnessSession | undefined {
    return this.sessions.get(dshSessionId);
  }

  setSession(dshSessionId: string, session: HarnessSession): void {
    this.sessions.set(dshSessionId, session);
    this.live.add(dshSessionId);
  }
}

export const store = new ConversationStore();
