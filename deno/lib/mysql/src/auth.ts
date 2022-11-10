import { xor } from "./util.ts";
import { encode } from "./buffer.ts";

import {
  type DigestAlgorithm,
} from "std/crypto/mod.ts";

async function hash(
  algorithm: DigestAlgorithm,
  data: BufferSource,
): Promise<Uint8Array> {
  const hash = await crypto.subtle.digest(algorithm, data);
  return new Uint8Array(hash);
}

async function mysqlNativePassword(password: string, seed: Uint8Array): Promise<Uint8Array> {
  const pwd1 = await hash("SHA-1", encode(password));
  const pwd2 = await hash("SHA-1", pwd1);

  let seedAndPwd2 = new Uint8Array(seed.length + pwd2.byteLength);
  seedAndPwd2.set(seed);
  seedAndPwd2.set(pwd2, seed.length);
  seedAndPwd2 = await hash("SHA-1", seedAndPwd2);

  return xor(seedAndPwd2, pwd1);
}

async function cachingSha2Password(password: string, seed: Uint8Array): Promise<Uint8Array> {
  const stage1 = await hash("SHA-256", encode(password));
  const stage2 = await hash("SHA-256", stage1);
  const stage3 = await hash("SHA-256", Uint8Array.from([...stage2, ...seed]));
  return xor(stage1, stage3);
}

export default function auth(
  authPluginName: string,
  password: string,
  seed: Uint8Array,
) {
  switch (authPluginName) {
    case "mysql_native_password":
      return mysqlNativePassword(password, seed);

    case "caching_sha2_password":
      return cachingSha2Password(password, seed);
    default:
      throw new Error("Not supported");
  }
}
