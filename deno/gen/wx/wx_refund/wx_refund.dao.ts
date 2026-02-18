// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import sqlstring from "sqlstring";

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

import { ServiceException } from "/lib/exceptions/service.exception.ts";

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
  InputMaybe,
  PageInput,
  SortInput,
  WxRefundChannel,
  WxRefundStatus,
  WxRefundFundsAccount,
  WxRefundAmountCurrency,
} from "/gen/types.ts";

import {
  getPagePathWxRefund,
  getTableNameWxRefund,
} from "./wx_refund.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxRefundSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += " 1=1"
  
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
  if (search?.out_refund_no != null) {
    whereQuery += ` and t.out_refund_no=${ args.push(search.out_refund_no) }`;
  }
  if (isNotEmpty(search?.out_refund_no_like)) {
    whereQuery += ` and t.out_refund_no like ${ args.push("%" + sqlLike(search?.out_refund_no_like) + "%") }`;
  }
  if (search?.refund_id != null) {
    whereQuery += ` and t.refund_id=${ args.push(search.refund_id) }`;
  }
  if (isNotEmpty(search?.refund_id_like)) {
    whereQuery += ` and t.refund_id like ${ args.push("%" + sqlLike(search?.refund_id_like) + "%") }`;
  }
  if (search?.reason != null) {
    whereQuery += ` and t.reason=${ args.push(search.reason) }`;
  }
  if (isNotEmpty(search?.reason_like)) {
    whereQuery += ` and t.reason like ${ args.push("%" + sqlLike(search?.reason_like) + "%") }`;
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
  if (search?.channel != null) {
    whereQuery += ` and t.channel in (${ args.push(search.channel) })`;
  }
  if (search?.user_received_account != null) {
    whereQuery += ` and t.user_received_account=${ args.push(search.user_received_account) }`;
  }
  if (isNotEmpty(search?.user_received_account_like)) {
    whereQuery += ` and t.user_received_account like ${ args.push("%" + sqlLike(search?.user_received_account_like) + "%") }`;
  }
  if (search?.success_time != null) {
    if (search.success_time[0] != null) {
      whereQuery += ` and t.success_time>=${ args.push(search.success_time[0]) }`;
    }
    if (search.success_time[1] != null) {
      whereQuery += ` and t.success_time<=${ args.push(search.success_time[1]) }`;
    }
  }
  if (search?.status != null) {
    whereQuery += ` and t.status in (${ args.push(search.status) })`;
  }
  if (search?.funds_account != null) {
    whereQuery += ` and t.funds_account in (${ args.push(search.funds_account) })`;
  }
  if (search?.amount_total != null) {
    if (search.amount_total[0] != null) {
      whereQuery += ` and t.amount_total>=${ args.push(search.amount_total[0]) }`;
    }
    if (search.amount_total[1] != null) {
      whereQuery += ` and t.amount_total<=${ args.push(search.amount_total[1]) }`;
    }
  }
  if (search?.amount_refund != null) {
    if (search.amount_refund[0] != null) {
      whereQuery += ` and t.amount_refund>=${ args.push(search.amount_refund[0]) }`;
    }
    if (search.amount_refund[1] != null) {
      whereQuery += ` and t.amount_refund<=${ args.push(search.amount_refund[1]) }`;
    }
  }
  if (search?.amount_payer_total != null) {
    if (search.amount_payer_total[0] != null) {
      whereQuery += ` and t.amount_payer_total>=${ args.push(search.amount_payer_total[0]) }`;
    }
    if (search.amount_payer_total[1] != null) {
      whereQuery += ` and t.amount_payer_total<=${ args.push(search.amount_payer_total[1]) }`;
    }
  }
  if (search?.amount_payer_refund != null) {
    if (search.amount_payer_refund[0] != null) {
      whereQuery += ` and t.amount_payer_refund>=${ args.push(search.amount_payer_refund[0]) }`;
    }
    if (search.amount_payer_refund[1] != null) {
      whereQuery += ` and t.amount_payer_refund<=${ args.push(search.amount_payer_refund[1]) }`;
    }
  }
  if (search?.amount_settlement_refund != null) {
    if (search.amount_settlement_refund[0] != null) {
      whereQuery += ` and t.amount_settlement_refund>=${ args.push(search.amount_settlement_refund[0]) }`;
    }
    if (search.amount_settlement_refund[1] != null) {
      whereQuery += ` and t.amount_settlement_refund<=${ args.push(search.amount_settlement_refund[1]) }`;
    }
  }
  if (search?.amount_discount_refund != null) {
    if (search.amount_discount_refund[0] != null) {
      whereQuery += ` and t.amount_discount_refund>=${ args.push(search.amount_discount_refund[0]) }`;
    }
    if (search.amount_discount_refund[1] != null) {
      whereQuery += ` and t.amount_discount_refund<=${ args.push(search.amount_discount_refund[1]) }`;
    }
  }
  if (search?.amount_currency != null) {
    whereQuery += ` and t.amount_currency in (${ args.push(search.amount_currency) })`;
  }
  if (search?.amount_refund_fee != null) {
    if (search.amount_refund_fee[0] != null) {
      whereQuery += ` and t.amount_refund_fee>=${ args.push(search.amount_refund_fee[0]) }`;
    }
    if (search.amount_refund_fee[1] != null) {
      whereQuery += ` and t.amount_refund_fee<=${ args.push(search.amount_refund_fee[1]) }`;
    }
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<WxRefundSearch>,
  options?: {
  },
) {
  let fromQuery = `wx_wx_refund t`;
  return fromQuery;
}

// MARK: findCountWxRefund
/** 根据条件查找微信退款申请总数 */
export async function findCountWxRefund(
  search?: Readonly<WxRefundSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameWxRefund();
  const method = "findCountWxRefund";
  
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
  // 退款渠道
  if (search && search.channel != null) {
    const len = search.channel.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.channel.length > ${ ids_limit }`);
    }
  }
  // 退款状态
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
  // 资金账户
  if (search && search.funds_account != null) {
    const len = search.funds_account.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.funds_account.length > ${ ids_limit }`);
    }
  }
  // 退款币种
  if (search && search.amount_currency != null) {
    const len = search.amount_currency.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.amount_currency.length > ${ ids_limit }`);
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

// MARK: findAllWxRefund
/** 根据搜索条件和分页查找微信退款申请列表 */
export async function findAllWxRefund(
  search?: Readonly<WxRefundSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxRefundModel[]> {
  
  const table = getTableNameWxRefund();
  const method = "findAllWxRefund";
  
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
  // 退款渠道
  if (search && search.channel != null) {
    const len = search.channel.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.channel.length > ${ ids_limit }`);
    }
  }
  // 退款状态
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
  // 资金账户
  if (search && search.funds_account != null) {
    const len = search.funds_account.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.funds_account.length > ${ ids_limit }`);
    }
  }
  // 退款币种
  if (search && search.amount_currency != null) {
    const len = search.amount_currency.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.amount_currency.length > ${ ids_limit }`);
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
    prop: "success_time",
    order: SortOrderEnum.Desc,
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
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxRefundModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  if (page?.isResultLimit !== false) {
    let find_all_result_limit = Number(getParsedEnv("server_find_all_result_limit")) || 1000;
    const len = result.length;
    if (len > find_all_result_limit) {
      throw new Error(`结果集过大, 超过 ${ find_all_result_limit }`);
    }
  }
  
  const [
    channelDict, // 退款渠道
    statusDict, // 退款状态
    funds_accountDict, // 资金账户
    amount_currencyDict, // 退款币种
  ] = await getDict([
    "wx_refund_channel",
    "wx_refund_status",
    "wx_refund_funds_account",
    "wx_pay_notice_currency",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 退款渠道
    let channel_lbl = model.channel as string;
    if (!isEmpty(model.channel)) {
      const dictItem = channelDict.find((dictItem) => dictItem.val === model.channel);
      if (dictItem) {
        channel_lbl = dictItem.lbl;
      }
    }
    model.channel_lbl = channel_lbl || "";
    
    // 退款成功时间
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
    
    // 退款状态
    let status_lbl = model.status as string;
    if (!isEmpty(model.status)) {
      const dictItem = statusDict.find((dictItem) => dictItem.val === model.status);
      if (dictItem) {
        status_lbl = dictItem.lbl;
      }
    }
    model.status_lbl = status_lbl || "";
    
    // 资金账户
    let funds_account_lbl = model.funds_account as string;
    if (!isEmpty(model.funds_account)) {
      const dictItem = funds_accountDict.find((dictItem) => dictItem.val === model.funds_account);
      if (dictItem) {
        funds_account_lbl = dictItem.lbl;
      }
    }
    model.funds_account_lbl = funds_account_lbl || "";
    
    // 退款币种
    let amount_currency_lbl = model.amount_currency as string;
    if (!isEmpty(model.amount_currency)) {
      const dictItem = amount_currencyDict.find((dictItem) => dictItem.val === model.amount_currency);
      if (dictItem) {
        amount_currency_lbl = dictItem.lbl;
      }
    }
    model.amount_currency_lbl = amount_currency_lbl || "";
    
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
  }
  
  return result;
}

