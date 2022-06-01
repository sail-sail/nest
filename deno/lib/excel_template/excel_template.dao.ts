import { readFile } from "std/node/fs/promises.ts";
import { Buffer } from "std/node/buffer.ts";

export async function getTemplate(
  template: string,
): Promise<Buffer | undefined> {
  // deno-lint-ignore no-explicit-any
  if ((window as any).process.env.NODE_ENV === "development") {
    const tmpFn = async function(dir: string): Promise<Buffer | undefined> {
      for await (const dirEntry of Deno.readDir(dir)) {
        console.log(dirEntry.name);
        if (dirEntry.name === "node_modules" || dirEntry.name === "test") {
          continue;
        }
        if (dirEntry.isDirectory) {
          const buffer = await tmpFn(dir + "/" + dirEntry.name);
          if (buffer) {
            return buffer;
          }
        } else if (dirEntry.isFile) {
          if (!dirEntry.name.endsWith(".xlsx") && !dirEntry.name.endsWith(".xlsm")) {
            continue;
          }
          if (dirEntry.name === template) {
            const buffer: Buffer = await readFile(dir + "/" + dirEntry.name);
            return buffer;
          }
        }
      }
    }
    let buffer = await tmpFn(Deno.cwd()+"/gen/");
    if (!buffer) {
      buffer = await tmpFn(Deno.cwd()+"/src/");
    }
    return buffer;
  }
  const buffer = await readFile(`${ Deno.cwd() }/excel_template/${ template }`);
  return buffer;
}
