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
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiCurrency,
} from "/gen/types.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

const route_path = "/wx/pay_transactions_jsapi";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<PayTransactionsJsapiSearch>,
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
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
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
    whereQuery += ` and t.trade_state in ${ args.push(search.trade_state) }`;
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
  if (search?.support_fapiao != null) {
    whereQuery += ` and t.support_fapiao in ${ args.push(search.support_fapiao) }`;
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
    whereQuery += ` and t.currency in ${ args.push(search.currency) }`;
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
  search?: Readonly<PayTransactionsJsapiSearch>,
  options?: Readonly<{
  }>,
) {
  let fromQuery = `wx_pay_transactions_jsapi t`;
  return fromQuery;
}

/**
 * 根据条件查找微信JSAPI下单总数
 * @param { PayTransactionsJsapiSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: Readonly<PayTransactionsJsapiSearch>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
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
 * 根据搜索条件和分页查找微信JSAPI下单列表
 * @param {PayTransactionsJsapiSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: Readonly<PayTransactionsJsapiSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput | SortInput[],
  options?: Readonly<{
    debug?: boolean;
    ids_limit?: number;
  }>,
): Promise<PayTransactionsJsapiModel[]> {
  const table = "wx_pay_transactions_jsapi";
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
  // 是否支持发票
  if (search && search.support_fapiao != null) {
    const len = search.support_fapiao.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.support_fapiao.length > ${ ids_limit }`);
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
  
  const result = await query<PayTransactionsJsapiModel>(
    sql,
    args,
    {
      debug,
    },
  );
  
  const [
    trade_stateDict, // 交易状态
    support_fapiaoDict, // 是否支持发票
    currencyDict, // 货币类型
  ] = await getDict([
    "wx_pay_notice_trade_state",
    "is_enabled",
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
      if (isNaN(success_time.toDate().getTime())) {
        model.success_time_lbl = (model.success_time || "").toString();
      } else {
        model.success_time_lbl = success_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.success_time_lbl = "";
    }
    
    // 是否支持发票
    let support_fapiao_lbl = model.support_fapiao?.toString() || "";
    if (model.support_fapiao != null) {
      const dictItem = support_fapiaoDict.find((dictItem) => dictItem.val === model.support_fapiao.toString());
      if (dictItem) {
        support_fapiao_lbl = dictItem.lbl;
      }
    }
    model.support_fapiao_lbl = support_fapiao_lbl || "";
    
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
  input: PayTransactionsJsapiInput,
) {
  // 支付完成时间
  if (!input.success_time && input.success_time_lbl) {
    const success_time_lbl = dayjs(input.success_time_lbl);
    if (success_time_lbl.isValid()) {
      input.success_time = success_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.success_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.success_time) {
    const success_time = dayjs(input.success_time);
    if (!success_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.success_time } ${ await ns("日期格式错误") }`;
    }
    input.success_time = dayjs(input.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    trade_stateDict, // 交易状态
    support_fapiaoDict, // 是否支持发票
    currencyDict, // 货币类型
  ] = await getDict([
    "wx_pay_notice_trade_state",
    "is_enabled",
    "wx_pay_notice_currency",
  ]);
  
  // 交易状态
  if (isNotEmpty(input.trade_state_lbl) && input.trade_state == null) {
    const val = trade_stateDict.find((itemTmp) => itemTmp.lbl === input.trade_state_lbl)?.val;
    if (val != null) {
      input.trade_state = val as PayTransactionsJsapiTradeState;
    }
  }
  
  // 支付完成时间
  if (isNotEmpty(input.success_time_lbl) && input.success_time == null) {
    input.success_time_lbl = String(input.success_time_lbl).trim();
    input.success_time = input.success_time_lbl;
  }
  
  // 是否支持发票
  if (isNotEmpty(input.support_fapiao_lbl) && input.support_fapiao == null) {
    const val = support_fapiaoDict.find((itemTmp) => itemTmp.lbl === input.support_fapiao_lbl)?.val;
    if (val != null) {
      input.support_fapiao = Number(val);
    }
  }
  
  // 货币类型
  if (isNotEmpty(input.currency_lbl) && input.currency == null) {
    const val = currencyDict.find((itemTmp) => itemTmp.lbl === input.currency_lbl)?.val;
    if (val != null) {
      input.currency = val as PayTransactionsJsapiCurrency;
    }
  }
}

/**
 * 获取微信JSAPI下单字段注释
 */
