const child_process = require("child_process");
const fs = require("fs");

function npmGitCommit() {
  if (fs.existsSync(".git/MERGE_HEAD")) {
    return;
  }
  let message = "";
  try {
    message = fs.readFileSync(".git/COMMIT_EDITMSG", "utf8").trim();
  } catch (e) {
  }
  if (message.startsWith("n:")) {
    fs.writeFileSync(".git/COMMIT_EDITMSG", message.slice(2).trim());
    return;
  }
  const cmd = `npm run gqlgen && npm run lint-staged`;
  child_process.execSync(cmd, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
}

npmGitCommit();
