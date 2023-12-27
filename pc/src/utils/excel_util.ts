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
    key_types: { [key: string]: "string" | "number" | "date" };
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
  const data: any = XLSX.utils.sheet_to_json(worksheet);
  const keys = Object.keys(data[0])
    .map((key) => key.trim())
    .filter((key) => key);
  for (let i = 0; i < data.length; i++) {
    const vals = data[i];
    const row = <T>{ };
    for (let k = 0; k < keys.length; k++) {
      const key = keys[k];
      let val = vals[key];
      const headerKey = header && header[key] || key;
      const type = opt?.key_types[headerKey] || "string";
      if (type === "number") {
        (row as any)[headerKey] = Number(val);
        if (isNaN((row as any)[headerKey])) {
          (row as any)[headerKey] = undefined;
        }
      } else if (type === "date") {
        if (val instanceof Date) {
          (row as any)[headerKey] = val;
        } else if (typeof val === "number") {
          (row as any)[headerKey] = num2Date(val);
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
  buffer:  Uint32Array,
  name: string,
) {
  const blob = new Blob([ buffer ], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
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
  if(isNaN(<any>date)) {
    date = undefined;
  }
  return date;
}
