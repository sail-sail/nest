const fs = require("fs");
try {
  fs.unlinkSync(`${ __dirname }/../../public/ejsexcel.min.js`);
} catch (e) {
}
fs.copyFileSync(`${ __dirname }/../../node_modules/ejsexcel-browserify/dist/ejsexcel.min.js`, `${ __dirname }/../../public/ejsexcel.min.js`);
