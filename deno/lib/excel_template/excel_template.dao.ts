
export async function getTemplate(
  template: string,
): Promise<Uint8Array | undefined> {
  // deno-lint-ignore no-explicit-any
  if ((window as any).process.env.NODE_ENV === "development") {
    const tmpFn = async function(dir: string) {
      for await (const dirEntry of Deno.readDir(dir)) {
        console.log(dirEntry.name);
        if (dirEntry.isDirectory) {
          await tmpFn(dir + "/" + dirEntry.name);
        } else if (dirEntry.isFile) {
          if (!dirEntry.name.endsWith(".xlsx") && !dirEntry.name.endsWith(".xlsm")) {
            continue;
          }
          if (dirEntry.name === template) {
            const buffer = await Deno.readFile(dir + "/" + dirEntry.name);
            return buffer;
          }
        }
      }
    }
    return await tmpFn(Deno.cwd());
  }
  const buffer = await Deno.readFile(`${ Deno.cwd() }/excel_template/${ template }`);
  return buffer;
}
