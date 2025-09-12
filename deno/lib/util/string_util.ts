import {
  crypto,
  type DigestAlgorithmName,
} from "@std/crypto";

import { encodeBase64 } from "@std/encoding/base64";

import type {
  InputMaybe,
} from "/gen/types.ts";

export function isEmpty<T>(str?: T | InputMaybe<T>): boolean;

export function isEmpty(str?: string | InputMaybe<string>): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty<T>(str?: T | InputMaybe<T>): str is T;

export function isNotEmpty(str?: string | InputMaybe<string>): str is string {
  return !(str === undefined || str === null || str === "" || str.trim() === "");
}

// deno-lint-ignore no-explicit-any
export function shortUuidV4<T extends any>(): T {
  return encodeBase64(crypto.randomUUID().replace(/-/gm, "")).substring(0, 22) as unknown as T;
}

export async function hash(
  data?: string | Uint8Array | ArrayBuffer | null,
  digestAlgorithmName: DigestAlgorithmName = "MD5",
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
    data as ArrayBuffer,
  );
  return encodeBase64(buf2);
}

export function sqlLike(str = ""): string {
  return str.replace(/[%_]/g, function(m) {
    return "\\" + m;
  });
}

let specialCharsReg: RegExp | undefined = undefined;

/** 替换字符串里面正则表达式的转义符 */
export function replaceRegExpEscape(str: string): string {
  if (specialCharsReg === undefined) {
    specialCharsReg = /[.*+?^${}()|[\]\\]/g;
  }
  return str.replace(specialCharsReg, '\\$&');
}
