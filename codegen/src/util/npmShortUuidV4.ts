import { shortUuidV4 } from "./uuid";
import { exec } from "node:child_process";
import {
  writeFileSync,
  unlinkSync,
} from "node:fs";

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

writeFileSync("temp", idStr);

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
  console.log(idStr);
  unlinkSync("temp");
});
