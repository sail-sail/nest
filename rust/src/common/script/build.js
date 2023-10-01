// npm run build -- -- uni
const child_process = require("node:child_process");
const minimist = require("minimist");

const {
  copy,
  remove,
  mkdir,
  move,
} = require("fs-extra");

const argv = minimist(process.argv.slice(2));

const target = argv.target || "";

const projectDir = `${ __dirname }/../../../../`;
const buildDir = process.cwd() + "/../build/" + target;
const commands = (argv.command || "").split(",").filter((v) => v);

async function copyEnv() {
  console.log("copyEnv");
  await copy(`${ projectDir }/rust` + "/ecosystem.config.js", buildDir + "/rust/ecosystem.config.js");
  await copy(`${ projectDir }/rust` + "/.env.prod", buildDir + "/rust/.env");
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
  await move(`${ projectDir }/uni/dist/build/h5/`, `${ buildDir }/uni/`);
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
  cmd += `cargo build --release --target=x86_64-unknown-linux-musl`;
  cmd += `"`;
  child_process.execSync(cmd, {
    cwd,
    stdio: "inherit",
  });
  await mkdir(`${ buildDir }/rust`, { recursive: true });
  await remove(`${ buildDir }/rust/server`);
  await move(`${ cwd }/target/x86_64-unknown-linux-musl/release/server`, `${ buildDir }/rust/server`);
}

// async function publish() {
//   console.log("publish");
//   child_process.execSync("npm run publish", {
//     cwd: `${ projectDir }/rust`,
//     stdio: "inherit",
//   });
// }

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
    } else if (command === "publish") {
      await publish();
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
    // await publish();
    process.exit(0);
  }
})();

