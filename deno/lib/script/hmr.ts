
let watcher: Deno.FsWatcher;

export async function hmr() {
  if (watcher) {
    return;
  }
  watcher = Deno.watchFs(`${ Deno.cwd() }`, { recursive: true });
  for await (const event of watcher) {
    
  }
}
