const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const version = new Date().getTime().toString(16);
const candidateFiles = [
  path.resolve(__dirname, "../../../build/uni/index.html"),
  path.resolve(__dirname, "../../dist/build/h5/index.html"),
];

for (const filePath of candidateFiles) {
  try {
    let content = readFileSync(filePath, "utf8");
    let updated = content;

    if (updated.includes("__VERSION__")) {
      updated = updated.replaceAll("__VERSION__", version);
    }

    if (updated.includes("$__version__$")) {
      updated = updated.replaceAll("$__version__$", version);
    }

    if (updated !== content) {
      writeFileSync(filePath, updated);
    }
  } catch (e) {
    // ignore missing build files; the build output may not exist yet when this is run directly
  }
}
