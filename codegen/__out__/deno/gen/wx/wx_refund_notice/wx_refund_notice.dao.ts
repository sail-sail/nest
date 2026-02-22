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
  WxRefundNoticeRefundStatus,
} from "/gen/types.ts";

import {
  getPagePathWxRefundNotice,
  getTableNameWxRefundNotice,
} from "./wx_refund_notice.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxRefundNoticeSearch>,
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
  if (search?.refund_status != null) {
    whereQuery += ` and t.refund_status in (${ args.push(search.refund_status) })`;
  }
  if (search?.success_time != null) {
    if (search.success_time[0] != null) {
      whereQuery += ` and t.success_time>=${ args.push(search.success_time[0]) }`;
    }
    if (search.success_time[1] != null) {
      whereQuery += ` and t.success_time<=${ args.push(search.success_time[1]) }`;
    }
  }
  if (search?.user_received_account != null) {
    whereQuery += ` and t.user_received_account=${ args.push(search.user_received_account) }`;
  }
  if (isNotEmpty(search?.user_received_account_like)) {
    whereQuery += ` and t.user_received_account like ${ args.push("%" + sqlLike(search?.user_received_account_like) + "%") }`;
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
  search?: Readonly<WxRefundNoticeSearch>,
  options?: {
  },
) {
  let fromQuery = `wx_wx_refund_notice t`;
  return fromQuery;
}

