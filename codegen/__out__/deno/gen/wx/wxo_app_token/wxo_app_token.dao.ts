// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
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

import type {
  WxoAppId,
} from "/gen/wx/wxo_app/wxo_app.model.ts";

import type {
  WxoAppTokenInput,
  WxoAppTokenModel,
  WxoAppTokenSearch,
  WxoAppTokenFieldComment,
  WxoAppTokenId,
} from "./wxo_app_token.model.ts";

import * as wxo_appDao from "/gen/wx/wxo_app/wxo_app.dao.ts";

const route_path = "/wx/wxo_app_token";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxoAppTokenSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.id != null) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.wxo_app_id != null && !Array.isArray(search?.wxo_app_id)) {
    search.wxo_app_id = [ search.wxo_app_id ];
  }
  if (search?.wxo_app_id != null) {
    whereQuery += ` and wxo_app_id_lbl.id in ${ args.push(search.wxo_app_id) }`;
  }
  if (search?.wxo_app_id_is_null) {
    whereQuery += ` and wxo_app_id_lbl.id is null`;
  }
  if (search?.access_token != null) {
    whereQuery += ` and t.access_token = ${ args.push(search.access_token) }`;
  }
  if (isNotEmpty(search?.access_token_like)) {
    whereQuery += ` and t.access_token like ${ args.push("%" + sqlLike(search?.access_token_like) + "%") }`;
  }
  if (search?.token_time != null) {
    if (search.token_time[0] != null) {
      whereQuery += ` and t.token_time >= ${ args.push(search.token_time[0]) }`;
    }
    if (search.token_time[1] != null) {
      whereQuery += ` and t.token_time <= ${ args.push(search.token_time[1]) }`;
    }
  }
  if (search?.expires_in != null) {
    if (search.expires_in[0] != null) {
      whereQuery += ` and t.expires_in >= ${ args.push(search.expires_in[0]) }`;
    }
    if (search.expires_in[1] != null) {
      whereQuery += ` and t.expires_in <= ${ args.push(search.expires_in[1]) }`;
    }
  }
  if (search?.create_usr_id != null && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and create_usr_id_lbl.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id != null && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and update_usr_id_lbl.id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time >= ${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time <= ${ args.push(search.update_time[1]) }`;
    }
  }
  return whereQuery;
}

async function getFromQuery(
  args: QueryArgs,
  search?: WxoAppTokenSearch,
  options?: {
  },
) {
  let fromQuery = `wx_wxo_app_token t
    left join wx_wxo_app wxo_app_id_lbl
      on wxo_app_id_lbl.id = t.wxo_app_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找小程序接口凭据总数
 * @param { WxoAppTokenSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxoAppTokenSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_app_token";
  const method = "findCount";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  const args = new QueryArgs();
  let sql = `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ await getFromQuery(args, search, options) }`;
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
  search?: WxoAppTokenSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxoAppTokenModel[]> {
  const table = "wx_wxo_app_token";
  const method = "findAll";
  
  if (options?.debug !== false) {
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
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search?.ids?.length === 0) {
    return [ ];
  }
  // 小程序设置
  if (search && search.wxo_app_id != null && search.wxo_app_id.length === 0) {
    return [ ];
  }
  // 创建人
  if (search && search.create_usr_id != null && search.create_usr_id.length === 0) {
    return [ ];
  }
  // 更新人
  if (search && search.update_usr_id != null && search.update_usr_id.length === 0) {
    return [ ];
  }
  
  const args = new QueryArgs();
  let sql = `
    select f.* from (
    select t.*
      ,wxo_app_id_lbl.lbl wxo_app_id_lbl
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
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
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxoAppTokenModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
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
    const wxo_appModel = await wxo_appDao.findOne({ lbl: input.wxo_app_id_lbl });
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
  search0: WxoAppTokenInput,
  options?: {
    debug?: boolean;
  },
): Promise<WxoAppTokenModel[]> {
  
  const table = "wx_wxo_app_token";
  const method = "findByUnique";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
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
    const modelTmps = await findAll({
      wxo_app_id,
    }, undefined, undefined, options);
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
  oldModel: WxoAppTokenModel,
  input: WxoAppTokenInput,
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
  input: WxoAppTokenInput,
  oldModel: WxoAppTokenModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxoAppTokenId | undefined> {
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
  search?: WxoAppTokenSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxoAppTokenModel | undefined> {
  const table = "wx_wxo_app_token";
  const method = "findOne";
  
  if (options?.debug !== false) {
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
    options = options || { };
    options.debug = false;
  }
  
  if (search?.id === "") {
    return;
  }
  if (search?.ids?.length === 0) {
    return;
  }
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort, options);
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
    debug?: boolean;
  },
): Promise<WxoAppTokenModel | undefined> {
  const table = "wx_wxo_app_token";
  const method = "findById";
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id }, undefined, options);
  return model;
}

/**
 * 根据搜索条件判断小程序接口凭据是否存在
 * @param {WxoAppTokenSearch} search?
 */
export async function exist(
  search?: WxoAppTokenSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wx_wxo_app_token";
  const method = "exist";
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
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
  id?: WxoAppTokenId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wx_wxo_app_token";
  const method = "existById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wx_wxo_app_token t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  let result = !!model?.e;
  
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
  input: WxoAppTokenInput,
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
  input: WxoAppTokenInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxoAppTokenId> {
  const table = "wx_wxo_app_token";
  const method = "create";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
  }
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
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
      return id;
    }
  }
  
  while (true) {
    input.id = shortUuidV4<WxoAppTokenId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wx_wxo_app_token(
      id,create_time
  `;
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,create_usr_id`;
    }
  }
  if (input.wxo_app_id != null) {
    sql += `,wxo_app_id`;
  }
  if (input.access_token != null) {
    sql += `,access_token`;
  }
  if (input.token_time != null) {
    sql += `,token_time`;
  }
  if (input.expires_in != null) {
    sql += `,expires_in`;
  }
  sql += `)values(${ args.push(input.id) },${ args.push(reqDate()) }`;
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.wxo_app_id != null) {
    sql += `,${ args.push(input.wxo_app_id) }`;
  }
  if (input.access_token != null) {
    sql += `,${ args.push(input.access_token) }`;
  }
  if (input.token_time != null) {
    sql += `,${ args.push(input.token_time) }`;
  }
  if (input.expires_in != null) {
    sql += `,${ args.push(input.expires_in) }`;
  }
  sql += `)`;
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  await delCache();
  
  return input.id;
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
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxoAppTokenId>}
 */
export async function updateById(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxoAppTokenId> {
  
  const table = "wx_wxo_app_token";
  const method = "updateById";
  
  
  if (options?.debug !== false) {
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
  }
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  await setIdByLbl(input);
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("小程序接口凭据"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("小程序接口凭据"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wx_wxo_app_token set
  `;
  let updateFldNum = 0;
  if (input.wxo_app_id != null) {
    if (input.wxo_app_id != oldModel.wxo_app_id) {
      sql += `wxo_app_id = ${ args.push(input.wxo_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.access_token != null) {
    if (input.access_token != oldModel.access_token) {
      sql += `access_token = ${ args.push(input.access_token) },`;
      updateFldNum++;
    }
  }
  if (input.token_time != null) {
    if (input.token_time != oldModel.token_time) {
      sql += `token_time = ${ args.push(input.token_time) },`;
      updateFldNum++;
    }
  }
  if (input.expires_in != null) {
    if (input.expires_in != oldModel.expires_in) {
      sql += `expires_in = ${ args.push(input.expires_in) },`;
      updateFldNum++;
    }
  }
  
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await getAuthModel();
      if (authModel?.id != null) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    if (input.update_time) {
      sql += `update_time = ${ args.push(input.update_time) }`;
    } else {
      sql += `update_time = ${ args.push(reqDate()) }`;
    }
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await delCache();
    
    await execute(sql, args);
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    log(JSON.stringify(oldModel));
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
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_app_token";
  const method = "deleteByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        wx_wxo_app_token
      set
        is_deleted = 1,
        delete_time = ${ args.push(reqDate()) }
      where
        id = ${ args.push(id) }
      limit 1
    `;
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
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_app_token";
  const method = "revertByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxoAppTokenId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wx_wxo_app_token
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 检查数据的唯一索引
    {
      const old_model = await findById(id);
      if (!old_model) {
        continue;
      }
      const input = {
        ...old_model,
        id: undefined,
      };
      let models = await findByUnique(input);
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
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_app_token";
  const method = "forceDeleteByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `
        select
          *
        from
          wx_wxo_app_token
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wx_wxo_app_token
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
