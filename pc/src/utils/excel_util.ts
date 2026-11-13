/* oxlint-disable @typescript-eslint/no-explicit-any */
import { saveAs } from "../compositions/download.ts";

import {
  showUploadMsg,
} from "./common.ts";

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
        // oxlint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return await ejsexcel.renderExcel(exlBuf, _data_);
      } catch (err) {
        console.error("useRenderExcel", exlBuf);
        throw err;
      }
    },
    {
      dependencies: [
        `${ location.origin }${ location.pathname }/ejsexcel.min.js`,
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
  
  if (!name.toLowerCase().endsWith(".xlsx")) {
    name += ".xlsx";
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

const SPLIT_SQL_INSERT_LEN = 200;

export function splitArr<T>(
  arr: T[],
  size: number,
): T[][] {
  if (arr.length <= size) {
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
  size = SPLIT_SQL_INSERT_LEN,
) {
  return splitArr(arr, size);
}

/** 导入失败时最多保留的错误详情条数 */
const IMPORT_ERR_MSG_LIMIT = 10;

/** 最多逐行定位多少条失败数据, 超过后不再拆分, 直接按整批计为失败 */
const IMPORT_ISOLATE_LIMIT = 100;

/**
 * 分批导入数据
 *
 * 后端的 creates 接口是单事务的: 一批数据中任意一条失败则整批回滚,
 * 接口也不会返回具体是哪一行出错。因此在某一批失败后按二分法拆分重试,
 * 逐步缩小范围直至单条, 从而给出精确的失败行号与真实入库条数。
 * 失败批次已整批回滚, 拆分后重试不会产生重复数据。
 *
 * @param inputs 全部待导入数据
 * @param createFn 单批创建函数
 * @param percentage 导入进度(0-100)
 * @param isCancel 是否已取消
 * @param formatErrMsg 生成错误提示, rowStart/rowEnd 为 Excel 行号(含表头)
 * @param opt.headerRows 表头行数, 用于把数据下标换算成 Excel 行号, 默认 1
 * @param opt.maxErrMsgs 最多保留的错误详情条数
 * @param opt.maxIsolateNum 最多逐行定位的失败条数
 */
export async function importModelsByChunk<T>(
  inputs: T[],
  createFn: (items: T[]) => Promise<unknown>,
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  formatErrMsg: (
    rowStart: number,
    rowEnd: number,
    err: unknown,
  ) => string | Promise<string>,
  opt?: {
    headerRows?: number;
    maxErrMsgs?: number;
    maxIsolateNum?: number;
  },
) {
  const headerRows = opt?.headerRows ?? 1;
  const maxErrMsgs = opt?.maxErrMsgs ?? IMPORT_ERR_MSG_LIMIT;
  const maxIsolateNum = opt?.maxIsolateNum ?? IMPORT_ISOLATE_LIMIT;
  
  const len = inputs.length;
  percentage.value = 0;
  
  let succNum = 0;
  let failNum = 0;
  let isolateNum = 0;
  let doneNum = 0;
  let isMsgTruncated = false;
  const failErrMsgs: string[] = [ ];
  
  // 数据下标 -> Excel 行号
  const getRowNum = (index: number) => index + 1 + headerRows;
  
  const addDone = (num: number) => {
    doneNum += num;
    percentage.value = len > 0 ? Math.floor(doneNum / len * 100) : 100;
  };
  
  const pushErrMsg = async (
    rowStart: number,
    rowEnd: number,
    err: unknown,
  ) => {
    if (failErrMsgs.length >= maxErrMsgs) {
      isMsgTruncated = true;
      return;
    }
    failErrMsgs.push(await formatErrMsg(rowStart, rowEnd, err));
  };
  
  /** 导入 [start, end) 区间, 失败则二分重试 */
  const importRange = async (
    start: number,
    end: number,
  ): Promise<void> => {
    if (isCancel.value) {
      return;
    }
    const items = inputs.slice(start, end);
    try {
      await createFn(items);
      succNum += items.length;
      addDone(items.length);
      return;
    } catch (err) {
      // 已定位到单条, 即真正出错的行
      if (items.length === 1) {
        failNum += 1;
        isolateNum += 1;
        addDone(1);
        await pushErrMsg(getRowNum(start), getRowNum(start), err);
        return;
      }
      // 失败数据过多时不再逐行定位, 直接按整批判定失败
      if (isolateNum >= maxIsolateNum) {
        failNum += items.length;
        addDone(items.length);
        await pushErrMsg(getRowNum(start), getRowNum(end - 1), err);
        return;
      }
      const mid = Math.ceil(items.length / 2);
      await importRange(start, start + mid);
      await importRange(start + mid, end);
    }
  };
  
  let offset = 0;
  for (const chunk of splitCreateArr(inputs)) {
    if (isCancel.value) {
      break;
    }
    await importRange(offset, offset + chunk.length);
    offset += chunk.length;
  }
  
  if (isMsgTruncated) {
    failErrMsgs.push(`错误信息过多, 仅显示前 ${ failErrMsgs.length } 条`);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

