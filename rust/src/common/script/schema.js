const child_process = require("node:child_process");
const path = require("node:path");

const {
  exists,
} = require("fs-extra");

const projectDir = `${ __dirname }/../../../../`;

async function schema() {
  const schemaPath = path.resolve(`${ projectDir }/rust/target/debug/schema`);
  let exit = await exists(schemaPath);
  if (!exit) {
    exit = await exists(schemaPath + ".exe");
  }
  let cmd = "";
  if (exit) {
    cmd = `./target/debug/schema`;
  } else {
    cmd = `cargo run --bin schema`;
  }
  child_process.execFileSync(cmd, {
    cwd: `${ projectDir }/rust`,
    stdio: "inherit",
  });
}

schema();
