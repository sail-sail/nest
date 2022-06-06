import { crypto } from "std/crypto/mod.ts";
import { encode } from "std/encoding/base64.ts";
import { DigestAlgorithm } from "std/_wasm_crypto/mod.ts";
import { JWTPayload } from "jose/index.ts";

export const SECRET_KEY = "38e52379-9e94-467c-8e63-17ad318fc845";
export const NOT_VERIFY_TOKEN = "not_verify_token";
export const TENANT_ID = "tenant_id";
export const AUTHORIZATION = "Authorization";

export interface AuthModel extends JWTPayload {
  id: string,
}

async function createHash(algorithm: DigestAlgorithm, buffer: Uint8Array): Promise<ArrayBuffer> {
  const hash = await crypto.subtle.digest(algorithm, buffer);
  return hash;
}

export async function getPassword(str: string): Promise<string> {
  if (!str) return "";
  let hash = await createHash("SHA-256", new TextEncoder().encode(str + SECRET_KEY));
  const bashStr = encode(hash);
  hash = await createHash("SHA-256", new TextEncoder().encode((bashStr)));
  return encode(hash).substring(0, 43);
}
