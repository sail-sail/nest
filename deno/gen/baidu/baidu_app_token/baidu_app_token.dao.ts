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
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
  hash,
} from "/lib/util/string_util.ts";

import * as validators from "/lib/validators/mod.ts";

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
} from "/gen/types.ts";

import {
  findOneBaiduApp,
} from "/gen/baidu/baidu_app/baidu_app.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<BaiduAppTokenSearch>,
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
  if (search?.baidu_app_id != null) {
    whereQuery += ` and t.baidu_app_id in (${ args.push(search.baidu_app_id) })`;
  }
  if (search?.baidu_app_id_is_null) {
    whereQuery += ` and t.baidu_app_id is null`;
  }
  if (search?.baidu_app_id_lbl != null) {
    whereQuery += ` and baidu_app_id_lbl.lbl in (${ args.push(search.baidu_app_id_lbl) })`;
  }
  if (isNotEmpty(search?.baidu_app_id_lbl_like)) {
    whereQuery += ` and baidu_app_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.baidu_app_id_lbl_like) + "%") }`;
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
  search?: Readonly<BaiduAppTokenSearch>,
  options?: {
  },
) {
  let fromQuery = `baidu_baidu_app_token t
  left join baidu_baidu_app baidu_app_id_lbl on baidu_app_id_lbl.id=t.baidu_app_id`;
  return fromQuery;
}

