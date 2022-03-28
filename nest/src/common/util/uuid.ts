import * as uuid from "uuid";

export function shortUuidV4() {
  return Buffer.from(uuid.v4().replace(/-/gm, ""), "hex").toString("base64").substring(0, 22);
}
