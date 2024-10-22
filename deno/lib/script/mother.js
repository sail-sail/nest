// const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const pjPath = path.resolve(`${ __dirname }/../../`).replace(/\\/gm, "/");
const child_process = require("child_process");
// const dotenv = require("dotenv");
const os = require("os");

// const buf = fs.readFileSync(`${ __dirname }/../../.env.dev`);
// const conf = dotenv.parse(buf);

process.title = "deno";

function graphqlCodegen() {
  const arr = [
    "node_modules/@graphql-codegen/cli/cjs/bin.js",
    "--config",
    "./lib/script/graphql_codegen_config.ts",
    "--watch",
  ];
  console.log("node " + arr.join(" "));
  child_process.spawn("node", arr);
}
graphqlCodegen();

let ls = null;
let changeTime = null;
let stopWatch = false;

function watchFn() {
  const watcher = chokidar.watch(
    pjPath,
    {
      ignored: [
        `${ pjPath }/.vscode/**`,
        `${ pjPath }/**/node_modules/**`,
        `${ pjPath }/**/package.json`,
        `${ pjPath }/**/*.xlsx`,
        `${ pjPath }/**/*.test.ts`,
        `${ pjPath }/**/*_test.ts`,
        `${ pjPath }/lib/script/**`,
        `${ pjPath }/tmp/**`,
        `${ pjPath }/typings/**`,
        `${ pjPath }/**/types.ts`,
        `${ pjPath }/.gitignore`,
        `${ pjPath }/*.diff`,
        `${ pjPath }/*.md`,
        `${ pjPath }/error.js`,
        `${ pjPath }/**/*.test.ts`,
        `${ pjPath }/**/*.dao.ts`,
        `${ pjPath }/**/*.service.ts`,
      ],
      ignoreInitial: true,
    },
  );
  let filenames = [ ];
  const callback = function(filename) {
    if (!filename) return;
    if (!filenames.includes(filename)) {
      filenames.push(filename);
    }
    if (stopWatch) return;
    clearTimeout(changeTime);
    changeTime = setTimeout(function() {
      stopWatch = true;
      const filenames2 = [ ];
      const filenamesDao = [ ];
      for (let i = 0; i < filenames.length; i++) {
        const filename = filenames[i].replaceAll("\\", "/");
        if (
          filename.endsWith(".dao.ts")
          &&
          (
            filename.includes("/src/")
            || filename.includes("/client/")
          )
        ) {
          filenamesDao.push(filename);
        } else {
          filenames2.push(filename);
        }
      }
      filenames = filenames2;
      if (filenamesDao.length > 0) {
        const arr = [
          "run",
          "-A",
          "--no-check",
          "./lib/script/hmr.ts",
        ];
        child_process.spawn("deno", arr, {
          cwd: pjPath,
          env: {
            ...process.env,
            "hmr_filenames": filenamesDao.join(","),
          },
          stdio: [ process.stdin, process.stdout, process.stderr ],
        });
      }
      console.log(filenames.slice(0, 4).join("\n"));
      if (filenames.some((filename) => filename.endsWith(".graphql.ts"))) {
        graphqlCodegen();
      }
      filenames = [ ];
      if (ls) {
        ls.kill(9);
      }
      delete(ls);
      start();
    }, 10);
  };
  watcher.on("change", callback).on("add", callback).on("unlink", callback);
}

let restartNum = 0;
stopWatch = false;
watchFn();
start();
function start() {
  child_process.execSync(os.platform() === "win32" ? "cls": "clear", { stdio: "inherit" });
  console.error('Mother process is running.');
  if (restartNum > 0) {
    console.log(`第 ${ restartNum } 次重启!`);
  }
  restartNum++;
  // const allowReads = [
  //   ".",
  //   "./.env.dev",
  //   "./.env.prod",
  //   "./excel_template",
  //   "./tmp",
  // ];
  // const allowWrites = [
  //   "./tmp",
  // ];
  // const allowEnvs = [
  //   "NODE_DEBUG",
  //   "NODE_ENV",
  // ];
  // const allowNets = [ ];
  // // 服务器端口
  // allowNets.push(`${ conf.server_host }:${ conf.server_port }`);
  // // 数据库
  // if (conf.database_hostname) {
  //   allowNets.push(`${ conf.database_hostname }:${ conf.database_port }`);
  // }
  // // 附件
  // if (conf.oss_endpoint) {
  //   const url = new URL(conf.oss_endpoint);
  //   allowNets.push(url.host);
  // }
  // // 缓存
  // if (conf.cache_hostname) {
  //   allowNets.push(`${ conf.cache_hostname }:${ conf.cache_port }`);
  // }
  // // 临时文件
  // if (conf.tmpfile_endpoint) {
  //   const url = new URL(conf.tmpfile_endpoint);
  //   allowNets.push(url.host);
  // }
  // const keys = Object.keys(conf);
  // [
  //   "log_path",
  //   "server_port",
  //   "server_host",
  //   "server_tokentimeout",
  //   "server_title",
    
  //   "database_type",
  //   "database_hostname",
  //   "database_port",
  //   "database_socketpath",
  //   "database_username",
  //   "database_password",
  //   "database_database",
  //   "database_pool_size",
    
  //   "oss_type",
  //   "oss_endpoint",
  //   "oss_accesskey",
  //   "oss_secretkey",
  //   "oss_bucket",
    
  //   "cache_type",
  //   "cache_hostname",
  //   "cache_password",
  //   "cache_port",
  //   "cache_db",
    
  //   "tmpfile_type",
  //   "tmpfile_endpoint",
  //   "tmpfile_accesskey",
  //   "tmpfile_secretkey",
  //   "tmpfile_bucket",
  // ].forEach(function(key) {
  //   if (!keys.includes(key)) {
  //     keys.push(key);
  //   }
  // });
  // for (let i = 0; i < keys.length; i++) {
  //   const key = keys[i];
  //   if (!allowEnvs.includes(key)) {
  //     allowEnvs.push(key);
  //   }
  // }
  // if (conf.log_path) {
  //   allowWrites.push(conf.log_path);
  //   allowReads.push(conf.log_path);
  // }
  const arr = [
    "run",
    "--unstable-hmr",
    "--inspect",
    // "--unstable-ffi",
    "-A",
    // `--allow-read=${ allowReads.join(",") }`,
    // `--allow-write=${ allowWrites.join(",") }`,
    // `--allow-env=${ allowEnvs.join(",") }`,
    // `--allow-net=${ allowNets.join(",") }`,
    "--no-check",
    "./mod.ts",
  ];
  console.log("deno " + arr.join(" "));
  // const startTime = Date.now();
  ls = child_process.spawn(
    "deno",
    arr,
    {
      cwd: pjPath,
      env: {
        ...process.env,
      },
    },
  );
  ls.stdout.on("data", function(data) {
    data = data.toString();
    data = data.substring(0, data.length-1);
    console.log(data);
    // if (data.startsWith("app started: ")) {
    //   const endTime = Date.now();
    //   console.log(`重启耗时: ${ endTime - startTime } ms`);
    // }
  });
  ls.stderr.on("data", function(data) {
    data = data.toString();
    data = data.substring(0, data.length-1);
    console.error(data);
  });
  ls.on("exit", function(code) {
    if (code != null) {
      console.error("child process exited with code " + code);
    }
    delete(ls);
    if (code == 2 || code == 3 || code == 3221225477) {
      if (!stopWatch) {
        setImmediate(start);
      }
    }
  });
  stopWatch = false;
}
