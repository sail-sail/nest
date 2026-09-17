import { execSync } from "node:child_process";

const parentBranchs = [
];

async function exec() {
  let command = "";
  command = "git pull";
  console.log(command);
  execSync(command, { stdio: "inherit" });
  if (parentBranchs.length > 0) {
    for (let i = 0; i < parentBranchs.length; i++) {
      const branch = parentBranchs[i];
      command = `git merge ${ branch } --no-edit`;
      console.log(command);
      execSync(command, { stdio: "inherit" });
    }
  } else {
    console.log("无父分支需要合并");
  }
}

exec();
