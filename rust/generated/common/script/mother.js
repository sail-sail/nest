const path = require("node:path");
const fs = require("node:fs");
const child_process = require("node:child_process");

const projectRoot = path.resolve(__dirname, "../../..");
const cargoToml = path.join(projectRoot, "Cargo.toml");
const restartDelayMs = 10_000;
let binaryName = "rust";

try {
  const cargoText = fs.readFileSync(cargoToml, "utf8");
  const match = cargoText.match(/^name\s*=\s*"([^"]+)"/m);
  if (match) {
    binaryName = match[1];
  }
} catch (err) {
  console.warn("read Cargo.toml failed, fallback to default binary name: rust");
}

process.title = "rust-mother";

let currentProcess = null;
let pendingTimer = null;
let watchedFiles = [];

function shouldIgnore(file) {
  const normalized = file.replace(/\\/g, "/");
  if (!normalized.endsWith(".rs")) {
    return true;
  }

  return (
    normalized.includes("/node_modules/")
    || normalized.includes("/.git/")
    || normalized.includes("/target/")
    || normalized.includes("/dist/")
    || normalized.includes("/build/")
  );
}

function restartRust() {
  if (currentProcess) {
    currentProcess.kill("SIGINT");
    currentProcess = null;
  }

  const command = process.platform === "win32" ? "cargo.exe" : "cargo";
  const args = [ "run", "--bin", binaryName ];
  console.log("cargo " + args.join(" "));
  currentProcess = child_process.spawn(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      CARGO_TERM_COLOR: "always",
    },
  });
  currentProcess.on("exit", (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`cargo run exited with code ${ code }`);
    }
    if (signal) {
      console.error(`cargo run terminated by signal ${ signal }`);
    }
  });
}

function scheduleRestart(file) {
  const normalized = file.replace(/\\/g, "/");
  if (shouldIgnore(normalized)) {
    return;
  }

  if (!watchedFiles.includes(normalized)) {
    watchedFiles.push(normalized);
  }

  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(function() {
    const changedFiles = [ ...new Set(watchedFiles) ];
    watchedFiles = [];
    console.log(`restart after ${ restartDelayMs / 1000 }s, files:`, changedFiles.slice(0, 5));
    restartRust();
  }, restartDelayMs);
}

function watchProject() {
  let chokidar;
  try {
    chokidar = require("chokidar");
  } catch (err) {
    console.warn("chokidar not installed, falling back to fs.watch");
  }

  if (chokidar) {
    const watcher = chokidar.watch(projectRoot, {
      ignored: [
        /(^|\/)node_modules\//,
        /(^|\/)target\//,
        /(^|\/)\.git\//,
        /(^|\/)dist\//,
        /(^|\/)build\//,
        /(^|\/)\.vscode\//,
        /(^|\/)pc\//,
        /(^|\/)uni\//,
        /(^|\/)codegen\//,
        /(^|\/)\.idea\//,
        /(^|\/)package-lock\.json$/,
        /(^|\/)pnpm-lock\.yaml$/,
        /(^|\/)yarn\.lock$/,
      ],
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 120,
        pollInterval: 20,
      },
      persistent: true,
    });

    watcher.add([ `${ projectRoot }/**/*.rs` ]);

    watcher
      .on("add", scheduleRestart)
      .on("change", scheduleRestart)
      .on("unlink", scheduleRestart);

    return;
  }

  const watchDir = (dir) => {
    try {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (!filename) {
          return;
        }
        scheduleRestart(path.join(dir, filename.toString()));
      });
    } catch (err) {
      // ignore unsupported recursive watch on some platforms
    }
  };

  watchDir(projectRoot);
}

process.on("SIGINT", function() {
  if (currentProcess) {
    currentProcess.kill("SIGINT");
  }
  process.exit();
});

console.error("Mother process is running.");
watchProject();
restartRust();
