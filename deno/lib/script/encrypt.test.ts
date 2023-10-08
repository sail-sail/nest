import {
  encodeBase64,
  decodeBase64,
} from "std/encoding/base64.ts";

let key = await crypto.subtle.generateKey(
  {
    name: "AES-CBC",
    length: 256, // 可以是 128、192 或 256
  },
  true, // 是否可导出
  ["encrypt", "decrypt"] // 用于什么目的
);

const keyJwk = await crypto.subtle.exportKey("jwk", key);

const iv = new TextEncoder().encode("1234567890123456");

const str = "24000.00";
const encryptedData = new TextEncoder().encode(str);

const encrypt = await crypto.subtle.encrypt(
  {
    name: "AES-CBC",
    iv,
  },
  key, // 此处使用预先提供的密钥，通常会从安全上下文中的密钥存储中获取
  encryptedData,
);

const str2 = encodeBase64(encrypt);

console.log(str2);

key = await crypto.subtle.importKey(
  "jwk",
  keyJwk,
  {
    name: "AES-CBC",
    length: 256, // 可以是 128、192 或 256
  },
  true, // 是否可导出
  ["encrypt", "decrypt"] // 用于什么目的
);

const decrypt = await crypto.subtle.decrypt(
  {
    name: "AES-CBC",
    iv,
  },
  key,
  decodeBase64(str2),
);

console.log(new TextDecoder().decode(decrypt));
