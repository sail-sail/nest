let createHash = undefined;

export const SECRET_KEY = "38e52379-9e94-467c-8e63-17ad318fc845";
export const NOT_VERIFY_TOKEN = "not_verify_token";
export const TENANT_ID = "tenant_id";
export const ACCESS_TOKEN = "access_token";

export interface AuthModel {
  id: string,
  tenant_id: string,
}

export function getPassword(str: string): string {
  if (!str) return "";
  if (!createHash) {
    createHash = require("crypto").createHash;
  }
  str = createHash("sha256").update(str+SECRET_KEY).digest("base64");
  str = createHash("sha256").update(str).digest("base64").substring(0, 43);
  return str;
}
