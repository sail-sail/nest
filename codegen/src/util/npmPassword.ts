import { createHash } from "node:crypto";
import { exec } from "node:child_process";
import {
  writeFileSync,
  unlinkSync,
} from "node:fs";

export const SECRET_KEY = "38e52379-9e94-467c-8e63-17ad318fc845";

function getPassword(str: string): string {
  if (!str) return "";
  str = createHash("sha256").update(str+SECRET_KEY).digest("base64");
  str = createHash("sha256").update(str).digest("base64").substring(0, 43);
  return str;
}

let envArgs = [ ];
if (process.env.npm_config_argv) {
  envArgs = JSON.parse(process.env.npm_config_argv).remain;
} else if (process.env.npm_lifecycle_script) {
  envArgs = process.env.npm_lifecycle_script.split(" ");
} else {
  envArgs = process.argv;
}
const password = (envArgs[0] || "").trim();

if (!password) {
  console.log("请输入密码!");
  process.exit(0);
}

const password2 = getPassword(password);

writeFileSync("temp", password2);

exec(`CHCP 65001 && clip < temp`, function(err, stdout, stderr) {
  if (err) {
    console.error(err);
    return;
  }
  if (stderr) {
    console.error(stderr);
    return;
  }
  console.log(stdout);
  console.log(password2);
  unlinkSync("temp");
});

