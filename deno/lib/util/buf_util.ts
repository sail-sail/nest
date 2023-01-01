
const BUFFER_TO_HEX_H = '0123456789ABCDEF';

export function bufferToHex(
  buffer: ArrayBuffer,
  h: string = BUFFER_TO_HEX_H,
): string {
    let s = "";
    (new Uint8Array(buffer)).forEach((v) => { s += h[v >> 4] + h[v & 15]; });
    return s;
}