// MARK: findCountWxRefundNotice
/** 根据条件查找微信退款通知总数 */
export async function findCountWxRefundNotice(
  search?: Readonly<WxRefundNoticeSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findCountWxRefundNotice";
  
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
  // 退款状态
  if (search && search.refund_status != null) {
    const len = search.refund_status.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.refund_status.length > ${ ids_limit }`);
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

// MARK: findAllWxRefundNotice
/** 根据搜索条件和分页查找微信退款通知列表 */
export async function findAllWxRefundNotice(
  search?: Readonly<WxRefundNoticeSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxRefundNoticeModel[]> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findAllWxRefundNotice";
  
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
  // 退款状态
  if (search && search.refund_status != null) {
    const len = search.refund_status.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.refund_status.length > ${ ids_limit }`);
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
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxRefundNoticeModel>(
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
    refund_statusDict, // 退款状态
  ] = await getDict([
    "wx_refund_status",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 退款状态
    let refund_status_lbl = model.refund_status as string;
    if (!isEmpty(model.refund_status)) {
      const dictItem = refund_statusDict.find((dictItem) => dictItem.val === model.refund_status);
      if (dictItem) {
        refund_status_lbl = dictItem.lbl;
      }
    }
    model.refund_status_lbl = refund_status_lbl || "";
    
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

// MARK: setIdByLblWxRefundNotice
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblWxRefundNotice(
  input: WxRefundNoticeInput,
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
      const fieldComments = await getFieldCommentsWxRefundNotice();
      throw `${ fieldComments.success_time } 日期格式错误`;
    }
  }
  if (input.success_time) {
    const success_time = dayjs(input.success_time);
    if (!success_time.isValid()) {
      const fieldComments = await getFieldCommentsWxRefundNotice();
      throw `${ fieldComments.success_time } 日期格式错误`;
    }
    input.success_time = dayjs(input.success_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    refund_statusDict, // 退款状态
  ] = await getDict([
    "wx_refund_status",
  ]);
  
  // 退款状态
  if (isNotEmpty(input.refund_status_lbl) && input.refund_status == null) {
    const val = refund_statusDict.find((itemTmp) => itemTmp.lbl === input.refund_status_lbl)?.val;
    if (val != null) {
      input.refund_status = val as WxRefundNoticeRefundStatus;
    }
  } else if (isEmpty(input.refund_status_lbl) && input.refund_status != null) {
    const lbl = refund_statusDict.find((itemTmp) => itemTmp.val === input.refund_status)?.lbl || "";
    input.refund_status_lbl = lbl;
  }
  
  // 退款成功时间
  if (isNotEmpty(input.success_time_lbl) && input.success_time == null) {
    input.success_time_lbl = String(input.success_time_lbl).trim();
    input.success_time = input.success_time_lbl;
  }
}

// MARK: getFieldCommentsWxRefundNotice
/** 获取微信退款通知字段注释 */
export async function getFieldCommentsWxRefundNotice(): Promise<WxRefundNoticeFieldComment> {
  const field_comments: WxRefundNoticeFieldComment = {
    id: "ID",
    appid: "开发者ID",
    mchid: "商户号",
    out_trade_no: "商户订单号",
    transaction_id: "微信支付订单号",
    out_refund_no: "商户退款单号",
    refund_id: "微信退款单号",
    refund_status: "退款状态",
    refund_status_lbl: "退款状态",
    success_time: "退款成功时间",
    success_time_lbl: "退款成功时间",
    user_received_account: "退款入账账户",
    amount_total: "订单金额(分)",
    amount_refund: "退款金额(分)",
    amount_payer_total: "用户实际支付金额(分)",
    amount_payer_refund: "用户退款金额(分)",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
  };
  
  return field_comments;
}

// MARK: findByUniqueWxRefundNotice
/** 通过唯一约束获得微信退款通知列表 */
export async function findByUniqueWxRefundNotice(
  search0: Readonly<WxRefundNoticeInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel[]> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findByUniqueWxRefundNotice";
  
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
    const model = await findOneWxRefundNotice(
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
  const models: WxRefundNoticeModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueWxRefundNotice(
  oldModel: Readonly<WxRefundNoticeModel>,
  input: Readonly<WxRefundNoticeInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueWxRefundNotice
/** 通过唯一约束检查 微信退款通知 是否已经存在 */
export async function checkByUniqueWxRefundNotice(
  input: Readonly<WxRefundNoticeInput>,
  oldModel: Readonly<WxRefundNoticeModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueWxRefundNotice(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("微信退款通知 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxRefundNoticeId = await updateByIdWxRefundNotice(
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

// MARK: findOneWxRefundNotice
/** 根据条件查找第一微信退款通知 */
export async function findOneWxRefundNotice(
  search?: Readonly<WxRefundNoticeSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel | undefined> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findOneWxRefundNotice";
  
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
  
  const wx_refund_notice_models = await findAllWxRefundNotice(
    search,
    page,
    sort,
    options,
  );
  
  const wx_refund_notice_model = wx_refund_notice_models[0];
  
  return wx_refund_notice_model;
}

// MARK: findOneOkWxRefundNotice
/** 根据条件查找第一微信退款通知, 如果不存在则抛错 */
export async function findOneOkWxRefundNotice(
  search?: Readonly<WxRefundNoticeSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findOneOkWxRefundNotice";
  
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
  
  const wx_refund_notice_models = await findAllWxRefundNotice(
    search,
    page,
    sort,
    options,
  );
  
  const wx_refund_notice_model = wx_refund_notice_models[0];
  
  if (!wx_refund_notice_model) {
    const err_msg = "此 微信退款通知 已被删除";
    throw new Error(err_msg);
  }
  
  return wx_refund_notice_model;
}

// MARK: findByIdWxRefundNotice
/** 根据 id 查找微信退款通知 */
export async function findByIdWxRefundNotice(
  id: WxRefundNoticeId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel | undefined> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findByIdWxRefundNotice";
  
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
  
  const wx_refund_notice_model = await findOneWxRefundNotice(
    {
      id,
    },
    undefined,
    options,
  );
  
  return wx_refund_notice_model;
}

// MARK: findByIdOkWxRefundNotice
/** 根据 id 查找微信退款通知, 如果不存在则抛错 */
export async function findByIdOkWxRefundNotice(
  id: WxRefundNoticeId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findByIdOkWxRefundNotice";
  
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
  
  const wx_refund_notice_model = await findByIdWxRefundNotice(
    id,
    options,
  );
  
  if (!wx_refund_notice_model) {
    const err_msg = "此 微信退款通知 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return wx_refund_notice_model;
}

// MARK: findByIdsWxRefundNotice
/** 根据 ids 查找微信退款通知 */
export async function findByIdsWxRefundNotice(
  ids: WxRefundNoticeId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel[]> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findByIdsWxRefundNotice";
  
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
  
  const models = await findAllWxRefundNotice(
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

// MARK: findByIdsOkWxRefundNotice
/** 根据 ids 查找微信退款通知, 出现查询不到的 id 则报错 */
export async function findByIdsOkWxRefundNotice(
  ids: WxRefundNoticeId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxRefundNoticeModel[]> {
  
  const table = getTableNameWxRefundNotice();
  const method = "findByIdsOkWxRefundNotice";
  
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
  
  const models = await findByIdsWxRefundNotice(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 微信退款通知 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 微信退款通知 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existWxRefundNotice
/** 根据搜索条件判断微信退款通知是否存在 */
export async function existWxRefundNotice(
  search?: Readonly<WxRefundNoticeSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameWxRefundNotice();
  const method = "existWxRefundNotice";
  
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
  const model = await findOneWxRefundNotice(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdWxRefundNotice
/** 根据id判断微信退款通知是否存在 */
export async function existByIdWxRefundNotice(
  id?: Readonly<WxRefundNoticeId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameWxRefundNotice();
  const method = "existByIdWxRefundNotice";
  
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
  const sql = `select 1 e from wx_wx_refund_notice t where t.id=${ args.push(id) } limit 1`;
  
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

// MARK: validateOptionWxRefundNotice
/** 校验微信退款通知是否存在 */
export async function validateOptionWxRefundNotice(
  model?: WxRefundNoticeModel,
) {
  if (!model) {
    const err_msg = "微信退款通知 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateWxRefundNotice
/** 微信退款通知增加和修改时校验输入 */
export async function validateWxRefundNotice(
  input: Readonly<WxRefundNoticeInput>,
) {
  const fieldComments = await getFieldCommentsWxRefundNotice();
  
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
  
  // 退款入账账户
  await validators.chars_max_length(
    input.user_received_account,
    64,
    fieldComments.user_received_account,
  );
  
}

// MARK: createReturnWxRefundNotice
/** 创建 微信退款通知 并返回 */
export async function createReturnWxRefundNotice(
  input: Readonly<WxRefundNoticeInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundNoticeModel> {
  
  const table = getTableNameWxRefundNotice();
  const method = "createReturnWxRefundNotice";
  
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
  
  const model = await validateOptionWxRefundNotice(
    await findOneWxRefundNotice(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createWxRefundNotice
/** 创建 微信退款通知 */
export async function createWxRefundNotice(
  input: Readonly<WxRefundNoticeInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundNoticeId> {
  
  const table = getTableNameWxRefundNotice();
  const method = "createWxRefundNotice";
  
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

// MARK: createsReturnWxRefundNotice
/** 批量创建 微信退款通知 并返回 */
export async function createsReturnWxRefundNotice(
  inputs: WxRefundNoticeInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundNoticeModel[]> {
  
  const table = getTableNameWxRefundNotice();
  const method = "createsReturnWxRefundNotice";
  
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
  
  const models = await findByIdsWxRefundNotice(ids, options);
  
  return models;
}

// MARK: createsWxRefundNotice
/** 批量创建 微信退款通知 */
export async function createsWxRefundNotice(
  inputs: WxRefundNoticeInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundNoticeId[]> {
  
  const table = getTableNameWxRefundNotice();
  const method = "createsWxRefundNotice";
  
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
  inputs: WxRefundNoticeInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxRefundNoticeId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNameWxRefundNotice();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxRefundNoticeId[] = [ ];
  const inputs2: WxRefundNoticeInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueWxRefundNotice(input, options);
    if (oldModels.length > 0) {
      let id: WxRefundNoticeId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueWxRefundNotice(
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
    
    const id = shortUuidV4<WxRefundNoticeId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into wx_wx_refund_notice(id,create_time,tenant_id,appid,mchid,out_trade_no,transaction_id,out_refund_no,refund_id,refund_status,success_time,user_received_account,amount_total,amount_refund,amount_payer_total,amount_payer_refund)values";
  
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
      if (input.refund_status != null) {
        sql += `,${ args.push(input.refund_status) }`;
      } else {
        sql += ",default";
      }
      if (input.success_time != null || input.success_time_save_null) {
        sql += `,${ args.push(input.success_time) }`;
      } else {
        sql += ",default";
      }
      if (input.user_received_account != null) {
        sql += `,${ args.push(input.user_received_account) }`;
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

// MARK: updateTenantByIdWxRefundNotice
/** 微信退款通知 根据 id 修改 租户id */
export async function updateTenantByIdWxRefundNotice(
  id: WxRefundNoticeId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameWxRefundNotice();
  const method = "updateTenantByIdWxRefundNotice";
  
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
  const sql = `update wx_wx_refund_notice set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdWxRefundNotice
/** 根据 id 修改 微信退款通知 */
export async function updateByIdWxRefundNotice(
  id: WxRefundNoticeId,
  input: WxRefundNoticeInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxRefundNoticeId> {
  
  const table = getTableNameWxRefundNotice();
  const method = "updateByIdWxRefundNotice";
  
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
    throw new Error("updateByIdWxRefundNotice: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdWxRefundNotice: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdWxRefundNotice(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueWxRefundNotice(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "微信退款通知 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdWxRefundNotice(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 微信退款通知 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update wx_wx_refund_notice set `;
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
  if (input.refund_status != null) {
    if (input.refund_status != oldModel.refund_status) {
      sql += `refund_status=${ args.push(input.refund_status) },`;
      updateFldNum++;
    }
  }
  if (input.success_time != null || input.success_time_save_null) {
    if (input.success_time != oldModel.success_time) {
      sql += `success_time=${ args.push(input.success_time) },`;
      updateFldNum++;
    }
  }
  if (input.user_received_account != null) {
    if (input.user_received_account != oldModel.user_received_account) {
      sql += `user_received_account=${ args.push(input.user_received_account) },`;
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

// MARK: updateByIdWxRefundNotice
/** 根据 id 更新微信退款通知, 并返回更新后的数据 */
export async function updateByIdReturnWxRefundNotice(
  id: WxRefundNoticeId,
  input: WxRefundNoticeInput,
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxRefundNoticeModel> {
  
  await updateByIdWxRefundNotice(
    id,
    input,
    options,
  );
  
  const model = await findByIdWxRefundNotice(
    id,
    options,
  );
  
  if (!model) {
    throw new Error(`微信退款通知 不存在`);
  }
  
  return model;
}

// MARK: deleteByIdsWxRefundNotice
/** 根据 ids 删除 微信退款通知 */
export async function deleteByIdsWxRefundNotice(
  ids: WxRefundNoticeId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameWxRefundNotice();
  const method = "deleteByIdsWxRefundNotice";
  
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
    const oldModel = await findByIdWxRefundNotice(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from wx_wx_refund_notice where id=${ args.push(id) } limit 1`;
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
