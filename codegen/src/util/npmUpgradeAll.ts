import { execSync } from "node:child_process";

const branchs: {
  from: string;
  to: string;
}[] = [
  { from: "main", to: "main" },
  { from: "main", to: "deno4wx" },
  { from: "main", to: "deno4wxwork" },
  { from: "main", to: "deno4baidu" },
  { from: "main", to: "deno4cron" },
  { from: "main", to: "deno4nuxt" },
  { from: "main", to: "deno4submail" },
  { from: "main", to: "deno4tsdb" },
  { from: "main", to: "rust" },
  
  { from: "rust", to: "rust" },
  { from: "rust", to: "rust4cron" },
  { from: "rust", to: "rust4wx" },
  { from: "rust", to: "rust4wxwork" },
];

const httpProxy = "http://127.0.0.1:7890";
const httpsProxy = "https://127.0.0.1:7890";

async function exec() {
  
  if (branchs.length === 0) {
    return;
  }
  
  let command = "";
  
  for (let i = 0; i < branchs.length; i++) {
    
    const branch = branchs[i];
    
    command = `git switch ${ branch.to }`;
    console.log(command);
    execSync(command, { stdio: "inherit" });
    
    command = `git merge ${ branch.from } --no-edit`;
    console.log(command);
    execSync(command, { stdio: "inherit" });
    
    try {
      command = `git commit -m "upgrade"`;
      console.log(command);
      execSync(command, { stdio: "inherit" });
    } catch (e) {
    }
    
    command = `git push`;
    console.log(command);
    execSync(command, { stdio: "inherit" });
    
  }
  
  if (checkRemoteExists("github-nest")) {
    
    for (let i = 0; i < branchs.length; i++) {
      
      const branch = branchs[i];
      
      command = `git switch ${ branch.to }`;
      console.log(command);
      execSync(command, { stdio: "inherit" });
      
      // 先从 github-nest 拉取最新更改
      // command = `git`;
      // if (httpProxy) {
      //   command += ` -c http.proxy=${ httpProxy }`;
      // }
      // if (httpsProxy) {
      //   command += ` -c https.proxy=${ httpsProxy }`;
      // }
      // command += ` pull github-nest ${ branch.to }`;
      // console.log(command);
      // try {
      //   execSync(command, { stdio: "inherit" });
      // } catch (e) {
      //   console.warn(`拉取分支 ${branch.to} 失败，可能是新分支`);
      // }
      
      command = `git`;
      if (httpProxy) {
        command += ` -c http.proxy=${ httpProxy }`;
      }
      if (httpsProxy) {
        command += ` -c https.proxy=${ httpsProxy }`;
      }
      command += ` push github-nest`;
      console.log(command);
      execSync(command, { stdio: "inherit" });
      
    }
    
  } else {
    console.warn("远程仓库 github-nest 不存在，跳过推送");
  }
  
  
}

function checkRemoteExists(remoteName: string): boolean {
  try {
    execSync(`git remote get-url ${remoteName}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

exec();
