/**
 * 第一行作为表头, 获得文件数据
 */
 export async function getExcelData<T extends { [key: string]: any }>(
  file: File,
  header?: {[key: string]: string},
  opt?: {
    type?: "xlsx" | "csv";
    date_keys?: string[];
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
  const keys = Object.keys(data[0]);
  for (let i = 0; i < data.length; i++) {
    const vals = data[i];
    const row = <T>{ };
    for (let k = 0; k < keys.length; k++) {
      const key = String(keys[k]).trim();
      if (!key) continue;
      let val = vals[key];
      if (opt?.date_keys && opt.date_keys.includes(key)) {
        val = num2Date(val);
      } else {
        if (typeof val === "string") {
          val = val.trim();
        }
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
