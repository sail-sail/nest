const SECRET_PATTERN = /token|authorization|secret|api[-_]?key|password/i;

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[deep]";
  if (value == null) return value;
  if (typeof value === "string") return value.length > 500 ? `${value.slice(0, 500)}...` : value;
  if (typeof value !== "object") return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => redact(item, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SECRET_PATTERN.test(key) ? "[redacted]" : redact(item, depth + 1);
  }
  return out;
}

function write(level: "info" | "warn" | "error", message: string, meta?: unknown): void {
  const line = {
    time: new Date().toISOString(),
    level,
    message,
    ...(meta === undefined ? {} : { meta: redact(meta) }),
  };
  const text = JSON.stringify(line);
  if (level === "error") console.error(text);
  else console.log(text);
}

export const log = {
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
};

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
