import { Worker } from "worker_threads";
import { mkdirSync, accessSync, constants } from "fs";
import { _PROJECT_PATH } from "../config";

const cachePath = `${ _PROJECT_PATH }/src/common/cache/`;

if (process.env.NODE_ENV === "production") {
  try {
    mkdirSync(cachePath);
  } catch (err) {
  }
  try {
    accessSync(cachePath, constants.R_OK | constants.W_OK);
  } catch (err) {
    throw `缓存文件夹无读写文件权限! ${ err.message }`;
  }
}

/*
Date.prototype.toString = function() {
  const t = this;
  const fullYear = t.getFullYear();
  if (isNaN(fullYear)) return "";
  return fullYear + "-" + t.getMonth().toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0") + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0");
};
Date.prototype.toJSON = Date.prototype.toString;
*/
export function renderExcelWorker(buffer: Buffer, data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      `
        const { parentPort, workerData } = require("worker_threads");
        const { renderExcel } = require("ejsexcel");
        const cachePath = "${ cachePath.replace(/"/gm, "\\\"") }";
        const { buffer, data } = workerData;
        (async function() {
          const buffer2 = await renderExcel(Buffer.from(buffer), data, { cachePath });
          parentPort.postMessage(buffer2);
        })();
      `,
      {
        workerData: { buffer, data },
        eval: true,
      },
    );
    worker.once('message', function(msg) {
      resolve(Buffer.from(msg));
    });
    worker.once('error', reject);
    // worker.once('exit', (code) => {
    //   if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    // });
  });
}
