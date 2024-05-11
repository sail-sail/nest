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
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import {
  deepCompare,
} from "/lib/util/object_util.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import {
  getDictbiz,
} from "/src/base/dictbiz_detail/dictbiz_detail.dao.ts";

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
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
  OrderStatus,
  OrderType,
} from "/gen/types.ts";

import {
  findOne as findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findOne as findOneCard,
} from "/gen/wshop/card/card.dao.ts";

const route_path = "/wshop/order";

async function getWhereQuery(
  args: QueryArgs,
  search?: OrderSearch,
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
  if (search?.lbl_seq != null) {
    if (search.lbl_seq[0] != null) {
      whereQuery += ` and t.lbl_seq>=${ args.push(search.lbl_seq[0]) }`;
    }
    if (search.lbl_seq[1] != null) {
      whereQuery += ` and t.lbl_seq<=${ args.push(search.lbl_seq[1]) }`;
    }
  }
  if (search?.lbl_date_seq != null) {
    if (search.lbl_date_seq[0] != null) {
      whereQuery += ` and t.lbl_date_seq>=${ args.push(search.lbl_date_seq[0]) }`;
    }
    if (search.lbl_date_seq[1] != null) {
      whereQuery += ` and t.lbl_date_seq<=${ args.push(search.lbl_date_seq[1]) }`;
    }
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.company != null) {
    whereQuery += ` and t.company=${ args.push(search.company) }`;
  }
  if (isNotEmpty(search?.company_like)) {
    whereQuery += ` and t.company like ${ args.push("%" + sqlLike(search?.company_like) + "%") }`;
  }
  if (search?.phone != null) {
    whereQuery += ` and t.phone=${ args.push(search.phone) }`;
  }
  if (isNotEmpty(search?.phone_like)) {
    whereQuery += ` and t.phone like ${ args.push("%" + sqlLike(search?.phone_like) + "%") }`;
  }
  if (search?.status != null && !Array.isArray(search?.status)) {
    search.status = [ search.status ];
  }
  if (search?.status != null) {
    whereQuery += ` and t.status in ${ args.push(search.status) }`;
  }
  if (search?.usr_id != null && !Array.isArray(search?.usr_id)) {
    search.usr_id = [ search.usr_id ];
  }
  if (search?.usr_id != null) {
    whereQuery += ` and usr_id_lbl.id in ${ args.push(search.usr_id) }`;
  }
  if (search?.usr_id_is_null) {
    whereQuery += ` and usr_id_lbl.id is null`;
  }
  if (search?.card_id != null && !Array.isArray(search?.card_id)) {
    search.card_id = [ search.card_id ];
  }
  if (search?.card_id != null) {
    whereQuery += ` and card_id_lbl.id in ${ args.push(search.card_id) }`;
  }
  if (search?.card_id_is_null) {
    whereQuery += ` and card_id_lbl.id is null`;
  }
  if (search?.price != null) {
    if (search.price[0] != null) {
      whereQuery += ` and t.price>=${ args.push(search.price[0]) }`;
    }
    if (search.price[1] != null) {
      whereQuery += ` and t.price<=${ args.push(search.price[1]) }`;
    }
  }
  if (search?.type != null && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type != null) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.amt != null) {
    if (search.amt[0] != null) {
      whereQuery += ` and t.amt>=${ args.push(search.amt[0]) }`;
    }
    if (search.amt[1] != null) {
      whereQuery += ` and t.amt<=${ args.push(search.amt[1]) }`;
    }
  }
  if (search?.give_amt != null) {
    if (search.give_amt[0] != null) {
      whereQuery += ` and t.give_amt>=${ args.push(search.give_amt[0]) }`;
    }
    if (search.give_amt[1] != null) {
      whereQuery += ` and t.give_amt<=${ args.push(search.give_amt[1]) }`;
    }
  }
  if (search?.integral != null) {
    if (search.integral[0] != null) {
      whereQuery += ` and t.integral>=${ args.push(search.integral[0]) }`;
    }
    if (search.integral[1] != null) {
      whereQuery += ` and t.integral<=${ args.push(search.integral[1]) }`;
    }
  }
  if (search?.balance != null) {
    if (search.balance[0] != null) {
      whereQuery += ` and t.balance>=${ args.push(search.balance[0]) }`;
    }
    if (search.balance[1] != null) {
      whereQuery += ` and t.balance<=${ args.push(search.balance[1]) }`;
    }
  }
  if (search?.give_balance != null) {
    if (search.give_balance[0] != null) {
      whereQuery += ` and t.give_balance>=${ args.push(search.give_balance[0]) }`;
    }
    if (search.give_balance[1] != null) {
      whereQuery += ` and t.give_balance<=${ args.push(search.give_balance[1]) }`;
    }
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
    whereQuery += ` and create_usr_id_lbl.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
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
    whereQuery += ` and update_usr_id_lbl.id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
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
  search?: OrderSearch,
  options?: {
  },
) {
  let fromQuery = `wshop_order t
    left join base_usr usr_id_lbl on usr_id_lbl.id=t.usr_id
    left join wshop_card card_id_lbl on card_id_lbl.id=t.card_id
    left join base_usr create_usr_id_lbl on create_usr_id_lbl.id=t.create_usr_id
    left join base_usr update_usr_id_lbl on update_usr_id_lbl.id=t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找订单总数
 * @param { OrderSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: OrderSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = Number(model?.total || 0);
  
  return result;
}

/**
 * 根据搜索条件和分页查找订单列表
 * @param {OrderSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: OrderSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
    ids_limit?: number;
  },
): Promise<OrderModel[]> {
  const table = "wshop_order";
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
  // 订单状态
  if (search && search.status != null) {
    const len = search.status.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.status.length > ${ ids_limit }`);
    }
  }
  // 用户
  if (search && search.usr_id != null) {
    const len = search.usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.usr_id.length > ${ ids_limit }`);
    }
  }
  // 会员卡
  if (search && search.card_id != null) {
    const len = search.card_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.card_id.length > ${ ids_limit }`);
    }
  }
  // 订单类别
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
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,usr_id_lbl.lbl usr_id_lbl
      ,card_id_lbl.lbl card_id_lbl
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
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<OrderModel>(
    sql,
    args,
    {
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
  
  const [
    statusDict, // 订单状态
    typeDict, // 订单类别
  ] = await getDictbiz([
    "order_status",
    "order_type",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 订单状态
    let status_lbl = model.status as string;
    if (!isEmpty(model.status)) {
      const dictItem = statusDict.find((dictItem) => dictItem.val === model.status);
      if (dictItem) {
        status_lbl = dictItem.lbl;
      }
    }
    model.status_lbl = status_lbl;
    
    // 订单类别
    let type_lbl = model.type as string;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl;
    
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
  input: OrderInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  const [
    statusDict, // 订单状态
    typeDict, // 订单类别
  ] = await getDictbiz([
    "order_status",
    "order_type",
  ]);
  
  // 订单状态
  if (isNotEmpty(input.status_lbl) && input.status == null) {
    const val = statusDict.find((itemTmp) => itemTmp.lbl === input.status_lbl)?.val;
    if (val != null) {
      input.status = val as OrderStatus;
    }
  }
  
  // 用户
  if (isNotEmpty(input.usr_id_lbl) && input.usr_id == null) {
    input.usr_id_lbl = String(input.usr_id_lbl).trim();
    const usrModel = await findOneUsr({ lbl: input.usr_id_lbl });
    if (usrModel) {
      input.usr_id = usrModel.id;
    }
  }
  
  // 会员卡
  if (isNotEmpty(input.card_id_lbl) && input.card_id == null) {
    input.card_id_lbl = String(input.card_id_lbl).trim();
    const cardModel = await findOneCard({ lbl: input.card_id_lbl });
    if (cardModel) {
      input.card_id = cardModel.id;
    }
  }
  
  // 订单类别
  if (isNotEmpty(input.type_lbl) && input.type == null) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === input.type_lbl)?.val;
    if (val != null) {
      input.type = val as OrderType;
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
 * 获取订单字段注释
 */
export async function getFieldComments(): Promise<OrderFieldComment> {
  const n = initN(route_path);
  const fieldComments: OrderFieldComment = {
    id: await n("ID"),
    lbl: await n("订单号"),
    company: await n("公司"),
    phone: await n("联系电话"),
    status: await n("订单状态"),
    status_lbl: await n("订单状态"),
    usr_id: await n("用户"),
    usr_id_lbl: await n("用户"),
    card_id: await n("会员卡"),
    card_id_lbl: await n("会员卡"),
    price: await n("订单金额"),
    type: await n("订单类别"),
    type_lbl: await n("订单类别"),
    amt: await n("消费充值金额"),
    give_amt: await n("消费赠送金额"),
    integral: await n("获得积分"),
    balance: await n("消费后充值余额"),
    give_balance: await n("消费后赠送余额"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
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
 * 通过唯一约束获得订单列表
 * @param {OrderInput} search0
 */
export async function findByUnique(
  search0: OrderInput,
  options?: {
    debug?: boolean;
  },
): Promise<OrderModel[]> {
  
  const table = "wshop_order";
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
  const models: OrderModel[] = [ ];
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
 * @param {OrderModel} oldModel
 * @param {OrderInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: OrderModel,
  input: OrderInput,
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
 * 通过唯一约束检查订单是否已经存在
 * @param {OrderInput} input
 * @param {OrderModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<OrderId | undefined>}
 */
export async function checkByUnique(
  input: OrderInput,
  oldModel: OrderModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<OrderId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("订单")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: OrderId = await updateById(
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
 * 根据条件查找第一个订单
 * @param {OrderSearch} search?
 */
export async function findOne(
  search?: OrderSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<OrderModel | undefined> {
  const table = "wshop_order";
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
 * 根据 id 查找订单
 * @param {OrderId} id
 */
export async function findById(
  id?: OrderId | null,
  options?: {
    debug?: boolean;
  },
): Promise<OrderModel | undefined> {
  const table = "wshop_order";
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
 * 根据搜索条件判断订单是否存在
 * @param {OrderSearch} search?
 */
export async function exist(
  search?: OrderSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wshop_order";
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
 * 根据id判断订单是否存在
 * @param {OrderId} id
 */
export async function existById(
  id?: OrderId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wshop_order";
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
  const sql = `select 1 e from wshop_order t where t.id = ${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

/** 校验订单是否启用 */
export async function validateIsEnabled(
  model: OrderModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("订单") } ${ await ns("已禁用") }`;
  }
}

/** 校验订单是否存在 */
export async function validateOption(
  model?: OrderModel,
) {
  if (!model) {
    throw `${ await ns("订单") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 订单增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: OrderInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 订单号
  await validators.chars_max_length(
    input.lbl,
    22,
    fieldComments.lbl,
  );
  
  // 公司
  await validators.chars_max_length(
    input.company,
    50,
    fieldComments.company,
  );
  
  // 联系电话
  await validators.chars_max_length(
    input.phone,
    20,
    fieldComments.phone,
  );
  
  // 订单状态
  await validators.chars_max_length(
    input.status,
    22,
    fieldComments.status,
  );
  
  // 用户
  await validators.chars_max_length(
    input.usr_id,
    22,
    fieldComments.usr_id,
  );
  
  // 会员卡
  await validators.chars_max_length(
    input.card_id,
    22,
    fieldComments.card_id,
  );
  
  // 订单类别
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

/**
 * 创建订单
 * @param {OrderInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<OrderId>} 
 */
export async function create(
  input: OrderInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<OrderId> {
  const table = "wshop_order";
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
  
  const [ id ] = await _creates([ input ], options);
  
  return id;
}

/**
 * 批量创建订单
 * @param {OrderInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<OrderId[]>} 
 */
export async function creates(
  inputs: OrderInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<OrderId[]> {
  const table = "wshop_order";
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
  inputs: OrderInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<OrderId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wshop_order";
  
  const ids2: OrderId[] = [ ];
  const inputs2: OrderInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: OrderId | undefined = undefined;
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
    
    const id = shortUuidV4<OrderId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wshop_order(id,create_time,tenant_id,org_id,create_usr_id,lbl_seq,lbl_date_seq,lbl,company,phone,status,usr_id,card_id,price,type,amt,give_amt,integral,balance,give_balance,is_locked,is_enabled,rem)values`;
  
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
      if (input.tenant_id != null) {
        sql += `,${ args.push(input.tenant_id) }`;
      } else {
        const authModel = await getAuthModel();
        const tenant_id = await getTenant_id(authModel?.id);
        if (tenant_id) {
          sql += `,${ args.push(tenant_id) }`;
        } else {
          sql += ",default";
        }
      }
      if (input.org_id != null) {
        sql += `,${ args.push(input.org_id) }`;
      } else {
        const authModel = await getAuthModel();
        const org_id = authModel?.org_id;
        if (org_id != null) {
          sql += `,${ args.push(org_id) }`;
        } else {
          sql += ",default";
        }
      }
      if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
        sql += `,${ args.push(input.create_usr_id) }`;
      } else {
        const authModel = await getAuthModel();
        if (authModel?.id != null) {
          sql += `,${ args.push(authModel.id) }`;
        } else {
          sql += ",default";
        }
      }
      if (input.lbl_seq != null) {
        sql += `,${ args.push(input.lbl_seq) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl_date_seq != null) {
        sql += `,${ args.push(input.lbl_date_seq) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.company != null) {
        sql += `,${ args.push(input.company) }`;
      } else {
        sql += ",default";
      }
      if (input.phone != null) {
        sql += `,${ args.push(input.phone) }`;
      } else {
        sql += ",default";
      }
      if (input.status != null) {
        sql += `,${ args.push(input.status) }`;
      } else {
        sql += ",default";
      }
      if (input.usr_id != null) {
        sql += `,${ args.push(input.usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.card_id != null) {
        sql += `,${ args.push(input.card_id) }`;
      } else {
        sql += ",default";
      }
      if (input.price != null) {
        sql += `,${ args.push(input.price) }`;
      } else {
        sql += ",default";
      }
      if (input.type != null) {
        sql += `,${ args.push(input.type) }`;
      } else {
        sql += ",default";
      }
      if (input.amt != null) {
        sql += `,${ args.push(input.amt) }`;
      } else {
        sql += ",default";
      }
      if (input.give_amt != null) {
        sql += `,${ args.push(input.give_amt) }`;
      } else {
        sql += ",default";
      }
      if (input.integral != null) {
        sql += `,${ args.push(input.integral) }`;
      } else {
        sql += ",default";
      }
      if (input.balance != null) {
        sql += `,${ args.push(input.balance) }`;
      } else {
        sql += ",default";
      }
      if (input.give_balance != null) {
        sql += `,${ args.push(input.give_balance) }`;
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
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
  }
  
  return ids2;
}

/**
 * 订单根据id修改租户id
 * @param {OrderId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: OrderId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
      wshop_order
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 订单根据id修改组织id
 * @export
 * @param {OrderId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: OrderId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "wshop_order";
  const method = "updateOrgById";
  
  const orgExist = await existByIdOrg(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wshop_order
    set
      update_time = ${ args.push(reqDate()) },
      org_id = ${ args.push(org_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 根据 id 修改订单
 * @param {OrderId} id
 * @param {OrderInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<OrderId>}
 */
export async function updateById(
  id: OrderId,
  input: OrderInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<OrderId> {
  
  const table = "wshop_order";
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
        throw await ns("此 {0} 已经存在", await ns("订单"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("订单"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wshop_order set
  `;
  let updateFldNum = 0;
  if (input.lbl_seq != null) {
    if (input.lbl_seq != oldModel.lbl_seq) {
      sql += `lbl_seq = ${ args.push(input.lbl_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl_date_seq != null) {
    if (input.lbl_date_seq != oldModel.lbl_date_seq) {
      sql += `lbl_date_seq = ${ args.push(input.lbl_date_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.company != null) {
    if (input.company != oldModel.company) {
      sql += `company = ${ args.push(input.company) },`;
      updateFldNum++;
    }
  }
  if (input.phone != null) {
    if (input.phone != oldModel.phone) {
      sql += `phone = ${ args.push(input.phone) },`;
      updateFldNum++;
    }
  }
  if (input.status != null) {
    if (input.status != oldModel.status) {
      sql += `status = ${ args.push(input.status) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id != null) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id = ${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.card_id != null) {
    if (input.card_id != oldModel.card_id) {
      sql += `card_id = ${ args.push(input.card_id) },`;
      updateFldNum++;
    }
  }
  if (input.price != null) {
    if (input.price != oldModel.price) {
      sql += `price = ${ args.push(input.price) },`;
      updateFldNum++;
    }
  }
  if (input.type != null) {
    if (input.type != oldModel.type) {
      sql += `type = ${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.amt != null) {
    if (input.amt != oldModel.amt) {
      sql += `amt = ${ args.push(input.amt) },`;
      updateFldNum++;
    }
  }
  if (input.give_amt != null) {
    if (input.give_amt != oldModel.give_amt) {
      sql += `give_amt = ${ args.push(input.give_amt) },`;
      updateFldNum++;
    }
  }
  if (input.integral != null) {
    if (input.integral != oldModel.integral) {
      sql += `integral = ${ args.push(input.integral) },`;
      updateFldNum++;
    }
  }
  if (input.balance != null) {
    if (input.balance != oldModel.balance) {
      sql += `balance = ${ args.push(input.balance) },`;
      updateFldNum++;
    }
  }
  if (input.give_balance != null) {
    if (input.give_balance != oldModel.give_balance) {
      sql += `give_balance = ${ args.push(input.give_balance) },`;
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
    if (input.update_time) {
      sql += `update_time = ${ args.push(input.update_time) }`;
    } else {
      sql += `update_time = ${ args.push(reqDate()) }`;
    }
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await execute(sql, args);
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OrderId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `update wshop_order set is_deleted=1,delete_time=${ args.push(reqDate()) } where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

/**
 * 根据 ID 查找订单是否已启用
 * 不存在则返回 undefined
 * @param {OrderId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: OrderId,
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
 * 根据 ids 启用或者禁用订单
 * @param {OrderId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: OrderId[],
  is_enabled: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
  
  const args = new QueryArgs();
  const sql = `update wshop_order set is_enabled=${ args.push(is_enabled) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

/**
 * 根据 ID 查找订单是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {OrderId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: OrderId,
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
 * 根据 ids 锁定或者解锁订单
 * @param {OrderId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: OrderId[],
  is_locked: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
  
  const args = new QueryArgs();
  let sql = `update wshop_order set is_locked=${ args.push(is_locked) } where id in ${ args.push(ids) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

/**
 * 根据 ids 还原订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: OrderId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: OrderId = ids[i];
    const args = new QueryArgs();
    const sql = `update wshop_order set is_deleted = 0 where id = ${ args.push(id) } limit 1`;
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
        throw await ns("此 {0} 已经存在", await ns("订单"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OrderId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_order";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `select * from wshop_order where id = ${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wshop_order where id = ${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
