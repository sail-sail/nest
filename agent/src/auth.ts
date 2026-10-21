import { createHash } from "node:crypto";

export interface TokenClaims {
  id: string;
  tenant_id?: string;
  exp?: number;
  lang?: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function extractBearer(header: string | undefined): string | undefined {
  if (!header) return undefined;
  const value = header.trim();
  if (!value) return undefined;
  const space = value.indexOf(" ");
  if (space === -1) return value;
  const scheme = value.slice(0, space);
  const token = value.slice(space + 1).trim();
  if (scheme.toLowerCase() !== "bearer") return undefined;
  return token || undefined;
}

/**
 * 只做 base64url 解码，不做签名校验。
 * 签名校验由 Rust 端完成；这里仅用于会话归属与列表展示。
 */
export function decodeClaims(token: string): TokenClaims {
  const parts = token.split(".");
  if (parts.length < 2) throw new AuthError("token 格式不正确");
  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(parts[1]!, "base64url").toString("utf8"));
  } catch {
    throw new AuthError("token payload 无法解析");
  }
  if (!payload || typeof payload !== "object") throw new AuthError("token payload 为空");
  const record = payload as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id : "";
  if (!id) throw new AuthError("token 缺少 id");
  const exp = typeof record.exp === "number" ? record.exp : undefined;
  if (exp !== undefined && exp * 1000 <= Date.now()) {
    throw new AuthError("登录已过期，请重新登录");
  }
  return {
    id,
    tenant_id: typeof record.tenant_id === "string" ? record.tenant_id : undefined,
    exp,
    lang: typeof record.lang === "string" ? record.lang : undefined,
  };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
