import * as child_process from "node:child_process";
import * as minimist from "minimist";
import {
  copySync,
  removeSync,
  mkdirSync,
  copyFileSync,
} from "fs-extra";
import { existsSync } from "node:fs";

const argv = minimist(process.argv.slice(2));

const target: string = argv.target || "";

const buildDir = process.cwd() + "/../build/" + target;
const commands = ((argv.command as string) || "").split(",").filter((v) => v);

mkdirSync(buildDir, { recursive: true });

function copyEnv() {
  console.log("copyEnv");
  copySync(process.cwd() + "/ecosystem.config.js", buildDir + "/ecosystem.config.js");
  copySync(process.cwd() + "/.env", buildDir + "/.env");
}

function gqlgen() {
  console.log("gqlgen");
  // child_process.execSync("npm run gqlgen", {
  //   cwd: process.cwd(),
  //   stdio: "inherit",
  // });
}

async function compile() {
  console.log("compile");
  let command = "cargo build --release";
  if (target) {
    command += " --target " + target;
  }
  child_process.execSync(command, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (existsSync(process.cwd() + "/target/release/server")) {
    copyFileSync(process.cwd() + "/target/release/server", buildDir + "/server");
  } else if (existsSync(process.cwd() + "/target/release/server.exe")) {
    copyFileSync(process.cwd() + "/target/release/server.exe", buildDir + "/server.exe");
  }
}

if (commands.length === 0) {
  removeSync(buildDir);
  mkdirSync(buildDir, { recursive: true });
  copyEnv();
  gqlgen();
  compile();
}
