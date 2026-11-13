const JWT_PATTERN = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const BEARER_PATTERN = /(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi;

/**
 * Rust 的 token 解析错误会把原始 token 拼进 message，
 * 这里在跨进程返回/落日志前统一抹掉。
 */
export function sanitizeToken(message: string, token?: string): string {
  let text = message;
  if (token) text = text.split(token).join("[redacted]");
  return text.replace(JWT_PATTERN, "[redacted-jwt]").replace(BEARER_PATTERN, "$1[redacted]");
}
