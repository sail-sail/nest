import { encode } from "std/encoding/base64.ts";

import {
  type JWTPayload,
} from "jose/index.ts";

import {
  createHash,
} from "/lib/util/hash_util.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

export const SECRET_KEY = "38e52379-9e94-467c-8e63-17ad318fc845";
export const NOT_VERIFY_TOKEN = "not_verify_token";
export const TENANT_ID = "tenant_id";
export const AUTHORIZATION = "Authorization";

export interface AuthModel extends JWTPayload {
  id: UsrId;
  wx_usr_id?: string;
  tenant_id: TenantId;
  org_id?: OrgId;
  lang: string;
}
export async function getPassword(str: string): Promise<string> {
  if (!str) return "";
  const textEncoder = new TextEncoder();
  let hash = await createHash("SHA-256", textEncoder.encode(str + SECRET_KEY));
  const bashStr = encode(hash);
  hash = await createHash("SHA-256", textEncoder.encode(bashStr));
  return encode(hash).substring(0, 43);
}
