// npm run build -- -- uni
const child_process = require("node:child_process");
const minimist = require("minimist");
const ecosystem = require(`${ __dirname }/../../../ecosystem.config.js`);

const {
  copy,
  remove,
  mkdir,
  move,
  readFile,
  writeFile,
} = require("fs-extra");

const argv = minimist(process.argv.slice(2));

const target = argv.target || "";
const env = argv.env || "prod";

const projectDir = `${ __dirname }/../../../../`;
const buildDir = process.cwd() + "/../build/" + target;
const commands = (argv.command || "").split(",").filter((v) => v);
const projectName = ecosystem.apps[0].script.replace("./", "");

async function copyEnv() {
  console.log("copyEnv");
  const ecosystemStr = await readFile(`${ projectDir }/rust/ecosystem.config.js`, "utf8");
  const ecosystemStr2 = ecosystemStr.replaceAll("{env}", env);
  await mkdir(`${ buildDir }/rust`, { recursive: true });
  await writeFile(buildDir + "/rust/ecosystem.config.js", ecosystemStr2);
  await copy(`${ projectDir }/rust` + "/.env." + env, buildDir + "/rust/.env");
}

async function gqlgen() {
  console.log("gqlgen");
  child_process.execSync("npm run gqlgen", {
    cwd: `${ projectDir }/rust`,
    stdio: "inherit",
  });
}

async function pc() {
  console.log("pc");
  child_process.execSync("npm run build", {
    cwd: `${ projectDir }/pc`,
    stdio: "inherit",
  });
}

async function uni() {
  console.log("uni");
  child_process.execSync("npm run build:h5", {
    cwd: `${ projectDir }/uni`,
    stdio: "inherit",
  });
  await mkdir(`${ buildDir }/uni`, { recursive: true });
  await remove(`${ buildDir }/uni/`);
  await copy(`${ projectDir }/uni/dist/build/h5/`, `${ buildDir }/uni/`);
}

async function docs() {
  console.log("docs");
  child_process.execSync("npm run docs:build", {
    cwd: `${ projectDir }/`,
    stdio: "inherit",
  });
}

async function compile() {
  console.log("compile");
  const cwd = `${ projectDir }/rust/`;
  let cmd = "";
  cmd += `wsl -e bash -lic `;
  cmd += `"`;
  // cmd += `rustup update`;
  // cmd += ` && rustup target add x86_64-unknown-linux-musl`;
  // cmd += ` && cargo build --release --target=x86_64-unknown-linux-musl`;
  cmd += `cargo build --bin ${ projectName } --release --target=x86_64-unknown-linux-musl`;
  cmd += `"`;
  child_process.execSync(cmd, {
    cwd,
    stdio: "inherit",
  });
  await mkdir(`${ buildDir }/rust`, { recursive: true });
  await remove(`${ buildDir }/rust/${ projectName }`);
  await copy(`${ cwd }/target/x86_64-unknown-linux-musl/release/${ projectName }`, `${ buildDir }/rust/${ projectName }`);
}

if (commands.length > 0) {
  console.log("commands", commands);
}

(async function() {
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
    } else if (command === "uni") {
      await uni();
    } else if (command === "docs") {
      await docs();
    }
  }
  if (commands.length === 0) {
    await remove(buildDir);
    await mkdir(buildDir, { recursive: true });
    try {
      await remove(buildDir + "/deno");
    } catch (err) {
    }
    await copyEnv();
    await gqlgen();
    await compile();
    await pc();
    await uni();
    // await docs();
    process.exit(0);
  }
})();
