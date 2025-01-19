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
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOne as findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./wxw_app_token.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxwAppTokenSearch>,
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
  if (search?.wxw_app_id != null) {
    whereQuery += ` and t.wxw_app_id in (${ args.push(search.wxw_app_id) })`;
  }
  if (search?.wxw_app_id_is_null) {
    whereQuery += ` and t.wxw_app_id is null`;
  }
  if (search?.wxw_app_id_lbl != null) {
    whereQuery += ` and wxw_app_id_lbl.lbl in (${ args.push(search.wxw_app_id_lbl) })`;
  }
  if (isNotEmpty(search?.wxw_app_id_lbl_like)) {
    whereQuery += ` and wxw_app_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.wxw_app_id_lbl_like) + "%") }`;
  }
  if (search?.type != null) {
    whereQuery += ` and t.type=${ args.push(search.type) }`;
  }
  if (isNotEmpty(search?.type_like)) {
    whereQuery += ` and t.type like ${ args.push("%" + sqlLike(search?.type_like) + "%") }`;
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
  if (search?.jsapi_ticket != null) {
    whereQuery += ` and t.jsapi_ticket=${ args.push(search.jsapi_ticket) }`;
  }
  if (isNotEmpty(search?.jsapi_ticket_like)) {
    whereQuery += ` and t.jsapi_ticket like ${ args.push("%" + sqlLike(search?.jsapi_ticket_like) + "%") }`;
  }
  if (search?.jsapi_ticket_time != null) {
    if (search.jsapi_ticket_time[0] != null) {
      whereQuery += ` and t.jsapi_ticket_time>=${ args.push(search.jsapi_ticket_time[0]) }`;
    }
    if (search.jsapi_ticket_time[1] != null) {
      whereQuery += ` and t.jsapi_ticket_time<=${ args.push(search.jsapi_ticket_time[1]) }`;
    }
  }
  if (search?.jsapi_ticket_expires_in != null) {
    if (search.jsapi_ticket_expires_in[0] != null) {
      whereQuery += ` and t.jsapi_ticket_expires_in>=${ args.push(search.jsapi_ticket_expires_in[0]) }`;
    }
    if (search.jsapi_ticket_expires_in[1] != null) {
      whereQuery += ` and t.jsapi_ticket_expires_in<=${ args.push(search.jsapi_ticket_expires_in[1]) }`;
    }
  }
  if (search?.jsapi_ticket_agent_config != null) {
    whereQuery += ` and t.jsapi_ticket_agent_config=${ args.push(search.jsapi_ticket_agent_config) }`;
  }
  if (isNotEmpty(search?.jsapi_ticket_agent_config_like)) {
    whereQuery += ` and t.jsapi_ticket_agent_config like ${ args.push("%" + sqlLike(search?.jsapi_ticket_agent_config_like) + "%") }`;
  }
  if (search?.jsapi_ticket_agent_config_time != null) {
    if (search.jsapi_ticket_agent_config_time[0] != null) {
      whereQuery += ` and t.jsapi_ticket_agent_config_time>=${ args.push(search.jsapi_ticket_agent_config_time[0]) }`;
    }
    if (search.jsapi_ticket_agent_config_time[1] != null) {
      whereQuery += ` and t.jsapi_ticket_agent_config_time<=${ args.push(search.jsapi_ticket_agent_config_time[1]) }`;
    }
  }
  if (search?.jsapi_ticket_agent_config_expires_in != null) {
    if (search.jsapi_ticket_agent_config_expires_in[0] != null) {
      whereQuery += ` and t.jsapi_ticket_agent_config_expires_in>=${ args.push(search.jsapi_ticket_agent_config_expires_in[0]) }`;
    }
    if (search.jsapi_ticket_agent_config_expires_in[1] != null) {
      whereQuery += ` and t.jsapi_ticket_agent_config_expires_in<=${ args.push(search.jsapi_ticket_agent_config_expires_in[1]) }`;
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
  search?: Readonly<WxwAppTokenSearch>,
  options?: {
  },
) {
  let fromQuery = `wxwork_wxw_app_token t
  left join wxwork_wxw_app wxw_app_id_lbl on wxw_app_id_lbl.id=t.wxw_app_id`;
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找企微应用接口凭据总数 */
export async function findCount(
  search?: Readonly<WxwAppTokenSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_app_token";
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
/** 根据搜索条件和分页查找企微应用接口凭据列表 */
export async function findAll(
  search?: Readonly<WxwAppTokenSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxwAppTokenModel[]> {
  
  const table = "wxwork_wxw_app_token";
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
  // 企微应用
  if (search && search.wxw_app_id != null) {
    const len = search.wxw_app_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.wxw_app_id.length > ${ ids_limit }`);
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
      ,wxw_app_id_lbl.lbl wxw_app_id_lbl
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
  
  const result = await query<WxwAppTokenModel>(
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
    
    // 企微应用
    model.wxw_app_id_lbl = model.wxw_app_id_lbl || "";
    
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
    
    // 企业jsapi_ticket创建时间
    if (model.jsapi_ticket_time) {
      const jsapi_ticket_time = dayjs(model.jsapi_ticket_time);
      if (isNaN(jsapi_ticket_time.toDate().getTime())) {
        model.jsapi_ticket_time_lbl = (model.jsapi_ticket_time || "").toString();
      } else {
        model.jsapi_ticket_time_lbl = jsapi_ticket_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.jsapi_ticket_time_lbl = "";
    }
    
    // 应用jsapi_ticket创建时间
    if (model.jsapi_ticket_agent_config_time) {
      const jsapi_ticket_agent_config_time = dayjs(model.jsapi_ticket_agent_config_time);
      if (isNaN(jsapi_ticket_agent_config_time.toDate().getTime())) {
        model.jsapi_ticket_agent_config_time_lbl = (model.jsapi_ticket_agent_config_time || "").toString();
      } else {
        model.jsapi_ticket_agent_config_time_lbl = jsapi_ticket_agent_config_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.jsapi_ticket_agent_config_time_lbl = "";
    }
    
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
  }
  
  return result;
}

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwAppTokenInput,
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
      throw `${ fieldComments.token_time } 日期格式错误`;
    }
  }
  if (input.token_time) {
    const token_time = dayjs(input.token_time);
    if (!token_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.token_time } 日期格式错误`;
    }
    input.token_time = dayjs(input.token_time).format("YYYY-MM-DD HH:mm:ss");
  }
  // 企业jsapi_ticket创建时间
  if (!input.jsapi_ticket_time && input.jsapi_ticket_time_lbl) {
    const jsapi_ticket_time_lbl = dayjs(input.jsapi_ticket_time_lbl);
    if (jsapi_ticket_time_lbl.isValid()) {
      input.jsapi_ticket_time = jsapi_ticket_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.jsapi_ticket_time } 日期格式错误`;
    }
  }
  if (input.jsapi_ticket_time) {
    const jsapi_ticket_time = dayjs(input.jsapi_ticket_time);
    if (!jsapi_ticket_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.jsapi_ticket_time } 日期格式错误`;
    }
    input.jsapi_ticket_time = dayjs(input.jsapi_ticket_time).format("YYYY-MM-DD HH:mm:ss");
  }
  // 应用jsapi_ticket创建时间
  if (!input.jsapi_ticket_agent_config_time && input.jsapi_ticket_agent_config_time_lbl) {
    const jsapi_ticket_agent_config_time_lbl = dayjs(input.jsapi_ticket_agent_config_time_lbl);
    if (jsapi_ticket_agent_config_time_lbl.isValid()) {
      input.jsapi_ticket_agent_config_time = jsapi_ticket_agent_config_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.jsapi_ticket_agent_config_time } 日期格式错误`;
    }
  }
  if (input.jsapi_ticket_agent_config_time) {
    const jsapi_ticket_agent_config_time = dayjs(input.jsapi_ticket_agent_config_time);
    if (!jsapi_ticket_agent_config_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.jsapi_ticket_agent_config_time } 日期格式错误`;
    }
    input.jsapi_ticket_agent_config_time = dayjs(input.jsapi_ticket_agent_config_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  // 企微应用
  if (isNotEmpty(input.wxw_app_id_lbl) && input.wxw_app_id == null) {
    input.wxw_app_id_lbl = String(input.wxw_app_id_lbl).trim();
    const wxw_appModel = await findOneWxwApp(
      {
        lbl: input.wxw_app_id_lbl,
      },
      undefined,
      options,
    );
    if (wxw_appModel) {
      input.wxw_app_id = wxw_appModel.id;
    }
  } else if (isEmpty(input.wxw_app_id_lbl) && input.wxw_app_id != null) {
    const wxw_app_model = await findOneWxwApp(
      {
        id: input.wxw_app_id,
      },
      undefined,
      options,
    );
    if (wxw_app_model) {
      input.wxw_app_id_lbl = wxw_app_model.lbl;
    }
  }
  
  // 令牌创建时间
  if (isNotEmpty(input.token_time_lbl) && input.token_time == null) {
    input.token_time_lbl = String(input.token_time_lbl).trim();
    input.token_time = input.token_time_lbl;
  }
  
  // 企业jsapi_ticket创建时间
  if (isNotEmpty(input.jsapi_ticket_time_lbl) && input.jsapi_ticket_time == null) {
    input.jsapi_ticket_time_lbl = String(input.jsapi_ticket_time_lbl).trim();
    input.jsapi_ticket_time = input.jsapi_ticket_time_lbl;
  }
  
  // 应用jsapi_ticket创建时间
  if (isNotEmpty(input.jsapi_ticket_agent_config_time_lbl) && input.jsapi_ticket_agent_config_time == null) {
    input.jsapi_ticket_agent_config_time_lbl = String(input.jsapi_ticket_agent_config_time_lbl).trim();
    input.jsapi_ticket_agent_config_time = input.jsapi_ticket_agent_config_time_lbl;
  }
}

// MARK: getFieldComments
/** 获取企微应用接口凭据字段注释 */
export async function getFieldComments(): Promise<WxwAppTokenFieldComment> {
  const fieldComments: WxwAppTokenFieldComment = {
    id: "ID",
    wxw_app_id: "企微应用",
    wxw_app_id_lbl: "企微应用",
    type: "类型corp和contact",
    access_token: "令牌",
    token_time: "令牌创建时间",
    token_time_lbl: "令牌创建时间",
    expires_in: "令牌超时时间",
    jsapi_ticket: "企业jsapi_ticket",
    jsapi_ticket_time: "企业jsapi_ticket创建时间",
    jsapi_ticket_time_lbl: "企业jsapi_ticket创建时间",
    jsapi_ticket_expires_in: "企业jsapi_ticket超时时间",
    jsapi_ticket_agent_config: "应用jsapi_ticket",
    jsapi_ticket_agent_config_time: "应用jsapi_ticket创建时间",
    jsapi_ticket_agent_config_time_lbl: "应用jsapi_ticket创建时间",
    jsapi_ticket_agent_config_expires_in: "应用jsapi_ticket超时时间",
    create_usr_id: "创建人",
    create_usr_id_lbl: "创建人",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
    update_usr_id: "更新人",
    update_usr_id_lbl: "更新人",
    update_time: "更新时间",
    update_time_lbl: "更新时间",
  };
  return fieldComments;
}

// MARK: findByUnique
/** 通过唯一约束获得企微应用接口凭据列表 */
export async function findByUnique(
  search0: Readonly<WxwAppTokenInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwAppTokenModel[]> {
  
  const table = "wxwork_wxw_app_token";
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
  const models: WxwAppTokenModel[] = [ ];
  {
    if (search0.wxw_app_id == null) {
      return [ ];
    }
    let wxw_app_id: WxwAppId[] = [ ];
    if (!Array.isArray(search0.wxw_app_id) && search0.wxw_app_id != null) {
      wxw_app_id = [ search0.wxw_app_id, search0.wxw_app_id ];
    } else {
      wxw_app_id = search0.wxw_app_id || [ ];
    }
    if (search0.type == null) {
      return [ ];
    }
    const type = search0.type;
    const modelTmps = await findAll(
      {
        wxw_app_id,
        type,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  {
    if (search0.access_token == null) {
      return [ ];
    }
    const access_token = search0.access_token;
    const modelTmps = await findAll(
      {
        access_token,
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
  oldModel: Readonly<WxwAppTokenModel>,
  input: Readonly<WxwAppTokenInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.wxw_app_id === input.wxw_app_id &&
    oldModel.type === input.type
  ) {
    return true;
  }
  if (
    oldModel.access_token === input.access_token
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUnique
/** 通过唯一约束检查 企微应用接口凭据 是否已经存在 */
export async function checkByUnique(
  input: Readonly<WxwAppTokenInput>,
  oldModel: Readonly<WxwAppTokenModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwAppTokenId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 企微应用接口凭据 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwAppTokenId = await updateById(
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
/** 根据条件查找第一企微应用接口凭据 */
export async function findOne(
  search?: Readonly<WxwAppTokenSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwAppTokenModel | undefined> {
  
  const table = "wxwork_wxw_app_token";
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
/** 根据 id 查找企微应用接口凭据 */
export async function findById(
  id?: WxwAppTokenId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwAppTokenModel | undefined> {
  
  const table = "wxwork_wxw_app_token";
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
/** 根据 ids 查找企微应用接口凭据 */
export async function findByIds(
  ids: WxwAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwAppTokenModel[]> {
  
  const table = "wxwork_wxw_app_token";
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
/** 根据搜索条件判断企微应用接口凭据是否存在 */
export async function exist(
  search?: Readonly<WxwAppTokenSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wxwork_wxw_app_token";
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
/** 根据id判断企微应用接口凭据是否存在 */
export async function existById(
  id?: Readonly<WxwAppTokenId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wxwork_wxw_app_token";
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
  const sql = `select 1 e from wxwork_wxw_app_token t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOption
/** 校验企微应用接口凭据是否存在 */
export async function validateOption(
  model?: WxwAppTokenModel,
) {
  if (!model) {
    const err_msg = "企微应用接口凭据 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 企微应用接口凭据增加和修改时校验输入 */
export async function validate(
  input: Readonly<WxwAppTokenInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 企微应用
  await validators.chars_max_length(
    input.wxw_app_id,
    22,
    fieldComments.wxw_app_id,
  );
  
  // 类型corp和contact
  await validators.chars_max_length(
    input.type,
    10,
    fieldComments.type,
  );
  
  // 令牌
  await validators.chars_max_length(
    input.access_token,
    600,
    fieldComments.access_token,
  );
  
  // 企业jsapi_ticket
  await validators.chars_max_length(
    input.jsapi_ticket,
    600,
    fieldComments.jsapi_ticket,
  );
  
  // 应用jsapi_ticket
  await validators.chars_max_length(
    input.jsapi_ticket_agent_config,
    600,
    fieldComments.jsapi_ticket_agent_config,
  );
  
}

// MARK: createReturn
/** 创建 企微应用接口凭据 并返回 */
export async function createReturn(
  input: Readonly<WxwAppTokenInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwAppTokenModel> {
  
  const table = "wxwork_wxw_app_token";
  const method = "createReturn";
  
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
  
  const model = await validateOption(
    await findOne(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: create
/** 创建 企微应用接口凭据 */
export async function create(
  input: Readonly<WxwAppTokenInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwAppTokenId> {
  
  const table = "wxwork_wxw_app_token";
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

// MARK: createsReturn
/** 批量创建 企微应用接口凭据 并返回 */
export async function createsReturn(
  inputs: WxwAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwAppTokenModel[]> {
  
  const table = "wxwork_wxw_app_token";
  const method = "createsReturn";
  
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
  
  const models = await findByIds(ids, options);
  
  return models;
}

// MARK: creates
/** 批量创建 企微应用接口凭据 */
export async function creates(
  inputs: WxwAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwAppTokenId[]> {
  
  const table = "wxwork_wxw_app_token";
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
  inputs: WxwAppTokenInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwAppTokenId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wxwork_wxw_app_token";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxwAppTokenId[] = [ ];
  const inputs2: WxwAppTokenInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: WxwAppTokenId | undefined = undefined;
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
    
    const id = shortUuidV4<WxwAppTokenId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = "insert into wxwork_wxw_app_token(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,wxw_app_id,type,access_token,token_time,expires_in,jsapi_ticket,jsapi_ticket_time,jsapi_ticket_expires_in,jsapi_ticket_agent_config,jsapi_ticket_agent_config_time,jsapi_ticket_agent_config_expires_in)values";
  
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
      if (input.wxw_app_id != null) {
        sql += `,${ args.push(input.wxw_app_id) }`;
      } else {
        sql += ",default";
      }
      if (input.type != null) {
        sql += `,${ args.push(input.type) }`;
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
      if (input.jsapi_ticket != null) {
        sql += `,${ args.push(input.jsapi_ticket) }`;
      } else {
        sql += ",default";
      }
      if (input.jsapi_ticket_time != null || input.jsapi_ticket_time_save_null) {
        sql += `,${ args.push(input.jsapi_ticket_time) }`;
      } else {
        sql += ",default";
      }
      if (input.jsapi_ticket_expires_in != null) {
        sql += `,${ args.push(input.jsapi_ticket_expires_in) }`;
      } else {
        sql += ",default";
      }
      if (input.jsapi_ticket_agent_config != null) {
        sql += `,${ args.push(input.jsapi_ticket_agent_config) }`;
      } else {
        sql += ",default";
      }
      if (input.jsapi_ticket_agent_config_time != null || input.jsapi_ticket_agent_config_time_save_null) {
        sql += `,${ args.push(input.jsapi_ticket_agent_config_time) }`;
      } else {
        sql += ",default";
      }
      if (input.jsapi_ticket_agent_config_expires_in != null) {
        sql += `,${ args.push(input.jsapi_ticket_agent_config_expires_in) }`;
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
  
  await delCache();
  
  return ids2;
}

// MARK: delCache
/** 删除缓存 */
export async function delCache() {
  await delCacheCtx(`dao.sql.wxwork_wxw_app_token`);
}

// MARK: updateTenantById
/** 企微应用接口凭据 根据 id 修改 租户id */
export async function updateTenantById(
  id: WxwAppTokenId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_app_token";
  const method = "updateTenantById";
  
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
  const sql = `update wxwork_wxw_app_token set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  await delCache();
  return affectedRows;
}

// MARK: updateById
/** 根据 id 修改 企微应用接口凭据 */
export async function updateById(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxwAppTokenId> {
  
  const table = "wxwork_wxw_app_token";
  const method = "updateById";
  
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
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id, options);
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
        throw "此 企微应用接口凭据 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 企微应用接口凭据 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wxwork_wxw_app_token set `;
  let updateFldNum = 0;
  if (input.wxw_app_id != null) {
    if (input.wxw_app_id != oldModel.wxw_app_id) {
      sql += `wxw_app_id=${ args.push(input.wxw_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.type != null) {
    if (input.type != oldModel.type) {
      sql += `type=${ args.push(input.type) },`;
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
  if (input.jsapi_ticket != null) {
    if (input.jsapi_ticket != oldModel.jsapi_ticket) {
      sql += `jsapi_ticket=${ args.push(input.jsapi_ticket) },`;
      updateFldNum++;
    }
  }
  if (input.jsapi_ticket_time != null || input.jsapi_ticket_time_save_null) {
    if (input.jsapi_ticket_time != oldModel.jsapi_ticket_time) {
      sql += `jsapi_ticket_time=${ args.push(input.jsapi_ticket_time) },`;
      updateFldNum++;
    }
  }
  if (input.jsapi_ticket_expires_in != null) {
    if (input.jsapi_ticket_expires_in != oldModel.jsapi_ticket_expires_in) {
      sql += `jsapi_ticket_expires_in=${ args.push(input.jsapi_ticket_expires_in) },`;
      updateFldNum++;
    }
  }
  if (input.jsapi_ticket_agent_config != null) {
    if (input.jsapi_ticket_agent_config != oldModel.jsapi_ticket_agent_config) {
      sql += `jsapi_ticket_agent_config=${ args.push(input.jsapi_ticket_agent_config) },`;
      updateFldNum++;
    }
  }
  if (input.jsapi_ticket_agent_config_time != null || input.jsapi_ticket_agent_config_time_save_null) {
    if (input.jsapi_ticket_agent_config_time != oldModel.jsapi_ticket_agent_config_time) {
      sql += `jsapi_ticket_agent_config_time=${ args.push(input.jsapi_ticket_agent_config_time) },`;
      updateFldNum++;
    }
  }
  if (input.jsapi_ticket_agent_config_expires_in != null) {
    if (input.jsapi_ticket_agent_config_expires_in != oldModel.jsapi_ticket_agent_config_expires_in) {
      sql += `jsapi_ticket_agent_config_expires_in=${ args.push(input.jsapi_ticket_agent_config_expires_in) },`;
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
    
    await delCache();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 企微应用接口凭据 */
export async function deleteByIds(
  ids: WxwAppTokenId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_app_token";
  const method = "deleteByIds";
  
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
  
  await delCache();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wxwork_wxw_app_token set is_deleted=1`;
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
  
  await delCache();
  
  return affectedRows;
}

// MARK: revertByIds
/** 根据 ids 还原 企微应用接口凭据 */
export async function revertByIds(
  ids: WxwAppTokenId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_app_token";
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
      } as WxwAppTokenInput;
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 企微应用接口凭据 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wxwork_wxw_app_token set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 企微应用接口凭据 */
export async function forceDeleteByIds(
  ids: WxwAppTokenId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_app_token";
  const method = "forceDeleteByIds";
  
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
    const sql = `delete from wxwork_wxw_app_token where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
