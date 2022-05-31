const tmpFn = async function(dir: string) {
  for await (const dirEntry of Deno.readDir(dir)) {
    if (dirEntry.isDirectory) {
      await tmpFn(dir + "/" + dirEntry.name);
    } else if (dirEntry.isFile) {
      if (!dirEntry.name.endsWith(".xlsx") && !dirEntry.name.endsWith(".xlsm")) {
        continue;
      }
      await Deno.mkdir(`${ Deno.cwd() }/build/excel_template`, { recursive: true });
      await Deno.copyFile(dir + "/" + dirEntry.name, `${ Deno.cwd() }/../build/excel_template/${ dirEntry.name }`);
    }
  }
}
await tmpFn(Deno.cwd());
