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
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiCurrency,
} from "/gen/types.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./pay_transactions_jsapi.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<PayTransactionsJsapiSearch>,
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
  if (search?.appid != null) {
    whereQuery += ` and t.appid=${ args.push(search.appid) }`;
  }
  if (isNotEmpty(search?.appid_like)) {
    whereQuery += ` and t.appid like ${ args.push("%" + sqlLike(search?.appid_like) + "%") }`;
  }
  if (search?.mchid != null) {
    whereQuery += ` and t.mchid=${ args.push(search.mchid) }`;
  }
  if (isNotEmpty(search?.mchid_like)) {
    whereQuery += ` and t.mchid like ${ args.push("%" + sqlLike(search?.mchid_like) + "%") }`;
  }
  if (search?.description != null) {
    whereQuery += ` and t.description=${ args.push(search.description) }`;
  }
  if (isNotEmpty(search?.description_like)) {
    whereQuery += ` and t.description like ${ args.push("%" + sqlLike(search?.description_like) + "%") }`;
  }
  if (search?.out_trade_no != null) {
    whereQuery += ` and t.out_trade_no=${ args.push(search.out_trade_no) }`;
  }
  if (isNotEmpty(search?.out_trade_no_like)) {
    whereQuery += ` and t.out_trade_no like ${ args.push("%" + sqlLike(search?.out_trade_no_like) + "%") }`;
  }
  if (search?.transaction_id != null) {
    whereQuery += ` and t.transaction_id=${ args.push(search.transaction_id) }`;
  }
  if (isNotEmpty(search?.transaction_id_like)) {
    whereQuery += ` and t.transaction_id like ${ args.push("%" + sqlLike(search?.transaction_id_like) + "%") }`;
  }
  if (search?.trade_state != null) {
    whereQuery += ` and t.trade_state in (${ args.push(search.trade_state) })`;
  }
  if (search?.trade_state_desc != null) {
    whereQuery += ` and t.trade_state_desc=${ args.push(search.trade_state_desc) }`;
  }
  if (isNotEmpty(search?.trade_state_desc_like)) {
    whereQuery += ` and t.trade_state_desc like ${ args.push("%" + sqlLike(search?.trade_state_desc_like) + "%") }`;
  }
  if (search?.success_time != null) {
    if (search.success_time[0] != null) {
      whereQuery += ` and t.success_time>=${ args.push(search.success_time[0]) }`;
    }
    if (search.success_time[1] != null) {
      whereQuery += ` and t.success_time<=${ args.push(search.success_time[1]) }`;
    }
  }
  if (search?.time_expire != null) {
    whereQuery += ` and t.time_expire=${ args.push(search.time_expire) }`;
  }
  if (isNotEmpty(search?.time_expire_like)) {
    whereQuery += ` and t.time_expire like ${ args.push("%" + sqlLike(search?.time_expire_like) + "%") }`;
  }
  if (search?.attach != null) {
    whereQuery += ` and t.attach=${ args.push(search.attach) }`;
  }
  if (isNotEmpty(search?.attach_like)) {
    whereQuery += ` and t.attach like ${ args.push("%" + sqlLike(search?.attach_like) + "%") }`;
  }
  if (search?.attach2 != null) {
    whereQuery += ` and t.attach2=${ args.push(search.attach2) }`;
  }
  if (isNotEmpty(search?.attach2_like)) {
    whereQuery += ` and t.attach2 like ${ args.push("%" + sqlLike(search?.attach2_like) + "%") }`;
  }
  if (search?.notify_url != null) {
    whereQuery += ` and t.notify_url=${ args.push(search.notify_url) }`;
  }
  if (isNotEmpty(search?.notify_url_like)) {
    whereQuery += ` and t.notify_url like ${ args.push("%" + sqlLike(search?.notify_url_like) + "%") }`;
  }
  if (search?.receipt != null) {
    whereQuery += ` and t.receipt=${ args.push(search.receipt) }`;
  }
  if (isNotEmpty(search?.receipt_like)) {
    whereQuery += ` and t.receipt like ${ args.push("%" + sqlLike(search?.receipt_like) + "%") }`;
  }
  if (search?.profit_sharing != null) {
    whereQuery += ` and t.profit_sharing=${ args.push(search.profit_sharing) }`;
  }
  if (isNotEmpty(search?.profit_sharing_like)) {
    whereQuery += ` and t.profit_sharing like ${ args.push("%" + sqlLike(search?.profit_sharing_like) + "%") }`;
  }
  if (search?.total_fee != null) {
    if (search.total_fee[0] != null) {
      whereQuery += ` and t.total_fee>=${ args.push(search.total_fee[0]) }`;
    }
    if (search.total_fee[1] != null) {
      whereQuery += ` and t.total_fee<=${ args.push(search.total_fee[1]) }`;
    }
  }
  if (search?.currency != null) {
    whereQuery += ` and t.currency in (${ args.push(search.currency) })`;
  }
  if (search?.openid != null) {
    whereQuery += ` and t.openid=${ args.push(search.openid) }`;
  }
  if (isNotEmpty(search?.openid_like)) {
    whereQuery += ` and t.openid like ${ args.push("%" + sqlLike(search?.openid_like) + "%") }`;
  }
  if (search?.prepay_id != null) {
    whereQuery += ` and t.prepay_id=${ args.push(search.prepay_id) }`;
  }
  if (isNotEmpty(search?.prepay_id_like)) {
    whereQuery += ` and t.prepay_id like ${ args.push("%" + sqlLike(search?.prepay_id_like) + "%") }`;
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
  search?: Readonly<PayTransactionsJsapiSearch>,
  options?: {
  },
) {
  let fromQuery = `wx_pay_transactions_jsapi t`;
  return fromQuery;
}

