import "/lib/env.ts";
import "/lib/util/date_util.ts";
import { getEnv } from "/lib/env.ts";

const key = await crypto.subtle.generateKey(
  {
    name: "AES-CBC",
    length: 128,
  },
  true,
  ["encrypt", "decrypt"],
);

const keyJwk = await crypto.subtle.exportKey("jwk", key);

const database_crypto_key_path = await getEnv("database_crypto_key_path");

console.log(`Writing crypto key to ${database_crypto_key_path}`);

await Deno.writeFile(database_crypto_key_path, new TextEncoder().encode(keyJwk.k?.substring(0, 16)));
