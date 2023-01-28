import { shortUuidV4 } from "./uuid";
import { exec } from "node:child_process";
import {
  writeFileSync,
  unlinkSync,
} from "node:fs";

const id = shortUuidV4();

writeFileSync("temp", id);

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
  console.log(id);
  unlinkSync("temp");
});
