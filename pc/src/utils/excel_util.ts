/**
 * 第一行作为表头, 获得文件数据
 */
 export async function getExcelData<T extends { [key: string]: any }>(
  file: File,
  header?: {[key: string]: string},
): Promise<T[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: "buffer",
    cellFormula: false,
    cellHTML: false,
  });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: T[] = [ ];
  const data: any = XLSX.utils.sheet_to_json(worksheet);
  const keys = Object.keys(data[0]);
  for (let i = 0; i < data.length; i++) {
    const vals = data[i];
    const row = <T>{ };
    for (let k = 0; k < keys.length; k++) {
      const key = String(keys[k]).trim();
      if (!key) continue;
      let val = vals[key];
      if (typeof val === "string") {
        val = val.trim();
      }
      if (val !== "-") {
        if (header && header[key]) {
          (row as any)[header[key]] = val;
        }
        // else {
        //   (row as any)[key] = val;
        // }
      }
    }
    rows.push(row);
  }
  return rows;
}
