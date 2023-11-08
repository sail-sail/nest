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

import * as dictSrcDao from "/src/base/dict_detail/dict_detail.dao.ts";

import * as dictbizSrcDao from "/src/base/dictbiz_detail/dictbiz_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";

import * as orgDao from "/gen/base/org/org.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  PayTransactionsJsapiInput,
  PayTransactionsJsapiModel,
  PayTransactionsJsapiSearch,
  PayTransactionsJsapiFieldComment,
} from "./pay_transactions_jsapi.model.ts";

const route_path = "/wx/pay_transactions_jsapi";

async function getWhereQuery(
  args: QueryArgs,
  search?: PayTransactionsJsapiSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id == null) {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (isNotEmpty(search?.tenant_id) && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (search?.org_id == null) {
    const authModel = await authDao.getAuthModel();
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
  if (search?.description !== undefined) {
    whereQuery += ` and t.description = ${ args.push(search.description) }`;
  }
  if (search?.description === null) {
    whereQuery += ` and t.description is null`;
  }
  if (isNotEmpty(search?.description_like)) {
    whereQuery += ` and t.description like ${ args.push("%" + sqlLike(search?.description_like) + "%") }`;
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
  if (search?.success_time && search?.success_time?.length > 0) {
    if (search.success_time[0] != null) {
      whereQuery += ` and t.success_time >= ${ args.push(search.success_time[0]) }`;
    }
    if (search.success_time[1] != null) {
      whereQuery += ` and t.success_time <= ${ args.push(search.success_time[1]) }`;
    }
  }
  if (search?.time_expire !== undefined) {
    whereQuery += ` and t.time_expire = ${ args.push(search.time_expire) }`;
  }
  if (search?.time_expire === null) {
    whereQuery += ` and t.time_expire is null`;
  }
  if (isNotEmpty(search?.time_expire_like)) {
    whereQuery += ` and t.time_expire like ${ args.push("%" + sqlLike(search?.time_expire_like) + "%") }`;
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
  if (search?.attach2 !== undefined) {
    whereQuery += ` and t.attach2 = ${ args.push(search.attach2) }`;
  }
  if (search?.attach2 === null) {
    whereQuery += ` and t.attach2 is null`;
  }
  if (isNotEmpty(search?.attach2_like)) {
    whereQuery += ` and t.attach2 like ${ args.push("%" + sqlLike(search?.attach2_like) + "%") }`;
  }
  if (search?.notify_url !== undefined) {
    whereQuery += ` and t.notify_url = ${ args.push(search.notify_url) }`;
  }
  if (search?.notify_url === null) {
    whereQuery += ` and t.notify_url is null`;
  }
  if (isNotEmpty(search?.notify_url_like)) {
    whereQuery += ` and t.notify_url like ${ args.push("%" + sqlLike(search?.notify_url_like) + "%") }`;
  }
  if (search?.support_fapiao && !Array.isArray(search?.support_fapiao)) {
    search.support_fapiao = [ search.support_fapiao ];
  }
  if (search?.support_fapiao && search?.support_fapiao?.length > 0) {
    whereQuery += ` and t.support_fapiao in ${ args.push(search.support_fapiao) }`;
  }
  if (search?.total_fee && search?.total_fee?.length > 0) {
    if (search.total_fee[0] != null) {
      whereQuery += ` and t.total_fee >= ${ args.push(search.total_fee[0]) }`;
    }
    if (search.total_fee[1] != null) {
      whereQuery += ` and t.total_fee <= ${ args.push(search.total_fee[1]) }`;
    }
  }
  if (search?.currency && !Array.isArray(search?.currency)) {
    search.currency = [ search.currency ];
  }
  if (search?.currency && search?.currency?.length > 0) {
    whereQuery += ` and t.currency in ${ args.push(search.currency) }`;
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
  if (search?.prepay_id !== undefined) {
    whereQuery += ` and t.prepay_id = ${ args.push(search.prepay_id) }`;
  }
  if (search?.prepay_id === null) {
    whereQuery += ` and t.prepay_id is null`;
  }
  if (isNotEmpty(search?.prepay_id_like)) {
    whereQuery += ` and t.prepay_id like ${ args.push("%" + sqlLike(search?.prepay_id_like) + "%") }`;
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
    wx_pay_transactions_jsapi t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { PayTransactionsJsapiSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PayTransactionsJsapiSearch,
  options?: {
  },
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
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
 * 根据搜索条件和分页查找数据
 * @param {PayTransactionsJsapiSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: PayTransactionsJsapiSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<PayTransactionsJsapiModel[]> {
  const table = "wx_pay_transactions_jsapi";
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
  
  const result = await query<PayTransactionsJsapiModel>(
    sql,
    args,
  );
  
  const [
    support_fapiaoDict, // 是否支持发票
  ] = await dictSrcDao.getDict([
    "is_enabled",
  ]);
  
  const [
    trade_stateDict, // 交易状态
    currencyDict, // 货币类型
  ] = await dictbizSrcDao.getDictbiz([
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
  ]);
  
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 交易状态
    let trade_state_lbl = model.trade_state;
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
    
    // 是否支持发票
    let support_fapiao_lbl = model.support_fapiao?.toString() || "";
    if (model.support_fapiao !== undefined && model.support_fapiao !== null) {
      const dictItem = support_fapiaoDict.find((dictItem) => dictItem.val === model.support_fapiao.toString());
      if (dictItem) {
        support_fapiao_lbl = dictItem.lbl;
      }
    }
    model.support_fapiao_lbl = support_fapiao_lbl;
    
    // 货币类型
    let currency_lbl = model.currency;
    if (!isEmpty(model.currency)) {
      const dictItem = currencyDict.find((dictItem) => dictItem.val === model.currency);
      if (dictItem) {
        currency_lbl = dictItem.lbl;
      }
    }
    model.currency_lbl = currency_lbl;
    
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
    support_fapiaoDict, // 是否支持发票
  ] = await dictSrcDao.getDict([
    "is_enabled",
  ]);
  
  const [
    trade_stateDict, // 交易状态
    currencyDict, // 货币类型
  ] = await dictbizSrcDao.getDictbiz([
    "wx_pay_notice_trade_state",
    "wx_pay_notice_currency",
  ]);
  
  // 交易状态
  if (isNotEmpty(input.trade_state_lbl) && input.trade_state === undefined) {
    const val = trade_stateDict.find((itemTmp) => itemTmp.lbl === input.trade_state_lbl)?.val;
    if (val !== undefined) {
      input.trade_state = val;
    }
  }
  
  // 支付完成时间
  if (isNotEmpty(input.success_time_lbl) && input.success_time === undefined) {
    input.success_time_lbl = String(input.success_time_lbl).trim();
    input.success_time = input.success_time_lbl;
  }
  
  // 是否支持发票
  if (isNotEmpty(input.support_fapiao_lbl) && input.support_fapiao === undefined) {
    const val = support_fapiaoDict.find((itemTmp) => itemTmp.lbl === input.support_fapiao_lbl)?.val;
    if (val !== undefined) {
      input.support_fapiao = Number(val);
    }
  }
  
  // 货币类型
  if (isNotEmpty(input.currency_lbl) && input.currency === undefined) {
    const val = currencyDict.find((itemTmp) => itemTmp.lbl === input.currency_lbl)?.val;
    if (val !== undefined) {
      input.currency = val;
    }
  }
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<PayTransactionsJsapiFieldComment> {
  const n = initN(route_path);
  const fieldComments: PayTransactionsJsapiFieldComment = {
    id: await n("ID"),
    appid: await n("appid"),
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
 * 通过唯一约束获得数据列表
 * @param {PayTransactionsJsapiInput} search0
 */
export async function findByUnique(
  search0: PayTransactionsJsapiInput,
  options?: {
  },
): Promise<PayTransactionsJsapiModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
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
  oldModel: PayTransactionsJsapiModel,
  input: PayTransactionsJsapiInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {PayTransactionsJsapiInput} input
 * @param {PayTransactionsJsapiModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  input: PayTransactionsJsapiInput,
  oldModel: PayTransactionsJsapiModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const result = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        {
          ...options,
        },
      );
      return result;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

/**
 * 根据条件查找第一条数据
 * @param {PayTransactionsJsapiSearch} search?
 */
export async function findOne(
  search?: PayTransactionsJsapiSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<PayTransactionsJsapiModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
  options?: {
  },
): Promise<PayTransactionsJsapiModel | undefined> {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {PayTransactionsJsapiSearch} search?
 */
export async function exist(
  search?: PayTransactionsJsapiSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const table = "wx_pay_transactions_jsapi";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wx_pay_transactions_jsapi t
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

/** 校验记录是否存在 */
export async function validateOption(
  model?: PayTransactionsJsapiModel,
) {
  if (!model) {
    throw `${ await ns("微信JSAPI下单") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: PayTransactionsJsapiInput,
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
 * 创建数据
 * @param {PayTransactionsJsapiInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  input: PayTransactionsJsapiInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const table = "wx_pay_transactions_jsapi";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: string | undefined = undefined;
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
    input.id = shortUuidV4();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wx_pay_transactions_jsapi(
      id
      ,create_time
      ,update_time
  `;
  if (input.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  if (input.org_id != null) {
    sql += `,org_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,org_id`;
    }
  }
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
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
  if (input.description !== undefined) {
    sql += `,description`;
  }
  if (input.out_trade_no !== undefined) {
    sql += `,out_trade_no`;
  }
  if (input.transaction_id !== undefined) {
    sql += `,transaction_id`;
  }
  if (input.trade_state !== undefined) {
    sql += `,trade_state`;
  }
  if (input.trade_state_desc !== undefined) {
    sql += `,trade_state_desc`;
  }
  if (input.success_time !== undefined) {
    sql += `,success_time`;
  }
  if (input.time_expire !== undefined) {
    sql += `,time_expire`;
  }
  if (input.attach !== undefined) {
    sql += `,attach`;
  }
  if (input.attach2 !== undefined) {
    sql += `,attach2`;
  }
  if (input.notify_url !== undefined) {
    sql += `,notify_url`;
  }
  if (input.support_fapiao !== undefined) {
    sql += `,support_fapiao`;
  }
  if (input.total_fee !== undefined) {
    sql += `,total_fee`;
  }
  if (input.currency !== undefined) {
    sql += `,currency`;
  }
  if (input.openid !== undefined) {
    sql += `,openid`;
  }
  if (input.prepay_id !== undefined) {
    sql += `,prepay_id`;
  }
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;
  if (input.tenant_id != null) {
    sql += `,${ args.push(input.tenant_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (input.org_id != null) {
    sql += `,${ args.push(input.org_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,${ args.push(authModel?.org_id) }`;
    }
  }
  if (input.create_usr_id != null && input.create_usr_id !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
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
  if (input.description !== undefined) {
    sql += `,${ args.push(input.description) }`;
  }
  if (input.out_trade_no !== undefined) {
    sql += `,${ args.push(input.out_trade_no) }`;
  }
  if (input.transaction_id !== undefined) {
    sql += `,${ args.push(input.transaction_id) }`;
  }
  if (input.trade_state !== undefined) {
    sql += `,${ args.push(input.trade_state) }`;
  }
  if (input.trade_state_desc !== undefined) {
    sql += `,${ args.push(input.trade_state_desc) }`;
  }
  if (input.success_time !== undefined) {
    sql += `,${ args.push(input.success_time) }`;
  }
  if (input.time_expire !== undefined) {
    sql += `,${ args.push(input.time_expire) }`;
  }
  if (input.attach !== undefined) {
    sql += `,${ args.push(input.attach) }`;
  }
  if (input.attach2 !== undefined) {
    sql += `,${ args.push(input.attach2) }`;
  }
  if (input.notify_url !== undefined) {
    sql += `,${ args.push(input.notify_url) }`;
  }
  if (input.support_fapiao !== undefined) {
    sql += `,${ args.push(input.support_fapiao) }`;
  }
  if (input.total_fee !== undefined) {
    sql += `,${ args.push(input.total_fee) }`;
  }
  if (input.currency !== undefined) {
    sql += `,${ args.push(input.currency) }`;
  }
  if (input.openid !== undefined) {
    sql += `,${ args.push(input.openid) }`;
  }
  if (input.prepay_id !== undefined) {
    sql += `,${ args.push(input.prepay_id) }`;
  }
  sql += `)`;
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  return input.id;
}

/**
 * 根据id修改租户id
 * @param {string} id
 * @param {string} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_pay_transactions_jsapi
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
 * 根据id修改组织id
 * @export
 * @param {string} id
 * @param {string} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: string,
  org_id: string,
  options?: {
  },
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_pay_transactions_jsapi
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
 * 根据id修改一行数据
 * @param {string} id
 * @param {PayTransactionsJsapiInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: PayTransactionsJsapiInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<string> {
  const table = "wx_pay_transactions_jsapi";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id);
  }
  
  // 修改组织id
  if (isNotEmpty(input.org_id)) {
    await updateOrgById(id, input.org_id);
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
    update wx_pay_transactions_jsapi set
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
  if (input.description !== undefined) {
    if (input.description != oldModel.description) {
      sql += `description = ${ args.push(input.description) },`;
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
  if (input.success_time !== undefined) {
    if (input.success_time != oldModel.success_time) {
      sql += `success_time = ${ args.push(input.success_time) },`;
      updateFldNum++;
    }
  }
  if (input.time_expire !== undefined) {
    if (input.time_expire != oldModel.time_expire) {
      sql += `time_expire = ${ args.push(input.time_expire) },`;
      updateFldNum++;
    }
  }
  if (input.attach !== undefined) {
    if (input.attach != oldModel.attach) {
      sql += `attach = ${ args.push(input.attach) },`;
      updateFldNum++;
    }
  }
  if (input.attach2 !== undefined) {
    if (input.attach2 != oldModel.attach2) {
      sql += `attach2 = ${ args.push(input.attach2) },`;
      updateFldNum++;
    }
  }
  if (input.notify_url !== undefined) {
    if (input.notify_url != oldModel.notify_url) {
      sql += `notify_url = ${ args.push(input.notify_url) },`;
      updateFldNum++;
    }
  }
  if (input.support_fapiao !== undefined) {
    if (input.support_fapiao != oldModel.support_fapiao) {
      sql += `support_fapiao = ${ args.push(input.support_fapiao) },`;
      updateFldNum++;
    }
  }
  if (input.total_fee !== undefined) {
    if (input.total_fee != oldModel.total_fee) {
      sql += `total_fee = ${ args.push(input.total_fee) },`;
      updateFldNum++;
    }
  }
  if (input.currency !== undefined) {
    if (input.currency != oldModel.currency) {
      sql += `currency = ${ args.push(input.currency) },`;
      updateFldNum++;
    }
  }
  if (input.openid !== undefined) {
    if (input.openid != oldModel.openid) {
      sql += `openid = ${ args.push(input.openid) },`;
      updateFldNum++;
    }
  }
  if (input.prepay_id !== undefined) {
    if (input.prepay_id != oldModel.prepay_id) {
      sql += `prepay_id = ${ args.push(input.prepay_id) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await authDao.getAuthModel();
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
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        wx_pay_transactions_jsapi
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
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wx_pay_transactions_jsapi
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
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "wx_pay_transactions_jsapi";
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
          wx_pay_transactions_jsapi
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wx_pay_transactions_jsapi
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
