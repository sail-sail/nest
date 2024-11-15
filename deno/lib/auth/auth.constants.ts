import {
  encodeBase64,
} from "@std/encoding/base64";

import type {
  JWTPayload,
} from "jose/index.ts";

import {
  createHash,
} from "/lib/util/hash_util.ts";

export const SECRET_KEY = "38e52379-9e94-467c-8e63-17ad318fc845";
export const NOT_VERIFY_TOKEN = "not_verify_token";
export const TENANT_ID = "tenant_id";
export const AUTHORIZATION = "authorization";

export interface AuthModel extends JWTPayload {
  id: UsrId;
  wx_usr_id?: WxUsrId;
  wxo_usr_id?: WxoUsrId;
  tenant_id: TenantId;
  org_id?: OrgId;
  lang: string;
}
export async function getPassword(str?: string | null): Promise<string> {
  if (!str) return "";
  const textEncoder = new TextEncoder();
  let hash = await createHash("SHA-256", textEncoder.encode(str + SECRET_KEY));
  const bashStr = encodeBase64(hash);
  hash = await createHash("SHA-256", textEncoder.encode(bashStr));
  return encodeBase64(hash).substring(0, 43);
}
