import { crypto } from "std/crypto/mod.ts";
import { encode } from "std/encoding/base64.ts";
import { InputMaybe } from "/gen/types.ts";

export function isEmpty(str?: string | InputMaybe<string>): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty(str?: string | InputMaybe<string>): str is string {
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
