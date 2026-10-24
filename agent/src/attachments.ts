import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { config } from "./config.ts";
import { errorMessage, log } from "./logger.ts";

/**
 * 附件暂存：浏览器把文件直接 POST 给宿主，模型只拿到 attachmentId。
 *
 * 这是「base64 不进上下文」的关键一环：文件字节既不经过模型，也不写进转录，
 * 只在真正调用 oss_upload 时由宿主读盘、转 base64、发给 Rust MCP。
 * 索引只存内存，进程重启后按 mtime 清理遗留文件。
 */

export class AttachmentError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "AttachmentError";
    this.code = code;
    this.status = status;
  }
}

/** 消息里的附件引用格式，前端与标题清洗共用 */
const HINT_PATTERN = /\[附件 att_[A-Za-z0-9]+ [^\]\n]+\]/g;

/** 去掉用户消息里的附件引用，会话标题只用真实文本 */
export function stripAttachmentHints(text: string): string {
  return text.replace(HINT_PATTERN, "").replace(/\n{3,}/g, "\n\n").trim();
}

export interface StagedAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: number;
  expiresAt: number;
}

interface StoredAttachment extends StagedAttachment {
  usrId: string;
  file: string;
}

export interface AttachmentInput {
  filename: string;
  contentType?: string;
  body: ReadableStream<Uint8Array> | null;
}

function humanSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

/** 只保留文件名本身：去掉路径、控制字符、Windows 非法字符与方括号（方括号用于消息里的附件引用） */
function cleanFilename(raw: string): string {
  const base = raw.split(/[\\/]/).pop() ?? "";
  const cleaned = base
    .replace(/[\u0000-\u001f\u007f<>:"|?*\[\]]/g, "")
    .trim()
    .slice(0, 120);
  return cleaned || "attachment.bin";
}

function publicOf(item: StoredAttachment): StagedAttachment {
  return {
    id: item.id,
    filename: item.filename,
    contentType: item.contentType,
    size: item.size,
    createdAt: item.createdAt,
    expiresAt: item.expiresAt,
  };
}

class AttachmentStore {
  private readonly items = new Map<string, StoredAttachment>();
  private sweeper: NodeJS.Timeout | undefined;
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    this.initialized = true;
    try {
      fs.mkdirSync(config.attachmentDir, { recursive: true });
      const now = Date.now();
      for (const name of fs.readdirSync(config.attachmentDir)) {
        const file = path.join(config.attachmentDir, name);
        try {
          if (now - fs.statSync(file).mtimeMs > config.attachmentTtlMs) {
            fs.rmSync(file, { force: true });
          }
        } catch {
          // 单个文件清理失败不影响启动
        }
      }
    } catch (error) {
      log.warn("attachment dir init failed", { error: errorMessage(error) });
    }

    this.sweeper = setInterval(() => this.sweep(), 5 * 60_000);
    this.sweeper.unref();
  }

  /** 每个用户暂存数量上限，避免匿名/异常调用把磁盘写满 */
  private assertQuota(usrId: string): void {
    const mine = [...this.items.values()].filter((item) => item.usrId === usrId);
    if (mine.length >= config.attachmentMaxPerUser) {
      throw new AttachmentError(
        `暂存附件过多（上限 ${config.attachmentMaxPerUser} 个），请先使用或等待过期`,
        "ATTACHMENT_QUOTA",
        429,
      );
    }
  }

  async put(usrId: string, input: AttachmentInput): Promise<StagedAttachment> {
    this.init();
    if (!config.attachmentEnabled) {
      throw new AttachmentError("附件功能已关闭（AGENT_ATTACHMENT=false）", "ATTACHMENT_DISABLED", 403);
    }
    if (!input.body) throw new AttachmentError("缺少请求体", "BAD_REQUEST", 400);
    this.assertQuota(usrId);

    const id = `att_${randomUUID().replaceAll("-", "")}`;
    const file = path.join(config.attachmentDir, `${id}.bin`);
    const tmp = `${file}.part`;
    let size = 0;

    const guard = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        size += chunk.length;
        if (size > config.attachmentMaxBytes) {
          callback(
            new AttachmentError(
              `附件超过上限 ${humanSize(config.attachmentMaxBytes)}`,
              "ATTACHMENT_TOO_LARGE",
              413,
            ),
          );
          return;
        }
        callback(null, chunk);
      },
    });

    try {
      await pipeline(
        Readable.fromWeb(
          input.body as unknown as import("node:stream/web").ReadableStream<Uint8Array>,
        ),
        guard,
        fs.createWriteStream(tmp),
      );
      await fsp.rename(tmp, file);
    } catch (error) {
      await fsp.rm(tmp, { force: true }).catch(() => undefined);
      if (error instanceof AttachmentError) throw error;
      throw new AttachmentError(`附件写入失败：${errorMessage(error)}`, "ATTACHMENT_WRITE_FAILED", 500);
    }

    if (size === 0) {
      await fsp.rm(file, { force: true }).catch(() => undefined);
      throw new AttachmentError("附件内容为空", "BAD_REQUEST", 400);
    }

    const now = Date.now();
    const item: StoredAttachment = {
      id,
      usrId,
      filename: cleanFilename(input.filename),
      contentType: input.contentType?.split(";")[0]?.trim() || "application/octet-stream",
      size,
      file,
      createdAt: now,
      expiresAt: now + config.attachmentTtlMs,
    };
    this.items.set(id, item);
    log.info("attachment staged", { usrId, attachmentId: id, size: item.size });
    return publicOf(item);
  }

  /** 读取时校验归属：不属于当前用户一律当作不存在，避免 id 枚举 */
  async read(
    usrId: string,
    id: string,
  ): Promise<{ meta: StagedAttachment; data: Buffer } | undefined> {
    this.init();
    const item = this.items.get(id);
    if (!item || item.usrId !== usrId) return undefined;
    if (item.expiresAt <= Date.now()) {
      await this.remove(id);
      return undefined;
    }
    try {
      const data = await fsp.readFile(item.file);
      return { meta: publicOf(item), data };
    } catch (error) {
      log.warn("attachment read failed", { attachmentId: id, error: errorMessage(error) });
      this.items.delete(id);
      return undefined;
    }
  }

  async remove(id: string): Promise<void> {
    const item = this.items.get(id);
    if (!item) return;
    this.items.delete(id);
    await fsp.rm(item.file, { force: true }).catch(() => undefined);
  }

  private async sweep(): Promise<void> {
    const now = Date.now();
    const expired = [...this.items.values()].filter((item) => item.expiresAt <= now);
    await Promise.all(expired.map((item) => this.remove(item.id)));
  }

  close(): void {
    clearInterval(this.sweeper);
  }
}

export const attachments = new AttachmentStore();
