import {
  crypto,
  type DigestAlgorithmName,
} from "std/crypto/mod.ts";
import { encode } from "std/encoding/base64.ts";

import type {
  InputMaybe,
} from "/gen/types.ts";

export function isEmpty(str?: string | InputMaybe<string>): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty(str?: string | InputMaybe<string>): str is string {
  return !(str === undefined || str === null || str === "" || str.trim() === "");
}

export function shortUuidV4(): string {
  return encode(crypto.randomUUID().replace(/-/gm, "")).substring(0, 22);
}

export async function hash(
  data?: string | Uint8Array | ArrayBuffer | null,
  digestAlgorithmName: DigestAlgorithmName = "SHA-256",
) {
  if (data === undefined || data === null) {
    return "";
  }
  if (typeof data === "string") {
    data = new TextEncoder().encode(data);
  }
  const buf2 = await crypto.subtle.digest(
    {
      name: digestAlgorithmName,
    },
    data,
  );
  return encode(buf2);
}

export function sqlLike(str = ""): string {
  return str.replace(/[%_]/g, function(m) {
    return "\\" + m;
  });
}
