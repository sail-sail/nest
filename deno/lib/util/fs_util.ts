
/**
 * 拷贝文件夹
 */
export async function copyDir(src: string, dest: string) {
  const srcStat = await Deno.stat(src);
  if (srcStat.isDirectory) {
    await Deno.mkdir(dest, { recursive: true });
    for await (const entry of Deno.readDir(src)) {
      await copyDir(`${ src }/${ entry.name }`, `${ dest }/${ entry.name }`);
    }
  } else if (srcStat.isFile) {
    await Deno.copyFile(src, dest);
  } else {
    throw new Error("src and dest must be both file or directory");
  }
}
