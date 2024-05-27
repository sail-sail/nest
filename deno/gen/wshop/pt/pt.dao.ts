// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
  splitCreateArr,
  FIND_ALL_IDS_LIMIT,
} from "/lib/util/dao_util.ts";

import Decimal from "decimal.js";

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
  existById as existByIdOrg,
} from "/gen/base/org/org.dao.ts";

import {
  many2manyUpdate,
} from "/lib/util/dao_util.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

const route_path = "/wshop/pt";

async function getWhereQuery(
  args: QueryArgs,
  search?: PtSearch,
  options?: {
  },
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
  
  if (search?.org_id == null) {
    const authModel = await getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery += ` and t.org_id=${ args.push(org_id) }`;
    }
  } else if (search?.org_id != null && search?.org_id !== "-") {
    whereQuery += ` and t.org_id=${ args.push(search.org_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.img != null) {
    whereQuery += ` and t.img=${ args.push(search.img) }`;
  }
  if (isNotEmpty(search?.img_like)) {
    whereQuery += ` and t.img like ${ args.push("%" + sqlLike(search?.img_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.pt_type_ids != null && !Array.isArray(search?.pt_type_ids)) {
    search.pt_type_ids = [ search.pt_type_ids ];
  }
  if (search?.pt_type_ids != null) {
    whereQuery += ` and wshop_pt_type.id in ${ args.push(search.pt_type_ids) }`;
  }
  if (search?.pt_type_ids_is_null) {
    whereQuery += ` and wshop_pt_type.id is null`;
  }
  if (search?.price != null) {
    if (search.price[0] != null) {
      whereQuery += ` and t.price>=${ args.push(search.price[0]) }`;
    }
    if (search.price[1] != null) {
      whereQuery += ` and t.price<=${ args.push(search.price[1]) }`;
    }
  }
  if (search?.original_price != null) {
    if (search.original_price[0] != null) {
      whereQuery += ` and t.original_price>=${ args.push(search.original_price[0]) }`;
    }
    if (search.original_price[1] != null) {
      whereQuery += ` and t.original_price<=${ args.push(search.original_price[1]) }`;
    }
  }
  if (search?.unit != null) {
    whereQuery += ` and t.unit=${ args.push(search.unit) }`;
  }
  if (isNotEmpty(search?.unit_like)) {
    whereQuery += ` and t.unit like ${ args.push("%" + sqlLike(search?.unit_like) + "%") }`;
  }
  if (search?.is_new != null && !Array.isArray(search?.is_new)) {
    search.is_new = [ search.is_new ];
  }
  if (search?.is_new != null) {
    whereQuery += ` and t.is_new in ${ args.push(search.is_new) }`;
  }
  if (search?.introduct != null) {
    whereQuery += ` and t.introduct=${ args.push(search.introduct) }`;
  }
  if (isNotEmpty(search?.introduct_like)) {
    whereQuery += ` and t.introduct like ${ args.push("%" + sqlLike(search?.introduct_like) + "%") }`;
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
      whereQuery += ` and t.order_by>=${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by<=${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.detail != null) {
    whereQuery += ` and t.detail=${ args.push(search.detail) }`;
  }
  if (isNotEmpty(search?.detail_like)) {
    whereQuery += ` and t.detail like ${ args.push("%" + sqlLike(search?.detail_like) + "%") }`;
  }
  if (search?.detail_top_img != null) {
    whereQuery += ` and t.detail_top_img=${ args.push(search.detail_top_img) }`;
  }
  if (isNotEmpty(search?.detail_top_img_like)) {
    whereQuery += ` and t.detail_top_img like ${ args.push("%" + sqlLike(search?.detail_top_img_like) + "%") }`;
  }
  if (search?.detail_bottom_img != null) {
    whereQuery += ` and t.detail_bottom_img=${ args.push(search.detail_bottom_img) }`;
  }
  if (isNotEmpty(search?.detail_bottom_img_like)) {
    whereQuery += ` and t.detail_bottom_img like ${ args.push("%" + sqlLike(search?.detail_bottom_img_like) + "%") }`;
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_usr_id != null && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id != null && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and t.update_usr_id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
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
  search?: PtSearch,
  options?: {
  },
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `wshop_pt t
    left join wshop_pt_pt_type
      on wshop_pt_pt_type.pt_id=t.id
      and wshop_pt_pt_type.is_deleted=${ args.push(is_deleted) }
    left join wshop_pt_type
      on wshop_pt_pt_type.pt_type_id=wshop_pt_type.id
      and wshop_pt_type.is_deleted=${ args.push(is_deleted) }
    left join(select
    json_objectagg(wshop_pt_pt_type.order_by,wshop_pt_type.id) pt_type_ids,
    json_objectagg(wshop_pt_pt_type.order_by,wshop_pt_type.lbl) pt_type_ids_lbl,
    wshop_pt.id pt_id
    from wshop_pt_pt_type
    inner join wshop_pt_type on wshop_pt_type.id=wshop_pt_pt_type.pt_type_id
    inner join wshop_pt on wshop_pt.id=wshop_pt_pt_type.pt_id
    where wshop_pt_pt_type.is_deleted=${ args.push(is_deleted) }
    group by pt_id) _pt_type on _pt_type.pt_id=t.id
    left join base_usr create_usr_id_lbl on create_usr_id_lbl.id=t.create_usr_id
    left join base_usr update_usr_id_lbl on update_usr_id_lbl.id=t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找产品总数
 * @param { PtSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PtSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
 * 根据搜索条件和分页查找产品列表
 * @param {PtSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: PtSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
    ids_limit?: number;
  },
): Promise<PtModel[]> {
  const table = "wshop_pt";
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
  // 产品类别
  if (search && search.pt_type_ids != null) {
    const len = search.pt_type_ids.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.pt_type_ids.length > ${ ids_limit }`);
    }
  }
  // 新品
  if (search && search.is_new != null) {
    const len = search.is_new.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_new.length > ${ ids_limit }`);
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
      ,max(pt_type_ids) pt_type_ids
      ,max(pt_type_ids_lbl) pt_type_ids_lbl
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
  
  const result = await query<PtModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug,
    },
  );
  for (const item of result) {
    
    // 产品类别
    if (item.pt_type_ids) {
      const obj = item.pt_type_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.pt_type_ids = keys.map((key) => obj[key]);
    } else {
      item.pt_type_ids = [ ];
    }
    if (item.pt_type_ids_lbl) {
      const obj = item.pt_type_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.pt_type_ids_lbl = keys.map((key) => obj[key]);
    } else {
      item.pt_type_ids_lbl = [ ];
    }
  }
  
  const [
    is_newDict, // 新品
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "yes_no",
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 新品
    let is_new_lbl = model.is_new?.toString() || "";
    if (model.is_new != null) {
      const dictItem = is_newDict.find((dictItem) => dictItem.val === model.is_new.toString());
      if (dictItem) {
        is_new_lbl = dictItem.lbl;
      }
    }
    model.is_new_lbl = is_new_lbl || "";
    
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
    
    // 创建人
    model.create_usr_id_lbl = model.create_usr_id_lbl || "";
    
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
    
    // 更新人
    model.update_usr_id_lbl = model.update_usr_id_lbl || "";
    
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
  input: PtInput,
) {
  
  const [
    is_newDict, // 新品
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "yes_no",
    "is_locked",
    "is_enabled",
  ]);
  
  // 产品类别
  if (!input.pt_type_ids && input.pt_type_ids_lbl) {
    input.pt_type_ids_lbl = input.pt_type_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.pt_type_ids_lbl = Array.from(new Set(input.pt_type_ids_lbl));
    if (input.pt_type_ids_lbl.length === 0) {
      input.pt_type_ids = [ ];
    } else {
      const debug = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select
          t.id
        from
          wshop_pt_type t
        where
          t.lbl in ${ args.push(input.pt_type_ids_lbl) }`;
      interface Result {
        id: PtTypeId;
      }
      const models = await query<Result>(sql, args, {
        debug,
      });
      input.pt_type_ids = models.map((item: { id: PtTypeId }) => item.id);
    }
  }
  
  // 新品
  if (isNotEmpty(input.is_new_lbl) && input.is_new == null) {
    const val = is_newDict.find((itemTmp) => itemTmp.lbl === input.is_new_lbl)?.val;
    if (val != null) {
      input.is_new = Number(val);
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
 * 获取产品字段注释
 */
export async function getFieldComments(): Promise<PtFieldComment> {
  const n = initN(route_path);
  const fieldComments: PtFieldComment = {
    id: await n("ID"),
    img: await n("图标"),
    lbl: await n("名称"),
    pt_type_ids: await n("产品类别"),
    pt_type_ids_lbl: await n("产品类别"),
    price: await n("价格"),
    original_price: await n("原价"),
    unit: await n("单位"),
    is_new: await n("新品"),
    is_new_lbl: await n("新品"),
    introduct: await n("简介"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
    detail: await n("详情"),
    detail_top_img: await n("详情顶部图片"),
    detail_bottom_img: await n("详情底部图片"),
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
 * 通过唯一约束获得产品列表
 * @param {PtInput} search0
 */
export async function findByUnique(
  search0: PtInput,
  options?: {
    debug?: boolean;
  },
): Promise<PtModel[]> {
  
  const table = "wshop_pt";
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
  const models: PtModel[] = [ ];
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
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {PtModel} oldModel
 * @param {PtInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: PtModel,
  input: PtInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查产品是否已经存在
 * @param {PtInput} input
 * @param {PtModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<PtId | undefined>}
 */
export async function checkByUnique(
  input: PtInput,
  oldModel: PtModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<PtId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("产品")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: PtId = await updateById(
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
 * 根据条件查找第一个产品
 * @param {PtSearch} search?
 */
export async function findOne(
  search?: PtSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<PtModel | undefined> {
  const table = "wshop_pt";
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
 * 根据 id 查找产品
 * @param {PtId} id
 */
export async function findById(
  id?: PtId | null,
  options?: {
    debug?: boolean;
  },
): Promise<PtModel | undefined> {
  const table = "wshop_pt";
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

/** 根据 ids 查找产品 */
export async function findByIds(
  ids: PtId[],
  options?: {
    debug?: boolean;
  },
): Promise<PtModel[]> {
  const table = "wshop_pt";
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
    options = options || { };
    options.debug = false;
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
 * 根据搜索条件判断产品是否存在
 * @param {PtSearch} search?
 */
export async function exist(
  search?: PtSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wshop_pt";
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
 * 根据id判断产品是否存在
 * @param {PtId} id
 */
export async function existById(
  id?: PtId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wshop_pt";
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
  const sql = `select 1 e from wshop_pt t where t.id = ${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

/** 校验产品是否启用 */
export async function validateIsEnabled(
  model: PtModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("产品") } ${ await ns("已禁用") }`;
  }
}

/** 校验产品是否存在 */
export async function validateOption(
  model?: PtModel,
) {
  if (!model) {
    throw `${ await ns("产品") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 产品增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: PtInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 图标
  await validators.chars_max_length(
    input.img,
    100,
    fieldComments.img,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    200,
    fieldComments.lbl,
  );
  
  // 单位
  await validators.chars_max_length(
    input.unit,
    10,
    fieldComments.unit,
  );
  
  // 简介
  await validators.chars_max_length(
    input.introduct,
    100,
    fieldComments.introduct,
  );
  
  // 详情
  await validators.chars_max_length(
    input.detail,
    200,
    fieldComments.detail,
  );
  
  // 详情顶部图片
  await validators.chars_max_length(
    input.detail_top_img,
    200,
    fieldComments.detail_top_img,
  );
  
  // 详情底部图片
  await validators.chars_max_length(
    input.detail_bottom_img,
    200,
    fieldComments.detail_bottom_img,
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

/**
 * 创建产品
 * @param {PtInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<PtId>} 
 */
export async function create(
  input: PtInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<PtId> {
  const table = "wshop_pt";
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
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

/**
 * 批量创建产品
 * @param {PtInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<PtId[]>} 
 */
export async function creates(
  inputs: PtInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<PtId[]> {
  const table = "wshop_pt";
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
    options = options || { };
    options.debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: PtInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<PtId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wshop_pt";
  
  const ids2: PtId[] = [ ];
  const inputs2: PtInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: PtId | undefined = undefined;
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
    
    const id = shortUuidV4<PtId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wshop_pt(id,create_time,tenant_id,org_id,create_usr_id,img,lbl,price,original_price,unit,is_new,introduct,is_locked,is_enabled,order_by,detail,detail_top_img,detail_bottom_img,rem)values`;
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (input.create_time != null) {
        sql += `,${ args.push(input.create_time) }`;
      } else {
        sql += `,${ args.push(reqDate()) }`;
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
      if (input.org_id == null) {
        const authModel = await getAuthModel();
        const org_id = authModel?.org_id;
        if (org_id != null) {
          sql += `,${ args.push(org_id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.org_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.org_id) }`;
      }
      if (input.create_usr_id == null) {
        const authModel = await getAuthModel();
        if (authModel?.id != null) {
          sql += `,${ args.push(authModel.id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.create_usr_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.create_usr_id) }`;
      }
      if (input.img != null) {
        sql += `,${ args.push(input.img) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.price != null) {
        sql += `,${ args.push(input.price) }`;
      } else {
        sql += ",default";
      }
      if (input.original_price != null) {
        sql += `,${ args.push(input.original_price) }`;
      } else {
        sql += ",default";
      }
      if (input.unit != null) {
        sql += `,${ args.push(input.unit) }`;
      } else {
        sql += ",default";
      }
      if (input.is_new != null) {
        sql += `,${ args.push(input.is_new) }`;
      } else {
        sql += ",default";
      }
      if (input.introduct != null) {
        sql += `,${ args.push(input.introduct) }`;
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
      if (input.detail != null) {
        sql += `,${ args.push(input.detail) }`;
      } else {
        sql += ",default";
      }
      if (input.detail_top_img != null) {
        sql += `,${ args.push(input.detail_top_img) }`;
      } else {
        sql += ",default";
      }
      if (input.detail_bottom_img != null) {
        sql += `,${ args.push(input.detail_bottom_img) }`;
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
    
    // 产品类别
    await many2manyUpdate(
      input,
      "pt_type_ids",
      {
        mod: "wshop",
        table: "pt_pt_type",
        column1: "pt_id",
        column2: "pt_type_id",
      },
    );
  }
  
  await delCache();
  
  return ids2;
}

/**
 * 删除缓存
 */
export async function delCache() {
  await delCacheCtx(`dao.sql.wshop_pt`);
}

/**
 * 产品根据id修改租户id
 * @param {PtId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: PtId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
  const sql = `update wshop_pt set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 产品根据id修改组织id
 * @export
 * @param {PtId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: PtId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "wshop_pt";
  const method = "updateOrgById";
  
  const orgExist = await existByIdOrg(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update wshop_pt set org_id=${ args.push(org_id) } where id=${ args.push(id) }
  `;
  
  await delCache();
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据 id 修改产品
 * @param {PtId} id
 * @param {PtInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<PtId>}
 */
export async function updateById(
  id: PtId,
  input: PtInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<PtId> {
  
  const table = "wshop_pt";
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
  
  // 修改组织id
  if (isNotEmpty(input.org_id)) {
    await updateOrgById(id, input.org_id as unknown as OrgId);
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
        throw await ns("此 {0} 已经存在", await ns("产品"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("产品"));
  }
  
  const args = new QueryArgs();
  let sql = `update wshop_pt set `;
  let updateFldNum = 0;
  if (input.img != null) {
    if (input.img != oldModel.img) {
      sql += `img=${ args.push(input.img) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.price != null) {
    if (input.price != oldModel.price) {
      sql += `price=${ args.push(input.price) },`;
      updateFldNum++;
    }
  }
  if (input.original_price != null) {
    if (input.original_price != oldModel.original_price) {
      sql += `original_price=${ args.push(input.original_price) },`;
      updateFldNum++;
    }
  }
  if (input.unit != null) {
    if (input.unit != oldModel.unit) {
      sql += `unit=${ args.push(input.unit) },`;
      updateFldNum++;
    }
  }
  if (input.is_new != null) {
    if (input.is_new != oldModel.is_new) {
      sql += `is_new=${ args.push(input.is_new) },`;
      updateFldNum++;
    }
  }
  if (input.introduct != null) {
    if (input.introduct != oldModel.introduct) {
      sql += `introduct=${ args.push(input.introduct) },`;
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
  if (input.detail != null) {
    if (input.detail != oldModel.detail) {
      sql += `detail=${ args.push(input.detail) },`;
      updateFldNum++;
    }
  }
  if (input.detail_top_img != null) {
    if (input.detail_top_img != oldModel.detail_top_img) {
      sql += `detail_top_img=${ args.push(input.detail_top_img) },`;
      updateFldNum++;
    }
  }
  if (input.detail_bottom_img != null) {
    if (input.detail_bottom_img != oldModel.detail_bottom_img) {
      sql += `detail_bottom_img=${ args.push(input.detail_bottom_img) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  
  updateFldNum++;
  
  // 产品类别
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "pt_type_ids",
    {
      mod: "wshop",
      table: "pt_pt_type",
      column1: "pt_id",
      column2: "pt_type_id",
    },
  );
  
  if (updateFldNum > 0) {
    if (input.update_usr_id == null) {
      const authModel = await getAuthModel();
      if (authModel?.id != null) {
        sql += `update_usr_id=${ args.push(authModel.id) },`;
      }
    } else if (input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
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
 * 根据 ids 删除产品
 * @param {PtId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: PtId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
  
  await delCache();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `update wshop_pt set is_deleted=1,delete_time=${ args.push(reqDate()) } where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找产品是否已启用
 * 不存在则返回 undefined
 * @param {PtId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: PtId,
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
 * 根据 ids 启用或者禁用产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: PtId[],
  is_enabled: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
  const sql = `update wshop_pt set is_enabled=${ args.push(is_enabled) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找产品是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {PtId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: PtId,
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
 * 根据 ids 锁定或者解锁产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: PtId[],
  is_locked: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
  let sql = `update wshop_pt set is_locked=${ args.push(is_locked) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原产品
 * @param {PtId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: PtId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
    const id: PtId = ids[i];
    const args = new QueryArgs();
    const sql = `update wshop_pt set is_deleted = 0 where id = ${ args.push(id) } limit 1`;
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
      } as PtInput;
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("产品"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除产品
 * @param {PtId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: PtId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
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
      const sql = `select * from wshop_pt where id = ${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wshop_pt where id = ${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
  
/**
 * 查找 产品 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_pt";
  const method = "findLastOrderBy";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  let sql = `select t.order_by order_by from wshop_pt t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);
  {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    whereQuery.push(` t.tenant_id=${ args.push(tenant_id) }`);
  }
  {
    const authModel = await getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery.push(` t.org_id=${ args.push(org_id) }`);
    }
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
