// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import sqlstring from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
  splitCreateArr,
  FIND_ALL_IDS_LIMIT,
} from "/lib/util/dao_util.ts";

import {
  log,
  error,
  escapeDec,
  reqDate,
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import { ServiceException } from "/lib/exceptions/service.exception.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  InputMaybe,
  PageInput,
  SortInput,
  DynPageFieldAlign,
} from "/gen/types.ts";

import {
  findOneDynPage,
} from "/gen/base/dyn_page/dyn_page.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  getPagePathDynPageField,
  getTableNameDynPageField,
} from "./dyn_page_field.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<DynPageFieldSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id=${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id=${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.code_seq != null) {
    if (search.code_seq[0] != null) {
      whereQuery += ` and t.code_seq>=${ args.push(search.code_seq[0]) }`;
    }
    if (search.code_seq[1] != null) {
      whereQuery += ` and t.code_seq<=${ args.push(search.code_seq[1]) }`;
    }
  }
  if (search?.code != null) {
    whereQuery += ` and t.code=${ args.push(search.code) }`;
  }
  if (isNotEmpty(search?.code_like)) {
    whereQuery += ` and t.code like ${ args.push("%" + sqlLike(search?.code_like) + "%") }`;
  }
  if (search?.dyn_page_id != null) {
    whereQuery += ` and t.dyn_page_id in (${ args.push(search.dyn_page_id) })`;
  }
  if (search?.dyn_page_id_is_null) {
    whereQuery += ` and t.dyn_page_id is null`;
  }
  if (search?.dyn_page_id_lbl != null) {
    whereQuery += ` and dyn_page_id_lbl.lbl in (${ args.push(search.dyn_page_id_lbl) })`;
  }
  if (isNotEmpty(search?.dyn_page_id_lbl_like)) {
    whereQuery += ` and dyn_page_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.dyn_page_id_lbl_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.type != null) {
    whereQuery += ` and t.type=${ args.push(search.type) }`;
  }
  if (isNotEmpty(search?.type_like)) {
    whereQuery += ` and t.type like ${ args.push("%" + sqlLike(search?.type_like) + "%") }`;
  }
  if (search?.attrs != null) {
    whereQuery += ` and t.attrs=${ args.push(search.attrs) }`;
  }
  if (isNotEmpty(search?.attrs_like)) {
    whereQuery += ` and t.attrs like ${ args.push("%" + sqlLike(search?.attrs_like) + "%") }`;
  }
  if (search?.formula != null) {
    whereQuery += ` and t.formula=${ args.push(search.formula) }`;
  }
  if (isNotEmpty(search?.formula_like)) {
    whereQuery += ` and t.formula like ${ args.push("%" + sqlLike(search?.formula_like) + "%") }`;
  }
  if (search?.is_required != null) {
    whereQuery += ` and t.is_required in (${ args.push(search.is_required) })`;
  }
  if (search?.is_search != null) {
    whereQuery += ` and t.is_search in (${ args.push(search.is_search) })`;
  }
  if (search?.width != null) {
    if (search.width[0] != null) {
      whereQuery += ` and t.width>=${ args.push(search.width[0]) }`;
    }
    if (search.width[1] != null) {
      whereQuery += ` and t.width<=${ args.push(search.width[1]) }`;
    }
  }
  if (search?.align != null) {
    whereQuery += ` and t.align in (${ args.push(search.align) })`;
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in (${ args.push(search.is_enabled) })`;
  }
  if (search?.order_by != null) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by>=${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by<=${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in (${ args.push(search.create_usr_id) })`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and t.create_usr_id_lbl in (${ args.push(search.create_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.create_usr_id_lbl_like)) {
    whereQuery += ` and t.create_usr_id_lbl like ${ args.push("%" + sqlLike(search.create_usr_id_lbl_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and t.update_usr_id in (${ args.push(search.update_usr_id) })`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
  }
  if (search?.update_usr_id_lbl != null) {
    whereQuery += ` and t.update_usr_id_lbl in (${ args.push(search.update_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.update_usr_id_lbl_like)) {
    whereQuery += ` and t.update_usr_id_lbl like ${ args.push("%" + sqlLike(search.update_usr_id_lbl_like) + "%") }`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time>=${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time<=${ args.push(search.update_time[1]) }`;
    }
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<DynPageFieldSearch>,
  options?: {
  },
) {
  let fromQuery = `base_dyn_page_field t
  left join base_dyn_page dyn_page_id_lbl on dyn_page_id_lbl.id=t.dyn_page_id`;
  return fromQuery;
}

// MARK: findCountDynPageField
/** 根据条件查找动态页面字段总数 */
export async function findCountDynPageField(
  search?: Readonly<DynPageFieldSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "findCountDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return 0;
  }
  if (search && search.ids && search.ids.length === 0) {
    return 0;
  }
  // 动态页面
  if (search && search.dyn_page_id != null) {
    const len = search.dyn_page_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.dyn_page_id.length > ${ ids_limit }`);
    }
  }
  // 必填
  if (search && search.is_required != null) {
    const len = search.is_required.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_required.length > ${ ids_limit }`);
    }
  }
  // 查询条件
  if (search && search.is_search != null) {
    const len = search.is_search.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_search.length > ${ ids_limit }`);
    }
  }
  // 对齐方式
  if (search && search.align != null) {
    const len = search.align.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.align.length > ${ ids_limit }`);
    }
  }
  // 启用
  if (search && search.is_enabled != null) {
    const len = search.is_enabled.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_enabled.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select count(1) total from (select 1 from ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAllDynPageField
/** 根据搜索条件和分页查找动态页面字段列表 */
export async function findAllDynPageField(
  search?: Readonly<DynPageFieldSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<DynPageFieldModel[]> {
  
  const table = getTableNameDynPageField();
  const method = "findAllDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (page && Object.keys(page).length > 0) {
      msg += ` page:${ JSON.stringify(page) }`;
    }
    if (sort && Object.keys(sort).length > 0) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 动态页面
  if (search && search.dyn_page_id != null) {
    const len = search.dyn_page_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.dyn_page_id.length > ${ ids_limit }`);
    }
  }
  // 必填
  if (search && search.is_required != null) {
    const len = search.is_required.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_required.length > ${ ids_limit }`);
    }
  }
  // 查询条件
  if (search && search.is_search != null) {
    const len = search.is_search.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_search.length > ${ ids_limit }`);
    }
  }
  // 对齐方式
  if (search && search.align != null) {
    const len = search.align.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.align.length > ${ ids_limit }`);
    }
  }
  // 启用
  if (search && search.is_enabled != null) {
    const len = search.is_enabled.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_enabled.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,dyn_page_id_lbl.lbl dyn_page_id_lbl
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  sort = sort ?? [ ];
  sort = sort.filter((item) => item.prop);
  
  sort.push({
    prop: "order_by",
    order: SortOrderEnum.Asc,
  });
  
  if (!sort.some((item) => item.prop === "create_time")) {
    sort.push({
      prop: "create_time",
      order: SortOrderEnum.Desc,
    });
  }
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<DynPageFieldModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  if (page?.isResultLimit !== false) {
    let find_all_result_limit = Number(getParsedEnv("server_find_all_result_limit")) || 1000;
    const len = result.length;
    if (len > find_all_result_limit) {
      throw new Error(`结果集过大, 超过 ${ find_all_result_limit }`);
    }
  }
  
  const [
    is_requiredDict, // 必填
    is_searchDict, // 查询条件
    alignDict, // 对齐方式
    is_enabledDict, // 启用
  ] = await getDict([
    "yes_no",
    "yes_no",
    "dyn_page_field_align",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 动态页面
    model.dyn_page_id_lbl = model.dyn_page_id_lbl || "";
    
    // 必填
    let is_required_lbl = model.is_required?.toString() || "";
    if (model.is_required != null) {
      const dictItem = is_requiredDict.find((dictItem) => dictItem.val === String(model.is_required));
      if (dictItem) {
        is_required_lbl = dictItem.lbl;
      }
    }
    model.is_required_lbl = is_required_lbl || "";
    
    // 查询条件
    let is_search_lbl = model.is_search?.toString() || "";
    if (model.is_search != null) {
      const dictItem = is_searchDict.find((dictItem) => dictItem.val === String(model.is_search));
      if (dictItem) {
        is_search_lbl = dictItem.lbl;
      }
    }
    model.is_search_lbl = is_search_lbl || "";
    
    // 对齐方式
    let align_lbl = model.align as string;
    if (!isEmpty(model.align)) {
      const dictItem = alignDict.find((dictItem) => dictItem.val === model.align);
      if (dictItem) {
        align_lbl = dictItem.lbl;
      }
    }
    model.align_lbl = align_lbl || "";
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled != null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === String(model.is_enabled));
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl || "";
    
    // 创建时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (create_time.isValid()) {
        model.create_time = create_time.format("YYYY-MM-DDTHH:mm:ss");
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.create_time_lbl = (model.create_time || "").toString();
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (update_time.isValid()) {
        model.update_time = update_time.format("YYYY-MM-DDTHH:mm:ss");
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.update_time_lbl = (model.update_time || "").toString();
      }
    } else {
      model.update_time_lbl = "";
    }
  }
  
  return result;
}

// MARK: setIdByLblDynPageField
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblDynPageField(
  input: DynPageFieldInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    is_requiredDict, // 必填
    is_searchDict, // 查询条件
    alignDict, // 对齐方式
    is_enabledDict, // 启用
  ] = await getDict([
    "yes_no",
    "yes_no",
    "dyn_page_field_align",
    "is_enabled",
  ]);
  
  // 动态页面
  if (isNotEmpty(input.dyn_page_id_lbl) && input.dyn_page_id == null) {
    input.dyn_page_id_lbl = String(input.dyn_page_id_lbl).trim();
    const dyn_pageModel = await findOneDynPage(
      {
        lbl: input.dyn_page_id_lbl,
      },
      undefined,
      options,
    );
    if (dyn_pageModel) {
      input.dyn_page_id = dyn_pageModel.id;
    }
  } else if (isEmpty(input.dyn_page_id_lbl) && input.dyn_page_id != null) {
    const dyn_page_model = await findOneDynPage(
      {
        id: input.dyn_page_id,
      },
      undefined,
      options,
    );
    if (dyn_page_model) {
      input.dyn_page_id_lbl = dyn_page_model.lbl;
    }
  }
  
  // 必填
  if (isNotEmpty(input.is_required_lbl) && input.is_required == null) {
    const val = is_requiredDict.find((itemTmp) => itemTmp.lbl === input.is_required_lbl)?.val;
    if (val != null) {
      input.is_required = Number(val);
    }
  } else if (isEmpty(input.is_required_lbl) && input.is_required != null) {
    const lbl = is_requiredDict.find((itemTmp) => itemTmp.val === String(input.is_required))?.lbl || "";
    input.is_required_lbl = lbl;
  }
  
  // 查询条件
  if (isNotEmpty(input.is_search_lbl) && input.is_search == null) {
    const val = is_searchDict.find((itemTmp) => itemTmp.lbl === input.is_search_lbl)?.val;
    if (val != null) {
      input.is_search = Number(val);
    }
  } else if (isEmpty(input.is_search_lbl) && input.is_search != null) {
    const lbl = is_searchDict.find((itemTmp) => itemTmp.val === String(input.is_search))?.lbl || "";
    input.is_search_lbl = lbl;
  }
  
  // 对齐方式
  if (isNotEmpty(input.align_lbl) && input.align == null) {
    const val = alignDict.find((itemTmp) => itemTmp.lbl === input.align_lbl)?.val;
    if (val != null) {
      input.align = val as DynPageFieldAlign;
    }
  } else if (isEmpty(input.align_lbl) && input.align != null) {
    const lbl = alignDict.find((itemTmp) => itemTmp.val === input.align)?.lbl || "";
    input.align_lbl = lbl;
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled == null) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val != null) {
      input.is_enabled = Number(val);
    }
  } else if (isEmpty(input.is_enabled_lbl) && input.is_enabled != null) {
    const lbl = is_enabledDict.find((itemTmp) => itemTmp.val === String(input.is_enabled))?.lbl || "";
    input.is_enabled_lbl = lbl;
  }
}

// MARK: getFieldCommentsDynPageField
/** 获取动态页面字段字段注释 */
export async function getFieldCommentsDynPageField(): Promise<DynPageFieldFieldComment> {
  const field_comments: DynPageFieldFieldComment = {
    id: "ID",
    code: "编码",
    dyn_page_id: "动态页面",
    dyn_page_id_lbl: "动态页面",
    lbl: "名称",
    type: "类型",
    attrs: "属性",
    formula: "计算公式",
    is_required: "必填",
    is_required_lbl: "必填",
    is_search: "查询条件",
    is_search_lbl: "查询条件",
    width: "宽度",
    align: "对齐方式",
    align_lbl: "对齐方式",
    is_enabled: "启用",
    is_enabled_lbl: "启用",
    order_by: "排序",
  };
  
  return field_comments;
}

// MARK: findByUniqueDynPageField
/** 通过唯一约束获得动态页面字段列表 */
export async function findByUniqueDynPageField(
  search0: Readonly<DynPageFieldInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel[]> {
  
  const table = getTableNameDynPageField();
  const method = "findByUniqueDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search0.id) {
    const model = await findOneDynPageField(
      {
        id: search0.id,
      },
      undefined,
      options,
    );
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: DynPageFieldModel[] = [ ];
  {
    if (search0.dyn_page_id == null) {
      return [ ];
    }
    let dyn_page_id: DynPageId[] = [ ];
    if (!Array.isArray(search0.dyn_page_id) && search0.dyn_page_id != null) {
      dyn_page_id = [ search0.dyn_page_id, search0.dyn_page_id ];
    } else {
      dyn_page_id = search0.dyn_page_id || [ ];
    }
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAllDynPageField(
      {
        dyn_page_id,
        lbl,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  {
    if (search0.code == null) {
      return [ ];
    }
    const code = search0.code;
    const modelTmps = await findAllDynPageField(
      {
        code,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueDynPageField(
  oldModel: Readonly<DynPageFieldModel>,
  input: Readonly<DynPageFieldInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.dyn_page_id === input.dyn_page_id &&
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  if (
    oldModel.code === input.code
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUniqueDynPageField
/** 通过唯一约束检查 动态页面字段 是否已经存在 */
export async function checkByUniqueDynPageField(
  input: Readonly<DynPageFieldInput>,
  oldModel: Readonly<DynPageFieldModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueDynPageField(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("动态页面字段 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: DynPageFieldId = await updateByIdDynPageField(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        options,
      );
      return id;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

// MARK: findOneDynPageField
/** 根据条件查找第一动态页面字段 */
export async function findOneDynPageField(
  search?: Readonly<DynPageFieldSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel | undefined> {
  
  const table = getTableNameDynPageField();
  const method = "findOneDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const dyn_page_field_models = await findAllDynPageField(
    search,
    page,
    sort,
    options,
  );
  
  const dyn_page_field_model = dyn_page_field_models[0];
  
  return dyn_page_field_model;
}

// MARK: findOneOkDynPageField
/** 根据条件查找第一动态页面字段, 如果不存在则抛错 */
export async function findOneOkDynPageField(
  search?: Readonly<DynPageFieldSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel> {
  
  const table = getTableNameDynPageField();
  const method = "findOneOkDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const dyn_page_field_models = await findAllDynPageField(
    search,
    page,
    sort,
    options,
  );
  
  const dyn_page_field_model = dyn_page_field_models[0];
  
  if (!dyn_page_field_model) {
    const err_msg = "此 动态页面字段 已被删除";
    throw new Error(err_msg);
  }
  
  return dyn_page_field_model;
}

// MARK: findByIdDynPageField
/** 根据 id 查找动态页面字段 */
export async function findByIdDynPageField(
  id: DynPageFieldId,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel | undefined> {
  
  const table = getTableNameDynPageField();
  const method = "findByIdDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    return;
  }
  
  const dyn_page_field_model = await findOneDynPageField(
    {
      id,
    },
    undefined,
    options,
  );
  
  return dyn_page_field_model;
}

// MARK: findByIdOkDynPageField
/** 根据 id 查找动态页面字段, 如果不存在则抛错 */
export async function findByIdOkDynPageField(
  id: DynPageFieldId,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel> {
  
  const table = getTableNameDynPageField();
  const method = "findByIdOkDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const dyn_page_field_model = await findByIdDynPageField(
    id,
    options,
  );
  
  if (!dyn_page_field_model) {
    const err_msg = "此 动态页面字段 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return dyn_page_field_model;
}

// MARK: findByIdsDynPageField
/** 根据 ids 查找动态页面字段 */
export async function findByIdsDynPageField(
  ids: DynPageFieldId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel[]> {
  
  const table = getTableNameDynPageField();
  const method = "findByIdsDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || ids.length === 0) {
    return [ ];
  }
  
  const models = await findAllDynPageField(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  const models2 = ids
    .map((id) => models.find((item) => item.id === id))
    .filter((item) => !!item);
  
  return models2;
}

// MARK: findByIdsOkDynPageField
/** 根据 ids 查找动态页面字段, 出现查询不到的 id 则报错 */
export async function findByIdsOkDynPageField(
  ids: DynPageFieldId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageFieldModel[]> {
  
  const table = getTableNameDynPageField();
  const method = "findByIdsOkDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const models = await findByIdsDynPageField(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 动态页面字段 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 动态页面字段 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existDynPageField
/** 根据搜索条件判断动态页面字段是否存在 */
export async function existDynPageField(
  search?: Readonly<DynPageFieldSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameDynPageField();
  const method = "existDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  const model = await findOneDynPageField(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdDynPageField
/** 根据id判断动态页面字段是否存在 */
export async function existByIdDynPageField(
  id?: Readonly<DynPageFieldId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameDynPageField();
  const method = "existByIdDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from base_dyn_page_field t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,
  );
  const result = !!model?.e;
  
  return result;
}

// MARK: validateIsEnabledDynPageField
/** 校验动态页面字段是否启用 */
export async function validateIsEnabledDynPageField(
  model: Readonly<DynPageFieldModel>,
) {
  if (model.is_enabled == 0) {
    throw "动态页面字段 已禁用";
  }
}

// MARK: validateOptionDynPageField
/** 校验动态页面字段是否存在 */
export async function validateOptionDynPageField(
  model?: DynPageFieldModel,
) {
  if (!model) {
    const err_msg = "动态页面字段 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateDynPageField
/** 动态页面字段增加和修改时校验输入 */
export async function validateDynPageField(
  input: Readonly<DynPageFieldInput>,
) {
  const fieldComments = await getFieldCommentsDynPageField();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 编码
  await validators.chars_max_length(
    input.code,
    20,
    fieldComments.code,
  );
  
  // 动态页面
  await validators.chars_max_length(
    input.dyn_page_id,
    22,
    fieldComments.dyn_page_id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    40,
    fieldComments.lbl,
  );
  
  // 类型
  await validators.chars_max_length(
    input.type,
    40,
    fieldComments.type,
  );
  
  // 计算公式
  await validators.chars_max_length(
    input.formula,
    200,
    fieldComments.formula,
  );
  
}

// MARK: findAutoCodeDynPageField
/** 获得 动态页面字段 自动编码 */
export async function findAutoCodeDynPageField(
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameDynPageField();
  const method = "findAutoCodeDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const model = await findOneDynPageField(
    undefined,
    [
      {
        prop: "code_seq",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  
  const model_deleted = await findOneDynPageField(
    {
      is_deleted: 1,
    },
    [
      {
        prop: "code_seq",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  
  let code_seq = (model?.code_seq || 0) + 1;
  const code_seq_deleted = (model_deleted?.code_seq || 0) + 1;
  if (code_seq_deleted > code_seq) {
    code_seq = code_seq_deleted;
  }
  const code = "fld_" + code_seq.toString();
  
  return {
    code_seq,
    code,
  };
}

// MARK: createReturnDynPageField
/** 创建 动态页面字段 并返回 */
export async function createReturnDynPageField(
  input: Readonly<DynPageFieldInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageFieldModel> {
  
  const table = getTableNameDynPageField();
  const method = "createReturnDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  const model = await validateOptionDynPageField(
    await findOneDynPageField(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createDynPageField
/** 创建 动态页面字段 */
export async function createDynPageField(
  input: Readonly<DynPageFieldInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageFieldId> {
  
  const table = getTableNameDynPageField();
  const method = "createDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

// MARK: createsReturnDynPageField
/** 批量创建 动态页面字段 并返回 */
export async function createsReturnDynPageField(
  inputs: DynPageFieldInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageFieldModel[]> {
  
  const table = getTableNameDynPageField();
  const method = "createsReturnDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  const models = await findByIdsDynPageField(ids, options);
  
  return models;
}

// MARK: createsDynPageField
/** 批量创建 动态页面字段 */
export async function createsDynPageField(
  inputs: DynPageFieldInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageFieldId[]> {
  
  const table = getTableNameDynPageField();
  const method = "createsDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: DynPageFieldInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageFieldId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  // 设置自动编码
  for (const input of inputs) {
    if (input.code) {
      continue;
    }
    const {
      code_seq,
      code,
    } = await findAutoCodeDynPageField(options);
    input.code_seq = code_seq;
    input.code = code;
  }
  
  const table = getTableNameDynPageField();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: DynPageFieldId[] = [ ];
  const inputs2: DynPageFieldInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueDynPageField(input, options);
    if (oldModels.length > 0) {
      let id: DynPageFieldId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueDynPageField(
          input,
          oldModel,
          options?.uniqueType,
          options,
        );
        if (id) {
          break;
        }
      }
      if (id) {
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
    const id = shortUuidV4<DynPageFieldId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into base_dyn_page_field(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,code_seq,code,dyn_page_id,lbl,type,attrs,formula,is_required,is_search,width,align,is_enabled,order_by)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (!is_silent_mode) {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,${ args.push(reqDate()) }`;
        }
      } else {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,null`;
        }
      }
      if (input.update_time != null || input.update_time_save_null) {
        sql += `,${ args.push(input.update_time) }`;
      } else {
        sql += `,null`;
      }
      if (input.tenant_id == null) {
        const usr_id = await get_usr_id();
        const tenant_id = await getTenant_id(usr_id);
        if (tenant_id) {
          sql += `,${ args.push(tenant_id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.tenant_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.tenant_id) }`;
      }
      if (!is_silent_mode) {
        if (input.create_usr_id == null) {
          let usr_id = await get_usr_id();
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id, options);
            if (!usr_model) {
              usr_id = undefined;
            } else {
              usr_lbl = usr_model.lbl;
            }
          }
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
          sql += ",default";
        } else {
          let usr_id: UsrId | undefined = input.create_usr_id;
          let usr_lbl = "";
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
            usr_lbl = "";
          } else {
            usr_lbl = usr_model.lbl;
          }
          if (usr_id) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
        if (input.create_usr_id_lbl == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id_lbl) }`;
        }
      }
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.update_usr_id_lbl != null) {
        sql += `,${ args.push(input.update_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.code_seq != null) {
        sql += `,${ args.push(input.code_seq) }`;
      } else {
        sql += ",default";
      }
      if (input.code != null) {
        sql += `,${ args.push(input.code) }`;
      } else {
        sql += ",default";
      }
      if (input.dyn_page_id != null) {
        sql += `,${ args.push(input.dyn_page_id) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.type != null) {
        sql += `,${ args.push(input.type) }`;
      } else {
        sql += ",default";
      }
      if (input.attrs != null) {
        sql += `,${ args.push(input.attrs) }`;
      } else {
        sql += ",default";
      }
      if (input.formula != null) {
        sql += `,${ args.push(input.formula) }`;
      } else {
        sql += ",default";
      }
      if (input.is_required != null) {
        sql += `,${ args.push(input.is_required) }`;
      } else {
        sql += ",default";
      }
      if (input.is_search != null) {
        sql += `,${ args.push(input.is_search) }`;
      } else {
        sql += ",default";
      }
      if (input.width != null) {
        sql += `,${ args.push(input.width) }`;
      } else {
        sql += ",default";
      }
      if (input.align != null) {
        sql += `,${ args.push(input.align) }`;
      } else {
        sql += ",default";
      }
      if (input.is_enabled != null) {
        sql += `,${ args.push(input.is_enabled) }`;
      } else {
        sql += ",default";
      }
      if (input.order_by != null) {
        sql += `,${ args.push(input.order_by) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  return ids2;
}

// MARK: updateTenantByIdDynPageField
/** 动态页面字段 根据 id 修改 租户id */
export async function updateTenantByIdDynPageField(
  id: DynPageFieldId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "updateTenantByIdDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id } `;
    }
    if (tenant_id) {
      msg += ` tenant_id:${ tenant_id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const tenantExist = await existByIdTenant(tenant_id, options);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update base_dyn_page_field set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdDynPageField
/** 根据 id 修改 动态页面字段 */
export async function updateByIdDynPageField(
  id: DynPageFieldId,
  input: DynPageFieldInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<DynPageFieldId> {
  
  const table = getTableNameDynPageField();
  const method = "updateByIdDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    throw new Error("updateByIdDynPageField: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdDynPageField: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdDynPageField(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueDynPageField(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "动态页面字段 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdDynPageField(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 动态页面字段 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update base_dyn_page_field set `;
  let updateFldNum = 0;
  if (input.code_seq != null) {
    if (input.code_seq != oldModel.code_seq) {
      sql += `code_seq=${ args.push(input.code_seq) },`;
      updateFldNum++;
    }
  }
  if (input.code != null) {
    if (input.code != oldModel.code) {
      sql += `code=${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.dyn_page_id != null) {
    if (input.dyn_page_id != oldModel.dyn_page_id) {
      sql += `dyn_page_id=${ args.push(input.dyn_page_id) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.type != null) {
    if (input.type != oldModel.type) {
      sql += `type=${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.attrs != null) {
    if (input.attrs != oldModel.attrs) {
      sql += `attrs=${ args.push(input.attrs) },`;
      updateFldNum++;
    }
  }
  if (input.formula != null) {
    if (input.formula != oldModel.formula) {
      sql += `formula=${ args.push(input.formula) },`;
      updateFldNum++;
    }
  }
  if (input.is_required != null) {
    if (input.is_required != oldModel.is_required) {
      sql += `is_required=${ args.push(input.is_required) },`;
      updateFldNum++;
    }
  }
  if (input.is_search != null) {
    if (input.is_search != oldModel.is_search) {
      sql += `is_search=${ args.push(input.is_search) },`;
      updateFldNum++;
    }
  }
  if (input.width != null) {
    if (input.width != oldModel.width) {
      sql += `width=${ args.push(input.width) },`;
      updateFldNum++;
    }
  }
  if (input.align != null) {
    if (input.align != oldModel.align) {
      sql += `align=${ args.push(input.align) },`;
      updateFldNum++;
    }
  }
  if (input.is_enabled != null) {
    if (input.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled=${ args.push(input.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (input.order_by != null) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by=${ args.push(input.order_by) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.create_usr_id_lbl)) {
    sql += `create_usr_id_lbl=?,`;
    args.push(input.create_usr_id_lbl);
    updateFldNum++;
  }
  if (input.create_usr_id != null) {
    if (input.create_usr_id != oldModel.create_usr_id) {
      sql += `create_usr_id=${ args.push(input.create_usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.create_time != null) {
    if (input.create_time != oldModel.create_time) {
      sql += `create_time=${ args.push(input.create_time) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        let usr_id = await get_usr_id();
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
        if (usr_lbl) {
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      } else if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
        let usr_id: UsrId | undefined = input.update_usr_id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      }
    } else {
      if (input.update_usr_id != null) {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
      if (input.update_usr_id_lbl != null) {
        sql += `update_usr_id_lbl=${ args.push(input.update_usr_id_lbl) },`;
      }
    }
    if (!is_silent_mode && !is_creating) {
      if (input.update_time != null || input.update_time_save_null) {
        sql += `update_time=${ args.push(input.update_time) },`;
      } else {
        sql += `update_time=${ args.push(reqDate()) },`;
      }
    } else if (input.update_time != null || input.update_time_save_null) {
      sql += `update_time=${ args.push(input.update_time) },`;
    }
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    if (sqlSetFldNum > 0) {
      const is_debug = getParsedEnv("database_debug_sql") === "true";
      await execute(
        sql,
        args,
        {
          debug: is_debug,
        },
      );
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsDynPageField
/** 根据 ids 删除 动态页面字段 */
export async function deleteByIdsDynPageField(
  ids: DynPageFieldId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "deleteByIdsDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdDynPageField(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update base_dyn_page_field set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      let usr_id = await get_usr_id();
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }
      let usr_lbl = "";
      if (usr_id) {
        const usr_model = await findByIdUsr(usr_id, options);
        if (!usr_model) {
          usr_id = undefined;
        } else {
          usr_lbl = usr_model.lbl;
        }
      }
      if (usr_lbl) {
        sql += `,delete_usr_id_lbl=${ args.push(usr_lbl) }`;
      }
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(
      sql,
      args,
      {
        debug: is_debug_sql,
      },
    );
    affectedRows += res.affectedRows;
  }
  
  return affectedRows;
}

// MARK: getIsEnabledByIdDynPageField
/** 根据 id 查找 动态页面字段 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledByIdDynPageField(
  id: DynPageFieldId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findByIdDynPageField(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIdsDynPageField
/** 根据 ids 启用或者禁用 动态页面字段 */
export async function enableByIdsDynPageField(
  ids: DynPageFieldId[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "enableByIdsDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (is_enabled != null) {
      msg += ` is_enabled:${ is_enabled }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update base_dyn_page_field set is_enabled=${ args.push(is_enabled) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

// MARK: revertByIdsDynPageField
/** 根据 ids 还原 动态页面字段 */
export async function revertByIdsDynPageField(
  ids: DynPageFieldId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "revertByIdsDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOneDynPageField(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdDynPageField(
        id,
        options,
      );
    }
    if (!old_model) {
      continue;
    }
    {
      const input = {
        ...old_model,
        id: undefined,
      } as DynPageFieldInput;
      const models = await findByUniqueDynPageField(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "动态页面字段 重复";
      }
    }
    const args = new QueryArgs();
    const sql = `update base_dyn_page_field set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsDynPageField
/** 根据 ids 彻底删除 动态页面字段 */
export async function forceDeleteByIdsDynPageField(
  ids: DynPageFieldId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "forceDeleteByIdsDynPageField";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneDynPageField(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (oldModel && !is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from base_dyn_page_field where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: findLastOrderByDynPageField
/** 查找 动态页面字段 order_by 字段的最大值 */
export async function findLastOrderByDynPageField(
  search?: Readonly<DynPageFieldSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageField();
  const method = "findLastOrderByDynPageField";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let sql = `select t.order_by from base_dyn_page_field t`;
  const args = new QueryArgs();
  const whereQuery = await getWhereQuery(
    args,
    search,
  );
  if (whereQuery) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` order by t.order_by desc limit 1`;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  let result = model?.order_by ?? 0;
  
  return result;
}
