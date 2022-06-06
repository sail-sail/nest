import { Readable } from "stream";

export function streamToBuffer(stream: Readable): Promise<Buffer> { 
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [ ];
    stream.on("error", reject);
    stream.on("data", (data: Buffer) => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
  });
}
