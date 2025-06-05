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

import Decimal from "decimal.js";

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

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import {
  getDictbiz,
} from "/src/base/dictbiz_detail/dictbiz_detail.dao.ts";

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
  PageInput,
  SortInput,
  OrderStatus,
  OrderType,
} from "/gen/types.ts";

import {
  findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findOneCard,
} from "/gen/wshop/card/card.dao.ts";

import {
  findOneOrg,
} from "/gen/base/org/org.dao.ts";

import {
  route_path,
} from "./order.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<OrderSearch>,
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
  if (search?.status != null) {
    whereQuery += ` and t.status in (${ args.push(search.status) })`;
  }
  if (search?.usr_id != null) {
    whereQuery += ` and t.usr_id in (${ args.push(search.usr_id) })`;
  }
  if (search?.usr_id_is_null) {
    whereQuery += ` and t.usr_id is null`;
  }
  if (search?.usr_id_lbl != null) {
    whereQuery += ` and usr_id_lbl.lbl in (${ args.push(search.usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.usr_id_lbl_like)) {
    whereQuery += ` and usr_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.usr_id_lbl_like) + "%") }`;
  }
  if (search?.card_id != null) {
    whereQuery += ` and t.card_id in (${ args.push(search.card_id) })`;
  }
  if (search?.card_id_is_null) {
    whereQuery += ` and t.card_id is null`;
  }
  if (search?.card_id_lbl != null) {
    whereQuery += ` and card_id_lbl.lbl in (${ args.push(search.card_id_lbl) })`;
  }
  if (isNotEmpty(search?.card_id_lbl_like)) {
    whereQuery += ` and card_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.card_id_lbl_like) + "%") }`;
  }
  if (search?.price != null) {
    if (search.price[0] != null) {
      whereQuery += ` and t.price>=${ args.push(search.price[0]) }`;
    }
    if (search.price[1] != null) {
      whereQuery += ` and t.price<=${ args.push(search.price[1]) }`;
    }
  }
  if (search?.type != null) {
    whereQuery += ` and t.type in (${ args.push(search.type) })`;
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
  if (search?.is_locked != null) {
    whereQuery += ` and t.is_locked in (${ args.push(search.is_locked) })`;
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in (${ args.push(search.is_enabled) })`;
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in (${ args.push(search.create_usr_id) })`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and create_usr_id_lbl.lbl in (${ args.push(search.create_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.create_usr_id_lbl_like)) {
    whereQuery += ` and create_usr_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.create_usr_id_lbl_like) + "%") }`;
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
    whereQuery += ` and update_usr_id_lbl.lbl in (${ args.push(search.update_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.update_usr_id_lbl_like)) {
    whereQuery += ` and update_usr_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.update_usr_id_lbl_like) + "%") }`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time>=${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time<=${ args.push(search.update_time[1]) }`;
    }
  }
  if (search?.org_id != null) {
    whereQuery += ` and t.org_id in (${ args.push(search.org_id) })`;
  }
  if (search?.org_id_is_null) {
    whereQuery += ` and t.org_id is null`;
  }
  if (search?.org_id_lbl != null) {
    whereQuery += ` and org_id_lbl.lbl in (${ args.push(search.org_id_lbl) })`;
  }
  if (isNotEmpty(search?.org_id_lbl_like)) {
    whereQuery += ` and org_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.org_id_lbl_like) + "%") }`;
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<OrderSearch>,
  options?: {
  },
) {
  let fromQuery = `wshop_order t
  left join base_usr usr_id_lbl on usr_id_lbl.id=t.usr_id
  left join wshop_card card_id_lbl on card_id_lbl.id=t.card_id
  left join base_usr create_usr_id_lbl on create_usr_id_lbl.id=t.create_usr_id
  left join base_usr update_usr_id_lbl on update_usr_id_lbl.id=t.update_usr_id
  left join base_org org_id_lbl on org_id_lbl.id=t.org_id`;
  return fromQuery;
}

// MARK: findCountOrder
/** 根据条件查找订单总数 */
export async function findCountOrder(
  search?: Readonly<OrderSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "findCountOrder";
  
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
  // 订单状态
  if (search && search.status != null) {
    const len = search.status.length;
    if (len === 0) {
      return 0;
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
      return 0;
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
      return 0;
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
      return 0;
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
      return 0;
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
  // 组织
  if (search && search.org_id != null) {
    const len = search.org_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.org_id.length > ${ ids_limit }`);
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

