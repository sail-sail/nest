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

const env = argv.env || "prod";

const projectDir = `${ __dirname }/../../../../`;
const buildDir = process.cwd() + "/../build/";
// nr build-test --command uni
const commands = (argv.command || argv.c || "").split(",").filter((v) => v);

if (commands.length > 0) {
  console.log("commands", commands);
}

const projectName = ecosystem.apps[0].script.replace("./", "");

const rustDir = projectDir + "/rust";
const pcDir = projectDir + "/pc";
const uniDir = projectDir + "/uni";

async function removeExcelTemplate() {
  console.log("removeExcelTemplate");
  await remove(`${ pcDir }/public/import_template/`);
  await remove(`${ pcDir }/public/export_template/`);
}

async function codegen() {
  console.log("codegen");
  child_process.execSync("npm run codegen", {
    cwd: `${ projectDir }`,
    stdio: "inherit",
  });
}

async function copyEnv() {
  console.log("copyEnv");
  const ecosystemStr = await readFile(`${ rustDir }/ecosystem.config.js`, "utf8");
  const ecosystemStr2 = ecosystemStr.replaceAll("{env}", env);
  await mkdir(`${ buildDir }/rust`, { recursive: true });
  await writeFile(buildDir + "/rust/ecosystem.config.js", ecosystemStr2);
  await copy(rustDir + "/.env." + env, buildDir + "/rust/.env");
}

async function gqlgen() {
  console.log("gqlgen");
  child_process.execSync("npm run gqlgen", {
    cwd: rustDir,
    stdio: "inherit",
  });
}

async function pc() {
  console.log("pc");
  child_process.execSync(`npm run build-${ env }`, {
    cwd: pcDir,
    stdio: "inherit",
  });
  // index.html
  {
    const str = await readFile(`${ buildDir }/pc/index.html`, "utf8");
    const str2 = str.replaceAll("$__version__$", new Date().getTime().toString(16));
    await writeFile(`${ buildDir }/pc/index.html`, str2);
  }
  // ejsexcel.min.js
  await copy(`${ pcDir }/node_modules/ejsexcel-browserify/dist/ejsexcel.min.js`, `${ buildDir }/pc/ejsexcel.min.js`);
}

async function uni() {
  console.log("uni");
  child_process.execSync(`npm run build:h5-${ env }`, {
    cwd: uniDir,
    stdio: "inherit",
  });
  await mkdir(`${ buildDir }/uni`, { recursive: true });
  await remove(`${ buildDir }/uni/`);
  await copy(`${ projectDir }/uni/dist/build/h5/`, `${ buildDir }/uni/`);
}

async function docs() {
  console.log("docs");
  child_process.execSync(`npm run build-${ env }`, {
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

async function publish() {
  console.log("publish");
  child_process.execSync(`npm run publish -- --env=${ env } --command=${ commands.join(",") }`, {
    cwd: `${ rustDir }/`,
    stdio: "inherit",
  });
}

(async function() {

  await remove(buildDir);
  await mkdir(buildDir, { recursive: true });
  try {
    await remove(buildDir + "/deno");
  } catch (err) {
  }
  
  await removeExcelTemplate();
  
  await codegen();
  await gqlgen();
  
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i].trim();
    if (command === "rust") {
      await copyEnv();
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
    await copyEnv();
    await compile();
    await pc();
    await uni();
    // await docs();
  }
  await publish();
})();

