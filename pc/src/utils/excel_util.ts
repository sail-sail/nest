/* eslint-disable @typescript-eslint/no-explicit-any */
import saveAs from "file-saver";

import dayjs from "dayjs";

/**
 * 第一行作为表头, 获得文件数据
 */
 export async function getExcelData<T extends { [key: string]: any }>(
  file: File,
  header?: {[key: string]: string},
  opt?: {
    type?: "xlsx" | "csv";
    key_types: { [key: string]: "string" | "number" | "date" | "string[]" };
  },
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
  
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  const keys = data[0];
  for (let i = 1; i < data.length; i++) {
    const vals = data[i];
    const row = { } as T;
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      let val = vals[k];
      const headerKey = header && header[key] || key;
      if (typeof val === "string") {
        if (val.trim() === "-") {
          (row as any)[headerKey] = undefined;
          continue;
        }
        if (val.trim() === "--") {
          (row as any)[headerKey] = "-";
          continue;
        }
      }
      const type = opt?.key_types[headerKey] || "string";
      if (type === "number") {
        (row as any)[headerKey] = Number(val);
        if (isNaN((row as any)[headerKey])) {
          (row as any)[headerKey] = undefined;
        }
      } else if (type === "string[]") {
        if (typeof val === "string") {
          val = val.split(",").map((v) => v.trim());
        }
        if (Array.isArray(val)) {
          (row as any)[headerKey] = val;
        } else if (val != null) {
          (row as any)[headerKey] = [ val.toString() ];
        } else {
          (row as any)[headerKey] = [ ];
        }
      } else if (type === "date") {
        if (val instanceof Date) {
          (row as any)[headerKey] = val;
        } else if (typeof val === "number") {
          // (row as any)[headerKey] = num2Date(val);
          const msg = `请使用字符串格式的日期, 例如: ${ dayjs().format("YYYY-MM-DD HH:mm:ss") }`;
          ElMessage.error(msg);
          throw msg;
        } else {
          const dateDay = dayjs(val);
          if (dateDay.isValid()) {
            (row as any)[headerKey] = dateDay.toDate();
          } else {
            (row as any)[headerKey] = val;
          }
        }
      } else {
        if (val instanceof Date) {
          val = dayjs(val).format("YYYY-MM-DD HH:mm:ss");
        } else {
          if (val != null && val !== "-") {
            (row as any)[headerKey] = String(val);
          }
        }
      }
    }
    rows.push(row);
  }
  return rows;
}

function toExcelColWidth(width?: string | number) {
  let excelWidth: string | undefined;
  if (width && !isNaN(Number(width))) {
    excelWidth = (Number(width) / 13 * 22).toFixed(0);
  }
  return excelWidth;
}

export function toExcelColumns(tableColumns: ColumnType[]): ExcelColumnType[] {
  const columns: ExcelColumnType[] = tableColumns.map((column) => {
    return {
      prop: column.prop,
      label: column.label,
      width: toExcelColWidth(column.width),
      align: column.align,
      fixed: column.fixed === "left" || column.fixed === true,
      hidden: column.hide === true ? "1" : "0",
    };
  });
  return columns;
}

/**
 * 渲染excel模板
 */
export function useRenderExcel() {
  return useWebWorkerFn(
    async function (exlBuf: Buffer | string, _data_: any | string) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await ejsexcel.renderExcel(exlBuf, _data_);
      } catch (err) {
        console.error("useRenderExcel", exlBuf);
        throw err;
      }
    },
    {
      dependencies: [
        `${ location.origin }/ejsexcel.min.js`,
      ],
    },
  );
}

/** 下载Excel文件 */
export function saveAsExcel(
  buffer:  Uint8Array | ArrayBuffer | Blob,
  name: string,
) {
  let blob: Blob;
  
  if (buffer instanceof Blob) {
    blob = buffer;
  } else if (buffer instanceof ArrayBuffer) {
    blob = new Blob([ buffer ], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } else {
    // 对于 Uint8Array 或其他 TypedArray
    blob = new Blob([ buffer as unknown as ArrayBuffer ], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
  
  saveAs(blob, name);
}

function date2Num(date: Date) {
  const time = date.getTime();
  let valTmp = time + 25567.33 * 86400000;
  if(valTmp <= 60 * 86400000) {
    valTmp += 86400000;
  } else {
    valTmp += 2 * 86400000;
  }
  return (valTmp - (date.getTimezoneOffset() * 600)) / 86400000;
}

function num2Date(valTmp: number | string | Date) {
  let date: Date | undefined = undefined;
  if(valTmp instanceof Date) {
    date = valTmp;
  } else if(typeof valTmp === "string") {
    date = new Date(valTmp);
  } else if(typeof valTmp === "number") {
    if(valTmp < 60) {
      valTmp--;
    } else if(valTmp > 60) {
      valTmp -= 2;
    }
    if(valTmp < 0 || valTmp === 60) {
      date = undefined;
    } else {
      valTmp = Math.round(valTmp * 86400000) - 2209017600000;
      date = new Date(valTmp);
    }
  }
  if(isNaN(date as any)) {
    date = undefined;
  }
  return date;
}

const SPLIT_SQL_INSERT_LEN = 2000;

export function splitArr<T>(
  arr: T[],
  size: number,
): T[][] {
  if (size <= SPLIT_SQL_INSERT_LEN) {
    return [ arr ];
  }
  const res: T[][] = [ ];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export function splitCreateArr<T>(
  arr: T[],
) {
  return splitArr(arr, SPLIT_SQL_INSERT_LEN);
}

