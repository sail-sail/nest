import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

type DictModel = {
  id: DictbizId;
  code: string;
  lbl: string;
  val: string;
};

/**
 * 获取业务字典
 */
export async function getDictbiz(
  codes: string[] = [ ],
  tenant_id?: string,
) {
  const table = "base_dictbiz_detail";
  
  if (codes.length === 0) {
    return [ ];
  }
  
  if (!tenant_id) {
    tenant_id = await getTenant_id();
  }
  
  const args = new QueryArgs();
  
  const sql = /*sql*/ `
    select
      t.id,
      base_dictbiz.code,
      base_dictbiz.type,
      t.lbl,
      t.val
    from
      base_dictbiz_detail t
    inner join base_dictbiz
      on t.dictbiz_id=base_dictbiz.id
      and base_dictbiz.is_deleted=0
      and base_dictbiz.is_enabled=1
    where
      t.is_deleted=0
      and t.is_enabled=1
      and t.tenant_id=${ args.push(tenant_id) }
      and base_dictbiz.tenant_id=${ args.push(tenant_id) }
      and base_dictbiz.code in (${ args.push(codes) })
    order by
      t.order_by asc
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  const rsArr = await query<DictModel>(sql, args, { cacheKey1, cacheKey2 });
  const data: DictModel[][] = [ ];
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const itemArr = rsArr.filter((itemTmp) => itemTmp.code === code);
    data.push(itemArr);
  }
  return data;
}

/**
 * 根据 val 的数据类型转换成字符串
 */
export function val2Str(
  val: string | number | boolean | Date | null | undefined,
  type: "string" | "number" | "boolean" | "date" | "datetime" | "time",
): string {
  if (val == null) {
    return "";
  }
  if (typeof val === "string") {
    return val;
  }
  if (Number.isFinite(val)) {
    return val.toString();
  }
  if (typeof val === "boolean") {
    return val ? "1" : "0";
  }
  if (val instanceof Date) {
    if (type === "date") {
      return val.toISOString().slice(0, 10);
    } else if (type === "datetime") {
      return val.toISOString().slice(0, 19).replace("T", " ");
    } else if (type === "time") {
      return val.toISOString().slice(11, 19);
    }
  }
  return "";
}

/**
 * 根据 val 字符串转换成对应的数据类型
 */
export function str2Val(
  str: null | undefined,
  type: "string" | "number" | "boolean" | "date" | "datetime" | "time",
): undefined;

/**
 * 根据 val 字符串转换成对应的数据类型
 */
export function str2Val(
  str: string,
  type: "string",
): string;

/**
 * 根据 val 字符串转换成对应的数据类型
 */
export function str2Val(
  str: string,
  type: "number",
): number;

/**
 * 根据 val 字符串转换成对应的数据类型
 */
export function str2Val(
  str: string,
  type: "boolean",
): 1 | 0;

/**
 * 根据 val 字符串转换成对应的数据类型
 */
export function str2Val(
  str: string,
  type: "date" | "datetime" | "time",
): Date;

/**
 * 根据 val 字符串转换成对应的数据类型
 */
export function str2Val(
  str: string | null | undefined,
  type: "string" | "number" | "boolean" | "date" | "datetime" | "time",
): string | number | boolean | Date | undefined {
  if (str == null) {
    return;
  }
  if (type === "string") {
    return str;
  }
  if (type === "number") {
    return Number(str);
  }
  if (type === "boolean") {
    return str === "1";
  }
  if (type === "date") {
    return new Date(str);
  }
  if (type === "datetime") {
    return new Date(str);
  }
  if (type === "time") {
    return new Date(`1970-01-01T${ str }`);
  }
  return;
}
