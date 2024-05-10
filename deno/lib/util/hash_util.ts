import {
  crypto,
  type DigestAlgorithm,
} from "@std/crypto";

export async function createHash(
  algorithm: DigestAlgorithm,
  buffer: Uint8Array,
): Promise<ArrayBuffer> {
  const hash = await crypto.subtle.digest(algorithm, buffer);
  return hash;
}
