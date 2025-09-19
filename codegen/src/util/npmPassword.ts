import { createHash } from "node:crypto";
import clipboardy from "clipboardy";

// 使用方法: npm run pwd "[密码]"
// 或: nr pwd "[密码]"

export const SECRET_KEY = "38e52379-9e94-467c-8e63-17ad318fc845";

function getPassword(str: string): string {
  if (!str) return "";
  str = createHash("sha256").update(str+SECRET_KEY).digest("base64");
  str = createHash("sha256").update(str).digest("base64").substring(0, 43);
  return str;
}

const envArgs = process.argv;
const password = (envArgs[2] || "").trim();

if (!password) {
  console.log("请输入密码!");
  process.exit(0);
}

const password2 = getPassword(password);

console.log("原始值:", password);
console.log("生成的密码:", password2);
clipboardy.writeSync(password2);
console.log("\n已复制到剪贴板");
