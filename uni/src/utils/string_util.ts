import { crypto } from "std/crypto/mod.ts";
import { encode } from "std/encoding/base64.ts";
import { InputMaybe } from "#/types.ts";

export function isEmpty(str?: string | InputMaybe<string>): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty(str?: string | InputMaybe<string>): str is string {
  return !(str === undefined || str === null || str === "" || str.trim() === "");
}
