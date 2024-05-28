// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  useContext,
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

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  encrypt,
  decrypt,
} from "/lib/util/dao_util.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOne as findOneDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

const route_path = "/wxwork/wxw_app";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxwAppSearch>,
  options?: Readonly<{
  }>,
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
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
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.corpid != null) {
    whereQuery += ` and t.corpid=${ args.push(search.corpid) }`;
  }
  if (isNotEmpty(search?.corpid_like)) {
    whereQuery += ` and t.corpid like ${ args.push("%" + sqlLike(search?.corpid_like) + "%") }`;
  }
  if (search?.agentid != null) {
    whereQuery += ` and t.agentid=${ args.push(search.agentid) }`;
  }
  if (isNotEmpty(search?.agentid_like)) {
    whereQuery += ` and t.agentid like ${ args.push("%" + sqlLike(search?.agentid_like) + "%") }`;
  }
  if (search?.domain_id != null) {
    whereQuery += ` and t.domain_id in ${ args.push(search.domain_id) }`;
  }
  if (search?.domain_id_is_null) {
    whereQuery += ` and t.domain_id is null`;
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
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
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
  search?: Readonly<WxwAppSearch>,
  options?: Readonly<{
  }>,
) {
  let fromQuery = `wxwork_wxw_app t
    left join base_domain domain_id_lbl on domain_id_lbl.id=t.domain_id`;
  return fromQuery;
}

/**
 * 根据条件查找企微应用总数
 * @param { WxwAppSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: Readonly<WxwAppSearch>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  const table = "wxwork_wxw_app";
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
 * 根据搜索条件和分页查找企微应用列表
 * @param {WxwAppSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: Readonly<WxwAppSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput | SortInput[],
  options?: Readonly<{
    debug?: boolean;
    ids_limit?: number;
  }>,
): Promise<WxwAppModel[]> {
  const table = "wxwork_wxw_app";
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
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 可信域名
  if (search && search.domain_id != null) {
    const len = search.domain_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.domain_id.length > ${ ids_limit }`);
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
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,domain_id_lbl.lbl domain_id_lbl
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
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxwAppModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug,
    },
  );
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 可信域名
    model.domain_id_lbl = model.domain_id_lbl || "";
    // 应用密钥
    model.corpsecret = await decrypt(model.corpsecret);
    // 通讯录密钥
    model.contactsecret = await decrypt(model.contactsecret);
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked != null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl || "";
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled != null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === model.is_enabled.toString());
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl || "";
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwAppInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 可信域名
  if (isNotEmpty(input.domain_id_lbl) && input.domain_id == null) {
    input.domain_id_lbl = String(input.domain_id_lbl).trim();
    const domainModel = await findOneDomain({ lbl: input.domain_id_lbl });
    if (domainModel) {
      input.domain_id = domainModel.id;
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked == null) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val != null) {
      input.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled == null) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val != null) {
      input.is_enabled = Number(val);
    }
  }
}

/**
 * 获取企微应用字段注释
 */
