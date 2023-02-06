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
let fileArr = argv2.split(",");
fileArr = fileArr.filter((file) => !isEmpty(file));
fileArr.forEach((file, i) => {
  if (!file.endsWith(".sql.csv")) {
    fileArr[i] += ".sql.csv";
  }
});

const root = `${ __dirname }/../tables/`;

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
