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
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  WxPayInput,
  WxPayModel,
  WxPaySearch,
  WxPayFieldComment,
  WxPayId,
} from "./wx_pay.model.ts";

const route_path = "/wx/wx_pay";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxPaySearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.appid != null) {
    whereQuery += ` and t.appid = ${ args.push(search.appid) }`;
  }
  if (isNotEmpty(search?.appid_like)) {
    whereQuery += ` and t.appid like ${ args.push("%" + sqlLike(search?.appid_like) + "%") }`;
  }
  if (search?.mchid != null) {
    whereQuery += ` and t.mchid = ${ args.push(search.mchid) }`;
  }
  if (isNotEmpty(search?.mchid_like)) {
    whereQuery += ` and t.mchid like ${ args.push("%" + sqlLike(search?.mchid_like) + "%") }`;
  }
  if (search?.public_key != null) {
    whereQuery += ` and t.public_key = ${ args.push(search.public_key) }`;
  }
  if (isNotEmpty(search?.public_key_like)) {
    whereQuery += ` and t.public_key like ${ args.push("%" + sqlLike(search?.public_key_like) + "%") }`;
  }
  if (search?.private_key != null) {
    whereQuery += ` and t.private_key = ${ args.push(search.private_key) }`;
  }
  if (isNotEmpty(search?.private_key_like)) {
    whereQuery += ` and t.private_key like ${ args.push("%" + sqlLike(search?.private_key_like) + "%") }`;
  }
  if (search?.v3_key != null) {
    whereQuery += ` and t.v3_key = ${ args.push(search.v3_key) }`;
  }
  if (isNotEmpty(search?.v3_key_like)) {
    whereQuery += ` and t.v3_key like ${ args.push("%" + sqlLike(search?.v3_key_like) + "%") }`;
  }
  if (search?.payer_client_ip != null) {
    whereQuery += ` and t.payer_client_ip = ${ args.push(search.payer_client_ip) }`;
  }
  if (isNotEmpty(search?.payer_client_ip_like)) {
    whereQuery += ` and t.payer_client_ip like ${ args.push("%" + sqlLike(search?.payer_client_ip_like) + "%") }`;
  }
  if (search?.notify_url != null) {
    whereQuery += ` and t.notify_url = ${ args.push(search.notify_url) }`;
  }
  if (isNotEmpty(search?.notify_url_like)) {
    whereQuery += ` and t.notify_url like ${ args.push("%" + sqlLike(search?.notify_url_like) + "%") }`;
  }
  if (search?.is_locked != null && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked != null) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled != null && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.order_by != null) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by >= ${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by <= ${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
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
  search?: WxPaySearch,
  options?: {
  },
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `wx_wx_pay t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找微信支付设置总数
 * @param { WxPaySearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxPaySearch,
  options?: {
    debug: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
 * 根据搜索条件和分页查找微信支付设置列表
 * @param {WxPaySearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxPaySearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxPayModel[]> {
  const table = "wx_wx_pay";
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
  
  const args = new QueryArgs();
  let sql = `
    select t.*
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
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxPayModel>(
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
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked != null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled != null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === model.is_enabled.toString());
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl;
    
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

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxPayInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
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
 * 获取微信支付设置字段注释
 */
export async function getFieldComments(): Promise<WxPayFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxPayFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    appid: await n("开发者ID"),
    mchid: await n("商户号"),
    public_key: await n("公钥"),
    private_key: await n("私钥"),
    v3_key: await n("APIv3密钥"),
    payer_client_ip: await n("支付终端IP"),
    notify_url: await n("通知地址"),
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

/**
 * 通过唯一约束获得微信支付设置列表
 * @param {WxPayInput} search0
 */
export async function findByUnique(
  search0: WxPayInput,
  options?: {
    debug?: boolean;
  },
): Promise<WxPayModel[]> {
  
  const table = "wx_wx_pay";
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
  const models: WxPayModel[] = [ ];
  {
    if (search0.appid == null) {
      return [ ];
    }
    const appid = search0.appid;
    const modelTmps = await findAll({
      appid,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  {
    if (search0.notify_url == null) {
      return [ ];
    }
    const notify_url = search0.notify_url;
    const modelTmps = await findAll({
      notify_url,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxPayModel} oldModel
 * @param {WxPayInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxPayModel,
  input: WxPayInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.appid === input.appid
  ) {
    return true;
  }
  if (
    oldModel.notify_url === input.notify_url
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查微信支付设置是否已经存在
 * @param {WxPayInput} input
 * @param {WxPayModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxPayId | undefined>}
 */
export async function checkByUnique(
  input: WxPayInput,
  oldModel: WxPayModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxPayId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("微信支付设置")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxPayId = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        {
          ...options,
        },
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
 * 根据条件查找第一个微信支付设置
 * @param {WxPaySearch} search?
 */
export async function findOne(
  search?: WxPaySearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxPayModel | undefined> {
  const table = "wx_wx_pay";
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
 * 根据 id 查找微信支付设置
 * @param {WxPayId} id
 */
export async function findById(
  id?: WxPayId | null,
  options?: {
    debug?: boolean;
  },
): Promise<WxPayModel | undefined> {
  const table = "wx_wx_pay";
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
 * 根据搜索条件判断微信支付设置是否存在
 * @param {WxPaySearch} search?
 */
export async function exist(
  search?: WxPaySearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wx_wx_pay";
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
 * 根据id判断微信支付设置是否存在
 * @param {WxPayId} id
 */
export async function existById(
  id?: WxPayId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wx_wx_pay";
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
      wx_wx_pay t
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

/** 校验微信支付设置是否启用 */
export async function validateIsEnabled(
  model: WxPayModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("微信支付设置") } ${ await ns("已禁用") }`;
  }
}

/** 校验微信支付设置是否存在 */
export async function validateOption(
  model?: WxPayModel,
) {
  if (!model) {
    throw `${ await ns("微信支付设置") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 微信支付设置增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxPayInput,
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
    22,
    fieldComments.lbl,
  );
  
  // 开发者ID
  await validators.chars_max_length(
    input.appid,
    22,
    fieldComments.appid,
  );
  
  // 商户号
  await validators.chars_max_length(
    input.mchid,
    32,
    fieldComments.mchid,
  );
  
  // 公钥
  await validators.chars_max_length(
    input.public_key,
    22,
    fieldComments.public_key,
  );
  
  // 私钥
  await validators.chars_max_length(
    input.private_key,
    22,
    fieldComments.private_key,
  );
  
  // APIv3密钥
  await validators.chars_max_length(
    input.v3_key,
    32,
    fieldComments.v3_key,
  );
  
  // 支付终端IP
  await validators.chars_max_length(
    input.payer_client_ip,
    45,
    fieldComments.payer_client_ip,
  );
  
  // 通知地址
  await validators.chars_max_length(
    input.notify_url,
    256,
    fieldComments.notify_url,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    255,
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

/**
 * 创建微信支付设置
 * @param {WxPayInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxPayId>} 
 */
export async function create(
  input: WxPayInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxPayId> {
  const table = "wx_wx_pay";
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
    let id: WxPayId | undefined = undefined;
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
    input.id = shortUuidV4<WxPayId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wx_wx_pay(
      id
      ,create_time
      ,update_time
  `;
  if (input.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,update_usr_id`;
    }
  }
  if (input.lbl != null) {
    sql += `,lbl`;
  }
  if (input.appid != null) {
    sql += `,appid`;
  }
  if (input.mchid != null) {
    sql += `,mchid`;
  }
  if (input.public_key != null) {
    sql += `,public_key`;
  }
  if (input.private_key != null) {
    sql += `,private_key`;
  }
  if (input.v3_key != null) {
    sql += `,v3_key`;
  }
  if (input.payer_client_ip != null) {
    sql += `,payer_client_ip`;
  }
  if (input.notify_url != null) {
    sql += `,notify_url`;
  }
  if (input.is_locked != null) {
    sql += `,is_locked`;
  }
  if (input.is_enabled != null) {
    sql += `,is_enabled`;
  }
  if (input.order_by != null) {
    sql += `,order_by`;
  }
  if (input.rem != null) {
    sql += `,rem`;
  }
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;
  if (input.tenant_id != null) {
    sql += `,${ args.push(input.tenant_id) }`;
  } else {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.lbl != null) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.appid != null) {
    sql += `,${ args.push(input.appid) }`;
  }
  if (input.mchid != null) {
    sql += `,${ args.push(input.mchid) }`;
  }
  if (input.public_key != null) {
    sql += `,${ args.push(input.public_key) }`;
  }
  if (input.private_key != null) {
    sql += `,${ args.push(input.private_key) }`;
  }
  if (input.v3_key != null) {
    sql += `,${ args.push(input.v3_key) }`;
  }
  if (input.payer_client_ip != null) {
    sql += `,${ args.push(input.payer_client_ip) }`;
  }
  if (input.notify_url != null) {
    sql += `,${ args.push(input.notify_url) }`;
  }
  if (input.is_locked != null) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.is_enabled != null) {
    sql += `,${ args.push(input.is_enabled) }`;
  }
  if (input.order_by != null) {
    sql += `,${ args.push(input.order_by) }`;
  }
  if (input.rem != null) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const res = await execute(sql, args, {
    debug,
  });
  log(JSON.stringify(res));
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "wx_wx_pay";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 微信支付设置根据id修改租户id
 * @param {WxPayId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxPayId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
  const sql = `
    update
      wx_wx_pay
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据 id 修改微信支付设置
 * @param {WxPayId} id
 * @param {WxPayInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxPayId>}
 */
export async function updateById(
  id: WxPayId,
  input: WxPayInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxPayId> {
  const table = "wx_wx_pay";
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
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id as unknown as TenantId);
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
        throw await ns("此 {0} 已经存在", await ns("微信支付设置"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("微信支付设置"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wx_wx_pay set
  `;
  let updateFldNum = 0;
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.appid != null) {
    if (input.appid != oldModel.appid) {
      sql += `appid = ${ args.push(input.appid) },`;
      updateFldNum++;
    }
  }
  if (input.mchid != null) {
    if (input.mchid != oldModel.mchid) {
      sql += `mchid = ${ args.push(input.mchid) },`;
      updateFldNum++;
    }
  }
  if (input.public_key != null) {
    if (input.public_key != oldModel.public_key) {
      sql += `public_key = ${ args.push(input.public_key) },`;
      updateFldNum++;
    }
  }
  if (input.private_key != null) {
    if (input.private_key != oldModel.private_key) {
      sql += `private_key = ${ args.push(input.private_key) },`;
      updateFldNum++;
    }
  }
  if (input.v3_key != null) {
    if (input.v3_key != oldModel.v3_key) {
      sql += `v3_key = ${ args.push(input.v3_key) },`;
      updateFldNum++;
    }
  }
  if (input.payer_client_ip != null) {
    if (input.payer_client_ip != oldModel.payer_client_ip) {
      sql += `payer_client_ip = ${ args.push(input.payer_client_ip) },`;
      updateFldNum++;
    }
  }
  if (input.notify_url != null) {
    if (input.notify_url != oldModel.notify_url) {
      sql += `notify_url = ${ args.push(input.notify_url) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked != null) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(input.is_locked) },`;
      updateFldNum++;
    }
  }
  if (input.is_enabled != null) {
    if (input.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled = ${ args.push(input.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (input.order_by != null) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by = ${ args.push(input.order_by) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem = ${ args.push(input.rem) },`;
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
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await delCache();
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除微信支付设置
 * @param {WxPayId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxPayId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
        wx_wx_pay
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
 * 根据 ID 查找微信支付设置是否已启用
 * 不存在则返回 undefined
 * @param {WxPayId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: WxPayId,
  options?: {
  },
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  return is_enabled;
}

/**
 * 根据 ids 启用或者禁用微信支付设置
 * @param {WxPayId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: WxPayId[],
  is_enabled: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
  let sql = `
    update
      wx_wx_pay
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找微信支付设置是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {WxPayId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: WxPayId,
  options?: {
  },
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  return is_locked;
}

/**
 * 根据 ids 锁定或者解锁微信支付设置
 * @param {WxPayId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: WxPayId[],
  is_locked: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      wx_wx_pay
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原微信支付设置
 * @param {WxPayId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxPayId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
    const id: WxPayId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_pay
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
        throw await ns("此 {0} 已经存在", await ns("微信支付设置"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除微信支付设置
 * @param {WxPayId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxPayId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
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
          wx_wx_pay
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wx_wx_pay
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
  
/**
 * 查找 微信支付设置 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wx_pay";
  const method = "findLastOrderBy";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  let sql = `
    select
      t.order_by order_by
    from
      wx_wx_pay t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);
  {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    whereQuery.push(`t.tenant_id = ${ args.push(tenant_id) }`);
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
