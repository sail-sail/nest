const path = require("path");
const chokidar = require("chokidar");
const pjPath = path.resolve(`${ __dirname }/../`).replace(/\\/gm, "/");
const child_process = require("child_process");

let ls = null;
let change = null;
let stopWatch = false;
function watchFn() {
  const watcher = chokidar.watch(
    pjPath,
    {
      ignored: [
        "**/node_modules",
        "**/package.json",
        "**/*.xlsx",
        "**/*.model.ts",
        "**/*.service.ts",
        "**/*.dao.ts",
        `${ pjPath }/src/common/cache/**`,
        `${ pjPath }/src/common/tmp/**`,
        `${ pjPath }/src/Mother.js`,
        `${ pjPath }/ecosystem.config.js`,
        `${ pjPath }/.eslintrc.js`,
        `${ pjPath }/.gitignore`,
        `${ pjPath }/gulpfile.js`,
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
    clearTimeout(change);
    change = setTimeout(function() {
      stopWatch = true;
      console.log(filenames.slice(0, 5).join("\n"));
      filenames = [ ];
      if (ls) {
        ls.kill(9);
      }
      delete(ls);
      setImmediate(start);
    }, 1000);
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
  let TS_NODE_PROJECT = process.env.TS_NODE_PROJECT;
  if (!TS_NODE_PROJECT) {
    TS_NODE_PROJECT = `${ pjPath }/tsconfig.swc.json`;
    console.log(`第 ${ restartNum } 次重启, 当前 release 模式!`);
  }
  ls = child_process.spawn(
    "node",
    [
      "-r",
      "ts-node/register",
      "./src/main.ts",
    ],
    {
      cwd: pjPath,
      env: {
        ...process.env,
        TS_NODE_PROJECT,
      },
    },
  );
  ls.stdout.on("data", function(data) {
    // data = data.toString();
    // data = data.substring(0, data.length-1);
    // console.log(data);
  });
  ls.stderr.on("data", function(data) {
    // data = data.toString();
    // data = data.substring(0, data.length-1);
    // console.error(data);
  });
  ls.on("exit", function(code) {
    if (code != null) {
      console.error("child process exited with code " + code);
    }
    delete(ls);
    if (code === 2 || code === 3) {
      if (!stopWatch) {
        setImmediate(start);
      }
    }
  });
  stopWatch = false;
}
