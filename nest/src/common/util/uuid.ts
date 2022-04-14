import { randomUUID } from "crypto";

export function shortUuidV4() {
  return Buffer.from(randomUUID().replace(/-/gm, ""), "hex").toString("base64").substring(0, 22);
}