// MARK: findCountPayTransactionsJsapi
/** 根据条件查找微信JSAPI下单总数 */
export async function findCountPayTransactionsJsapi(
  search?: Readonly<PayTransactionsJsapiSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "findCountPayTransactionsJsapi";
  
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
  // 交易状态
  if (search && search.trade_state != null) {
    const len = search.trade_state.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.trade_state.length > ${ ids_limit }`);
    }
  }
  // 货币类型
  if (search && search.currency != null) {
    const len = search.currency.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.currency.length > ${ ids_limit }`);
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
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAllPayTransactionsJsapi
/** 根据搜索条件和分页查找微信JSAPI下单列表 */
export async function findAllPayTransactionsJsapi(
  search?: Readonly<PayTransactionsJsapiSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<PayTransactionsJsapiModel[]> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "findAllPayTransactionsJsapi";
  
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
  // 交易状态
  if (search && search.trade_state != null) {
    const len = search.trade_state.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.trade_state.length > ${ ids_limit }`);
    }
  }
  // 货币类型
  if (search && search.currency != null) {
    const len = search.currency.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.currency.length > ${ ids_limit }`);
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
  
  const result = await query<PayTransactionsJsapiModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  const [
    trade_stateDict, // 交易状态
    currencyDict, // 货币类型
  ] = await getDict([
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 交易状态
    let trade_state_lbl = model.trade_state as string;
    if (!isEmpty(model.trade_state)) {
      const dictItem = trade_stateDict.find((dictItem) => dictItem.val === model.trade_state);
      if (dictItem) {
        trade_state_lbl = dictItem.lbl;
      }
    }
    model.trade_state_lbl = trade_state_lbl || "";
    
    // 支付完成时间
    if (model.success_time) {
      const success_time = dayjs(model.success_time);
      if (success_time.isValid()) {
        model.success_time = success_time.format("YYYY-MM-DDTHH:mm:ss");
        model.success_time_lbl = success_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.success_time_lbl = (model.success_time || "").toString();
      }
    } else {
      model.success_time_lbl = "";
    }
    
    // 货币类型
    let currency_lbl = model.currency as string;
    if (!isEmpty(model.currency)) {
      const dictItem = currencyDict.find((dictItem) => dictItem.val === model.currency);
      if (dictItem) {
        currency_lbl = dictItem.lbl;
      }
    }
    model.currency_lbl = currency_lbl || "";
    
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

// MARK: setIdByLblPayTransactionsJsapi
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblPayTransactionsJsapi(
  input: PayTransactionsJsapiInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 支付完成时间
  if (!input.success_time && input.success_time_lbl) {
    const success_time_lbl = dayjs(input.success_time_lbl);
    if (success_time_lbl.isValid()) {
      input.success_time = success_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsPayTransactionsJsapi();
      throw `${ fieldComments.success_time } 日期格式错误`;
    }
  }
  if (input.success_time) {
    const success_time = dayjs(input.success_time);
    if (!success_time.isValid()) {
      const fieldComments = await getFieldCommentsPayTransactionsJsapi();
      throw `${ fieldComments.success_time } 日期格式错误`;
    }
    input.success_time = dayjs(input.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    trade_stateDict, // 交易状态
    currencyDict, // 货币类型
  ] = await getDict([
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
  ]);
  
  // 交易状态
  if (isNotEmpty(input.trade_state_lbl) && input.trade_state == null) {
    const val = trade_stateDict.find((itemTmp) => itemTmp.lbl === input.trade_state_lbl)?.val;
    if (val != null) {
      input.trade_state = val as PayTransactionsJsapiTradeState;
    }
  } else if (isEmpty(input.trade_state_lbl) && input.trade_state != null) {
    const lbl = trade_stateDict.find((itemTmp) => itemTmp.val === input.trade_state)?.lbl || "";
    input.trade_state_lbl = lbl;
  }
  
  // 支付完成时间
  if (isNotEmpty(input.success_time_lbl) && input.success_time == null) {
    input.success_time_lbl = String(input.success_time_lbl).trim();
    input.success_time = input.success_time_lbl;
  }
  
  // 货币类型
  if (isNotEmpty(input.currency_lbl) && input.currency == null) {
    const val = currencyDict.find((itemTmp) => itemTmp.lbl === input.currency_lbl)?.val;
    if (val != null) {
      input.currency = val as PayTransactionsJsapiCurrency;
    }
  } else if (isEmpty(input.currency_lbl) && input.currency != null) {
    const lbl = currencyDict.find((itemTmp) => itemTmp.val === input.currency)?.lbl || "";
    input.currency_lbl = lbl;
  }
}

// MARK: getFieldCommentsPayTransactionsJsapi
/** 获取微信JSAPI下单字段注释 */
export async function getFieldCommentsPayTransactionsJsapi(): Promise<PayTransactionsJsapiFieldComment> {
  const fieldComments: PayTransactionsJsapiFieldComment = {
    id: "ID",
    appid: "开发者ID",
    mchid: "商户号",
    description: "商品描述",
    out_trade_no: "商户订单号",
    transaction_id: "微信支付订单号",
    trade_state: "交易状态",
    trade_state_lbl: "交易状态",
    trade_state_desc: "交易状态描述",
    success_time: "支付完成时间",
    success_time_lbl: "支付完成时间",
    time_expire: "交易限制时间",
    attach: "附加数据",
    receipt: "开发票",
    profit_sharing: "分账",
    total_fee: "订单金额(分)",
    currency: "货币类型",
    currency_lbl: "货币类型",
    openid: "用户标识",
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

// MARK: findByUniquePayTransactionsJsapi
/** 通过唯一约束获得微信JSAPI下单列表 */
export async function findByUniquePayTransactionsJsapi(
  search0: Readonly<PayTransactionsJsapiInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<PayTransactionsJsapiModel[]> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "findByUniquePayTransactionsJsapi";
  
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
    const model = await findOnePayTransactionsJsapi(
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
  const models: PayTransactionsJsapiModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniquePayTransactionsJsapi(
  oldModel: Readonly<PayTransactionsJsapiModel>,
  input: Readonly<PayTransactionsJsapiInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniquePayTransactionsJsapi
/** 通过唯一约束检查 微信JSAPI下单 是否已经存在 */
export async function checkByUniquePayTransactionsJsapi(
  input: Readonly<PayTransactionsJsapiInput>,
  oldModel: Readonly<PayTransactionsJsapiModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<PayTransactionsJsapiId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniquePayTransactionsJsapi(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 微信JSAPI下单 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: PayTransactionsJsapiId = await updateByIdPayTransactionsJsapi(
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

// MARK: findOnePayTransactionsJsapi
/** 根据条件查找第一微信JSAPI下单 */
export async function findOnePayTransactionsJsapi(
  search?: Readonly<PayTransactionsJsapiSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "findOnePayTransactionsJsapi";
  
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
  const models = await findAllPayTransactionsJsapi(
    search,
    page,
    sort,
    options,
  );
  const model = models[0];
  return model;
}

// MARK: findByIdPayTransactionsJsapi
/** 根据 id 查找微信JSAPI下单 */
export async function findByIdPayTransactionsJsapi(
  id?: PayTransactionsJsapiId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "findByIdPayTransactionsJsapi";
  
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
  
  const model = await findOnePayTransactionsJsapi(
    {
      id,
    },
    undefined,
    options,
  );
  
  return model;
}

// MARK: findByIdsPayTransactionsJsapi
/** 根据 ids 查找微信JSAPI下单 */
export async function findByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<PayTransactionsJsapiModel[]> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "findByIdsPayTransactionsJsapi";
  
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
  
  const models = await findAllPayTransactionsJsapi(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 微信JSAPI下单 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 微信JSAPI下单 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existPayTransactionsJsapi
/** 根据搜索条件判断微信JSAPI下单是否存在 */
export async function existPayTransactionsJsapi(
  search?: Readonly<PayTransactionsJsapiSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "existPayTransactionsJsapi";
  
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
  const model = await findOnePayTransactionsJsapi(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdPayTransactionsJsapi
/** 根据id判断微信JSAPI下单是否存在 */
export async function existByIdPayTransactionsJsapi(
  id?: Readonly<PayTransactionsJsapiId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "existByIdPayTransactionsJsapi";
  
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
  const sql = `select 1 e from wx_pay_transactions_jsapi t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionPayTransactionsJsapi
/** 校验微信JSAPI下单是否存在 */
export async function validateOptionPayTransactionsJsapi(
  model?: PayTransactionsJsapiModel,
) {
  if (!model) {
    const err_msg = "微信JSAPI下单 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validatePayTransactionsJsapi
/** 微信JSAPI下单增加和修改时校验输入 */
export async function validatePayTransactionsJsapi(
  input: Readonly<PayTransactionsJsapiInput>,
) {
  const fieldComments = await getFieldCommentsPayTransactionsJsapi();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 开发者ID
  await validators.chars_max_length(
    input.appid,
    32,
    fieldComments.appid,
  );
  
  // 商户号
  await validators.chars_max_length(
    input.mchid,
    32,
    fieldComments.mchid,
  );
  
  // 商品描述
  await validators.chars_max_length(
    input.description,
    127,
    fieldComments.description,
  );
  
  // 商户订单号
  await validators.chars_max_length(
    input.out_trade_no,
    32,
    fieldComments.out_trade_no,
  );
  
  // 微信支付订单号
  await validators.chars_max_length(
    input.transaction_id,
    32,
    fieldComments.transaction_id,
  );
  
  // 交易状态描述
  await validators.chars_max_length(
    input.trade_state_desc,
    256,
    fieldComments.trade_state_desc,
  );
  
  // 交易限制时间
  await validators.chars_max_length(
    input.time_expire,
    64,
    fieldComments.time_expire,
  );
  
  // 附加数据
  await validators.chars_max_length(
    input.attach,
    128,
    fieldComments.attach,
  );
  
  // 开发票
  await validators.chars_max_length(
    input.receipt,
    8,
    fieldComments.receipt,
  );
  
  // 分账
  await validators.chars_max_length(
    input.profit_sharing,
    16,
    fieldComments.profit_sharing,
  );
  
  // 用户标识
  await validators.chars_max_length(
    input.openid,
    128,
    fieldComments.openid,
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

// MARK: createReturnPayTransactionsJsapi
/** 创建 微信JSAPI下单 并返回 */
export async function createReturnPayTransactionsJsapi(
  input: Readonly<PayTransactionsJsapiInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PayTransactionsJsapiModel> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "createReturnPayTransactionsJsapi";
  
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
  
  const model = await validateOptionPayTransactionsJsapi(
    await findOnePayTransactionsJsapi(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createPayTransactionsJsapi
/** 创建 微信JSAPI下单 */
export async function createPayTransactionsJsapi(
  input: Readonly<PayTransactionsJsapiInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PayTransactionsJsapiId> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "createPayTransactionsJsapi";
  
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

// MARK: createsReturnPayTransactionsJsapi
/** 批量创建 微信JSAPI下单 并返回 */
export async function createsReturnPayTransactionsJsapi(
  inputs: PayTransactionsJsapiInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PayTransactionsJsapiModel[]> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "createsReturnPayTransactionsJsapi";
  
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
  
  const models = await findByIdsPayTransactionsJsapi(ids, options);
  
  return models;
}

// MARK: createsPayTransactionsJsapi
/** 批量创建 微信JSAPI下单 */
export async function createsPayTransactionsJsapi(
  inputs: PayTransactionsJsapiInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PayTransactionsJsapiId[]> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "createsPayTransactionsJsapi";
  
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
  inputs: PayTransactionsJsapiInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PayTransactionsJsapiId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wx_pay_transactions_jsapi";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: PayTransactionsJsapiId[] = [ ];
  const inputs2: PayTransactionsJsapiInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniquePayTransactionsJsapi(input, options);
    if (oldModels.length > 0) {
      let id: PayTransactionsJsapiId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniquePayTransactionsJsapi(
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
    
    const id = shortUuidV4<PayTransactionsJsapiId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into wx_pay_transactions_jsapi(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,appid,mchid,description,out_trade_no,transaction_id,trade_state,trade_state_desc,success_time,time_expire,attach,attach2,notify_url,receipt,profit_sharing,total_fee,currency,openid,prepay_id)values";
  
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
      if (input.appid != null) {
        sql += `,${ args.push(input.appid) }`;
      } else {
        sql += ",default";
      }
      if (input.mchid != null) {
        sql += `,${ args.push(input.mchid) }`;
      } else {
        sql += ",default";
      }
      if (input.description != null) {
        sql += `,${ args.push(input.description) }`;
      } else {
        sql += ",default";
      }
      if (input.out_trade_no != null) {
        sql += `,${ args.push(input.out_trade_no) }`;
      } else {
        sql += ",default";
      }
      if (input.transaction_id != null) {
        sql += `,${ args.push(input.transaction_id) }`;
      } else {
        sql += ",default";
      }
      if (input.trade_state != null) {
        sql += `,${ args.push(input.trade_state) }`;
      } else {
        sql += ",default";
      }
      if (input.trade_state_desc != null) {
        sql += `,${ args.push(input.trade_state_desc) }`;
      } else {
        sql += ",default";
      }
      if (input.success_time != null || input.success_time_save_null) {
        sql += `,${ args.push(input.success_time) }`;
      } else {
        sql += ",default";
      }
      if (input.time_expire != null) {
        sql += `,${ args.push(input.time_expire) }`;
      } else {
        sql += ",default";
      }
      if (input.attach != null) {
        sql += `,${ args.push(input.attach) }`;
      } else {
        sql += ",default";
      }
      if (input.attach2 != null) {
        sql += `,${ args.push(input.attach2) }`;
      } else {
        sql += ",default";
      }
      if (input.notify_url != null) {
        sql += `,${ args.push(input.notify_url) }`;
      } else {
        sql += ",default";
      }
      if (input.receipt != null) {
        sql += `,${ args.push(input.receipt) }`;
      } else {
        sql += ",default";
      }
      if (input.profit_sharing != null) {
        sql += `,${ args.push(input.profit_sharing) }`;
      } else {
        sql += ",default";
      }
      if (input.total_fee != null) {
        sql += `,${ args.push(input.total_fee) }`;
      } else {
        sql += ",default";
      }
      if (input.currency != null) {
        sql += `,${ args.push(input.currency) }`;
      } else {
        sql += ",default";
      }
      if (input.openid != null) {
        sql += `,${ args.push(input.openid) }`;
      } else {
        sql += ",default";
      }
      if (input.prepay_id != null) {
        sql += `,${ args.push(input.prepay_id) }`;
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

// MARK: updateTenantByIdPayTransactionsJsapi
/** 微信JSAPI下单 根据 id 修改 租户id */
export async function updateTenantByIdPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "updateTenantByIdPayTransactionsJsapi";
  
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
  const sql = `update wx_pay_transactions_jsapi set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdPayTransactionsJsapi
/** 根据 id 修改 微信JSAPI下单 */
export async function updateByIdPayTransactionsJsapi(
  id: PayTransactionsJsapiId,
  input: PayTransactionsJsapiInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<PayTransactionsJsapiId> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "updateByIdPayTransactionsJsapi";
  
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
    throw new Error("updateByIdPayTransactionsJsapi: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdPayTransactionsJsapi: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdPayTransactionsJsapi(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniquePayTransactionsJsapi(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 微信JSAPI下单 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdPayTransactionsJsapi(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 微信JSAPI下单 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wx_pay_transactions_jsapi set `;
  let updateFldNum = 0;
  if (input.appid != null) {
    if (input.appid != oldModel.appid) {
      sql += `appid=${ args.push(input.appid) },`;
      updateFldNum++;
    }
  }
  if (input.mchid != null) {
    if (input.mchid != oldModel.mchid) {
      sql += `mchid=${ args.push(input.mchid) },`;
      updateFldNum++;
    }
  }
  if (input.description != null) {
    if (input.description != oldModel.description) {
      sql += `description=${ args.push(input.description) },`;
      updateFldNum++;
    }
  }
  if (input.out_trade_no != null) {
    if (input.out_trade_no != oldModel.out_trade_no) {
      sql += `out_trade_no=${ args.push(input.out_trade_no) },`;
      updateFldNum++;
    }
  }
  if (input.transaction_id != null) {
    if (input.transaction_id != oldModel.transaction_id) {
      sql += `transaction_id=${ args.push(input.transaction_id) },`;
      updateFldNum++;
    }
  }
  if (input.trade_state != null) {
    if (input.trade_state != oldModel.trade_state) {
      sql += `trade_state=${ args.push(input.trade_state) },`;
      updateFldNum++;
    }
  }
  if (input.trade_state_desc != null) {
    if (input.trade_state_desc != oldModel.trade_state_desc) {
      sql += `trade_state_desc=${ args.push(input.trade_state_desc) },`;
      updateFldNum++;
    }
  }
  if (input.success_time != null || input.success_time_save_null) {
    if (input.success_time != oldModel.success_time) {
      sql += `success_time=${ args.push(input.success_time) },`;
      updateFldNum++;
    }
  }
  if (input.time_expire != null) {
    if (input.time_expire != oldModel.time_expire) {
      sql += `time_expire=${ args.push(input.time_expire) },`;
      updateFldNum++;
    }
  }
  if (input.attach != null) {
    if (input.attach != oldModel.attach) {
      sql += `attach=${ args.push(input.attach) },`;
      updateFldNum++;
    }
  }
  if (input.attach2 != null) {
    if (input.attach2 != oldModel.attach2) {
      sql += `attach2=${ args.push(input.attach2) },`;
      updateFldNum++;
    }
  }
  if (input.notify_url != null) {
    if (input.notify_url != oldModel.notify_url) {
      sql += `notify_url=${ args.push(input.notify_url) },`;
      updateFldNum++;
    }
  }
  if (input.receipt != null) {
    if (input.receipt != oldModel.receipt) {
      sql += `receipt=${ args.push(input.receipt) },`;
      updateFldNum++;
    }
  }
  if (input.profit_sharing != null) {
    if (input.profit_sharing != oldModel.profit_sharing) {
      sql += `profit_sharing=${ args.push(input.profit_sharing) },`;
      updateFldNum++;
    }
  }
  if (input.total_fee != null) {
    if (input.total_fee != oldModel.total_fee) {
      sql += `total_fee=${ args.push(input.total_fee) },`;
      updateFldNum++;
    }
  }
  if (input.currency != null) {
    if (input.currency != oldModel.currency) {
      sql += `currency=${ args.push(input.currency) },`;
      updateFldNum++;
    }
  }
  if (input.openid != null) {
    if (input.openid != oldModel.openid) {
      sql += `openid=${ args.push(input.openid) },`;
      updateFldNum++;
    }
  }
  if (input.prepay_id != null) {
    if (input.prepay_id != oldModel.prepay_id) {
      sql += `prepay_id=${ args.push(input.prepay_id) },`;
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
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsPayTransactionsJsapi
/** 根据 ids 删除 微信JSAPI下单 */
export async function deleteByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "deleteByIdsPayTransactionsJsapi";
  
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
    const oldModel = await findByIdPayTransactionsJsapi(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wx_pay_transactions_jsapi set is_deleted=1`;
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
  
  return affectedRows;
}

// MARK: revertByIdsPayTransactionsJsapi
/** 根据 ids 还原 微信JSAPI下单 */
export async function revertByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "revertByIdsPayTransactionsJsapi";
  
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
    let old_model = await findOnePayTransactionsJsapi(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdPayTransactionsJsapi(
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
      } as PayTransactionsJsapiInput;
      const models = await findByUniquePayTransactionsJsapi(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 微信JSAPI下单 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wx_pay_transactions_jsapi set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsPayTransactionsJsapi
/** 根据 ids 彻底删除 微信JSAPI下单 */
export async function forceDeleteByIdsPayTransactionsJsapi(
  ids: PayTransactionsJsapiId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
  const method = "forceDeleteByIdsPayTransactionsJsapi";
  
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
    const oldModel = await findOnePayTransactionsJsapi(
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
    const sql = `delete from wx_pay_transactions_jsapi where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
