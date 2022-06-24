const path = require("path");
const chokidar = require("chokidar");
const pjPath = path.resolve(`${ __dirname }/../../`).replace(/\\/gm, "/");
const child_process = require("child_process");

{
  const arr = [
    "node_modules/@graphql-codegen/cli/bin.js",
    "--config",
    "./lib/script/graphql_codegen_config.yml",
    "--watch",
  ];
  console.log("node " + arr.join(" "));
  child_process.spawn("node", arr);
}

let ls = null;
let changeTime = null;
let stopWatch = false;

function watchFn() {
  const watcher = chokidar.watch(
    pjPath,
    {
      ignored: [
        `${ pjPath }/**/node_modules/**`,
        `${ pjPath }/**/package.json`,
        `${ pjPath }/**/*.xlsx`,
        `${ pjPath }/**/*.test.ts`,
        `${ pjPath }/**/*_test.ts`,
        `${ pjPath }/lib/script/**`,
        `${ pjPath }/src/types.ts`,
        `${ pjPath }/.eslintrc.js`,
        `${ pjPath }/.gitignore`,
        `${ pjPath }/*.diff`,
        `${ pjPath }/*.md`,
        `${ pjPath }/error.js`,
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
        const filename = filenames[i];
        if (filename.endsWith(".dao.ts") && filename.replaceAll("\\", "/").includes("/src/")) {
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
          "--import-map",
          "./import_map.json",
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
      filenames = [ ];
      if (ls) {
        ls.kill(9);
      }
      delete(ls);
      start();
    }, 30);
  };
  watcher.on("change", callback).on("add", callback).on("unlink", callback);
}

let restartNum = 0;
stopWatch = false;
watchFn();
start();
function start() {
  console.error('Mother process is running.');
  restartNum++;
  console.log(`第 ${ restartNum } 次重启!`);
  const arr = [
    "run",
    "--inspect",
    "-A",
    "--import-map",
    "./import_map.json",
    "--no-check",
    "./mod.ts",
  ];
  console.log("deno " + arr.join(" "));
  const startTime = Date.now();
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
    if (data.startsWith("app started: ")) {
      const endTime = Date.now();
      console.log(`重启耗时: ${ endTime - startTime } ms`);
    }
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
