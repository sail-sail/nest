// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
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

import {
  deepCompare,
} from "/lib/util/object_util.ts";

import * as validators from "/lib/validators/mod.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOne as findOneWxoApp,
} from "/gen/wx/wxo_app/wxo_app.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

const route_path = "/wx/wxo_app_token";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxoAppTokenSearch>,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.wxo_app_id != null) {
    whereQuery += ` and t.wxo_app_id in ${ args.push(search.wxo_app_id) }`;
  }
  if (search?.wxo_app_id_is_null) {
    whereQuery += ` and t.wxo_app_id is null`;
  }
  if (search?.wxo_app_id_lbl != null) {
    whereQuery += ` and wxo_app_id_lbl.lbl in ${ args.push(search.wxo_app_id_lbl) }`;
  }
  if (search?.access_token != null) {
    whereQuery += ` and t.access_token=${ args.push(search.access_token) }`;
  }
  if (isNotEmpty(search?.access_token_like)) {
    whereQuery += ` and t.access_token like ${ args.push("%" + sqlLike(search?.access_token_like) + "%") }`;
  }
  if (search?.token_time != null) {
    if (search.token_time[0] != null) {
      whereQuery += ` and t.token_time>=${ args.push(search.token_time[0]) }`;
    }
    if (search.token_time[1] != null) {
      whereQuery += ` and t.token_time<=${ args.push(search.token_time[1]) }`;
    }
  }
  if (search?.expires_in != null) {
    if (search.expires_in[0] != null) {
      whereQuery += ` and t.expires_in>=${ args.push(search.expires_in[0]) }`;
    }
    if (search.expires_in[1] != null) {
      whereQuery += ` and t.expires_in<=${ args.push(search.expires_in[1]) }`;
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
  search?: Readonly<WxoAppTokenSearch>,
  options?: {
  },
) {
  let fromQuery = `wx_wxo_app_token t
    left join wx_wxo_app wxo_app_id_lbl on wxo_app_id_lbl.id=t.wxo_app_id`;
  return fromQuery;
}

/**
 * 根据条件查找小程序接口凭据总数
 * @param { WxoAppTokenSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: Readonly<WxoAppTokenSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_app_token";
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

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 * @param {WxoAppTokenSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: Readonly<WxoAppTokenSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput | SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxoAppTokenModel[]> {
  
  const table = "wx_wxo_app_token";
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
  // 小程序设置
  if (search && search.wxo_app_id != null) {
    const len = search.wxo_app_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.wxo_app_id.length > ${ ids_limit }`);
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
      ,wxo_app_id_lbl.lbl wxo_app_id_lbl
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
        prop: "create_time",
        order: SortOrderEnum.Desc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "create_time",
    order: SortOrderEnum.Desc,
  });
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
  
  const result = await query<WxoAppTokenModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 小程序设置
    model.wxo_app_id_lbl = model.wxo_app_id_lbl || "";
    
    // 令牌创建时间
    if (model.token_time) {
      const token_time = dayjs(model.token_time);
      if (isNaN(token_time.toDate().getTime())) {
        model.token_time_lbl = (model.token_time || "").toString();
      } else {
        model.token_time_lbl = token_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.token_time_lbl = "";
    }
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxoAppTokenInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 令牌创建时间
  if (!input.token_time && input.token_time_lbl) {
    const token_time_lbl = dayjs(input.token_time_lbl);
    if (token_time_lbl.isValid()) {
      input.token_time = token_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.token_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.token_time) {
    const token_time = dayjs(input.token_time);
    if (!token_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.token_time } ${ await ns("日期格式错误") }`;
    }
    input.token_time = dayjs(input.token_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  // 小程序设置
  if (isNotEmpty(input.wxo_app_id_lbl) && input.wxo_app_id == null) {
    input.wxo_app_id_lbl = String(input.wxo_app_id_lbl).trim();
    const wxo_appModel = await findOneWxoApp(
      {
        lbl: input.wxo_app_id_lbl,
      },
      undefined,
      options,
    );
    if (wxo_appModel) {
      input.wxo_app_id = wxo_appModel.id;
    }
  }
  
  // 令牌创建时间
  if (isNotEmpty(input.token_time_lbl) && input.token_time == null) {
    input.token_time_lbl = String(input.token_time_lbl).trim();
    input.token_time = input.token_time_lbl;
  }
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxoAppTokenFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxoAppTokenFieldComment = {
    id: await n("ID"),
    wxo_app_id: await n("小程序设置"),
    wxo_app_id_lbl: await n("小程序设置"),
    access_token: await n("令牌"),
    token_time: await n("令牌创建时间"),
    token_time_lbl: await n("令牌创建时间"),
    expires_in: await n("令牌超时时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得小程序接口凭据列表
 * @param {WxoAppTokenInput} search0
 */
export async function findByUnique(
  search0: Readonly<WxoAppTokenInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoAppTokenModel[]> {
  
  const table = "wx_wxo_app_token";
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
  const models: WxoAppTokenModel[] = [ ];
  {
    if (search0.wxo_app_id == null) {
      return [ ];
    }
    let wxo_app_id: WxoAppId[] = [ ];
    if (!Array.isArray(search0.wxo_app_id) && search0.wxo_app_id != null) {
      wxo_app_id = [ search0.wxo_app_id, search0.wxo_app_id ];
    } else {
      wxo_app_id = search0.wxo_app_id || [ ];
    }
    const modelTmps = await findAll(
      {
        wxo_app_id,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxoAppTokenModel} oldModel
 * @param {WxoAppTokenInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: Readonly<WxoAppTokenModel>,
  input: Readonly<WxoAppTokenInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.wxo_app_id === input.wxo_app_id
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查小程序接口凭据是否已经存在
 * @param {WxoAppTokenInput} input
 * @param {WxoAppTokenModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxoAppTokenId | undefined>}
 */
export async function checkByUnique(
  input: Readonly<WxoAppTokenInput>,
  oldModel: Readonly<WxoAppTokenModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoAppTokenId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("小程序接口凭据")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxoAppTokenId = await updateById(
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

/**
 * 根据条件查找第一个小程序接口凭据
 * @param {WxoAppTokenSearch} search?
 */
export async function findOne(
  search?: Readonly<WxoAppTokenSearch>,
  sort?: SortInput | SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoAppTokenModel | undefined> {
  
  const table = "wx_wxo_app_token";
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

/**
 * 根据 id 查找小程序接口凭据
 * @param {WxoAppTokenId} id
 */
export async function findById(
  id?: WxoAppTokenId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoAppTokenModel | undefined> {
  
  const table = "wx_wxo_app_token";
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

/** 根据 ids 查找小程序接口凭据 */
export async function findByIds(
  ids: WxoAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoAppTokenModel[]> {
  
  const table = "wx_wxo_app_token";
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

/**
 * 根据搜索条件判断小程序接口凭据是否存在
 * @param {WxoAppTokenSearch} search?
 */
export async function exist(
  search?: Readonly<WxoAppTokenSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wx_wxo_app_token";
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

/**
 * 根据id判断小程序接口凭据是否存在
 * @param {WxoAppTokenId} id
 */
export async function existById(
  id?: Readonly<WxoAppTokenId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wx_wxo_app_token";
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
  const sql = `select 1 e from wx_wxo_app_token t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

/** 校验小程序接口凭据是否存在 */
export async function validateOption(
  model?: WxoAppTokenModel,
) {
  if (!model) {
    throw `${ await ns("小程序接口凭据") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 小程序接口凭据增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: Readonly<WxoAppTokenInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 小程序设置
  await validators.chars_max_length(
    input.wxo_app_id,
    22,
    fieldComments.wxo_app_id,
  );
  
  // 令牌
  await validators.chars_max_length(
    input.access_token,
    600,
    fieldComments.access_token,
  );
  
}

/**
 * 创建小程序接口凭据
 * @param {WxoAppTokenInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxoAppTokenId>} 
 */
export async function create(
  input: Readonly<WxoAppTokenInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoAppTokenId> {
  
  const table = "wx_wxo_app_token";
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

/**
 * 批量创建小程序接口凭据
 * @param {WxoAppTokenInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxoAppTokenId[]>} 
 */
export async function creates(
  inputs: WxoAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoAppTokenId[]> {
  
  const table = "wx_wxo_app_token";
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
  inputs: WxoAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoAppTokenId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wx_wxo_app_token";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxoAppTokenId[] = [ ];
  const inputs2: WxoAppTokenInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: WxoAppTokenId | undefined = undefined;
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
    
    const id = shortUuidV4<WxoAppTokenId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wx_wxo_app_token(id`;
  sql += ",create_time";
  sql += ",update_time";
  sql += ",create_usr_id";
  sql += ",create_usr_id_lbl";
  sql += ",update_usr_id";
  sql += ",update_usr_id_lbl";
  sql += ",wxo_app_id";
  sql += ",access_token";
  sql += ",token_time";
  sql += ",expires_in";
  sql += ")values";
  
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
          const authModel = await getAuthModel();
          let usr_id: UsrId | undefined = authModel?.id;
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
      if (input.wxo_app_id != null) {
        sql += `,${ args.push(input.wxo_app_id) }`;
      } else {
        sql += ",default";
      }
      if (input.access_token != null) {
        sql += `,${ args.push(input.access_token) }`;
      } else {
        sql += ",default";
      }
      if (input.token_time != null || input.token_time_save_null) {
        sql += `,${ args.push(input.token_time) }`;
      } else {
        sql += ",default";
      }
      if (input.expires_in != null) {
        sql += `,${ args.push(input.expires_in) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  await delCache();
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug: is_debug_sql,
  });
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
  }
  
  await delCache();
  
  return ids2;
}

/**
 * 删除缓存
 */
export async function delCache() {
  await delCacheCtx(`dao.sql.wx_wxo_app_token`);
}

/**
 * 根据 id 修改小程序接口凭据
 * @param {WxoAppTokenId} id
 * @param {WxoAppTokenInput} input
 * @param {({
 *   uniqueType?: Exclude<UniqueType, UniqueType.Update>;
 * })} options? 唯一约束冲突时的处理选项, 默认为 UniqueType.Throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxoAppTokenId>}
 */
export async function updateById(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
  },
): Promise<WxoAppTokenId> {
  
  const table = "wx_wxo_app_token";
  const method = "updateById";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
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
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("小程序接口凭据"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("小程序接口凭据"));
  }
  
  const args = new QueryArgs();
  let sql = `update wx_wxo_app_token set `;
  let updateFldNum = 0;
  if (input.wxo_app_id != null) {
    if (input.wxo_app_id != oldModel.wxo_app_id) {
      sql += `wxo_app_id=${ args.push(input.wxo_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.access_token != null) {
    if (input.access_token != oldModel.access_token) {
      sql += `access_token=${ args.push(input.access_token) },`;
      updateFldNum++;
    }
  }
  if (input.token_time != null || input.token_time_save_null) {
    if (input.token_time != oldModel.token_time) {
      sql += `token_time=${ args.push(input.token_time) },`;
      updateFldNum++;
    }
  }
  if (input.expires_in != null) {
    if (input.expires_in != oldModel.expires_in) {
      sql += `expires_in=${ args.push(input.expires_in) },`;
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
    if (!is_silent_mode) {
      if (input.update_usr_id == null) {
        const authModel = await getAuthModel();
        let usr_id: UsrId | undefined = authModel?.id;
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
          sql += `update_usr_id=${ args.push(authModel.id) },`;
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
    if (!is_silent_mode) {
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
    }
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!is_silent_mode) {
    const newModel = await findById(id, options);
    
    if (!deepCompare(oldModel, newModel)) {
      log(JSON.stringify(oldModel));
    }
  }
  
  return id;
}

/**
 * 根据 ids 删除小程序接口凭据
 * @param {WxoAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxoAppTokenId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_app_token";
  const method = "deleteByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
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
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    let sql = `update wx_wxo_app_token set is_deleted=1`;
    if (!is_silent_mode) {
      const authModel = await getAuthModel();
      let usr_id: UsrId | undefined = authModel?.id;
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }
      let usr_lbl = "";
      if (usr_id) {
        const usr_model = await findByIdUsr(usr_id);
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
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原小程序接口凭据
 * @param {WxoAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxoAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_app_token";
  const method = "revertByIds";
  
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxoAppTokenId = ids[i];
    const args = new QueryArgs();
    const sql = `update wx_wxo_app_token set is_deleted = 0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 检查数据的唯一索引
    {
      const old_model = await findById(
        id,
        options,
      );
      if (!old_model) {
        continue;
      }
      const input = {
        ...old_model,
        id: undefined,
      } as WxoAppTokenInput;
      let models = await findByUnique(input, options);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("小程序接口凭据"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 * @param {WxoAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxoAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_app_token";
  const method = "forceDeleteByIds";
  
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `select * from wx_wxo_app_token where id=${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wx_wxo_app_token where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
