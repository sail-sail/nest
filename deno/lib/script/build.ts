import "/lib/env.ts";
import { getEnv, getEnvs } from "/lib/env.ts";

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
  await Deno.copyFile(Deno.cwd()+"/ecosystem.config.js", `${ buildDir }/ecosystem.config.js`);
  await Deno.copyFile(Deno.cwd()+"/.env.prod", `${ buildDir }/.env.prod`);
}

async function excel_template() {
  console.log("excel_template");
  await Deno.mkdir(`${ buildDir }/tmp`, { recursive: true });
  await Deno.mkdir(`${ buildDir }/log`, { recursive: true });
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
  console.log("compile");
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
    for await (const dirEntry of Deno.readDir(Deno.cwd()+"/../build/")) {
      if (dirEntry.isFile) {
        await Deno.remove(Deno.cwd()+"/../build/"+dirEntry.name);
      }
    }
    const allowReads = [
      ".",
      "./excel_template",
      "./tmp",
    ];
    const allowWrites = [
      "./tmp",
    ];
    const allowEnvs = [
      "NODE_DEBUG",
      "NODE_ENV",
    ];
    const allowNets = [ ];
    // 服务器端口
    allowNets.push(`${ await getEnv("server_host") }:${ await getEnv("server_port") }`);
    // 数据库
    if (await getEnv("database_socketpath")) {
      allowWrites.push(await getEnv("database_socketpath"));
      allowReads.push(await getEnv("database_socketpath"));
    } else if (await getEnv("database_host")) {
      allowNets.push(`${ await getEnv("database_host") }:${ await getEnv("database_port") }`);
    }
    // 附件
    if (await getEnv("oss_endpoint")) {
      const url = new URL(await getEnv("oss_endpoint"));
      allowNets.push(url.host);
    }
    // 缓存
    if (await getEnv("cache_hostname")) {
      allowNets.push(`${ await getEnv("cache_hostname") }:${ await getEnv("cache_port") }`);
    }
    // 临时文件
    if (await getEnv("tmpfile_endpoint")) {
      const url = new URL(await getEnv("tmpfile_endpoint"));
      allowNets.push(url.host);
    }
    const conf = await getEnvs();
    const keys = Object.keys(conf);
    [
      "log_path",
      "server_port",
      "server_host",
      "server_tokentimeout",
      "server_title",
      
      "database_type",
      "database_host",
      "database_port",
      "database_socketpath",
      "database_username",
      "database_password",
      "database_database",
      "database_connectionlimit",
      "database_waitForconnections",
      
      "oss_type",
      "oss_endpoint",
      "oss_accesskey",
      "oss_secretkey",
      "oss_bucket",
      
      "cache_type",
      "cache_hostname",
      "cache_port",
      "cache_db",
      
      "tmpfile_type",
      "tmpfile_endpoint",
      "tmpfile_accesskey",
      "tmpfile_secretkey",
      "tmpfile_bucket",
    ].forEach(function(key) {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    });
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!allowEnvs.includes(key)) {
        allowEnvs.push(key);
      }
    }
    if (await getEnv("log_path")) {
      allowWrites.push(await getEnv("log_path"));
      allowReads.push(await getEnv("log_path"));
    }
    let cmds = [
      "deno",
      "compile",
      "--unstable",
      // `--allow-read=${ allowReads.join(",") }`,
      `--allow-read`,
      // `--allow-write=${ allowWrites.join(",") }`,
      `--allow-write`,
      // `--allow-env=${ allowEnvs.join(",") }`,
      `--allow-env`,
      // `--allow-net=${ allowNets.join(",") }`,
      `--allow-net`,
      "--import-map",
      "./import_map.json",
    ];
    if (target) {
      cmds = cmds.concat([ "--target", target ]);
    }
    const server_title = await getEnv("server_title") || "start";
    cmds = cmds.concat([ "--output", `${ buildDir }/${ server_title }`, "./mod.ts", "-e=prod" ]);
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

async function pc() {
  console.log("pc");
  const proc = Deno.run({
    cmd: [ "C:/Program Files/nodejs/npm.cmd", "run", "build" ],
    cwd: Deno.cwd() + "/../pc",
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
  const str = await Deno.readTextFile(`${ buildDir }/../pc/index.html`);
  const str2 = str.replaceAll("$__version__$", new Date().getTime().toString(16));
  await Deno.writeTextFile(`${ buildDir }/../pc/index.html`, str2);
}

async function docs() {
  console.log("docs");
  const proc = Deno.run({
    cmd: [ "C:/Program Files/nodejs/npm.cmd", "run", "docs:build" ],
    cwd: Deno.cwd() + "/../",
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

async function publish() {
  console.log("publish");
  const proc = Deno.run({
    cmd: [ "C:/Program Files/nodejs/npm.cmd", "run", "publish" ],
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
  } else if (command === "pc") {
    await pc();
  } else if (command === "docs") {
    await docs();
  } else if (command === "publish") {
    await publish();
  }
}

if (commands.length === 0) {
  await Deno.remove(`${ buildDir }/`, { recursive: true });
  await Deno.mkdir(`${ buildDir }/`, { recursive: true });
  await copyEnv();
  await excel_template();
  await gqlgen();
  await compile();
  await pc();
  await docs();
  await publish();
}
