
// @deno-types="https://cdn.sheetjs.com/xlsx-latest/package/types/index.d.ts"
import * as XLSX from "sheetjs";


/* load the codepage support library for extended support with older formats  */
// import * as cptable from "sheetjs_cptable";
// XLSX.set_cptable(cptable);

// // deno-lint-ignore no-explicit-any
// declare const XLSX: any;

async function getXLSX() {
  if (typeof XLSX === "undefined") {
    const xlsx = await import("https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs");
    return xlsx;
  }
  // @deno-types="https://cdn.sheetjs.com/xlsx-latest/package/types/index.d.ts"
  return XLSX;
}

export {
  getXLSX,
}

//https://github.com/SheetJS/sheetjs/blob/83ddb4c120/demos/deno/sheet2csv.ts
