import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "./config.ts";
import { log } from "./logger.ts";

export interface MemoryItem {
  id: string;
  text: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  source: "user" | "assistant";
}

export interface MemoryDraft {
  text: string;
  tags?: string[];
  source?: "user" | "assistant";
}

export class MemoryRejected extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MemoryRejected";
  }
}

const MAX_ITEMS_PER_USER = 300;
const MAX_TEXT_LENGTH = 500;
const MAX_TAGS = 8;

/** 明显是凭据的内容不写入记忆 */
const SECRET_PATTERNS = [
  /\beyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]{8,}\b/,
  /\bBearer\s+[A-Za-z0-9._-]{10,}/i,
  /(password|passwd|secret|api[_-]?key)\s*[:=]/i,
  /(密码|口令|密钥)\s*(是|为|[:=])\s*\S+/,
];

function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ").toLowerCase();
}

function clampText(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > MAX_TEXT_LENGTH ? `${trimmed.slice(0, MAX_TEXT_LENGTH)}…` : trimmed;
}

function score(item: MemoryItem, query: string): number {
  const text = item.text.toLowerCase();
  const tags = item.tags.join(" ").toLowerCase();
  let value = 0;

  if (text.includes(query)) value += 6;
  if (tags.includes(query)) value += 3;

  const terms = query.split(/[\s,，、;；]+/).filter((term) => term.length > 0);
  for (const term of terms) {
    if (text.includes(term)) value += 2;
    if (tags.includes(term)) value += 1;
  }

  return value;
}

class MemoryStore {
  private readonly data = new Map<string, MemoryItem[]>();
  private loaded = false;
  private saveTimer: NodeJS.Timeout | undefined;
  private saveQueue: Promise<void> = Promise.resolve();

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    try {
      const raw = fs.readFileSync(config.memoryFile, "utf8");
      const parsed = JSON.parse(raw) as { users?: Record<string, MemoryItem[]> };
      for (const [usrId, items] of Object.entries(parsed.users ?? {})) {
        if (!Array.isArray(items)) continue;
        this.data.set(
          usrId,
          items.filter((item) => item?.id && typeof item.text === "string"),
        );
      }
      log.info("memory loaded", { users: this.data.size });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        log.warn("memory load failed", { error: String(error) });
      }
    }
  }

  private scheduleSave(): void {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = undefined;
      void this.flush();
    }, 300);
  }

  /** 定时保存与进程关闭共用一条异步写队列，避免并发写 tmp 文件 */
  flush(): Promise<void> {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
    }
    const memoryFile = config.memoryFile;
    const payload = JSON.stringify({ users: Object.fromEntries(this.data) }, null, 2);
    this.saveQueue = this.saveQueue.then(async () => {
      try {
        await fsp.mkdir(path.dirname(memoryFile), { recursive: true });
        const tmp = `${memoryFile}.tmp`;
        await fsp.writeFile(tmp, payload, "utf8");
        await fsp.rename(tmp, memoryFile);
      } catch (error) {
        log.warn("memory save failed", { error: String(error) });
      }
    });
    return this.saveQueue;
  }

  private itemsOf(usrId: string): MemoryItem[] {
    this.load();
    const existing = this.data.get(usrId);
    if (existing) return existing;
    const created: MemoryItem[] = [];
    this.data.set(usrId, created);
    return created;
  }

  save(usrId: string, draft: MemoryDraft): MemoryItem {
    const text = clampText(draft.text ?? "");
    if (!text) throw new MemoryRejected("记忆内容为空");

    if (SECRET_PATTERNS.some((pattern) => pattern.test(text))) {
      throw new MemoryRejected("这段内容看起来包含凭据或密钥，不能写入记忆");
    }

    const items = this.itemsOf(usrId);
    const key = normalize(text);
    const tags = (draft.tags ?? [])
      .map((tag) => String(tag).trim().slice(0, 24))
      .filter(Boolean)
      .slice(0, MAX_TAGS);

    const existing = items.find((item) => normalize(item.text) === key);
    if (existing) {
      existing.updatedAt = Date.now();
      existing.tags = [...new Set([...existing.tags, ...tags])];
      this.scheduleSave();
      return existing;
    }

    const item: MemoryItem = {
      id: `mem_${randomUUID().replaceAll("-", "")}`,
      text,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      source: draft.source ?? "assistant",
    };
    items.push(item);

    if (items.length > MAX_ITEMS_PER_USER) {
      items.sort((a, b) => a.updatedAt - b.updatedAt);
      items.splice(0, items.length - MAX_ITEMS_PER_USER);
    }

    this.scheduleSave();
    return item;
  }

  list(usrId: string, limit = 50): MemoryItem[] {
    return [...this.itemsOf(usrId)]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, Math.max(1, limit));
  }

  search(usrId: string, query: string, limit = 10): MemoryItem[] {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return this.list(usrId, limit);

    return this.itemsOf(usrId)
      .map((item) => ({ item, value: score(item, trimmed) }))
      .filter((entry) => entry.value > 0)
      .sort((a, b) => b.value - a.value || b.item.updatedAt - a.item.updatedAt)
      .slice(0, Math.max(1, limit))
      .map((entry) => entry.item);
  }

  forget(usrId: string, options: { id?: string; query?: string }): number {
    const items = this.itemsOf(usrId);
    const before = items.length;

    if (options.id) {
      const index = items.findIndex((item) => item.id === options.id);
      if (index >= 0) items.splice(index, 1);
    } else if (options.query) {
      const query = options.query.trim().toLowerCase();
      const matched = new Set(
        items.filter((item) => score(item, query) > 0).map((item) => item.id),
      );
      for (let i = items.length - 1; i >= 0; i -= 1) {
        if (matched.has(items[i]!.id)) items.splice(i, 1);
      }
    } else {
      items.length = 0;
    }

    const removed = before - items.length;
    if (removed > 0) this.scheduleSave();
    return removed;
  }

  /** 首轮对话注入用的摘要，控制长度，避免挤占上下文 */
  digest(usrId: string, limit = 10, maxChars = 1_500): string {
    const items = this.list(usrId, limit);
    if (items.length === 0) return "";

    const lines: string[] = [];
    let used = 0;
    for (const item of items) {
      const line = `- ${item.text}`;
      if (used + line.length > maxChars) break;
      lines.push(line);
      used += line.length + 1;
    }
    if (lines.length === 0) return "";

    return [
      "<user_memory>",
      "以下是与当前用户相关的长期记忆（自动注入，可能过时；需要更多细节时调用 memory_search）：",
      ...lines,
      "</user_memory>",
    ].join("\n");
  }
}

export const memory = new MemoryStore();
