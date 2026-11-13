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
 *
 * 注意：这里**不**判定 exp 是否过期。过期语义必须由签发方（Rust）单独决定：
 * - `/mcp`、`/api/oss/*` 走 get_auth_model_by_token，只验签名，不看 exp；
 * - `/graphql` 走 Ctx::with_auth，允许 exp + server_tokentimeout 的宽限窗口，
 *   并在响应头回传续期后的 authorization；
 * agent 若自己按 exp 拒绝，会比服务端更早失效，出现「页面还能用、助手说登录已过期」。
 * exp 仍原样返回，供展示与内存回收使用。
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
