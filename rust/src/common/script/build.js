const child_process = require("node:child_process");
const minimist = require("minimist");

const {
  copy,
  remove,
  mkdir,
  readFile,
  writeFile,
} = require("fs-extra");

const SSH2Promise = require("ssh2-promise");

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
    cwd: process.cwd(),
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

async function compile_temp() {
  console.log("compile");
  let cmd = `"E:/Program Files (x86)/VMware/VMware Workstation/vmware.exe" -x -- "E:/softwear/Virtual Machines/CentOS7/CentOS7.vmx"`;
  child_process.exec(cmd, function(err, stdout, stderr) {
    if (err) {
      console.log("\n" + stderr);
    } else {
      console.log("\n" + stdout);
    }
  });
  const sshConfig = {
    host: "192.168.74.128",
    username: "root",
    password: "abc123",
    port: 22,
    reconnect: true,
    reconnectTries: 30,
    reconnectDelay: 2000,
  };
  const publishPath = "/data/nest/";
  const ssh = new SSH2Promise(sshConfig);
  await ssh.connect();
  const sftp = ssh.sftp();
  let data = "";
  try {
    let cmd = "";
    cmd += `cd ${ publishPath }`;
    cmd += " ; cd ./rust";
    cmd += " ; git pull";
    cmd += " ; git checkout rust";
    cmd += " ; git pull";
    cmd += " ; cargo build --release";
    data = await ssh.exec(cmd);
  } catch (err) {
    console.log(err);
  }
  await mkdir(`${ buildDir }/rust/rust`, { recursive: true });
  await sftp.fastGet(`${ publishPath }/rust/target/release/server`, `${ buildDir }/rust/rust/server`);
  await ssh.close();
  if (data) {
    console.log(data);
  }
}

async function compile() {
  console.log("compile");
  const cwd = `${ projectDir }/rust/`;
  // let cmd = "";
  // cmd += "wsl source /etc/profile";
  // cmd += " && rustup target add x86_64-unknown-linux-musl";
  // cmd += " && cargo build --release --target=x86_64-unknown-linux-musl";
  // child_process.execSync(cmd, {
  //   cwd,
  //   stdio: "inherit",
  // });
  await mkdir(`${ buildDir }/rust`, { recursive: true });
  await copy(`${ cwd }/target/x86_64-unknown-linux-musl/release/server`, `${ buildDir }/rust/server`);
}

(async function() {
  if (commands.length === 0) {
    await remove(buildDir);
    await mkdir(buildDir, { recursive: true });
    await copyEnv();
    await gqlgen();
    await compile();
    await pc();
    process.exit(0);
  }
})();

