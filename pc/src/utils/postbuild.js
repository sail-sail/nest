/* eslint-disable @typescript-eslint/no-var-requires */
const {
  readFile,
  writeFile,
} = require("fs/promises");

const buildDir = `${ __dirname }/../../../build/`;

(async function() {
  const str = await readFile(`${ buildDir }/pc/index.html`, "utf8");
  const str2 = str.replaceAll("$__version__$", new Date().getTime().toString(16));
  await writeFile(`${ buildDir }/pc/index.html`, str2);
})();
