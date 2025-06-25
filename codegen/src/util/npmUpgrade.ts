import { execSync } from "node:child_process";

const parentBranchs = [
];

async function exec() {
  // const currentBranch = execSync("git branch --show-current").toString().trim();
  let command = "";
  // command = "git rev-parse --abbrev-ref @{u}";
  // console.log(command);
  // let origin = execSync(command).toString().trim();
  // origin = origin.split("/")[0];
  // command = `git pull ${ origin } main`;
  // console.log(command);
  // execSync(command, { stdio: "inherit" });
  if (parentBranchs.length > 0) {
    // for (let i = 0; i < parentBranchs.length; i++) {
    //   const branch = parentBranchs[i];
    //   command = `git switch ${ branch }`;
    //   console.log(command);
    //   execSync(command, { stdio: "inherit" });
    //   command = "git rev-parse --abbrev-ref @{u}";
    //   console.log(command);
    //   let origin = execSync(command).toString().trim();
    //   origin = origin.split("/")[0];
    //   command = `git pull ${ origin } ${ branch }`;
    //   console.log(command);
    //   execSync(command, { stdio: "inherit" });
    // }
    // command = `git switch ${ currentBranch }`;
    // console.log(command);
    // execSync(command, { stdio: "inherit" });
    for (let i = 0; i < parentBranchs.length; i++) {
      const branch = parentBranchs[i];
      command = `git merge ${ branch } --no-edit`;
      console.log(command);
      execSync(command, { stdio: "inherit" });
    }
  }
}

exec();
