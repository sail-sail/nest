import { crypto } from "std/crypto/mod.ts";
import { encode } from "std/encoding/base64.ts";

export function isEmpty(str?: string): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty(str?: string): str is string {
  return !(str === undefined || str === null || str === "" || str.trim() === "");
}

export function shortUuidV4(): string {
  return encode(crypto.randomUUID().replace(/-/gm, "")).substring(0, 22);
}

export function sqlLike(str = ""): string {
  return str.replace(/[%_]/g, function(m) {
    return "\\" + m;
  });
}
