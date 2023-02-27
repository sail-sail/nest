
async function getXLSX() {
  // @deno-types="https://cdn.sheetjs.com/xlsx-latest/package/types/index.d.ts"
  const XLSX = await import("sheetjs");
  // const cptable = await import("sheetjs_cptable");
  // XLSX.set_cptable(cptable);
  return XLSX;
}

export {
  getXLSX,
}

//https://github.com/SheetJS/sheetjs/blob/83ddb4c120/demos/deno/sheet2csv.ts
