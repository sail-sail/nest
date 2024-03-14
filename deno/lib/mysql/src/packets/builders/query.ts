// deno-lint-ignore-file no-explicit-any
import { replaceParams } from "../../../deps.ts";
import { BufferWriter, encode } from "../../buffer.ts";

/** @ignore */
export function buildQuery(sql: string, params: any[] = [],
    opt?: {
      debug?: boolean,
    },
  ): Uint8Array {
  const data = encode(replaceParams(sql, params, opt));
  const writer = new BufferWriter(new Uint8Array(data.length + 1));
  writer.write(0x03);
  writer.writeBuffer(data);
  return writer.buffer;
}
