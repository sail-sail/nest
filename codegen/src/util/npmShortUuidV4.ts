import { shortUuidV4 } from "./uuid.ts";
import clipboardy from "clipboardy";

// 使用方法: npm run uuid [数量]
// 或: nr uuid [数量]

const ids = [ ];

let num: number | undefined;
let numStr = process.argv[2];
if (numStr) {
  num = parseInt(numStr);
}
if (!num) {
  num = 1;
}
for (let i = 0; i < num; i++) {
  ids.push(shortUuidV4());
}
const idStr = ids.join("\n");

console.log(idStr);
clipboardy.writeSync(idStr);
console.log("\n已复制到剪贴板");