// MARK: findAllOrder
/** 根据搜索条件和分页查找订单列表 */
export async function findAllOrder(
  search?: Readonly<OrderSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<OrderModel[]> {
  
  const table = "wshop_order";
  const method = "findAllOrder";
  
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
  // 组织
  if (search && search.org_id != null) {
    const len = search.org_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.org_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,usr_id_lbl.lbl usr_id_lbl
      ,card_id_lbl.lbl card_id_lbl
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
      ,org_id_lbl.lbl org_id_lbl
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<OrderModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
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
    
    // 订单号-日期
    if (model.lbl_date_seq) {
      const lbl_date_seq = dayjs(model.lbl_date_seq);
      if (lbl_date_seq.isValid()) {
        model.lbl_date_seq = lbl_date_seq.format("YYYY-MM-DDTHH:mm:ss");
        model.lbl_date_seq_lbl = lbl_date_seq.format("YYYY-MM-DD");
      } else {
        model.lbl_date_seq_lbl = (model.lbl_date_seq || "").toString();
      }
    } else {
      model.lbl_date_seq_lbl = "";
    }
    
    // 订单状态
    let status_lbl = model.status as string;
    if (!isEmpty(model.status)) {
      const dictItem = statusDict.find((dictItem) => dictItem.val === model.status);
      if (dictItem) {
        status_lbl = dictItem.lbl;
      }
    }
    model.status_lbl = status_lbl || "";
    
    // 用户
    model.usr_id_lbl = model.usr_id_lbl || "";
    
    // 会员卡
    model.card_id_lbl = model.card_id_lbl || "";
    
    // 订单金额
    model.price = new Decimal(model.price ?? 0);
    
    // 订单类别
    let type_lbl = model.type as string;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl || "";
    
    // 消费充值金额
    model.amt = new Decimal(model.amt ?? 0);
    
    // 消费赠送金额
    model.give_amt = new Decimal(model.give_amt ?? 0);
    
    // 消费后充值余额
    model.balance = new Decimal(model.balance ?? 0);
    
    // 消费后赠送余额
    model.give_balance = new Decimal(model.give_balance ?? 0);
    
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
    
    // 创建人
    model.create_usr_id_lbl = model.create_usr_id_lbl || "";
    
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
    
    // 更新人
    model.update_usr_id_lbl = model.update_usr_id_lbl || "";
    
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
    
    // 组织
    model.org_id_lbl = model.org_id_lbl || "";
  }
  
  return result;
}

// MARK: setIdByLblOrder
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblOrder(
  input: OrderInput,
) {
  
  const options = {
    is_debug: false,
  };
  
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
  
  // 订单号-日期
  if (isNotEmpty(input.lbl_date_seq_lbl) && input.lbl_date_seq == null) {
    input.lbl_date_seq_lbl = String(input.lbl_date_seq_lbl).trim();
    input.lbl_date_seq = input.lbl_date_seq_lbl;
  }
  
  // 订单状态
  if (isNotEmpty(input.status_lbl) && input.status == null) {
    const val = statusDict.find((itemTmp) => itemTmp.lbl === input.status_lbl)?.val;
    if (val != null) {
      input.status = val as OrderStatus;
    }
  } else if (isEmpty(input.status_lbl) && input.status != null) {
    const lbl = statusDict.find((itemTmp) => itemTmp.val === input.status)?.lbl || "";
    input.status_lbl = lbl;
  }
  
  // 用户
  if (isNotEmpty(input.usr_id_lbl) && input.usr_id == null) {
    input.usr_id_lbl = String(input.usr_id_lbl).trim();
    const usrModel = await findOneUsr(
      {
        lbl: input.usr_id_lbl,
      },
      undefined,
      options,
    );
    if (usrModel) {
      input.usr_id = usrModel.id;
    }
  } else if (isEmpty(input.usr_id_lbl) && input.usr_id != null) {
    const usr_model = await findOneUsr(
      {
        id: input.usr_id,
      },
      undefined,
      options,
    );
    if (usr_model) {
      input.usr_id_lbl = usr_model.lbl;
    }
  }
  
  // 会员卡
  if (isNotEmpty(input.card_id_lbl) && input.card_id == null) {
    input.card_id_lbl = String(input.card_id_lbl).trim();
    const cardModel = await findOneCard(
      {
        lbl: input.card_id_lbl,
      },
      undefined,
      options,
    );
    if (cardModel) {
      input.card_id = cardModel.id;
    }
  } else if (isEmpty(input.card_id_lbl) && input.card_id != null) {
    const card_model = await findOneCard(
      {
        id: input.card_id,
      },
      undefined,
      options,
    );
    if (card_model) {
      input.card_id_lbl = card_model.lbl;
    }
  }
  
  // 订单类别
  if (isNotEmpty(input.type_lbl) && input.type == null) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === input.type_lbl)?.val;
    if (val != null) {
      input.type = val as OrderType;
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
  
  // 组织
  if (isNotEmpty(input.org_id_lbl) && input.org_id == null) {
    input.org_id_lbl = String(input.org_id_lbl).trim();
    const orgModel = await findOneOrg(
      {
        lbl: input.org_id_lbl,
      },
      undefined,
      options,
    );
    if (orgModel) {
      input.org_id = orgModel.id;
    }
  } else if (isEmpty(input.org_id_lbl) && input.org_id != null) {
    const org_model = await findOneOrg(
      {
        id: input.org_id,
      },
      undefined,
      options,
    );
    if (org_model) {
      input.org_id_lbl = org_model.lbl;
    }
  }
}

// MARK: getFieldCommentsOrder
/** 获取订单字段注释 */
export async function getFieldCommentsOrder(): Promise<OrderFieldComment> {
  const fieldComments: OrderFieldComment = {
    id: "ID",
    lbl: "订单号",
    company: "公司",
    phone: "联系电话",
    status: "订单状态",
    status_lbl: "订单状态",
    usr_id: "用户",
    usr_id_lbl: "用户",
    card_id: "会员卡",
    card_id_lbl: "会员卡",
    price: "订单金额",
    type: "订单类别",
    type_lbl: "订单类别",
    amt: "消费充值金额",
    give_amt: "消费赠送金额",
    integral: "获得积分",
    balance: "消费后充值余额",
    give_balance: "消费后赠送余额",
    is_locked: "锁定",
    is_locked_lbl: "锁定",
    is_enabled: "启用",
    is_enabled_lbl: "启用",
    rem: "备注",
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

// MARK: findByUniqueOrder
/** 通过唯一约束获得订单列表 */
export async function findByUniqueOrder(
  search0: Readonly<OrderInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel[]> {
  
  const table = "wshop_order";
  const method = "findByUniqueOrder";
  
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
    const model = await findOneOrder(
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
  const models: OrderModel[] = [ ];
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAllOrder(
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
export function equalsByUniqueOrder(
  oldModel: Readonly<OrderModel>,
  input: Readonly<OrderInput>,
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

// MARK: checkByUniqueOrder
/** 通过唯一约束检查 订单 是否已经存在 */
export async function checkByUniqueOrder(
  input: Readonly<OrderInput>,
  oldModel: Readonly<OrderModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueOrder(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 订单 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: OrderId = await updateByIdOrder(
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

// MARK: findOneOrder
/** 根据条件查找第一订单 */
export async function findOneOrder(
  search?: Readonly<OrderSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel | undefined> {
  
  const table = "wshop_order";
  const method = "findOneOrder";
  
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
  
  const order_models = await findAllOrder(
    search,
    page,
    sort,
    options,
  );
  
  const order_model = order_models[0];
  
  return order_model;
}

// MARK: findOneOkOrder
/** 根据条件查找第一订单, 如果不存在则抛错 */
export async function findOneOkOrder(
  search?: Readonly<OrderSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel> {
  
  const table = "wshop_order";
  const method = "findOneOkOrder";
  
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
  
  const order_models = await findAllOrder(
    search,
    page,
    sort,
    options,
  );
  
  const order_model = order_models[0];
  
  if (!order_model) {
    const err_msg = "此 订单 已被删除";
    throw new Error(err_msg);
  }
  
  return order_model;
}

// MARK: findByIdOrder
/** 根据 id 查找订单 */
export async function findByIdOrder(
  id: OrderId,
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel | undefined> {
  
  const table = "wshop_order";
  const method = "findByIdOrder";
  
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
  
  const order_model = await findOneOrder(
    {
      id,
    },
    undefined,
    options,
  );
  
  return order_model;
}

// MARK: findByIdOkOrder
/** 根据 id 查找订单, 如果不存在则抛错 */
export async function findByIdOkOrder(
  id: OrderId,
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel> {
  
  const table = "wshop_order";
  const method = "findByIdOkOrder";
  
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
  
  const order_model = await findByIdOrder(
    id,
    options,
  );
  
  if (!order_model) {
    const err_msg = "此 订单 已被删除";
    throw new Error(err_msg);
  }
  
  return order_model;
}

// MARK: findByIdsOrder
/** 根据 ids 查找订单 */
export async function findByIdsOrder(
  ids: OrderId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel[]> {
  
  const table = "wshop_order";
  const method = "findByIdsOrder";
  
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
  
  const models = await findAllOrder(
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

// MARK: findByIdsOkOrder
/** 根据 ids 查找订单, 出现查询不到的 id 则报错 */
export async function findByIdsOkOrder(
  ids: OrderId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<OrderModel[]> {
  
  const table = "wshop_order";
  const method = "findByIdsOkOrder";
  
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
  
  const models = await findByIdsOrder(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 订单 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 订单 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existOrder
/** 根据搜索条件判断订单是否存在 */
export async function existOrder(
  search?: Readonly<OrderSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wshop_order";
  const method = "existOrder";
  
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
  const model = await findOneOrder(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdOrder
/** 根据id判断订单是否存在 */
export async function existByIdOrder(
  id?: Readonly<OrderId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wshop_order";
  const method = "existByIdOrder";
  
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
  const sql = `select 1 e from wshop_order t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateIsEnabledOrder
/** 校验订单是否启用 */
export async function validateIsEnabledOrder(
  model: Readonly<OrderModel>,
) {
  if (model.is_enabled == 0) {
    throw "订单 已禁用";
  }
}

// MARK: validateOptionOrder
/** 校验订单是否存在 */
export async function validateOptionOrder(
  model?: OrderModel,
) {
  if (!model) {
    const err_msg = "订单 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateOrder
/** 订单增加和修改时校验输入 */
export async function validateOrder(
  input: Readonly<OrderInput>,
) {
  const fieldComments = await getFieldCommentsOrder();
  
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

// MARK: createReturnOrder
/** 创建 订单 并返回 */
export async function createReturnOrder(
  input: Readonly<OrderInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<OrderModel> {
  
  const table = "wshop_order";
  const method = "createReturnOrder";
  
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
  
  const model = await validateOptionOrder(
    await findOneOrder(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createOrder
/** 创建 订单 */
export async function createOrder(
  input: Readonly<OrderInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<OrderId> {
  
  const table = "wshop_order";
  const method = "createOrder";
  
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

// MARK: createsReturnOrder
/** 批量创建 订单 并返回 */
export async function createsReturnOrder(
  inputs: OrderInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<OrderModel[]> {
  
  const table = "wshop_order";
  const method = "createsReturnOrder";
  
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
  
  const models = await findByIdsOrder(ids, options);
  
  return models;
}

// MARK: createsOrder
/** 批量创建 订单 */
export async function createsOrder(
  inputs: OrderInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<OrderId[]> {
  
  const table = "wshop_order";
  const method = "createsOrder";
  
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
  inputs: OrderInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<OrderId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wshop_order";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: OrderId[] = [ ];
  const inputs2: OrderInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueOrder(input, options);
    if (oldModels.length > 0) {
      let id: OrderId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueOrder(
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into wshop_order(id,create_time,update_time,tenant_id,create_usr_id,update_usr_id,lbl_seq,lbl_date_seq,lbl,company,phone,status,usr_id,card_id,price,type,amt,give_amt,integral,balance,give_balance,is_locked,is_enabled,rem,org_id)values";
  
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
          const usr_id = await get_usr_id();
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
      }
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl_seq != null) {
        sql += `,${ args.push(input.lbl_seq) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl_date_seq != null || input.lbl_date_seq_save_null) {
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
      if (input.org_id != null) {
        sql += `,${ args.push(input.org_id) }`;
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

// MARK: updateTenantByIdOrder
/** 订单 根据 id 修改 租户id */
export async function updateTenantByIdOrder(
  id: OrderId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "updateTenantByIdOrder";
  
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
  const sql = `update wshop_order set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdOrder
/** 根据 id 修改 订单 */
export async function updateByIdOrder(
  id: OrderId,
  input: OrderInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<OrderId> {
  
  const table = "wshop_order";
  const method = "updateByIdOrder";
  
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
    throw new Error("updateByIdOrder: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdOrder: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdOrder(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueOrder(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 订单 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdOrder(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 订单 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wshop_order set `;
  let updateFldNum = 0;
  if (input.lbl_seq != null) {
    if (input.lbl_seq != oldModel.lbl_seq) {
      sql += `lbl_seq=${ args.push(input.lbl_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl_date_seq != null || input.lbl_date_seq_save_null) {
    if (input.lbl_date_seq != oldModel.lbl_date_seq) {
      sql += `lbl_date_seq=${ args.push(input.lbl_date_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.company != null) {
    if (input.company != oldModel.company) {
      sql += `company=${ args.push(input.company) },`;
      updateFldNum++;
    }
  }
  if (input.phone != null) {
    if (input.phone != oldModel.phone) {
      sql += `phone=${ args.push(input.phone) },`;
      updateFldNum++;
    }
  }
  if (input.status != null) {
    if (input.status != oldModel.status) {
      sql += `status=${ args.push(input.status) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id != null) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id=${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.card_id != null) {
    if (input.card_id != oldModel.card_id) {
      sql += `card_id=${ args.push(input.card_id) },`;
      updateFldNum++;
    }
  }
  if (input.price != null) {
    if (input.price != oldModel.price) {
      sql += `price=${ args.push(input.price) },`;
      updateFldNum++;
    }
  }
  if (input.type != null) {
    if (input.type != oldModel.type) {
      sql += `type=${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.amt != null) {
    if (input.amt != oldModel.amt) {
      sql += `amt=${ args.push(input.amt) },`;
      updateFldNum++;
    }
  }
  if (input.give_amt != null) {
    if (input.give_amt != oldModel.give_amt) {
      sql += `give_amt=${ args.push(input.give_amt) },`;
      updateFldNum++;
    }
  }
  if (input.integral != null) {
    if (input.integral != oldModel.integral) {
      sql += `integral=${ args.push(input.integral) },`;
      updateFldNum++;
    }
  }
  if (input.balance != null) {
    if (input.balance != oldModel.balance) {
      sql += `balance=${ args.push(input.balance) },`;
      updateFldNum++;
    }
  }
  if (input.give_balance != null) {
    if (input.give_balance != oldModel.give_balance) {
      sql += `give_balance=${ args.push(input.give_balance) },`;
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
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
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
  if (input.org_id != null) {
    if (input.org_id != oldModel.org_id) {
      sql += `org_id=${ args.push(input.org_id) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        const usr_id = await get_usr_id();
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
      } else if (input.update_usr_id as unknown as string !== "-") {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
    } else if (input.update_usr_id != null) {
      sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
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
      await execute(sql, args);
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsOrder
/** 根据 ids 删除 订单 */
export async function deleteByIdsOrder(
  ids: OrderId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "deleteByIdsOrder";
  
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
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdOrder(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wshop_order set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
  }
  
  return affectedRows;
}

// MARK: getIsEnabledByIdOrder
/** 根据 id 查找 订单 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledByIdOrder(
  id: OrderId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findByIdOrder(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIdsOrder
/** 根据 ids 启用或者禁用 订单 */
export async function enableByIdsOrder(
  ids: OrderId[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "enableByIdsOrder";
  
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
  const sql = `update wshop_order set is_enabled=${ args.push(is_enabled) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

// MARK: getIsLockedByIdOrder
/** 根据 id 查找 订单 是否已锁定, 不存在则返回 undefined, 已锁定的不能修改和删除 */
export async function getIsLockedByIdOrder(
  id: OrderId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const order_model = await findByIdOrder(
    id,
    options,
  );
  const is_locked = order_model?.is_locked as (0 | 1 | undefined);
  
  return is_locked;
}

// MARK: lockByIdsOrder
/** 根据 ids 锁定或者解锁 订单 */
export async function lockByIdsOrder(
  ids: OrderId[],
  is_locked: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "lockByIdsOrder";
  
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
  
  const args = new QueryArgs();
  let sql = `update wshop_order set is_locked=${ args.push(is_locked) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

// MARK: revertByIdsOrder
/** 根据 ids 还原 订单 */
export async function revertByIdsOrder(
  ids: OrderId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "revertByIdsOrder";
  
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
    let old_model = await findOneOrder(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdOrder(
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
      } as OrderInput;
      const models = await findByUniqueOrder(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 订单 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wshop_order set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsOrder
/** 根据 ids 彻底删除 订单 */
export async function forceDeleteByIdsOrder(
  ids: OrderId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_order";
  const method = "forceDeleteByIdsOrder";
  
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneOrder(
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
    const sql = `delete from wshop_order where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
