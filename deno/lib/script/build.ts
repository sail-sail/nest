
function getArg(name: string): string | undefined {
  const index = Deno.args.indexOf(name);
  if (index === -1) {
    return undefined;
  }
  return Deno.args[index + 1];
}

const buildDir = getArg("--build-dir") || `${ Deno.cwd() }/../build/deno`;
const commands = (getArg("--command") || "").split(",").filter((v) => v);
let target = getArg("--target") || "";
if (target === "linux") {
  target = "x86_64-unknown-linux-gnu";
}

await Deno.mkdir(buildDir, { recursive: true });

async function copyEnv() {
  console.log("copyEnv");
  await Deno.copyFile(Deno.cwd()+"/.env.prod", `${ buildDir }/.env`);
}

async function excel_template() {
  console.log("excel_template");
  await Deno.mkdir(`${ buildDir }/excel_template`, { recursive: true });
  const tmpFn = async function(dir: string) {
    for await (const dirEntry of Deno.readDir(dir)) {
      if (dirEntry.name === "node_modules" || dirEntry.name === "test") {
        continue;
      }
      if (dirEntry.isDirectory) {
        await tmpFn(dir + "/" + dirEntry.name);
      } else if (dirEntry.isFile) {
        if (!dirEntry.name.endsWith(".xlsx") && !dirEntry.name.endsWith(".xlsm")) {
          continue;
        }
        await Deno.copyFile(dir + "/" + dirEntry.name, `${ buildDir }/excel_template/${ dirEntry.name }`);
      }
    }
  }
  await tmpFn(Deno.cwd()+"/gen/");
  await tmpFn(Deno.cwd()+"/src/");
}

async function gqlgen() {
  console.log("gqlgen");
  const proc = Deno.run({
    cmd: [ "C:/Program Files/nodejs/npm.cmd", "run", "gqlgen" ],
    cwd: Deno.cwd(),
    stderr: 'piped',
    stdout: "null",
  });
  const [ stderr ] = await Promise.all([
    proc.stderrOutput(),
  ]);
  const stderrStr = new TextDecoder().decode(stderr);
  if (stderrStr) {
    console.error(stderrStr);
  }
}

async function compile() {
  console.log("compile");
  let cmds = [ "deno", "compile", "-A", "--import-map", "./import_map.json"];
  if (target) {
    cmds = cmds.concat([ "--target", target ]);
  }
  cmds = cmds.concat([ "--output", `${ buildDir }/deno`, "./mod.ts" ]);
  const proc = Deno.run({
    cmd: cmds,
    cwd: Deno.cwd(),
    stderr: 'piped',
    stdout: "null",
  });
  const [ stderr ] = await Promise.all([
    proc.stderrOutput(),
  ]);
  const stderrStr = new TextDecoder().decode(stderr);
  if (stderrStr) {
    console.error(stderrStr);
  }
}

// async function publish() {
  
// }

for (let i = 0; i < commands.length; i++) {
  const command = commands[i].trim();
  if (command === "copyEnv") {
    await copyEnv();
  } else if (command === "excel_template") {
    await excel_template();
  } else if (command === "gqlgen") {
    await gqlgen();
  } else if (command === "compile") {
    await compile();
  }
}

if (commands.length === 0) {
  await copyEnv();
  await excel_template();
  await gqlgen();
  await compile();
}
