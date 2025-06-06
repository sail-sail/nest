import {
  query,
  QueryArgs,
} from "/lib/context.ts";

import {
  get_lang_id,
} from "/lib/auth/auth.dao.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";

type DictModel = {
  id: DictId;
  code: string;
  type: string;
  lbl: string;
  val: string;
};

/**
 * 获取系统字典
 */
export async function getDict(
  codes: string[] = [ ],
) {
  const table = "base_dict_detail";
  
  if (codes.length === 0) {
    return [ ];
  }
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
  const args = new QueryArgs();
  let lang_join = "";
  let lang_select = "";
  
  if (server_i18n_enable) {
    const lang_id = await get_lang_id();
    if (lang_id) {
      lang_join = `
        left join base_dict_detail_lang
          on t.id=base_dict_detail_lang.dict_detail_id
          and base_dict_detail_lang.lang_id=${ args.push(lang_id) }
      `;
      lang_select = "base_dict_detail_lang.lbl as lbl_lang,";
    }
  }
  
  const sql = `
    select
      t.id,
      base_dict.code,
      base_dict.type,
      t.lbl,
      ${ lang_select }
      t.val
    from
      base_dict_detail t
    inner join base_dict
      on t.dict_id=base_dict.id
      and base_dict.is_deleted=0
      and base_dict.is_enabled=1
    ${ lang_join }
    where
      t.is_deleted=0
      and t.is_enabled=1
      and base_dict.code in (${ args.push(codes) })
    order by
      t.order_by asc
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  type Result = DictModel & { lbl_lang: string | null };
  const rsArr = await query<Result>(sql, args, { cacheKey1, cacheKey2 });
  for (const rs of rsArr) {
    rs.lbl = rs.lbl_lang || rs.lbl;
  }
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
