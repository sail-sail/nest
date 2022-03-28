import { getPassword } from "../auth/auth.constants";

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
console.log(getPassword(password));
