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
  await move(`${ cwd }/target/x86_64-unknown-linux-musl/release/server`, `${ buildDir }/rust/server`);
}

// async function publish() {
//   console.log("publish");
//   child_process.execSync("npm run publish", {
//     cwd: `${ projectDir }/rust`,
//     stdio: "inherit",
//   });
// }

(async function() {
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
    // await publish();
    await pc();
    process.exit(0);
  }
})();

