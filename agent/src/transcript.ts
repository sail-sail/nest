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

function fileOf(conversationId: string): string {
  const safe = conversationId.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(dir, `${safe}.jsonl`);
}

export function appendTranscript(
  conversationId: string,
  entry: Omit<TranscriptEntry, "id" | "time"> & { time?: number },
): void {
  try {
    fs.mkdirSync(dir, { recursive: true });
    const full: TranscriptEntry = {
      id: `msg_${randomUUID().replaceAll("-", "")}`,
      time: entry.time ?? Date.now(),
      ...entry,
    };
    fs.appendFileSync(fileOf(conversationId), `${JSON.stringify(full)}\n`, "utf8");
  } catch (error) {
    log.warn("transcript append failed", { error: String(error) });
  }
}

export function readTranscript(conversationId: string, limit = 500): TranscriptEntry[] {
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
    return entries.slice(-limit);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      log.warn("transcript read failed", { error: String(error) });
    }
    return [];
  }
}

export function clearTranscript(conversationId: string): void {
  try {
    fs.rmSync(fileOf(conversationId), { force: true });
  } catch {
    // ignore
  }
}