export async function getFieldComments(): Promise<WxwAppFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxwAppFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    corpid: await n("企业ID"),
    agentid: await n("应用ID"),
    domain_id: await n("可信域名"),
    domain_id_lbl: await n("可信域名"),
    corpsecret: await n("应用密钥"),
    contactsecret: await n("通讯录密钥"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
    rem: await n("备注"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得企微应用列表
 * @param {WxwAppInput} search0
 */
export async function findByUnique(
  search0: Readonly<WxwAppInput>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<WxwAppModel[]> {
  
  const table = "wxwork_wxw_app";
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
  const models: WxwAppModel[] = [ ];
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      lbl,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  {
    if (search0.corpid == null) {
      return [ ];
    }
    const corpid = search0.corpid;
    if (search0.agentid == null) {
      return [ ];
    }
    const agentid = search0.agentid;
    const modelTmps = await findAll({
      corpid,
      agentid,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  {
    if (search0.domain_id == null) {
      return [ ];
    }
    let domain_id: DomainId[] = [ ];
    if (!Array.isArray(search0.domain_id) && search0.domain_id != null) {
      domain_id = [ search0.domain_id, search0.domain_id ];
    } else {
      domain_id = search0.domain_id || [ ];
    }
    const modelTmps = await findAll({
      domain_id,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxwAppModel} oldModel
 * @param {WxwAppInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: Readonly<WxwAppModel>,
  input: Readonly<WxwAppInput>,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  if (
    oldModel.corpid === input.corpid &&
    oldModel.agentid === input.agentid
  ) {
    return true;
  }
  if (
    oldModel.domain_id === input.domain_id
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查企微应用是否已经存在
 * @param {WxwAppInput} input
 * @param {WxwAppModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxwAppId | undefined>}
 */
export async function checkByUnique(
  input: Readonly<WxwAppInput>,
  oldModel: Readonly<WxwAppModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: Readonly<{
  }>,
): Promise<WxwAppId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("企微应用")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwAppId = await updateById(
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
 * 根据条件查找第一个企微应用
 * @param {WxwAppSearch} search?
 */
export async function findOne(
  search?: Readonly<WxwAppSearch>,
  sort?: SortInput | SortInput[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<WxwAppModel | undefined> {
  
  const table = "wxwork_wxw_app";
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
    options = {
      ...options,
      debug: false,
    };
  }
  
  if (search && search.ids && search.ids.length === 0) {
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
 * 根据 id 查找企微应用
 * @param {WxwAppId} id
 */
export async function findById(
  id?: WxwAppId | null,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<WxwAppModel | undefined> {
  
  const table = "wxwork_wxw_app";
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
    options = {
      ...options,
      debug: false,
    };
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

/** 根据 ids 查找企微应用 */
export async function findByIds(
  ids: WxwAppId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<WxwAppModel[]> {
  
  const table = "wxwork_wxw_app";
  const method = "findByIds";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
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
 * 根据搜索条件判断企微应用是否存在
 * @param {WxwAppSearch} search?
 */
export async function exist(
  search?: Readonly<WxwAppSearch>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<boolean> {
  
  const table = "wxwork_wxw_app";
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
    options = {
      ...options,
      debug: false,
    };
  }
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断企微应用是否存在
 * @param {WxwAppId} id
 */
export async function existById(
  id?: Readonly<WxwAppId | null>,
  options?: Readonly<{
    debug?: boolean;
  }>,
) {
  
  const table = "wxwork_wxw_app";
  const method = "existById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from wxwork_wxw_app t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  const result = !!model?.e;
  
  return result;
}

/** 校验企微应用是否启用 */
export async function validateIsEnabled(
  model: Readonly<WxwAppModel>,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("企微应用") } ${ await ns("已禁用") }`;
  }
}

/** 校验企微应用是否存在 */
export async function validateOption(
  model?: Readonly<WxwAppModel>,
) {
  if (!model) {
    throw `${ await ns("企微应用") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 企微应用增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: Readonly<WxwAppInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    45,
    fieldComments.lbl,
  );
  
  // 企业ID
  await validators.chars_max_length(
    input.corpid,
    18,
    fieldComments.corpid,
  );
  
  // 应用ID
  await validators.chars_max_length(
    input.agentid,
    7,
    fieldComments.agentid,
  );
  
  // 可信域名
  await validators.chars_max_length(
    input.domain_id,
    22,
    fieldComments.domain_id,
  );
  
  // 应用密钥
  await validators.chars_max_length(
    input.corpsecret,
    120,
    fieldComments.corpsecret,
  );
  
  // 通讯录密钥
  await validators.chars_max_length(
    input.contactsecret,
    120,
    fieldComments.contactsecret,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

/**
 * 创建企微应用
 * @param {WxwAppInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxwAppId>} 
 */
export async function create(
  input: Readonly<WxwAppInput>,
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<WxwAppId> {
  
  const table = "wxwork_wxw_app";
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
    options = {
      ...options,
      debug: false,
    };
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
 * 批量创建企微应用
 * @param {WxwAppInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxwAppId[]>} 
 */
export async function creates(
  inputs: WxwAppInput[],
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<WxwAppId[]> {
  
  const table = "wxwork_wxw_app";
  const method = "creates";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = {
      ...options,
      debug: false,
    };
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: WxwAppInput[],
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<WxwAppId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wxwork_wxw_app";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
  const ids2: WxwAppId[] = [ ];
  const inputs2: WxwAppInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: WxwAppId | undefined = undefined;
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
    
    const id = shortUuidV4<WxwAppId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wxwork_wxw_app(id`;
  if (!silentMode) {
    sql += ",create_time";
  }
  sql += ",tenant_id";
  if (!silentMode) {
    sql += ",create_usr_id";
  }
  if (!silentMode) {
    sql += ",create_usr_id_lbl";
  }
  sql += ",lbl";
  sql += ",corpid";
  sql += ",agentid";
  sql += ",domain_id";
  sql += ",corpsecret";
  sql += ",contactsecret";
  sql += ",is_locked";
  sql += ",is_enabled";
  sql += ",order_by";
  sql += ",rem";
  sql += ")values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (!silentMode) {
        if (input.create_time != null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,${ args.push(reqDate()) }`;
        }
      }
      if (input.tenant_id == null) {
        const authModel = await getAuthModel();
        const tenant_id = await getTenant_id(authModel?.id);
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
      if (!silentMode) {
        if (input.create_usr_id == null) {
          const authModel = await getAuthModel();
          let usr_id: UsrId | undefined = authModel?.id;
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id);
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
          const usr_model = await findByIdUsr(usr_id);
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
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.corpid != null) {
        sql += `,${ args.push(input.corpid) }`;
      } else {
        sql += ",default";
      }
      if (input.agentid != null) {
        sql += `,${ args.push(input.agentid) }`;
      } else {
        sql += ",default";
      }
      if (input.domain_id != null) {
        sql += `,${ args.push(input.domain_id) }`;
      } else {
        sql += ",default";
      }
      if (input.corpsecret != null) {
        sql += `,${ args.push(await encrypt(input.corpsecret)) }`;
      } else {
        sql += ",default";
      }
      if (input.contactsecret != null) {
        sql += `,${ args.push(await encrypt(input.contactsecret)) }`;
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
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
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
  await delCacheCtx(`dao.sql.wxwork_wxw_app`);
}

/**
 * 企微应用根据id修改租户id
 * @param {WxwAppId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxwAppId,
  tenant_id: Readonly<TenantId>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  const table = "wxwork_wxw_app";
  const method = "updateTenantById";
  
  if (options?.debug !== false) {
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
  }
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update wxwork_wxw_app set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据 id 修改企微应用
 * @param {WxwAppId} id
 * @param {WxwAppInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxwAppId>}
 */
export async function updateById(
  id: WxwAppId,
  input: WxwAppInput,
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
    silentMode?: boolean;
  }>,
): Promise<WxwAppId> {
  
  const table = "wxwork_wxw_app";
  const method = "updateById";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
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
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id as unknown as TenantId);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("企微应用"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("企微应用"));
  }
  
  const args = new QueryArgs();
  let sql = `update wxwork_wxw_app set `;
  let updateFldNum = 0;
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.corpid != null) {
    if (input.corpid != oldModel.corpid) {
      sql += `corpid=${ args.push(input.corpid) },`;
      updateFldNum++;
    }
  }
  if (input.agentid != null) {
    if (input.agentid != oldModel.agentid) {
      sql += `agentid=${ args.push(input.agentid) },`;
      updateFldNum++;
    }
  }
  if (input.domain_id != null) {
    if (input.domain_id != oldModel.domain_id) {
      sql += `domain_id = ${ args.push(input.domain_id) },`;
      updateFldNum++;
    }
  }
  if (input.corpsecret != null) {
    if (input.corpsecret != oldModel.corpsecret) {
      sql += `corpsecret=${ args.push(await encrypt(input.corpsecret)) },`;
      updateFldNum++;
    }
  }
  if (input.contactsecret != null) {
    if (input.contactsecret != oldModel.contactsecret) {
      sql += `contactsecret=${ args.push(await encrypt(input.contactsecret)) },`;
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
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  
  if (updateFldNum > 0) {
    if (!silentMode) {
      if (input.update_usr_id == null) {
        const authModel = await getAuthModel();
        let usr_id: UsrId | undefined = authModel?.id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id);
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
          const usr_model = await findByIdUsr(usr_id);
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
    }
    if (!silentMode) {
      if (input.update_time) {
        sql += `update_time = ${ args.push(input.update_time) }`;
      } else {
        sql += `update_time = ${ args.push(reqDate()) }`;
      }
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    await delCache();
    
    await execute(sql, args);
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!silentMode) {
    const newModel = await findById(id);
    
    if (!deepCompare(oldModel, newModel)) {
      log(JSON.stringify(oldModel));
    }
  }
  
  return id;
}

/**
 * 根据 ids 删除企微应用
 * @param {WxwAppId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwAppId[],
  options?: Readonly<{
    debug?: boolean;
    silentMode?: boolean;
  }>,
): Promise<number> {
  
  const table = "wxwork_wxw_app";
  const method = "deleteByIds";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    let sql = `update wxwork_wxw_app set is_deleted=1`;
    if (!silentMode) {
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
 * 根据 ID 查找企微应用是否已启用
 * 不存在则返回 undefined
 * @param {WxwAppId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: WxwAppId,
  options?: Readonly<{
  }>,
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  return is_enabled;
}

/**
 * 根据 ids 启用或者禁用企微应用
 * @param {WxwAppId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: WxwAppId[],
  is_enabled: Readonly<0 | 1>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wxwork_wxw_app";
  const method = "enableByIds";
  
  if (options?.debug !== false) {
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
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  const sql = `update wxwork_wxw_app set is_enabled=${ args.push(is_enabled) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找企微应用是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {WxwAppId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: WxwAppId,
  options?: Readonly<{
  }>,
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  return is_locked;
}

/**
 * 根据 ids 锁定或者解锁企微应用
 * @param {WxwAppId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: WxwAppId[],
  is_locked: Readonly<0 | 1>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wxwork_wxw_app";
  const method = "lockByIds";
  
  if (options?.debug !== false) {
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
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = `update wxwork_wxw_app set is_locked=${ args.push(is_locked) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原企微应用
 * @param {WxwAppId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwAppId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wxwork_wxw_app";
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxwAppId = ids[i];
    const args = new QueryArgs();
    const sql = `update wxwork_wxw_app set is_deleted = 0 where id=${ args.push(id) } limit 1`;
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
      } as WxwAppInput;
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("企微应用"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除企微应用
 * @param {WxwAppId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwAppId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wxwork_wxw_app";
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `select * from wxwork_wxw_app where id=${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wxwork_wxw_app where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
  
/**
 * 查找 企微应用 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wxwork_wxw_app";
  const method = "findLastOrderBy";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  let sql = `select t.order_by order_by from wxwork_wxw_app t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);
  {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    whereQuery.push(` t.tenant_id=${ args.push(tenant_id) }`);
  }
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
