// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import {
  escapeId,
} from "sqlstring";

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
  delCache as delCacheCtx,
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";

import {
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
  hash,
} from "/lib/util/string_util.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
  get_lang_id,
} from "/lib/auth/auth.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
  DictType,
} from "/gen/types.ts";

import {
  findAll as findAllDictDetail,
  create as createDictDetail,
  deleteByIds as deleteByIdsDictDetail,
  revertByIds as revertByIdsDictDetail,
  updateById as updateByIdDictDetail,
  forceDeleteByIds as forceDeleteByIdsDictDetail,
} from "/gen/base/dict_detail/dict_detail.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./dict.model.ts";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<DictSearch>,
  options?: {
  },
): Promise<string> {
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.code != null) {
    whereQuery += ` and t.code=${ args.push(search.code) }`;
  }
  if (isNotEmpty(search?.code_like)) {
    whereQuery += ` and t.code like ${ args.push("%" + sqlLike(search?.code_like) + "%") }`;
  }
  if (search?.lbl != null) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.lbl=${ args.push(search.lbl) } or base_dict_lang.lbl=${ args.push(search.lbl) })`;
    } else {
      whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
    }
  }
  if (isNotEmpty(search?.lbl_like)) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") } or base_dict_lang.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") })`;
    } else {
      whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
    }
  }
  if (search?.type != null) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.is_locked != null) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.order_by != null) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by>=${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by<=${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.rem != null) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.rem=${ args.push(search.rem) } or base_dict_lang.rem=${ args.push(search.rem) })`;
    } else {
      whereQuery += ` and t.rem=${ args.push(search.rem) }`;
    }
  }
  if (isNotEmpty(search?.rem_like)) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") } or base_dict_lang.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") })`;
    } else {
      whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
    }
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and t.create_usr_id_lbl in ${ args.push(search.create_usr_id_lbl) }`;
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
    whereQuery += ` and t.update_usr_id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
  }
  if (search?.update_usr_id_lbl != null) {
    whereQuery += ` and t.update_usr_id_lbl in ${ args.push(search.update_usr_id_lbl) }`;
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

async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<DictSearch>,
  options?: {
  },
) {
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  let fromQuery = `base_dict t`;
  
  if (server_i18n_enable) {
    fromQuery += ` left join base_dict_lang on base_dict_lang.dict_id=t.id and base_dict_lang.lang_id=${ args.push(await get_lang_id()) }`;
  }
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找系统字典总数 */
export async function findCount(
  search?: Readonly<DictSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "findCount";
  
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
  
  const args = new QueryArgs();
  let sql = `select count(1) total from (select 1 from ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAll
/** 根据搜索条件和分页查找系统字典列表 */
export async function findAll(
  search?: Readonly<DictSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput | SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<DictModel[]> {
  
  const table = "base_dict";
  const method = "findAll";
  
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
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  // 数据类型
  if (search && search.type != null) {
    const len = search.type.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.type.length > ${ ids_limit }`);
    }
  }
  // 锁定
  if (search && search.is_locked != null) {
    const len = search.is_locked.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_locked.length > ${ ids_limit }`);
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
  
  let lang_sql = "";
  
  if (server_i18n_enable) {
    lang_sql += ",max(base_dict_lang.lbl) lbl_lang";
    lang_sql += ",max(base_dict_lang.rem) rem_lang";
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ${ lang_sql }
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "order_by",
        order: SortOrderEnum.Asc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
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
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<DictModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },
  );
  
  const [
    typeDict, // 数据类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "dict_type",
    "is_locked",
    "is_enabled",
  ]);
  
  // 系统字典明细
  const dict_detail_models = await findAllDictDetail(
    {
      dict_id: result.map((item) => item.id),
      is_deleted: search?.is_deleted,
    },
    undefined,
    undefined,
    options,
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    if (server_i18n_enable) {
      
      // deno-lint-ignore no-explicit-any
      if ((model as any).lbl_lang) {
        // deno-lint-ignore no-explicit-any
        model.lbl = (model as any).lbl_lang;
        // deno-lint-ignore no-explicit-any
        (model as any).lbl_lang = undefined;
      }
      
      // deno-lint-ignore no-explicit-any
      if ((model as any).rem_lang) {
        // deno-lint-ignore no-explicit-any
        model.rem = (model as any).rem_lang;
        // deno-lint-ignore no-explicit-any
        (model as any).rem_lang = undefined;
      }
    }
    
    // 数据类型
    let type_lbl = model.type as string;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl || "";
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked != null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === String(model.is_locked));
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl || "";
    
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
      if (isNaN(create_time.toDate().getTime())) {
        model.create_time_lbl = (model.create_time || "").toString();
      } else {
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (isNaN(update_time.toDate().getTime())) {
        model.update_time_lbl = (model.update_time || "").toString();
      } else {
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.update_time_lbl = "";
    }
    
    // 系统字典明细
    model.dict_detail = dict_detail_models
      .filter((item) => item.dict_id === model.id);
  }
  
  return result;
}

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: DictInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    typeDict, // 数据类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "dict_type",
    "is_locked",
    "is_enabled",
  ]);
  
  // 数据类型
  if (isNotEmpty(input.type_lbl) && input.type == null) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === input.type_lbl)?.val;
    if (val != null) {
      input.type = val as DictType;
    }
  } else if (isEmpty(input.type_lbl) && input.type != null) {
    const lbl = typeDict.find((itemTmp) => itemTmp.val === input.type)?.lbl || "";
    input.type_lbl = lbl;
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked == null) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val != null) {
      input.is_locked = Number(val);
    }
  } else if (isEmpty(input.is_locked_lbl) && input.is_locked != null) {
    const lbl = is_lockedDict.find((itemTmp) => itemTmp.val === String(input.is_locked))?.lbl || "";
    input.is_locked_lbl = lbl;
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

// MARK: getFieldComments
/** 获取系统字典字段注释 */
export async function getFieldComments(): Promise<DictFieldComment> {
  const n = initN(route_path);
  const fieldComments: DictFieldComment = {
    id: await n("ID"),
    code: await n("编码"),
    lbl: await n("名称"),
    type: await n("数据类型"),
    type_lbl: await n("数据类型"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
    rem: await n("备注"),
    create_usr_id: await n("创建人"),
    create_usr_id_lbl: await n("创建人"),
    create_time: await n("创建时间"),
    create_time_lbl: await n("创建时间"),
    update_usr_id: await n("更新人"),
    update_usr_id_lbl: await n("更新人"),
    update_time: await n("更新时间"),
    update_time_lbl: await n("更新时间"),
  };
  return fieldComments;
}

// MARK: findByUnique
/** 通过唯一约束获得系统字典列表 */
export async function findByUnique(
  search0: Readonly<DictInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<DictModel[]> {
  
  const table = "base_dict";
  const method = "findByUnique";
  
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
    const model = await findOne(
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
  const models: DictModel[] = [ ];
  {
    if (search0.code == null) {
      return [ ];
    }
    const code = search0.code;
    const modelTmps = await findAll(
      {
        code,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll(
      {
        lbl,
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
export function equalsByUnique(
  oldModel: Readonly<DictModel>,
  input: Readonly<DictInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.code === input.code
  ) {
    return true;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUnique
/** 通过唯一约束检查 系统字典 是否已经存在 */
export async function checkByUnique(
  input: Readonly<DictInput>,
  oldModel: Readonly<DictModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<DictId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("系统字典")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: DictId = await updateById(
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

// MARK: findOne
/** 根据条件查找第一系统字典 */
export async function findOne(
  search?: Readonly<DictSearch>,
  sort?: SortInput | SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DictModel | undefined> {
  
  const table = "base_dict";
  const method = "findOne";
  
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
  
  if (search && search.ids && search.ids.length === 0) {
    return;
  }
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(
    search,
    page,
    sort,
    options,
  );
  const model = models[0];
  return model;
}

// MARK: findById
/** 根据 id 查找系统字典 */
export async function findById(
  id?: DictId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<DictModel | undefined> {
  
  const table = "base_dict";
  const method = "findById";
  
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
  
  const model = await findOne(
    {
      id,
    },
    undefined,
    options,
  );
  
  return model;
}

// MARK: findByIds
/** 根据 ids 查找系统字典 */
export async function findByIds(
  ids: DictId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DictModel[]> {
  
  const table = "base_dict";
  const method = "findByIds";
  
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
  
  const models = await findAll(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  if (models.length !== ids.length) {
    throw new Error("findByIds: models.length !== ids.length");
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      throw new Error(`findByIds: id: ${ id } not found`);
    }
    return model;
  });
  
  return models2;
}

// MARK: exist
/** 根据搜索条件判断系统字典是否存在 */
export async function exist(
  search?: Readonly<DictSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "base_dict";
  const method = "exist";
  
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
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existById
/** 根据id判断系统字典是否存在 */
export async function existById(
  id?: Readonly<DictId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "base_dict";
  const method = "existById";
  
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
  const sql = `select 1 e from base_dict t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const queryOptions = {
    cacheKey1,
    cacheKey2,
  };
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,
    queryOptions,
  );
  const result = !!model?.e;
  
  return result;
}

