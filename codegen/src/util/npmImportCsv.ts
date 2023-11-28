// npm run importCsv -- wx/*
import {
  readdirSync,
  statSync,
} from "node:fs";

import {
  execCsvFile,
} from "./common";

import {
  initContext,
} from "../lib/information_schema";

import {
  isEmpty,
} from "../lib/StringUitl";

let argv2 = process.argv[2];
if (!argv2) {
  console.log("npm run importCsv -- [文件路径]");
  process.exit(1);
}

const root = `${ __dirname }/../tables/`;

const fileArr2: string[] = [ ];

let fileArr = argv2.split(",");
fileArr = fileArr.filter((file) => !isEmpty(file));
fileArr.forEach((file, i) => {
  if (file.endsWith("/") || file.endsWith("/*")) {
    if (file.endsWith("/*")) {
      file = file.substring(0, file.length - 1);
    }
    function tmpFn(file: string) {
      const fileTmps = readdirSync(`${ root }/${ file }`);
      for (const fileTmp of fileTmps) {
        if (!fileTmp.endsWith(".sql.csv")) {
          continue;
        }
        const stat = statSync(`${ root }/${ file }/${ fileTmp }`);
        if (stat.isDirectory()) {
          tmpFn(`${ file }/${ fileTmp }`);
        } else {
          fileArr2.push(`${ file }/${ fileTmp }`);
        }
      }
    }
    tmpFn(file);
    return;
  }
  if (!file.endsWith(".sql.csv")) {
    fileArr[i] += ".sql.csv";
    fileArr2.push(fileArr[i]);
  }
});
fileArr = fileArr2;

async function exec() {
  console.time("csv");
  const context = await initContext();
  
  const csvFiles = [
    ...fileArr.map((file) => `${ root }/${ file }`),
  ];
  
  for (let i = 0; i < csvFiles.length; i++) {
    const item = csvFiles[i];
    await execCsvFile(context, item);
  }
  
  console.timeEnd("csv");
  process.exit(0);
}

exec().catch((err) => {
  console.error(err);
});
