
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
  await Deno.copyFile(Deno.cwd()+"/.env.prod", `${ buildDir }/.env.prod`);
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

function escapeRegExp(str: string) {
  return str.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
}

async function compile() {
  const depsStr = await Deno.readTextFile(Deno.cwd()+"/deps.ts");
  const reg = new RegExp(escapeRegExp(`/**prod`)+"([\\s\\S]*?)"+escapeRegExp(`*/`), "gm");
  const depsStr2 = depsStr.replace(reg, function(str) {
    str = str.trim();
    const len = str.length;
    const openLen = `/**prod`.length;
    const closeLen = `*/`.length;
    str = str.substring(openLen, len-closeLen).trim();
    return str;
  }).replace("declare const XLSX: any;", "");
  await Deno.writeTextFile(Deno.cwd()+"/deps.ts", depsStr2);
  
  try {
    let cmds = [ "deno", "compile", "-A", "--import-map", "./import_map.json" ];
    if (target) {
      cmds = cmds.concat([ "--target", target ]);
    }
    cmds = cmds.concat([ "--output", `${ buildDir }/start`, "./mod.ts", "-e=prod" ]);
    console.log(cmds.join(" "));
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
  } finally {
    await Deno.writeTextFile(Deno.cwd()+"/deps.ts", depsStr);
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
