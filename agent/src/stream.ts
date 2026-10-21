import type { HarnessNotification } from "@deepseek-ai/dsh-sdk-client";

export interface SseFrame {
  event: string;
  data: Record<string, unknown>;
}

interface ContentBlockLike {
  type?: string;
  text?: string;
}

function collectText(blocks: unknown): { text: string; reasoning: string } {
  if (!Array.isArray(blocks)) return { text: "", reasoning: "" };
  const text: string[] = [];
  const reasoning: string[] = [];
  for (const block of blocks as ContentBlockLike[]) {
    if (!block || typeof block !== "object") continue;
    if (block.type === "text" && typeof block.text === "string") text.push(block.text);
    if (block.type === "reasoning" && typeof block.text === "string") reasoning.push(block.text);
  }
  return { text: text.join(""), reasoning: reasoning.join("") };
}

function safeParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function clip(value: string, max = 8000): string {
  return value.length > max ? `${value.slice(0, max)}\n…（已截断）` : value;
}

/**
 * 把 dsh 的 session.event 映射成前端易消费的 SSE 帧。
 * 只转发根会话的事件；子代理事件暂不展示。
 */
export function mapNotification(
  notification: HarnessNotification,
  rootSessionId: string,
): SseFrame | undefined {
  if (notification.method === "session.status") {
    const params = notification.params as { sessionId?: string; status?: string };
    if (params.sessionId !== rootSessionId || !params.status) return undefined;
    return { event: "status", data: { status: params.status } };
  }

  if (notification.method !== "session.event") return undefined;
  const params = notification.params as {
    sessionId?: string;
    event?: { type?: string; seq?: number; time?: number; data?: Record<string, unknown> };
  };
  if (params.sessionId !== rootSessionId) return undefined;
  const event = params.event;
  if (!event?.type) return undefined;

  const base = { seq: event.seq, time: event.time, type: event.type };
  const data = event.data ?? {};

  switch (event.type) {
    case "assistant/message": {
      const message = data.message as { content?: unknown } | undefined;
      const { text, reasoning } = collectText(message?.content);
      if (!text.trim() && !reasoning.trim()) return undefined;
      return {
        event: "assistant",
        data: {
          ...base,
          turn: data.turn,
          step: data.step,
          text,
          reasoning,
          interrupted: data.interrupted === true,
        },
      };
    }
    case "tool/call": {
      return {
        event: "tool_call",
        data: {
          ...base,
          turn: data.turn,
          step: data.step,
          callId: data.callId,
          name: data.name,
          arguments: safeParse(String(data.arguments ?? "{}")),
        },
      };
    }
    case "tool/result": {
      const message = data.message as
        | { toolCallId?: string; content?: unknown; isError?: boolean }
        | undefined;
      const { text } = collectText(message?.content);
      return {
        event: "tool_result",
        data: {
          ...base,
          callId: message?.toolCallId,
          isError: message?.isError === true,
          content: clip(text),
        },
      };
    }
    case "turn/start":
    case "turn/end": {
      return {
        event: "turn",
        data: { ...base, turn: data.turn, phase: event.type === "turn/start" ? "start" : "end" },
      };
    }
    case "step/start":
    case "step/end": {
      return {
        event: "step",
        data: {
          ...base,
          turn: data.turn,
          step: data.step,
          phase: event.type === "step/start" ? "start" : "end",
        },
      };
    }
    default:
      return undefined;
  }
}