// MARK: setIdByLblWxRefund
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblWxRefund(
  input: WxRefundInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 退款成功时间
  if (!input.success_time && input.success_time_lbl) {
    const success_time_lbl = dayjs(input.success_time_lbl);
    if (success_time_lbl.isValid()) {
      input.success_time = success_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsWxRefund();
      throw `${ fieldComments.success_time } 日期格式错误`;
    }
  }
  if (input.success_time) {
    const success_time = dayjs(input.success_time);
    if (!success_time.isValid()) {
      const fieldComments = await getFieldCommentsWxRefund();
      throw `${ fieldComments.success_time } 日期格式错误`;
    }
    input.success_time = dayjs(input.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    channelDict, // 退款渠道
    statusDict, // 退款状态
    funds_accountDict, // 资金账户
    amount_currencyDict, // 退款币种
  ] = await getDict([
    "wx_refund_channel",
    "wx_refund_status",
    "wx_refund_funds_account",
    "wx_pay_notice_currency",
  ]);
  
  // 退款渠道
  if (isNotEmpty(input.channel_lbl) && input.channel == null) {
    const val = channelDict.find((itemTmp) => itemTmp.lbl === input.channel_lbl)?.val;
    if (val != null) {
      input.channel = val as WxRefundChannel;
    }
  } else if (isEmpty(input.channel_lbl) && input.channel != null) {
    const lbl = channelDict.find((itemTmp) => itemTmp.val === input.channel)?.lbl || "";
    input.channel_lbl = lbl;
  }
  
  // 退款成功时间
  if (isNotEmpty(input.success_time_lbl) && input.success_time == null) {
    input.success_time_lbl = String(input.success_time_lbl).trim();
    input.success_time = input.success_time_lbl;
  }
  
  // 退款状态
  if (isNotEmpty(input.status_lbl) && input.status == null) {
    const val = statusDict.find((itemTmp) => itemTmp.lbl === input.status_lbl)?.val;
    if (val != null) {
      input.status = val as WxRefundStatus;
    }
  } else if (isEmpty(input.status_lbl) && input.status != null) {
    const lbl = statusDict.find((itemTmp) => itemTmp.val === input.status)?.lbl || "";
    input.status_lbl = lbl;
  }
  
  // 资金账户
  if (isNotEmpty(input.funds_account_lbl) && input.funds_account == null) {
    const val = funds_accountDict.find((itemTmp) => itemTmp.lbl === input.funds_account_lbl)?.val;
    if (val != null) {
      input.funds_account = val as WxRefundFundsAccount;
    }
  } else if (isEmpty(input.funds_account_lbl) && input.funds_account != null) {
    const lbl = funds_accountDict.find((itemTmp) => itemTmp.val === input.funds_account)?.lbl || "";
    input.funds_account_lbl = lbl;
  }
  
  // 退款币种
  if (isNotEmpty(input.amount_currency_lbl) && input.amount_currency == null) {
    const val = amount_currencyDict.find((itemTmp) => itemTmp.lbl === input.amount_currency_lbl)?.val;
    if (val != null) {
      input.amount_currency = val as WxRefundAmountCurrency;
    }
  } else if (isEmpty(input.amount_currency_lbl) && input.amount_currency != null) {
    const lbl = amount_currencyDict.find((itemTmp) => itemTmp.val === input.amount_currency)?.lbl || "";
    input.amount_currency_lbl = lbl;
  }
}

// MARK: getFieldCommentsWxRefund
/** 获取微信退款申请字段注释 */
export async function getFieldCommentsWxRefund(): Promise<WxRefundFieldComment> {
  const field_comments: WxRefundFieldComment = {
    id: "ID",
    appid: "开发者ID",
    mchid: "商户号",
    out_trade_no: "商户订单号",
    transaction_id: "微信支付订单号",
    out_refund_no: "商户退款单号",
    refund_id: "微信退款单号",
    reason: "退款原因",
    channel: "退款渠道",
    channel_lbl: "退款渠道",
    user_received_account: "退款入账账户",
    success_time: "退款成功时间",
    success_time_lbl: "退款成功时间",
    status: "退款状态",
    status_lbl: "退款状态",
    funds_account: "资金账户",
    funds_account_lbl: "资金账户",
    amount_total: "订单金额(分)",
    amount_refund: "退款金额(分)",
    amount_payer_total: "用户实际支付金额(分)",
    amount_payer_refund: "用户退款金额(分)",
    amount_settlement_refund: "应结退款金额(分)",
    amount_discount_refund: "优惠退款金额(分)",
    amount_currency: "退款币种",
    amount_currency_lbl: "退款币种",
    amount_refund_fee: "手续费退款金额(分)",
    rem: "备注",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
  };
  
  return field_comments;
}

// MARK: findByUniqueWxRefund
/** 通过唯一约束获得微信退款申请列表 */
export async function findByUniqueWxRefund(
  search0: Readonly<WxRefundInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel[]> {
  
  const table = getTableNameWxRefund();
  const method = "findByUniqueWxRefund";
  
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
    const model = await findOneWxRefund(
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
  const models: WxRefundModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueWxRefund(
  oldModel: Readonly<WxRefundModel>,
  input: Readonly<WxRefundInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueWxRefund
/** 通过唯一约束检查 微信退款申请 是否已经存在 */
export async function checkByUniqueWxRefund(
  input: Readonly<WxRefundInput>,
  oldModel: Readonly<WxRefundModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueWxRefund(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("微信退款申请 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxRefundId = await updateByIdWxRefund(
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

// MARK: findOneWxRefund
/** 根据条件查找第一微信退款申请 */
export async function findOneWxRefund(
  search?: Readonly<WxRefundSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel | undefined> {
  
  const table = getTableNameWxRefund();
  const method = "findOneWxRefund";
  
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
  
  const wx_refund_models = await findAllWxRefund(
    search,
    page,
    sort,
    options,
  );
  
  const wx_refund_model = wx_refund_models[0];
  
  return wx_refund_model;
}

// MARK: findOneOkWxRefund
/** 根据条件查找第一微信退款申请, 如果不存在则抛错 */
export async function findOneOkWxRefund(
  search?: Readonly<WxRefundSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel> {
  
  const table = getTableNameWxRefund();
  const method = "findOneOkWxRefund";
  
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
  
  const wx_refund_models = await findAllWxRefund(
    search,
    page,
    sort,
    options,
  );
  
  const wx_refund_model = wx_refund_models[0];
  
  if (!wx_refund_model) {
    const err_msg = "此 微信退款申请 已被删除";
    throw new Error(err_msg);
  }
  
  return wx_refund_model;
}

// MARK: findByIdWxRefund
/** 根据 id 查找微信退款申请 */
export async function findByIdWxRefund(
  id: WxRefundId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel | undefined> {
  
  const table = getTableNameWxRefund();
  const method = "findByIdWxRefund";
  
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
  
  const wx_refund_model = await findOneWxRefund(
    {
      id,
    },
    undefined,
    options,
  );
  
  return wx_refund_model;
}

// MARK: findByIdOkWxRefund
/** 根据 id 查找微信退款申请, 如果不存在则抛错 */
export async function findByIdOkWxRefund(
  id: WxRefundId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel> {
  
  const table = getTableNameWxRefund();
  const method = "findByIdOkWxRefund";
  
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
  
  const wx_refund_model = await findByIdWxRefund(
    id,
    options,
  );
  
  if (!wx_refund_model) {
    const err_msg = "此 微信退款申请 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return wx_refund_model;
}

// MARK: findByIdsWxRefund
/** 根据 ids 查找微信退款申请 */
export async function findByIdsWxRefund(
  ids: WxRefundId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel[]> {
  
  const table = getTableNameWxRefund();
  const method = "findByIdsWxRefund";
  
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
  
  const models = await findAllWxRefund(
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

// MARK: findByIdsOkWxRefund
/** 根据 ids 查找微信退款申请, 出现查询不到的 id 则报错 */
export async function findByIdsOkWxRefund(
  ids: WxRefundId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundModel[]> {
  
  const table = getTableNameWxRefund();
  const method = "findByIdsOkWxRefund";
  
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
  
  const models = await findByIdsWxRefund(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 微信退款申请 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 微信退款申请 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existWxRefund
/** 根据搜索条件判断微信退款申请是否存在 */
export async function existWxRefund(
  search?: Readonly<WxRefundSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameWxRefund();
  const method = "existWxRefund";
  
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
  const model = await findOneWxRefund(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdWxRefund
/** 根据id判断微信退款申请是否存在 */
export async function existByIdWxRefund(
  id?: Readonly<WxRefundId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameWxRefund();
  const method = "existByIdWxRefund";
  
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
  const sql = `select 1 e from wx_wx_refund t where t.id=${ args.push(id) } limit 1`;
  
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

// MARK: validateOptionWxRefund
/** 校验微信退款申请是否存在 */
export async function validateOptionWxRefund(
  model?: WxRefundModel,
) {
  if (!model) {
    const err_msg = "微信退款申请 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateWxRefund
/** 微信退款申请增加和修改时校验输入 */
export async function validateWxRefund(
  input: Readonly<WxRefundInput>,
) {
  const fieldComments = await getFieldCommentsWxRefund();
  
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
  
  // 商户退款单号
  await validators.chars_max_length(
    input.out_refund_no,
    64,
    fieldComments.out_refund_no,
  );
  
  // 微信退款单号
  await validators.chars_max_length(
    input.refund_id,
    32,
    fieldComments.refund_id,
  );
  
  // 退款原因
  await validators.chars_max_length(
    input.reason,
    80,
    fieldComments.reason,
  );
  
  // 退款入账账户
  await validators.chars_max_length(
    input.user_received_account,
    64,
    fieldComments.user_received_account,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

// MARK: createReturnWxRefund
/** 创建 微信退款申请 并返回 */
export async function createReturnWxRefund(
  input: Readonly<WxRefundInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundModel> {
  
  const table = getTableNameWxRefund();
  const method = "createReturnWxRefund";
  
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
  
  const model = await validateOptionWxRefund(
    await findOneWxRefund(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createWxRefund
/** 创建 微信退款申请 */
export async function createWxRefund(
  input: Readonly<WxRefundInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundId> {
  
  const table = getTableNameWxRefund();
  const method = "createWxRefund";
  
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

// MARK: createsReturnWxRefund
/** 批量创建 微信退款申请 并返回 */
export async function createsReturnWxRefund(
  inputs: WxRefundInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundModel[]> {
  
  const table = getTableNameWxRefund();
  const method = "createsReturnWxRefund";
  
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
  
  const models = await findByIdsWxRefund(ids, options);
  
  return models;
}

// MARK: createsWxRefund
/** 批量创建 微信退款申请 */
export async function createsWxRefund(
  inputs: WxRefundInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundId[]> {
  
  const table = getTableNameWxRefund();
  const method = "createsWxRefund";
  
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
  inputs: WxRefundInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNameWxRefund();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxRefundId[] = [ ];
  const inputs2: WxRefundInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueWxRefund(input, options);
    if (oldModels.length > 0) {
      let id: WxRefundId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueWxRefund(
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
    
    const id = shortUuidV4<WxRefundId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into wx_wx_refund(id,create_time,tenant_id,appid,mchid,out_trade_no,transaction_id,out_refund_no,refund_id,reason,attach2,notify_url,channel,user_received_account,success_time,status,funds_account,amount_total,amount_refund,amount_payer_total,amount_payer_refund,amount_settlement_refund,amount_discount_refund,amount_currency,amount_refund_fee,rem)values";
  
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
      if (input.out_refund_no != null) {
        sql += `,${ args.push(input.out_refund_no) }`;
      } else {
        sql += ",default";
      }
      if (input.refund_id != null) {
        sql += `,${ args.push(input.refund_id) }`;
      } else {
        sql += ",default";
      }
      if (input.reason != null) {
        sql += `,${ args.push(input.reason) }`;
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
      if (input.channel != null) {
        sql += `,${ args.push(input.channel) }`;
      } else {
        sql += ",default";
      }
      if (input.user_received_account != null) {
        sql += `,${ args.push(input.user_received_account) }`;
      } else {
        sql += ",default";
      }
      if (input.success_time != null || input.success_time_save_null) {
        sql += `,${ args.push(input.success_time) }`;
      } else {
        sql += ",default";
      }
      if (input.status != null) {
        sql += `,${ args.push(input.status) }`;
      } else {
        sql += ",default";
      }
      if (input.funds_account != null) {
        sql += `,${ args.push(input.funds_account) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_total != null) {
        sql += `,${ args.push(input.amount_total) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_refund != null) {
        sql += `,${ args.push(input.amount_refund) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_payer_total != null) {
        sql += `,${ args.push(input.amount_payer_total) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_payer_refund != null) {
        sql += `,${ args.push(input.amount_payer_refund) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_settlement_refund != null) {
        sql += `,${ args.push(input.amount_settlement_refund) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_discount_refund != null) {
        sql += `,${ args.push(input.amount_discount_refund) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_currency != null) {
        sql += `,${ args.push(input.amount_currency) }`;
      } else {
        sql += ",default";
      }
      if (input.amount_refund_fee != null) {
        sql += `,${ args.push(input.amount_refund_fee) }`;
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
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  return ids2;
}

// MARK: updateTenantByIdWxRefund
/** 微信退款申请 根据 id 修改 租户id */
export async function updateTenantByIdWxRefund(
  id: WxRefundId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameWxRefund();
  const method = "updateTenantByIdWxRefund";
  
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
  const sql = `update wx_wx_refund set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdWxRefund
/** 根据 id 修改 微信退款申请 */
export async function updateByIdWxRefund(
  id: WxRefundId,
  input: WxRefundInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxRefundId> {
  
  const table = getTableNameWxRefund();
  const method = "updateByIdWxRefund";
  
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
    throw new Error("updateByIdWxRefund: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdWxRefund: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdWxRefund(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueWxRefund(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "微信退款申请 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdWxRefund(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 微信退款申请 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update wx_wx_refund set `;
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
  if (input.out_refund_no != null) {
    if (input.out_refund_no != oldModel.out_refund_no) {
      sql += `out_refund_no=${ args.push(input.out_refund_no) },`;
      updateFldNum++;
    }
  }
  if (input.refund_id != null) {
    if (input.refund_id != oldModel.refund_id) {
      sql += `refund_id=${ args.push(input.refund_id) },`;
      updateFldNum++;
    }
  }
  if (input.reason != null) {
    if (input.reason != oldModel.reason) {
      sql += `reason=${ args.push(input.reason) },`;
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
  if (input.channel != null) {
    if (input.channel != oldModel.channel) {
      sql += `channel=${ args.push(input.channel) },`;
      updateFldNum++;
    }
  }
  if (input.user_received_account != null) {
    if (input.user_received_account != oldModel.user_received_account) {
      sql += `user_received_account=${ args.push(input.user_received_account) },`;
      updateFldNum++;
    }
  }
  if (input.success_time != null || input.success_time_save_null) {
    if (input.success_time != oldModel.success_time) {
      sql += `success_time=${ args.push(input.success_time) },`;
      updateFldNum++;
    }
  }
  if (input.status != null) {
    if (input.status != oldModel.status) {
      sql += `status=${ args.push(input.status) },`;
      updateFldNum++;
    }
  }
  if (input.funds_account != null) {
    if (input.funds_account != oldModel.funds_account) {
      sql += `funds_account=${ args.push(input.funds_account) },`;
      updateFldNum++;
    }
  }
  if (input.amount_total != null) {
    if (input.amount_total != oldModel.amount_total) {
      sql += `amount_total=${ args.push(input.amount_total) },`;
      updateFldNum++;
    }
  }
  if (input.amount_refund != null) {
    if (input.amount_refund != oldModel.amount_refund) {
      sql += `amount_refund=${ args.push(input.amount_refund) },`;
      updateFldNum++;
    }
  }
  if (input.amount_payer_total != null) {
    if (input.amount_payer_total != oldModel.amount_payer_total) {
      sql += `amount_payer_total=${ args.push(input.amount_payer_total) },`;
      updateFldNum++;
    }
  }
  if (input.amount_payer_refund != null) {
    if (input.amount_payer_refund != oldModel.amount_payer_refund) {
      sql += `amount_payer_refund=${ args.push(input.amount_payer_refund) },`;
      updateFldNum++;
    }
  }
  if (input.amount_settlement_refund != null) {
    if (input.amount_settlement_refund != oldModel.amount_settlement_refund) {
      sql += `amount_settlement_refund=${ args.push(input.amount_settlement_refund) },`;
      updateFldNum++;
    }
  }
  if (input.amount_discount_refund != null) {
    if (input.amount_discount_refund != oldModel.amount_discount_refund) {
      sql += `amount_discount_refund=${ args.push(input.amount_discount_refund) },`;
      updateFldNum++;
    }
  }
  if (input.amount_currency != null) {
    if (input.amount_currency != oldModel.amount_currency) {
      sql += `amount_currency=${ args.push(input.amount_currency) },`;
      updateFldNum++;
    }
  }
  if (input.amount_refund_fee != null) {
    if (input.amount_refund_fee != oldModel.amount_refund_fee) {
      sql += `amount_refund_fee=${ args.push(input.amount_refund_fee) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
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
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    if (sqlSetFldNum > 0) {
      const is_debug = getParsedEnv("database_debug_sql") === "true";
      await execute(
        sql,
        args,
        {
          debug: is_debug,
        },
      );
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: updateByIdWxRefund
/** 根据 id 更新微信退款申请, 并返回更新后的数据 */
export async function updateByIdReturnWxRefund(
  id: WxRefundId,
  input: WxRefundInput,
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxRefundModel> {
  
  await updateByIdWxRefund(
    id,
    input,
    options,
  );
  
  const model = await findByIdWxRefund(
    id,
    options,
  );
  
  if (!model) {
    throw new Error(`微信退款申请 不存在`);
  }
  
  return model;
}

// MARK: deleteByIdsWxRefund
/** 根据 ids 删除 微信退款申请 */
export async function deleteByIdsWxRefund(
  ids: WxRefundId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameWxRefund();
  const method = "deleteByIdsWxRefund";
  
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdWxRefund(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from wx_wx_refund where id=${ args.push(id) } limit 1`;
    const res = await execute(
      sql,
      args,
      {
        debug: is_debug_sql,
      },
    );
    affectedRows += res.affectedRows;
  }
  
  return affectedRows;
}
