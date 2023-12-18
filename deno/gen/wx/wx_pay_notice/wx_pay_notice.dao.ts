// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

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

import * as orgDao from "/gen/base/org/org.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
  WxPayNoticeTradeType,
  WxPayNoticeTradeState,
  WxPayNoticeCurrency,
  WxPayNoticePayerCurrency,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  WxPayNoticeInput,
  WxPayNoticeModel,
  WxPayNoticeSearch,
  WxPayNoticeFieldComment,
  WxPayNoticeId,
} from "./wx_pay_notice.model.ts";

const route_path = "/wx/wx_pay_notice";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxPayNoticeSearch,
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
  } else if (isNotEmpty(search?.tenant_id) && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (search?.org_id == null) {
    const authModel = await getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery += ` and t.org_id = ${ args.push(org_id) }`;
    }
  } else if (isNotEmpty(search?.org_id) && search?.org_id !== "-") {
    whereQuery += ` and t.org_id = ${ args.push(search.org_id) }`;
  }
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.appid !== undefined) {
    whereQuery += ` and t.appid = ${ args.push(search.appid) }`;
  }
  if (search?.appid === null) {
    whereQuery += ` and t.appid is null`;
  }
  if (isNotEmpty(search?.appid_like)) {
    whereQuery += ` and t.appid like ${ args.push("%" + sqlLike(search?.appid_like) + "%") }`;
  }
  if (search?.mchid !== undefined) {
    whereQuery += ` and t.mchid = ${ args.push(search.mchid) }`;
  }
  if (search?.mchid === null) {
    whereQuery += ` and t.mchid is null`;
  }
  if (isNotEmpty(search?.mchid_like)) {
    whereQuery += ` and t.mchid like ${ args.push("%" + sqlLike(search?.mchid_like) + "%") }`;
  }
  if (search?.openid !== undefined) {
    whereQuery += ` and t.openid = ${ args.push(search.openid) }`;
  }
  if (search?.openid === null) {
    whereQuery += ` and t.openid is null`;
  }
  if (isNotEmpty(search?.openid_like)) {
    whereQuery += ` and t.openid like ${ args.push("%" + sqlLike(search?.openid_like) + "%") }`;
  }
  if (search?.out_trade_no !== undefined) {
    whereQuery += ` and t.out_trade_no = ${ args.push(search.out_trade_no) }`;
  }
  if (search?.out_trade_no === null) {
    whereQuery += ` and t.out_trade_no is null`;
  }
  if (isNotEmpty(search?.out_trade_no_like)) {
    whereQuery += ` and t.out_trade_no like ${ args.push("%" + sqlLike(search?.out_trade_no_like) + "%") }`;
  }
  if (search?.transaction_id !== undefined) {
    whereQuery += ` and t.transaction_id = ${ args.push(search.transaction_id) }`;
  }
  if (search?.transaction_id === null) {
    whereQuery += ` and t.transaction_id is null`;
  }
  if (isNotEmpty(search?.transaction_id_like)) {
    whereQuery += ` and t.transaction_id like ${ args.push("%" + sqlLike(search?.transaction_id_like) + "%") }`;
  }
  if (search?.trade_type && !Array.isArray(search?.trade_type)) {
    search.trade_type = [ search.trade_type ];
  }
  if (search?.trade_type && search?.trade_type?.length > 0) {
    whereQuery += ` and t.trade_type in ${ args.push(search.trade_type) }`;
  }
  if (search?.trade_state && !Array.isArray(search?.trade_state)) {
    search.trade_state = [ search.trade_state ];
  }
  if (search?.trade_state && search?.trade_state?.length > 0) {
    whereQuery += ` and t.trade_state in ${ args.push(search.trade_state) }`;
  }
  if (search?.trade_state_desc !== undefined) {
    whereQuery += ` and t.trade_state_desc = ${ args.push(search.trade_state_desc) }`;
  }
  if (search?.trade_state_desc === null) {
    whereQuery += ` and t.trade_state_desc is null`;
  }
  if (isNotEmpty(search?.trade_state_desc_like)) {
    whereQuery += ` and t.trade_state_desc like ${ args.push("%" + sqlLike(search?.trade_state_desc_like) + "%") }`;
  }
  if (search?.bank_type !== undefined) {
    whereQuery += ` and t.bank_type = ${ args.push(search.bank_type) }`;
  }
  if (search?.bank_type === null) {
    whereQuery += ` and t.bank_type is null`;
  }
  if (isNotEmpty(search?.bank_type_like)) {
    whereQuery += ` and t.bank_type like ${ args.push("%" + sqlLike(search?.bank_type_like) + "%") }`;
  }
  if (search?.attach !== undefined) {
    whereQuery += ` and t.attach = ${ args.push(search.attach) }`;
  }
  if (search?.attach === null) {
    whereQuery += ` and t.attach is null`;
  }
  if (isNotEmpty(search?.attach_like)) {
    whereQuery += ` and t.attach like ${ args.push("%" + sqlLike(search?.attach_like) + "%") }`;
  }
  if (search?.success_time && search?.success_time?.length > 0) {
    if (search.success_time[0] != null) {
      whereQuery += ` and t.success_time >= ${ args.push(search.success_time[0]) }`;
    }
    if (search.success_time[1] != null) {
      whereQuery += ` and t.success_time <= ${ args.push(search.success_time[1]) }`;
    }
  }
  if (search?.total && search?.total?.length > 0) {
    if (search.total[0] != null) {
      whereQuery += ` and t.total >= ${ args.push(search.total[0]) }`;
    }
    if (search.total[1] != null) {
      whereQuery += ` and t.total <= ${ args.push(search.total[1]) }`;
    }
  }
  if (search?.payer_total && search?.payer_total?.length > 0) {
    if (search.payer_total[0] != null) {
      whereQuery += ` and t.payer_total >= ${ args.push(search.payer_total[0]) }`;
    }
    if (search.payer_total[1] != null) {
      whereQuery += ` and t.payer_total <= ${ args.push(search.payer_total[1]) }`;
    }
  }
  if (search?.currency && !Array.isArray(search?.currency)) {
    search.currency = [ search.currency ];
  }
  if (search?.currency && search?.currency?.length > 0) {
    whereQuery += ` and t.currency in ${ args.push(search.currency) }`;
  }
  if (search?.payer_currency && !Array.isArray(search?.payer_currency)) {
    search.payer_currency = [ search.payer_currency ];
  }
  if (search?.payer_currency && search?.payer_currency?.length > 0) {
    whereQuery += ` and t.payer_currency in ${ args.push(search.payer_currency) }`;
  }
  if (search?.device_id !== undefined) {
    whereQuery += ` and t.device_id = ${ args.push(search.device_id) }`;
  }
  if (search?.device_id === null) {
    whereQuery += ` and t.device_id is null`;
  }
  if (isNotEmpty(search?.device_id_like)) {
    whereQuery += ` and t.device_id like ${ args.push("%" + sqlLike(search?.device_id_like) + "%") }`;
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (search?.rem === null) {
    whereQuery += ` and t.rem is null`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.raw !== undefined) {
    whereQuery += ` and t.raw = ${ args.push(search.raw) }`;
  }
  if (search?.raw === null) {
    whereQuery += ` and t.raw is null`;
  }
  if (isNotEmpty(search?.raw_like)) {
    whereQuery += ` and t.raw like ${ args.push("%" + sqlLike(search?.raw_like) + "%") }`;
  }
  if (search?.create_usr_id && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id && search?.create_usr_id.length > 0) {
    whereQuery += ` and create_usr_id_lbl.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id === null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_time && search?.create_time?.length > 0) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id && search?.update_usr_id.length > 0) {
    whereQuery += ` and update_usr_id_lbl.id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id === null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
  }
  if (search?.update_time && search?.update_time?.length > 0) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time >= ${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time <= ${ args.push(search.update_time[1]) }`;
    }
  }
  if (search?.$extra) {
    const extras = search.$extra;
    for (let i = 0; i < extras.length; i++) {
      const extra = extras[i];
      const queryTmp = await extra(args);
      if (queryTmp) {
        whereQuery += ` ${ queryTmp }`;
      }
    }
  }
  return whereQuery;
}

async function getFromQuery() {
  let fromQuery = `
    wx_wx_pay_notice t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找微信支付通知总数
 * @param { WxPayNoticeSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxPayNoticeSearch,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_pay_notice";
  const method = "findCount";
  
  const args = new QueryArgs();
  let sql = `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ await getFromQuery() }
        where
          ${ await getWhereQuery(args, search, options) }
        group by t.id
      ) t
  `;
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找微信支付通知列表
 * @param {WxPayNoticeSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxPayNoticeModel[]> {
  const table = "wx_wx_pay_notice";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      ${ await getFromQuery() }
    where
      ${ await getWhereQuery(args, search, options) }
    group by t.id
  `;
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "transaction_id",
        order: SortOrderEnum.Desc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "transaction_id",
    order: SortOrderEnum.Desc,
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
  
  const result = await query<WxPayNoticeModel>(
    sql,
    args,
  );
  
  const [
    trade_typeDict, // 交易类型
    trade_stateDict, // 交易状态
    currencyDict, // 货币类型
    payer_currencyDict, // 用户支付币种
  ] = await getDict([
    "wx_unified_order_trade_type",
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
    "wx_pay_notice_currency",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 交易类型
    let trade_type_lbl = model.trade_type as string;
    if (!isEmpty(model.trade_type)) {
      const dictItem = trade_typeDict.find((dictItem) => dictItem.val === model.trade_type);
      if (dictItem) {
        trade_type_lbl = dictItem.lbl;
      }
    }
    model.trade_type_lbl = trade_type_lbl;
    
    // 交易状态
    let trade_state_lbl = model.trade_state as string;
    if (!isEmpty(model.trade_state)) {
      const dictItem = trade_stateDict.find((dictItem) => dictItem.val === model.trade_state);
      if (dictItem) {
        trade_state_lbl = dictItem.lbl;
      }
    }
    model.trade_state_lbl = trade_state_lbl;
    
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
    
    // 货币类型
    let currency_lbl = model.currency as string;
    if (!isEmpty(model.currency)) {
      const dictItem = currencyDict.find((dictItem) => dictItem.val === model.currency);
      if (dictItem) {
        currency_lbl = dictItem.lbl;
      }
    }
    model.currency_lbl = currency_lbl;
    
    // 用户支付币种
    let payer_currency_lbl = model.payer_currency as string;
    if (!isEmpty(model.payer_currency)) {
      const dictItem = payer_currencyDict.find((dictItem) => dictItem.val === model.payer_currency);
      if (dictItem) {
        payer_currency_lbl = dictItem.lbl;
      }
    }
    model.payer_currency_lbl = payer_currency_lbl;
    
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
  input: WxPayNoticeInput,
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
    trade_typeDict, // 交易类型
    trade_stateDict, // 交易状态
    currencyDict, // 货币类型
    payer_currencyDict, // 用户支付币种
  ] = await getDict([
    "wx_unified_order_trade_type",
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
    "wx_pay_notice_currency",
  ]);
  
  // 交易类型
  if (isNotEmpty(input.trade_type_lbl) && input.trade_type === undefined) {
    const val = trade_typeDict.find((itemTmp) => itemTmp.lbl === input.trade_type_lbl)?.val;
    if (val !== undefined) {
      input.trade_type = val as WxPayNoticeTradeType;
    }
  }
  
  // 交易状态
  if (isNotEmpty(input.trade_state_lbl) && input.trade_state === undefined) {
    const val = trade_stateDict.find((itemTmp) => itemTmp.lbl === input.trade_state_lbl)?.val;
    if (val !== undefined) {
      input.trade_state = val as WxPayNoticeTradeState;
    }
  }
  
  // 支付完成时间
  if (isNotEmpty(input.success_time_lbl) && input.success_time === undefined) {
    input.success_time_lbl = String(input.success_time_lbl).trim();
    input.success_time = input.success_time_lbl;
  }
  
  // 货币类型
  if (isNotEmpty(input.currency_lbl) && input.currency === undefined) {
    const val = currencyDict.find((itemTmp) => itemTmp.lbl === input.currency_lbl)?.val;
    if (val !== undefined) {
      input.currency = val as WxPayNoticeCurrency;
    }
  }
  
  // 用户支付币种
  if (isNotEmpty(input.payer_currency_lbl) && input.payer_currency === undefined) {
    const val = payer_currencyDict.find((itemTmp) => itemTmp.lbl === input.payer_currency_lbl)?.val;
    if (val !== undefined) {
      input.payer_currency = val as WxPayNoticePayerCurrency;
    }
  }
}

/**
 * 获取微信支付通知字段注释
 */
export async function getFieldComments(): Promise<WxPayNoticeFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxPayNoticeFieldComment = {
    id: await n("ID"),
    appid: await n("appid"),
    mchid: await n("商户号"),
    openid: await n("用户标识"),
    out_trade_no: await n("商户订单号"),
    transaction_id: await n("微信支付订单号"),
    trade_type: await n("交易类型"),
    trade_type_lbl: await n("交易类型"),
    trade_state: await n("交易状态"),
    trade_state_lbl: await n("交易状态"),
    trade_state_desc: await n("交易状态描述"),
    bank_type: await n("付款银行"),
    attach: await n("附加数据"),
    success_time: await n("支付完成时间"),
    success_time_lbl: await n("支付完成时间"),
    total: await n("总金额"),
    payer_total: await n("用户支付金额"),
    currency: await n("货币类型"),
    currency_lbl: await n("货币类型"),
    payer_currency: await n("用户支付币种"),
    payer_currency_lbl: await n("用户支付币种"),
    device_id: await n("商户端设备号"),
    rem: await n("备注"),
    raw: await n("原始数据"),
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
 * 通过唯一约束获得微信支付通知列表
 * @param {WxPayNoticeInput} search0
 */
export async function findByUnique(
  search0: WxPayNoticeInput,
  options?: {
  },
): Promise<WxPayNoticeModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: WxPayNoticeModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxPayNoticeModel} oldModel
 * @param {WxPayNoticeInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxPayNoticeModel,
  input: WxPayNoticeInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查微信支付通知是否已经存在
 * @param {WxPayNoticeInput} input
 * @param {WxPayNoticeModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxPayNoticeId | undefined>}
 */
export async function checkByUnique(
  input: WxPayNoticeInput,
  oldModel: WxPayNoticeModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxPayNoticeId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxPayNoticeId = await updateById(
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
 * 根据条件查找第一个微信支付通知
 * @param {WxPayNoticeSearch} search?
 */
export async function findOne(
  search?: WxPayNoticeSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxPayNoticeModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找微信支付通知
 * @param {WxPayNoticeId} id
 */
export async function findById(
  id?: WxPayNoticeId | null,
  options?: {
  },
): Promise<WxPayNoticeModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断微信支付通知是否存在
 * @param {WxPayNoticeSearch} search?
 */
export async function exist(
  search?: WxPayNoticeSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断微信支付通知是否存在
 * @param {WxPayNoticeId} id
 */
export async function existById(
  id?: WxPayNoticeId | null,
) {
  const table = "wx_wx_pay_notice";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wx_wx_pay_notice t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,
  );
  let result = !!model?.e;
  
  return result;
}

/** 校验微信支付通知是否存在 */
export async function validateOption(
  model?: WxPayNoticeModel,
) {
  if (!model) {
    throw `${ await ns("微信支付通知") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 微信支付通知增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxPayNoticeInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // appid
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
  
  // 用户标识
  await validators.chars_max_length(
    input.openid,
    128,
    fieldComments.openid,
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
  
  // 交易类型
  await validators.chars_max_length(
    input.trade_type,
    16,
    fieldComments.trade_type,
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
  
  // 付款银行
  await validators.chars_max_length(
    input.bank_type,
    32,
    fieldComments.bank_type,
  );
  
  // 附加数据
  await validators.chars_max_length(
    input.attach,
    128,
    fieldComments.attach,
  );
  
  // 货币类型
  await validators.chars_max_length(
    input.currency,
    16,
    fieldComments.currency,
  );
  
  // 用户支付币种
  await validators.chars_max_length(
    input.payer_currency,
    16,
    fieldComments.payer_currency,
  );
  
  // 商户端设备号
  await validators.chars_max_length(
    input.device_id,
    32,
    fieldComments.device_id,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    50,
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
 * 创建微信支付通知
 * @param {WxPayNoticeInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxPayNoticeId>} 
 */
export async function create(
  input: WxPayNoticeInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayNoticeId> {
  const table = "wx_wx_pay_notice";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: WxPayNoticeId | undefined = undefined;
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
    input.id = shortUuidV4<WxPayNoticeId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wx_wx_pay_notice(
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
  if (input.org_id != null) {
    sql += `,org_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.org_id) {
      sql += `,org_id`;
    }
  }
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id`;
    }
  }
  if (input.appid !== undefined) {
    sql += `,appid`;
  }
  if (input.mchid !== undefined) {
    sql += `,mchid`;
  }
  if (input.openid !== undefined) {
    sql += `,openid`;
  }
  if (input.out_trade_no !== undefined) {
    sql += `,out_trade_no`;
  }
  if (input.transaction_id !== undefined) {
    sql += `,transaction_id`;
  }
  if (input.trade_type !== undefined) {
    sql += `,trade_type`;
  }
  if (input.trade_state !== undefined) {
    sql += `,trade_state`;
  }
  if (input.trade_state_desc !== undefined) {
    sql += `,trade_state_desc`;
  }
  if (input.bank_type !== undefined) {
    sql += `,bank_type`;
  }
  if (input.attach !== undefined) {
    sql += `,attach`;
  }
  if (input.success_time !== undefined) {
    sql += `,success_time`;
  }
  if (input.total !== undefined) {
    sql += `,total`;
  }
  if (input.payer_total !== undefined) {
    sql += `,payer_total`;
  }
  if (input.currency !== undefined) {
    sql += `,currency`;
  }
  if (input.payer_currency !== undefined) {
    sql += `,payer_currency`;
  }
  if (input.device_id !== undefined) {
    sql += `,device_id`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
  }
  if (input.raw !== undefined) {
    sql += `,raw`;
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
  if (input.org_id != null) {
    sql += `,${ args.push(input.org_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.org_id) {
      sql += `,${ args.push(authModel?.org_id) }`;
    }
  }
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.appid !== undefined) {
    sql += `,${ args.push(input.appid) }`;
  }
  if (input.mchid !== undefined) {
    sql += `,${ args.push(input.mchid) }`;
  }
  if (input.openid !== undefined) {
    sql += `,${ args.push(input.openid) }`;
  }
  if (input.out_trade_no !== undefined) {
    sql += `,${ args.push(input.out_trade_no) }`;
  }
  if (input.transaction_id !== undefined) {
    sql += `,${ args.push(input.transaction_id) }`;
  }
  if (input.trade_type !== undefined) {
    sql += `,${ args.push(input.trade_type) }`;
  }
  if (input.trade_state !== undefined) {
    sql += `,${ args.push(input.trade_state) }`;
  }
  if (input.trade_state_desc !== undefined) {
    sql += `,${ args.push(input.trade_state_desc) }`;
  }
  if (input.bank_type !== undefined) {
    sql += `,${ args.push(input.bank_type) }`;
  }
  if (input.attach !== undefined) {
    sql += `,${ args.push(input.attach) }`;
  }
  if (input.success_time !== undefined) {
    sql += `,${ args.push(input.success_time) }`;
  }
  if (input.total !== undefined) {
    sql += `,${ args.push(input.total) }`;
  }
  if (input.payer_total !== undefined) {
    sql += `,${ args.push(input.payer_total) }`;
  }
  if (input.currency !== undefined) {
    sql += `,${ args.push(input.currency) }`;
  }
  if (input.payer_currency !== undefined) {
    sql += `,${ args.push(input.payer_currency) }`;
  }
  if (input.device_id !== undefined) {
    sql += `,${ args.push(input.device_id) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  if (input.raw !== undefined) {
    sql += `,${ args.push(input.raw) }`;
  }
  sql += `)`;
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  return input.id;
}

/**
 * 微信支付通知根据id修改租户id
 * @param {WxPayNoticeId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxPayNoticeId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_pay_notice";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_wx_pay_notice
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
 * 微信支付通知根据id修改组织id
 * @export
 * @param {WxPayNoticeId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: WxPayNoticeId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_pay_notice";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_wx_pay_notice
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
 * 根据 id 修改微信支付通知
 * @param {WxPayNoticeId} id
 * @param {WxPayNoticeInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxPayNoticeId>}
 */
export async function updateById(
  id: WxPayNoticeId,
  input: WxPayNoticeInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxPayNoticeId> {
  const table = "wx_wx_pay_notice";
  const method = "updateById";
  
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
        throw await ns("数据已经存在");
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("修改失败, 数据已被删除");
  }
  
  const args = new QueryArgs();
  let sql = `
    update wx_wx_pay_notice set
  `;
  let updateFldNum = 0;
  if (input.appid !== undefined) {
    if (input.appid != oldModel.appid) {
      sql += `appid = ${ args.push(input.appid) },`;
      updateFldNum++;
    }
  }
  if (input.mchid !== undefined) {
    if (input.mchid != oldModel.mchid) {
      sql += `mchid = ${ args.push(input.mchid) },`;
      updateFldNum++;
    }
  }
  if (input.openid !== undefined) {
    if (input.openid != oldModel.openid) {
      sql += `openid = ${ args.push(input.openid) },`;
      updateFldNum++;
    }
  }
  if (input.out_trade_no !== undefined) {
    if (input.out_trade_no != oldModel.out_trade_no) {
      sql += `out_trade_no = ${ args.push(input.out_trade_no) },`;
      updateFldNum++;
    }
  }
  if (input.transaction_id !== undefined) {
    if (input.transaction_id != oldModel.transaction_id) {
      sql += `transaction_id = ${ args.push(input.transaction_id) },`;
      updateFldNum++;
    }
  }
  if (input.trade_type !== undefined) {
    if (input.trade_type != oldModel.trade_type) {
      sql += `trade_type = ${ args.push(input.trade_type) },`;
      updateFldNum++;
    }
  }
  if (input.trade_state !== undefined) {
    if (input.trade_state != oldModel.trade_state) {
      sql += `trade_state = ${ args.push(input.trade_state) },`;
      updateFldNum++;
    }
  }
  if (input.trade_state_desc !== undefined) {
    if (input.trade_state_desc != oldModel.trade_state_desc) {
      sql += `trade_state_desc = ${ args.push(input.trade_state_desc) },`;
      updateFldNum++;
    }
  }
  if (input.bank_type !== undefined) {
    if (input.bank_type != oldModel.bank_type) {
      sql += `bank_type = ${ args.push(input.bank_type) },`;
      updateFldNum++;
    }
  }
  if (input.attach !== undefined) {
    if (input.attach != oldModel.attach) {
      sql += `attach = ${ args.push(input.attach) },`;
      updateFldNum++;
    }
  }
  if (input.success_time !== undefined) {
    if (input.success_time != oldModel.success_time) {
      sql += `success_time = ${ args.push(input.success_time) },`;
      updateFldNum++;
    }
  }
  if (input.total !== undefined) {
    if (input.total != oldModel.total) {
      sql += `total = ${ args.push(input.total) },`;
      updateFldNum++;
    }
  }
  if (input.payer_total !== undefined) {
    if (input.payer_total != oldModel.payer_total) {
      sql += `payer_total = ${ args.push(input.payer_total) },`;
      updateFldNum++;
    }
  }
  if (input.currency !== undefined) {
    if (input.currency != oldModel.currency) {
      sql += `currency = ${ args.push(input.currency) },`;
      updateFldNum++;
    }
  }
  if (input.payer_currency !== undefined) {
    if (input.payer_currency != oldModel.payer_currency) {
      sql += `payer_currency = ${ args.push(input.payer_currency) },`;
      updateFldNum++;
    }
  }
  if (input.device_id !== undefined) {
    if (input.device_id != oldModel.device_id) {
      sql += `device_id = ${ args.push(input.device_id) },`;
      updateFldNum++;
    }
  }
  if (input.rem !== undefined) {
    if (input.rem != oldModel.rem) {
      sql += `rem = ${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (input.raw !== undefined) {
    if (input.raw != oldModel.raw) {
      sql += `raw = ${ args.push(input.raw) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除微信支付通知
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxPayNoticeId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_pay_notice";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxPayNoticeId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_pay_notice
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
  
  return num;
}

/**
 * 根据 ids 还原微信支付通知
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxPayNoticeId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_pay_notice";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxPayNoticeId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_pay_notice
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
        throw await ns("数据已经存在");
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除微信支付通知
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxPayNoticeId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_pay_notice";
  const method = "forceDeleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
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
          wx_wx_pay_notice
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wx_wx_pay_notice
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