// MARK: findCountBaiduAppToken
/** 根据条件查找百度接口凭据总数 */
export async function findCountBaiduAppToken(
  search?: Readonly<BaiduAppTokenSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "baidu_baidu_app_token";
  const method = "findCountBaiduAppToken";
  
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
  // 百度应用
  if (search && search.baidu_app_id != null) {
    const len = search.baidu_app_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.baidu_app_id.length > ${ ids_limit }`);
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
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAllBaiduAppToken
/** 根据搜索条件和分页查找百度接口凭据列表 */
export async function findAllBaiduAppToken(
  search?: Readonly<BaiduAppTokenSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<BaiduAppTokenModel[]> {
  
  const table = "baidu_baidu_app_token";
  const method = "findAllBaiduAppToken";
  
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
  // 百度应用
  if (search && search.baidu_app_id != null) {
    const len = search.baidu_app_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.baidu_app_id.length > ${ ids_limit }`);
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
      ,baidu_app_id_lbl.lbl baidu_app_id_lbl
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
  
  const result = await query<BaiduAppTokenModel>(
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
    
    // 百度应用
    model.baidu_app_id_lbl = model.baidu_app_id_lbl || "";
    
    // 令牌创建时间
    if (model.token_time) {
      const token_time = dayjs(model.token_time);
      if (token_time.isValid()) {
        model.token_time = token_time.format("YYYY-MM-DDTHH:mm:ss");
        model.token_time_lbl = token_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.token_time_lbl = (model.token_time || "").toString();
      }
    } else {
      model.token_time_lbl = "";
    }
    
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

// MARK: setIdByLblBaiduAppToken
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblBaiduAppToken(
  input: BaiduAppTokenInput,
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
      const fieldComments = await getFieldCommentsBaiduAppToken();
      throw `${ fieldComments.token_time } 日期格式错误`;
    }
  }
  if (input.token_time) {
    const token_time = dayjs(input.token_time);
    if (!token_time.isValid()) {
      const fieldComments = await getFieldCommentsBaiduAppToken();
      throw `${ fieldComments.token_time } 日期格式错误`;
    }
    input.token_time = dayjs(input.token_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  // 百度应用
  if (isNotEmpty(input.baidu_app_id_lbl) && input.baidu_app_id == null) {
    input.baidu_app_id_lbl = String(input.baidu_app_id_lbl).trim();
    const baidu_appModel = await findOneBaiduApp(
      {
        lbl: input.baidu_app_id_lbl,
      },
      undefined,
      options,
    );
    if (baidu_appModel) {
      input.baidu_app_id = baidu_appModel.id;
    }
  } else if (isEmpty(input.baidu_app_id_lbl) && input.baidu_app_id != null) {
    const baidu_app_model = await findOneBaiduApp(
      {
        id: input.baidu_app_id,
      },
      undefined,
      options,
    );
    if (baidu_app_model) {
      input.baidu_app_id_lbl = baidu_app_model.lbl;
    }
  }
  
  // 令牌创建时间
  if (isNotEmpty(input.token_time_lbl) && input.token_time == null) {
    input.token_time_lbl = String(input.token_time_lbl).trim();
    input.token_time = input.token_time_lbl;
  }
}

// MARK: getFieldCommentsBaiduAppToken
/** 获取百度接口凭据字段注释 */
export async function getFieldCommentsBaiduAppToken(): Promise<BaiduAppTokenFieldComment> {
  const fieldComments: BaiduAppTokenFieldComment = {
    id: "ID",
    baidu_app_id: "百度应用",
    baidu_app_id_lbl: "百度应用",
    access_token: "令牌",
    token_time: "令牌创建时间",
    token_time_lbl: "令牌创建时间",
    expires_in: "令牌超时时间",
  };
  return fieldComments;
}

// MARK: findByUniqueBaiduAppToken
/** 通过唯一约束获得百度接口凭据列表 */
export async function findByUniqueBaiduAppToken(
  search0: Readonly<BaiduAppTokenInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel[]> {
  
  const table = "baidu_baidu_app_token";
  const method = "findByUniqueBaiduAppToken";
  
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
    const model = await findOneBaiduAppToken(
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
  const models: BaiduAppTokenModel[] = [ ];
  {
    if (search0.baidu_app_id == null) {
      return [ ];
    }
    let baidu_app_id: BaiduAppId[] = [ ];
    if (!Array.isArray(search0.baidu_app_id) && search0.baidu_app_id != null) {
      baidu_app_id = [ search0.baidu_app_id, search0.baidu_app_id ];
    } else {
      baidu_app_id = search0.baidu_app_id || [ ];
    }
    const modelTmps = await findAllBaiduAppToken(
      {
        baidu_app_id,
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
export function equalsByUniqueBaiduAppToken(
  oldModel: Readonly<BaiduAppTokenModel>,
  input: Readonly<BaiduAppTokenInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.baidu_app_id === input.baidu_app_id
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUniqueBaiduAppToken
/** 通过唯一约束检查 百度接口凭据 是否已经存在 */
export async function checkByUniqueBaiduAppToken(
  input: Readonly<BaiduAppTokenInput>,
  oldModel: Readonly<BaiduAppTokenModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueBaiduAppToken(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 百度接口凭据 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: BaiduAppTokenId = await updateByIdBaiduAppToken(
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

// MARK: findOneBaiduAppToken
/** 根据条件查找第一百度接口凭据 */
export async function findOneBaiduAppToken(
  search?: Readonly<BaiduAppTokenSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel | undefined> {
  
  const table = "baidu_baidu_app_token";
  const method = "findOneBaiduAppToken";
  
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
  
  const baidu_app_token_models = await findAllBaiduAppToken(
    search,
    page,
    sort,
    options,
  );
  
  const baidu_app_token_model = baidu_app_token_models[0];
  
  return baidu_app_token_model;
}

// MARK: findOneOkBaiduAppToken
/** 根据条件查找第一百度接口凭据, 如果不存在则抛错 */
export async function findOneOkBaiduAppToken(
  search?: Readonly<BaiduAppTokenSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel> {
  
  const table = "baidu_baidu_app_token";
  const method = "findOneOkBaiduAppToken";
  
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
  
  const baidu_app_token_models = await findAllBaiduAppToken(
    search,
    page,
    sort,
    options,
  );
  
  const baidu_app_token_model = baidu_app_token_models[0];
  
  if (!baidu_app_token_model) {
    const err_msg = "此 百度接口凭据 已被删除";
    throw new Error(err_msg);
  }
  
  return baidu_app_token_model;
}

// MARK: findByIdBaiduAppToken
/** 根据 id 查找百度接口凭据 */
export async function findByIdBaiduAppToken(
  id: BaiduAppTokenId,
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel | undefined> {
  
  const table = "baidu_baidu_app_token";
  const method = "findByIdBaiduAppToken";
  
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
  
  const baidu_app_token_model = await findOneBaiduAppToken(
    {
      id,
    },
    undefined,
    options,
  );
  
  return baidu_app_token_model;
}

// MARK: findByIdOkBaiduAppToken
/** 根据 id 查找百度接口凭据, 如果不存在则抛错 */
export async function findByIdOkBaiduAppToken(
  id: BaiduAppTokenId,
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel> {
  
  const table = "baidu_baidu_app_token";
  const method = "findByIdOkBaiduAppToken";
  
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
  
  const baidu_app_token_model = await findByIdBaiduAppToken(
    id,
    options,
  );
  
  if (!baidu_app_token_model) {
    const err_msg = "此 百度接口凭据 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return baidu_app_token_model;
}

// MARK: findByIdsBaiduAppToken
/** 根据 ids 查找百度接口凭据 */
export async function findByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel[]> {
  
  const table = "baidu_baidu_app_token";
  const method = "findByIdsBaiduAppToken";
  
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
  
  const models = await findAllBaiduAppToken(
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

// MARK: findByIdsOkBaiduAppToken
/** 根据 ids 查找百度接口凭据, 出现查询不到的 id 则报错 */
export async function findByIdsOkBaiduAppToken(
  ids: BaiduAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<BaiduAppTokenModel[]> {
  
  const table = "baidu_baidu_app_token";
  const method = "findByIdsOkBaiduAppToken";
  
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
  
  const models = await findByIdsBaiduAppToken(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 百度接口凭据 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 百度接口凭据 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existBaiduAppToken
/** 根据搜索条件判断百度接口凭据是否存在 */
export async function existBaiduAppToken(
  search?: Readonly<BaiduAppTokenSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "baidu_baidu_app_token";
  const method = "existBaiduAppToken";
  
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
  const model = await findOneBaiduAppToken(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdBaiduAppToken
/** 根据id判断百度接口凭据是否存在 */
export async function existByIdBaiduAppToken(
  id?: Readonly<BaiduAppTokenId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "baidu_baidu_app_token";
  const method = "existByIdBaiduAppToken";
  
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
  const sql = `select 1 e from baidu_baidu_app_token t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionBaiduAppToken
/** 校验百度接口凭据是否存在 */
export async function validateOptionBaiduAppToken(
  model?: BaiduAppTokenModel,
) {
  if (!model) {
    const err_msg = "百度接口凭据 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateBaiduAppToken
/** 百度接口凭据增加和修改时校验输入 */
export async function validateBaiduAppToken(
  input: Readonly<BaiduAppTokenInput>,
) {
  const fieldComments = await getFieldCommentsBaiduAppToken();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 百度应用
  await validators.chars_max_length(
    input.baidu_app_id,
    22,
    fieldComments.baidu_app_id,
  );
  
  // 令牌
  await validators.chars_max_length(
    input.access_token,
    600,
    fieldComments.access_token,
  );
  
}

// MARK: createReturnBaiduAppToken
/** 创建 百度接口凭据 并返回 */
export async function createReturnBaiduAppToken(
  input: Readonly<BaiduAppTokenInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<BaiduAppTokenModel> {
  
  const table = "baidu_baidu_app_token";
  const method = "createReturnBaiduAppToken";
  
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
  
  const model = await validateOptionBaiduAppToken(
    await findOneBaiduAppToken(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createBaiduAppToken
/** 创建 百度接口凭据 */
export async function createBaiduAppToken(
  input: Readonly<BaiduAppTokenInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<BaiduAppTokenId> {
  
  const table = "baidu_baidu_app_token";
  const method = "createBaiduAppToken";
  
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

// MARK: createsReturnBaiduAppToken
/** 批量创建 百度接口凭据 并返回 */
export async function createsReturnBaiduAppToken(
  inputs: BaiduAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<BaiduAppTokenModel[]> {
  
  const table = "baidu_baidu_app_token";
  const method = "createsReturnBaiduAppToken";
  
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
  
  const models = await findByIdsBaiduAppToken(ids, options);
  
  return models;
}

// MARK: createsBaiduAppToken
/** 批量创建 百度接口凭据 */
export async function createsBaiduAppToken(
  inputs: BaiduAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<BaiduAppTokenId[]> {
  
  const table = "baidu_baidu_app_token";
  const method = "createsBaiduAppToken";
  
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
  inputs: BaiduAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<BaiduAppTokenId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "baidu_baidu_app_token";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: BaiduAppTokenId[] = [ ];
  const inputs2: BaiduAppTokenInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueBaiduAppToken(input, options);
    if (oldModels.length > 0) {
      let id: BaiduAppTokenId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueBaiduAppToken(
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
    
    const id = shortUuidV4<BaiduAppTokenId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCacheBaiduAppToken();
  
  const args = new QueryArgs();
  let sql = "insert into baidu_baidu_app_token(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,baidu_app_id,access_token,token_time,expires_in)values";
  
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
      if (input.baidu_app_id != null) {
        sql += `,${ args.push(input.baidu_app_id) }`;
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
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  await delCacheBaiduAppToken();
  
  return ids2;
}

// MARK: delCacheBaiduAppToken
/** 删除缓存 */
export async function delCacheBaiduAppToken() {
  await delCacheCtx(`dao.sql.baidu_baidu_app_token`);
}

// MARK: updateTenantByIdBaiduAppToken
/** 百度接口凭据 根据 id 修改 租户id */
export async function updateTenantByIdBaiduAppToken(
  id: BaiduAppTokenId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "baidu_baidu_app_token";
  const method = "updateTenantByIdBaiduAppToken";
  
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
  const sql = `update baidu_baidu_app_token set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  await delCacheBaiduAppToken();
  return affectedRows;
}

// MARK: updateByIdBaiduAppToken
/** 根据 id 修改 百度接口凭据 */
export async function updateByIdBaiduAppToken(
  id: BaiduAppTokenId,
  input: BaiduAppTokenInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<BaiduAppTokenId> {
  
  const table = "baidu_baidu_app_token";
  const method = "updateByIdBaiduAppToken";
  
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
    throw new Error("updateByIdBaiduAppToken: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdBaiduAppToken: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdBaiduAppToken(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueBaiduAppToken(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 百度接口凭据 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdBaiduAppToken(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 百度接口凭据 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update baidu_baidu_app_token set `;
  let updateFldNum = 0;
  if (input.baidu_app_id != null) {
    if (input.baidu_app_id != oldModel.baidu_app_id) {
      sql += `baidu_app_id=${ args.push(input.baidu_app_id) },`;
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
    
    await delCacheBaiduAppToken();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (updateFldNum > 0) {
    await delCacheBaiduAppToken();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsBaiduAppToken
/** 根据 ids 删除 百度接口凭据 */
export async function deleteByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "baidu_baidu_app_token";
  const method = "deleteByIdsBaiduAppToken";
  
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
  
  await delCacheBaiduAppToken();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdBaiduAppToken(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update baidu_baidu_app_token set is_deleted=1`;
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
  }
  
  await delCacheBaiduAppToken();
  
  return affectedRows;
}

// MARK: revertByIdsBaiduAppToken
/** 根据 ids 还原 百度接口凭据 */
export async function revertByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "baidu_baidu_app_token";
  const method = "revertByIdsBaiduAppToken";
  
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
  
  await delCacheBaiduAppToken();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOneBaiduAppToken(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdBaiduAppToken(
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
      } as BaiduAppTokenInput;
      const models = await findByUniqueBaiduAppToken(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 百度接口凭据 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update baidu_baidu_app_token set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCacheBaiduAppToken();
  
  return num;
}

// MARK: forceDeleteByIdsBaiduAppToken
/** 根据 ids 彻底删除 百度接口凭据 */
export async function forceDeleteByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "baidu_baidu_app_token";
  const method = "forceDeleteByIdsBaiduAppToken";
  
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
  
  await delCacheBaiduAppToken();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneBaiduAppToken(
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
    const sql = `delete from baidu_baidu_app_token where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCacheBaiduAppToken();
  
  return num;
}