// MARK: validateIsEnabled
/** 校验系统字典是否启用 */
export async function validateIsEnabled(
  model: Readonly<DictModel>,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("系统字典") } ${ await ns("已禁用") }`;
  }
}

// MARK: validateOption
/** 校验系统字典是否存在 */
export async function validateOption(
  model?: DictModel,
) {
  if (!model) {
    const err_msg = `${ await ns("系统字典") } ${ await ns("不存在") }`;
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 系统字典增加和修改时校验输入 */
export async function validate(
  input: Readonly<DictInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 编码
  await validators.chars_max_length(
    input.code,
    50,
    fieldComments.code,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    200,
    fieldComments.lbl,
  );
  
  // 数据类型
  await validators.chars_max_length(
    input.type,
    22,
    fieldComments.type,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
  // 创建人
  await validators.chars_max_length(
    input.create_usr_id,
    22,
    fieldComments.create_usr_id,
  );
  
  // 更新人
  await validators.chars_max_length(
    input.update_usr_id,
    22,
    fieldComments.update_usr_id,
  );
  
}

// MARK: create
/** 创建 系统字典 */
export async function create(
  input: Readonly<DictInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DictId> {
  
  const table = "base_dict";
  const method = "create";
  
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

// MARK: creates
/** 批量创建 系统字典 */
export async function creates(
  inputs: DictInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DictId[]> {
  
  const table = "base_dict";
  const method = "creates";
  
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
  inputs: DictInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DictId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "base_dict";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: DictId[] = [ ];
  const inputs2: DictInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: DictId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUnique(
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
    
    const id = shortUuidV4<DictId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = "insert into base_dict(id,create_time,update_time,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,code,lbl,type,is_locked,is_enabled,order_by,rem,is_sys)values";
  
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
      if (input.code != null) {
        sql += `,${ args.push(input.code) }`;
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
      if (input.is_locked != null) {
        sql += `,${ args.push(input.is_locked) }`;
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
      if (input.rem != null) {
        sql += `,${ args.push(input.rem) }`;
      } else {
        sql += ",default";
      }
      if (input.is_sys != null) {
        sql += `,${ args.push(input.is_sys) }`;
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
  
  for (const input of inputs) {
    await refreshLangByInput(input);
  }
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
    
    // 系统字典明细
    const dict_detail_input = input.dict_detail;
    if (dict_detail_input && dict_detail_input.length > 0) {
      for (let i = 0; i < dict_detail_input.length; i++) {
        const model = dict_detail_input[i];
        model.dict_id = input.id;
        await createDictDetail(model, options);
      }
    }
  }
  
  await delCache();
  
  return ids2;
}

// MARK: delCache
/** 删除缓存 */
export async function delCache() {
  await delCacheCtx(`dao.sql.base_dict`);
}

async function refreshLangByInput(
  input: Readonly<DictInput>,
) {
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  if (!server_i18n_enable) {
    return;
  }
  const lang_sql = "select id from base_dict_lang where lang_id=? and dict_id=?";
  const lang_args = new QueryArgs();
  lang_args.push(await get_lang_id());
  lang_args.push(input.id);
  const model = await queryOne<{ id: string }>(
    lang_sql,
    lang_args,
  );
  const lang_id = model?.id;
  if (lang_id) {
    let lang_sql = "update base_dict_lang set ";
    const lang_args = new QueryArgs();
    // 名称
    if (input.lbl != null) {
      lang_sql += "lbl=?,";
      lang_args.push(input.lbl);
    }
    // 备注
    if (input.rem != null) {
      lang_sql += "rem=?,";
      lang_args.push(input.rem);
    }
    if (lang_sql.endsWith(",")) {
      lang_sql = lang_sql.substring(0, lang_sql.length - 1);
    }
    lang_sql += " where id=?";
    lang_args.push(lang_id);
    await execute(lang_sql, lang_args);
  } else {
    const sql_fields: string[] = [ ];
    const lang_args = new QueryArgs();
    lang_args.push(shortUuidV4());
    lang_args.push(await get_lang_id());
    lang_args.push(input.id);
    // 名称
    if (input.lbl != null) {
      sql_fields.push("lbl");
      lang_args.push(input.lbl);
    }
    // 备注
    if (input.rem != null) {
      sql_fields.push("rem");
      lang_args.push(input.rem);
    }
    let lang_sql = "insert into base_dict_lang(id,lang_id,dict_id";
    for (const sql_field of sql_fields) {
      lang_sql += "," + sql_field;
    }
    lang_sql += ")values(?,?,?";
    for (let i = 0; i < sql_fields.length; i++) {
      lang_sql += ",?";
    }
    lang_sql += ")";
    await execute(lang_sql, lang_args);
  }
}

// MARK: updateById
/** 根据 id 修改 系统字典 */
export async function updateById(
  id: DictId,
  input: DictInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<DictId> {
  
  const table = "base_dict";
  const method = "updateById";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
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
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("系统字典"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("系统字典"));
  }
  
  const args = new QueryArgs();
  let sql = `update base_dict set `;
  let updateFldNum = 0;
  if (input.code != null) {
    if (input.code != oldModel.code) {
      sql += `code=${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      if (!server_i18n_enable) {
        sql += `lbl=${ args.push(input.lbl) },`;
      }
      updateFldNum++;
    }
  }
  if (input.type != null) {
    if (input.type != oldModel.type) {
      sql += `type=${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked != null) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked=${ args.push(input.is_locked) },`;
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
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      if (!server_i18n_enable) {
        sql += `rem=${ args.push(input.rem) },`;
      }
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
  if (input.create_time != null || input.create_time_save_null) {
    if (input.create_time != oldModel.create_time) {
      sql += `create_time=${ args.push(input.create_time) },`;
      updateFldNum++;
    }
  }
  if (input.is_sys != null) {
    if (input.is_sys != oldModel.is_sys) {
      sql += `is_sys=${ args.push(input.is_sys) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  // 系统字典明细
  const dict_detail_input = input.dict_detail;
  if (dict_detail_input) {
    const dict_detail_models = await findAllDictDetail(
      {
        dict_id: [ id ],
      },
      undefined,
      undefined,
      options,
    );
    if (dict_detail_models.length > 0 && dict_detail_input.length > 0) {
      updateFldNum++;
    }
    for (let i = 0; i < dict_detail_models.length; i++) {
      const model = dict_detail_models[i];
      if (dict_detail_input.some((item) => item.id === model.id)) {
        continue;
      }
      await deleteByIdsDictDetail(
        [ model.id ],
        options,
      );
    }
    for (let i = 0; i < dict_detail_input.length; i++) {
      const model = dict_detail_input[i];
      if (!model.id) {
        model.dict_id = id;
        await createDictDetail(
          model,
          options,
        );
        continue;
      }
      if (dict_detail_models.some((item) => item.id === model.id)) {
        await revertByIdsDictDetail(
          [ model.id ],
          options,
        );
      }
      await updateByIdDictDetail(
        model.id,
        {
          ...model,
          id: undefined,
        },
        options,
      );
    }
  }
  
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
    
    await delCache();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
      if (server_i18n_enable) {
        await refreshLangByInput({
          ...input,
          id,
        });
      }
    }
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 系统字典 */
export async function deleteByIds(
  ids: DictId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "deleteByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
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
  
  await delCache();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update base_dict set is_deleted=1`;
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
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
    if (server_i18n_enable) {
      const sql = "update base_dict_lang set is_deleted=1 where dict_id=?";
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }
  }
  
  // 系统字典明细
  const dict_detail = await findAllDictDetail(
    {
      dict_id: ids,
    },
    undefined,
    undefined,
    options,
  );
  await deleteByIdsDictDetail(
    dict_detail.map((item) => item.id),
    options,
  );
  
  await delCache();
  
  return affectedRows;
}

// MARK: getIsEnabledById
/** 根据 id 查找 系统字典 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledById(
  id: DictId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIds
/** 根据 ids 启用或者禁用 系统字典 */
export async function enableByIds(
  ids: DictId[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "enableByIds";
  
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
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  const sql = `update base_dict set is_enabled=${ args.push(is_enabled) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

// MARK: getIsLockedById
/** 根据 id 查找 系统字典 是否已锁定, 不存在则返回 undefined, 已锁定的不能修改和删除 */
export async function getIsLockedById(
  id: DictId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  
  return is_locked;
}

// MARK: lockByIds
/** 根据 ids 锁定或者解锁 系统字典 */
export async function lockByIds(
  ids: DictId[],
  is_locked: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "lockByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (is_locked != null) {
      msg += ` is_locked:${ is_locked }`;
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
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = `update base_dict set is_locked=${ args.push(is_locked) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

// MARK: revertByIds
/** 根据 ids 还原 系统字典 */
export async function revertByIds(
  ids: DictId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "revertByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOne(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findById(
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
      } as DictInput;
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw await ns("此 {0} 已经存在", await ns("系统字典"));
      }
    }
    const args = new QueryArgs();
    const sql = `update base_dict set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    if (server_i18n_enable) {
      const sql = "update base_dict_lang set is_deleted=0 where dict_id=?";
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }
  }
  
  // 系统字典明细
  const dict_detail_models = await findAllDictDetail(
    {
      dict_id: ids,
      is_deleted: 1,
    },
    undefined,
    undefined,
    options,
  );
  await revertByIdsDictDetail(
    dict_detail_models.map((item) => item.id),
    options,
  );
  
  await delCache();
  
  return num;
}

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 系统字典 */
export async function forceDeleteByIds(
  ids: DictId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "forceDeleteByIds";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_debug = get_is_debug(options?.is_debug);
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOne(
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
    const sql = `delete from base_dict where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    if (server_i18n_enable) {
      const sql = "delete from base_dict_lang where dict_id=?";
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }
  }
  
  // 系统字典明细
  const dict_detail_models = await findAllDictDetail(
    {
      dict_id: ids,
      is_deleted: 1,
    },
    undefined,
    undefined,
    options,
  );
  await forceDeleteByIdsDictDetail(
    dict_detail_models.map((item) => item.id),
    options,
  );
  
  await delCache();
  
  return num;
}

// MARK: findLastOrderBy
/** 查找 系统字典 order_by 字段的最大值 */
export async function findLastOrderBy(
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_dict";
  const method = "findLastOrderBy";
  
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
  
  let sql = `select t.order_by order_by from base_dict t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += ` order by t.order_by desc limit 1`;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(sql, args);
  let result = model?.order_by ?? 0;
  
  return result;
}
