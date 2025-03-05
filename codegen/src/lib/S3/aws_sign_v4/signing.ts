import { hex, hmacSha256 } from "./util";

const AWS4: Uint8Array = new TextEncoder().encode("AWS4");

/**
 * @param  {string|Uint8Array} key - the key to sign aws v4 signature
 * @param  {string} msg - the message to sign
 * @returns {string|Uint8Array} - signature
 */
export async function signAwsV4(
  key: string | Uint8Array,
  msg: string,
): Promise<string> {
  const hash = await hmacSha256(key, msg);
  return hex(hash);
}

/**
 * @param  {string|Uint8Array} key - the key to generate signature key
 * @param  {string} dateStamp - dateStamp in ISO format
 * @param  {string} region - aws region
 * @param  {string} service - aws service
 * @returns {string|Uint8Array} - generated key
 */
export async function getSignatureKey(
  key: string | Uint8Array,
  dateStamp: string,
  region: string,
  service: string,
): Promise<string | Uint8Array> {
  if (typeof key === "string") {
    key = new TextEncoder().encode(key);
  }

  const paddedKey: Uint8Array = new Uint8Array(4 + key.byteLength);

  paddedKey.set(AWS4, 0);
  paddedKey.set(key, 4);

  let mac = await hmacSha256(paddedKey, dateStamp);

  mac = await hmacSha256(mac, region);
  mac = await hmacSha256(mac, service);
  mac = await hmacSha256(mac, "aws4_request");

  return new Uint8Array(mac);
}
