import { randomUUID } from "crypto";

let randomUUID2 = randomUUID;
if (!randomUUID2) {
  randomUUID2 = require("uuid").v4;
}

export function shortUuidV4() {
  return Buffer.from(randomUUID2().replace(/-/gm, ""), "hex").toString("base64").substring(0, 22);
}