export async function getFieldComments(): Promise<PayTransactionsJsapiFieldComment> {
  const n = initN(route_path);
  const fieldComments: PayTransactionsJsapiFieldComment = {
    id: await n("ID"),
    appid: await n("开发者ID"),
    mchid: await n("商户号"),
    description: await n("商品描述"),
    out_trade_no: await n("商户订单号"),
    transaction_id: await n("微信支付订单号"),
    trade_state: await n("交易状态"),
    trade_state_lbl: await n("交易状态"),
    trade_state_desc: await n("交易状态描述"),
    success_time: await n("支付完成时间"),
    success_time_lbl: await n("支付完成时间"),
    time_expire: await n("交易限制时间"),
    attach: await n("附加数据"),
    attach2: await n("附加数据2"),
    notify_url: await n("通知地址"),
    support_fapiao: await n("是否支持发票"),
    support_fapiao_lbl: await n("是否支持发票"),
    total_fee: await n("订单金额(分)"),
    currency: await n("货币类型"),
    currency_lbl: await n("货币类型"),
    openid: await n("用户标识"),
    prepay_id: await n("预支付交易会话标识"),
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
 * 通过唯一约束获得微信JSAPI下单列表
 * @param {PayTransactionsJsapiInput} search0
 */
export async function findByUnique(
  search0: Readonly<PayTransactionsJsapiInput>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<PayTransactionsJsapiModel[]> {
  
  const table = "wx_pay_transactions_jsapi";
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
  const models: PayTransactionsJsapiModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {PayTransactionsJsapiModel} oldModel
 * @param {PayTransactionsJsapiInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: Readonly<PayTransactionsJsapiModel>,
  input: Readonly<PayTransactionsJsapiInput>,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查微信JSAPI下单是否已经存在
 * @param {PayTransactionsJsapiInput} input
 * @param {PayTransactionsJsapiModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<PayTransactionsJsapiId | undefined>}
 */
export async function checkByUnique(
  input: Readonly<PayTransactionsJsapiInput>,
  oldModel: Readonly<PayTransactionsJsapiModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: Readonly<{
  }>,
): Promise<PayTransactionsJsapiId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("微信JSAPI下单")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: PayTransactionsJsapiId = await updateById(
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
 * 根据条件查找第一个微信JSAPI下单
 * @param {PayTransactionsJsapiSearch} search?
 */
export async function findOne(
  search?: Readonly<PayTransactionsJsapiSearch>,
  sort?: SortInput | SortInput[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const table = "wx_pay_transactions_jsapi";
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
 * 根据 id 查找微信JSAPI下单
 * @param {PayTransactionsJsapiId} id
 */
export async function findById(
  id?: PayTransactionsJsapiId | null,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<PayTransactionsJsapiModel | undefined> {
  
  const table = "wx_pay_transactions_jsapi";
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

/** 根据 ids 查找微信JSAPI下单 */
export async function findByIds(
  ids: PayTransactionsJsapiId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<PayTransactionsJsapiModel[]> {
  
  const table = "wx_pay_transactions_jsapi";
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
 * 根据搜索条件判断微信JSAPI下单是否存在
 * @param {PayTransactionsJsapiSearch} search?
 */
export async function exist(
  search?: Readonly<PayTransactionsJsapiSearch>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<boolean> {
  
  const table = "wx_pay_transactions_jsapi";
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
 * 根据id判断微信JSAPI下单是否存在
 * @param {PayTransactionsJsapiId} id
 */
export async function existById(
  id?: Readonly<PayTransactionsJsapiId | null>,
  options?: Readonly<{
    debug?: boolean;
  }>,
) {
  
  const table = "wx_pay_transactions_jsapi";
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

/** 校验微信JSAPI下单是否存在 */
export async function validateOption(
  model?: Readonly<PayTransactionsJsapiModel>,
) {
  if (!model) {
    throw `${ await ns("微信JSAPI下单") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 微信JSAPI下单增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: Readonly<PayTransactionsJsapiInput>,
) {
  const fieldComments = await getFieldComments();
  
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
  
  // 交易状态
  await validators.chars_max_length(
    input.trade_state,
    32,
    fieldComments.trade_state,
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
  
  // 附加数据2
  await validators.chars_max_length(
    input.attach2,
    256,
    fieldComments.attach2,
  );
  
  // 通知地址
  await validators.chars_max_length(
    input.notify_url,
    256,
    fieldComments.notify_url,
  );
  
  // 货币类型
  await validators.chars_max_length(
    input.currency,
    16,
    fieldComments.currency,
  );
  
  // 用户标识
  await validators.chars_max_length(
    input.openid,
    128,
    fieldComments.openid,
  );
  
  // 预支付交易会话标识
  await validators.chars_max_length(
    input.prepay_id,
    64,
    fieldComments.prepay_id,
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
 * 创建微信JSAPI下单
 * @param {PayTransactionsJsapiInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<PayTransactionsJsapiId>} 
 */
export async function create(
  input: Readonly<PayTransactionsJsapiInput>,
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<PayTransactionsJsapiId> {
  
  const table = "wx_pay_transactions_jsapi";
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
 * 批量创建微信JSAPI下单
 * @param {PayTransactionsJsapiInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<PayTransactionsJsapiId[]>} 
 */
export async function creates(
  inputs: PayTransactionsJsapiInput[],
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<PayTransactionsJsapiId[]> {
  
  const table = "wx_pay_transactions_jsapi";
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
  inputs: PayTransactionsJsapiInput[],
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    silentMode?: boolean;
  }>,
): Promise<PayTransactionsJsapiId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wx_pay_transactions_jsapi";
  
  const context = useContext();
  const silentMode = options?.silentMode ?? context.silentMode;
  
  const ids2: PayTransactionsJsapiId[] = [ ];
  const inputs2: PayTransactionsJsapiInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: PayTransactionsJsapiId | undefined = undefined;
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
    
    const id = shortUuidV4<PayTransactionsJsapiId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wx_pay_transactions_jsapi(id`;
  if (!silentMode) {
    sql += ",create_time";
  }
  sql += ",tenant_id";
  sql += ",org_id";
  if (!silentMode) {
    sql += ",create_usr_id";
  }
  if (!silentMode) {
    sql += ",create_usr_id_lbl";
  }
  sql += ",appid";
  sql += ",mchid";
  sql += ",description";
  sql += ",out_trade_no";
  sql += ",transaction_id";
  sql += ",trade_state";
  sql += ",trade_state_desc";
  sql += ",success_time";
  sql += ",time_expire";
  sql += ",attach";
  sql += ",attach2";
  sql += ",notify_url";
  sql += ",support_fapiao";
  sql += ",total_fee";
  sql += ",currency";
  sql += ",openid";
  sql += ",prepay_id";
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
      if (input.support_fapiao != null) {
        sql += `,${ args.push(input.support_fapiao) }`;
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
 * 微信JSAPI下单根据id修改租户id
 * @param {PayTransactionsJsapiId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: PayTransactionsJsapiId,
  tenant_id: Readonly<TenantId>,
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
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
  const sql = `update wx_pay_transactions_jsapi set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 微信JSAPI下单根据id修改组织id
 * @export
 * @param {PayTransactionsJsapiId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: PayTransactionsJsapiId,
  org_id: Readonly<OrgId>,
  options?: Readonly<{
  }>,
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
  const method = "updateOrgById";
  
  const orgExist = await existByIdOrg(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update wx_pay_transactions_jsapi set org_id=${ args.push(org_id) } where id=${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 根据 id 修改微信JSAPI下单
 * @param {PayTransactionsJsapiId} id
 * @param {PayTransactionsJsapiInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<PayTransactionsJsapiId>}
 */
export async function updateById(
  id: PayTransactionsJsapiId,
  input: PayTransactionsJsapiInput,
  options?: Readonly<{
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
    silentMode?: boolean;
  }>,
): Promise<PayTransactionsJsapiId> {
  
  const table = "wx_pay_transactions_jsapi";
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
        throw await ns("此 {0} 已经存在", await ns("微信JSAPI下单"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("微信JSAPI下单"));
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
  if (input.support_fapiao != null) {
    if (input.support_fapiao != oldModel.support_fapiao) {
      sql += `support_fapiao=${ args.push(input.support_fapiao) },`;
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
    
    await execute(sql, args);
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
 * 根据 ids 删除微信JSAPI下单
 * @param {PayTransactionsJsapiId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: PayTransactionsJsapiId[],
  options?: Readonly<{
    debug?: boolean;
    silentMode?: boolean;
  }>,
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    let sql = `update wx_pay_transactions_jsapi set is_deleted=1`;
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
  
  return num;
}

/**
 * 根据 ids 还原微信JSAPI下单
 * @param {PayTransactionsJsapiId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: PayTransactionsJsapiId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
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
    const id: PayTransactionsJsapiId = ids[i];
    const args = new QueryArgs();
    const sql = `update wx_pay_transactions_jsapi set is_deleted = 0 where id=${ args.push(id) } limit 1`;
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
      } as PayTransactionsJsapiInput;
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("微信JSAPI下单"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除微信JSAPI下单
 * @param {PayTransactionsJsapiId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: PayTransactionsJsapiId[],
  options?: Readonly<{
    debug?: boolean;
  }>,
): Promise<number> {
  
  const table = "wx_pay_transactions_jsapi";
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
      const sql = `select * from wx_pay_transactions_jsapi where id=${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wx_pay_transactions_jsapi where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
