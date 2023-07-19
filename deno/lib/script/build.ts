import "/lib/env.ts";
import { getEnv, getEnvs } from "/lib/env.ts";

function getArg(name: string): string | undefined {
  const index = Deno.args.indexOf(name);
  if (index === -1) {
    return;
  }
  return Deno.args[index + 1];
}

const denoDir = Deno.cwd();
const pcDir = denoDir + "/../pc";
const buildDir = getArg("--build-dir") || `${ denoDir }/../build/deno`;
const commands = (getArg("--command") || "").split(",").filter((v) => v);
let target = getArg("--target") || "";
if (target === "linux") {
  target = "x86_64-unknown-linux-gnu";
}

await Deno.mkdir(buildDir, { recursive: true });

async function copyEnv() {
  console.log("copyEnv");
  await Deno.copyFile(denoDir+"/ecosystem.config.js", `${ buildDir }/ecosystem.config.js`);
  await Deno.copyFile(denoDir+"/.env.prod", `${ buildDir }/.env.prod`);
  await Deno.mkdir(`${ buildDir }/lib/image/`, { recursive: true });
  await Deno.copyFile(denoDir+"/lib/image/image.dll", `${ buildDir }/lib/image/image.dll`);
  await Deno.copyFile(denoDir+"/lib/image/image.so", `${ buildDir }/lib/image/image.so`);
}

async function gqlgen() {
  console.log("gqlgen");
  const command = new Deno.Command("C:/Program Files/nodejs/npm.cmd", {
    cwd: denoDir,
    args: [
      "run",
      "gqlgen",
    ],
    stderr: "piped",
    stdout: "null",
  });
  const { stderr } = await command.output();
  const stderrStr = new TextDecoder().decode(stderr);
  if (stderrStr) {
    console.error(stderrStr);
  }
}

// function escapeRegExp(str: string) {
//   return str.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
// }

async function compile() {
  console.log("compile");
  try {
    for await (const dirEntry of Deno.readDir(denoDir+"/../build/")) {
      if (dirEntry.isFile) {
        await Deno.remove(denoDir+"/../build/"+dirEntry.name);
      }
    }
    const allowReads = [
      ".",
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
    if (await getEnv("database_hostname")) {
      allowNets.push(`${ await getEnv("database_hostname") }:${ await getEnv("database_port") }`);
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
      "database_hostname",
      "database_port",
      "database_socketpath",
      "database_username",
      "database_password",
      "database_database",
      "database_pool_size",
      
      "oss_type",
      "oss_endpoint",
      "oss_accesskey",
      "oss_secretkey",
      "oss_bucket",
      
      "cache_type",
      "cache_hostname",
      "cache_password",
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
      `--allow-ffi`,
      "--import-map",
      "./import_map.json",
    ];
    if (target) {
      cmds = cmds.concat([ "--target", target ]);
    }
    const server_title = await getEnv("server_title") || "start";
    cmds = cmds.concat([ "--output", `${ buildDir }/${ server_title }`, "./mod.ts", "--", "-e=prod" ]);
    console.log("deno " + cmds.join(" "));
    const command = new Deno.Command(Deno.execPath(), {
      cwd: denoDir,
      args: cmds,
      stderr: "piped",
      stdout: "null",
    });
    const { stderr } = await command.output();
    const stderrStr = new TextDecoder().decode(stderr);
    if (stderrStr) {
      console.error(stderrStr);
    }
  } finally {
    // await Deno.writeTextFile(denoDir+"/deps.ts", depsStr);
  }
}

async function pc() {
  console.log("pc");
  const command = new Deno.Command("C:/Program Files/nodejs/npm.cmd", {
    cwd: pcDir,
    args: [
      "run",
      "build",
    ],
    stderr: "piped",
    stdout: "null",
  });
  const { stderr } = await command.output();
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
  const command = new Deno.Command("C:/Program Files/nodejs/npm.cmd", {
    cwd: denoDir + "/../",
    args: [
      "run",
      "docs:build",
    ],
    stderr: "piped",
    stdout: "null",
  });
  const { stderr } = await command.output();
  const stderrStr = new TextDecoder().decode(stderr);
  if (stderrStr) {
    console.error(stderrStr);
  }
}

async function publish() {
  console.log("publish");
  const command = new Deno.Command("C:/Program Files/nodejs/npm.cmd", {
    cwd: denoDir,
    args: [
      "run",
      "publish",
    ],
    stderr: "piped",
    stdout: "null",
  });
  const { stderr } = await command.output();
  if (stderr) {
    const stderrStr = new TextDecoder().decode(stderr);
    console.error(stderrStr);
  }
}

for (let i = 0; i < commands.length; i++) {
  const command = commands[i].trim();
  if (command === "copyEnv") {
    await copyEnv();
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
  try {
    await Deno.remove(`${ buildDir }/`, { recursive: true });
  } catch (err) {
    console.error(err);
  }
  await Deno.mkdir(`${ buildDir }/`, { recursive: true });
  try {
    await Deno.remove(`${ buildDir }/../rust`, { recursive: true });
  // deno-lint-ignore no-empty
  } catch (_err) { }
  await copyEnv();
  await gqlgen();
  await compile();
  await pc();
  // await docs();
  await publish();
}
