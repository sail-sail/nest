import {
  v7 as uuidV7,
} from "uuid";

export function shortUuidV7() {
  return Buffer.from(uuidV7().replace(/-/gm, ""), "hex").toString("base64").substring(0, 22);
}
