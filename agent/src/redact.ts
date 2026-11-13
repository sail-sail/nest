/**
 * 转录 / SSE 展示层的脱敏与体积裁剪。
 *
 * 目标不是“安全审计”，而是保证两件事：
 * 1. 文件内容（base64）与凭据不会落到转录文件，也不会随 SSE 帧回放给浏览器；
 * 2. 单条工具参数不会因为超长字符串把转录和前端拖垮。
 *
 * 注意：这里只处理“展示与留存”的副本，模型侧上下文由工具层自己约束
 * （见 bridge.ts 的 oss_upload 分流），不要指望本模块反推模型已经看到的内容。
 */

export interface RedactLimits {
  /** 单个普通字符串的最大保留长度 */
  maxString: number;
  /** 数组最多保留的元素个数 */
  maxArray: number;
  /** 对象最多保留的字段数 */
  maxObjectKeys: number;
  /** 最大递归深度 */
  maxDepth: number;
}

const DEFAULT_LIMITS: RedactLimits = {
  maxString: 2_000,
  maxArray: 50,
  maxObjectKeys: 60,
  maxDepth: 6,
};

/** 命中这些键一律省略：凭据、token、文件内容 */
const SENSITIVE_KEY =
  /^(authorization|proxy[-_]?authorization|cookie|set[-_]?cookie|token|access[-_]?token|refresh[-_]?token|id[-_]?token|password|passwd|secret|client[-_]?secret|api[-_]?key|apikey|api[-_]?secret|content[-_]?base64)$/i;

const BASE64_BODY = /^[A-Za-z0-9+/\r\n]+={0,2}$/;
const DATA_URL = /^data:[\w.+-]+\/[\w.+-]+;base64,/i;
/** 已脱敏的占位符：转录写入与回读各过一次，必须幂等 */
const MARKER = /^\[(?:base64 )?已省略，原始 \d+ 字符\]$/;
const TRUNCATED = /…（已省略 \d+ 字符）$/;

function omitted(value: string): string {
  if (DATA_URL.test(value) || (value.length >= 2_048 && BASE64_BODY.test(value))) {
    return `[base64 已省略，原始 ${value.length} 字符]`;
  }
  return `[已省略，原始 ${value.length} 字符]`;
}

function redactString(value: string, key: string | undefined, limits: RedactLimits): string {
  if (MARKER.test(value) || TRUNCATED.test(value)) return value;
  if (key !== undefined && SENSITIVE_KEY.test(key)) return omitted(value);
  if (DATA_URL.test(value)) return omitted(value);
  if (value.length <= limits.maxString) return value;
  if (BASE64_BODY.test(value)) return omitted(value);
  return `${value.slice(0, limits.maxString)}…（已省略 ${value.length - limits.maxString} 字符）`;
}

function redactValue(value: unknown, limits: RedactLimits, depth: number, key?: string): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return redactString(value, key, limits);
  if (typeof value !== "object") return value;
  if (depth >= limits.maxDepth) return "[层级过深已省略]";

  if (Array.isArray(value)) {
    const kept = value
      .slice(0, limits.maxArray)
      .map((item) => redactValue(item, limits, depth + 1));
    if (value.length > limits.maxArray) {
      kept.push(`…（另有 ${value.length - limits.maxArray} 项）`);
    }
    return kept;
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const out: Record<string, unknown> = {};
  for (const [entryKey, entryValue] of entries.slice(0, limits.maxObjectKeys)) {
    out[entryKey] = redactValue(entryValue, limits, depth + 1, entryKey);
  }
  if (entries.length > limits.maxObjectKeys) {
    out._omitted = `另有 ${entries.length - limits.maxObjectKeys} 个字段`;
  }
  return out;
}

/** 工具调用参数：写转录、推 SSE 前统一走这里 */
export function redactToolArguments(args: unknown, limits: Partial<RedactLimits> = {}): unknown {
  return redactValue(args, { ...DEFAULT_LIMITS, ...limits }, 0);
}

/** 任意 payload 的展示层裁剪（页面任务结果、错误详情等） */
export function redactPayload(value: unknown, limits: Partial<RedactLimits> = {}): unknown {
  return redactValue(value, { ...DEFAULT_LIMITS, ...limits }, 0);
}
