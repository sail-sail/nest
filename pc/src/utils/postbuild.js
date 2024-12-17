const {
  readFileSync,
  writeFileSync,
  copyFileSync,
  unlinkSync,
} = require("fs");

const buildDir = `${ __dirname }/../../../build/`;

// index.html
const str = readFileSync(`${ buildDir }/pc/index.html`, "utf8");
const str2 = str.replaceAll("$__version__$", new Date().getTime().toString(16));
writeFileSync(`${ buildDir }/pc/index.html`, str2);

// ejsexcel.min.js
try {
  unlinkSync(`${ __dirname }/../../public/ejsexcel.min.js`);
} catch (e) {
}
copyFileSync(`${ __dirname }/../../node_modules/ejsexcel-browserify/dist/ejsexcel.min.js`, `${ __dirname }/../../public/ejsexcel.min.js`);
