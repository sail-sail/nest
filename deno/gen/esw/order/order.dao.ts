// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

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

import * as orgDao from "/gen/base/org/org.dao.ts";

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

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  OrderInput,
  OrderModel,
  OrderSearch,
  OrderFieldComment,
  OrderId,
} from "./order.model.ts";

import * as usrDao from "/gen/base/usr/usr.dao.ts";

import * as cardDao from "/gen/esw/card/card.dao.ts";

const route_path = "/esw/order";

async function getWhereQuery(
  args: QueryArgs,
  search?: OrderSearch,
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
  if (search?.lbl_seq && search?.lbl_seq?.length > 0) {
    if (search.lbl_seq[0] != null) {
      whereQuery += ` and t.lbl_seq >= ${ args.push(search.lbl_seq[0]) }`;
    }
    if (search.lbl_seq[1] != null) {
      whereQuery += ` and t.lbl_seq <= ${ args.push(search.lbl_seq[1]) }`;
    }
  }
  if (search?.lbl_date_seq && search?.lbl_date_seq?.length > 0) {
    if (search.lbl_date_seq[0] != null) {
      whereQuery += ` and t.lbl_date_seq >= ${ args.push(search.lbl_date_seq[0]) }`;
    }
    if (search.lbl_date_seq[1] != null) {
      whereQuery += ` and t.lbl_date_seq <= ${ args.push(search.lbl_date_seq[1]) }`;
    }
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.company !== undefined) {
    whereQuery += ` and t.company = ${ args.push(search.company) }`;
  }
  if (search?.company === null) {
    whereQuery += ` and t.company is null`;
  }
  if (isNotEmpty(search?.company_like)) {
    whereQuery += ` and t.company like ${ args.push("%" + sqlLike(search?.company_like) + "%") }`;
  }
  if (search?.phone !== undefined) {
    whereQuery += ` and t.phone = ${ args.push(search.phone) }`;
  }
  if (search?.phone === null) {
    whereQuery += ` and t.phone is null`;
  }
  if (isNotEmpty(search?.phone_like)) {
    whereQuery += ` and t.phone like ${ args.push("%" + sqlLike(search?.phone_like) + "%") }`;
  }
  if (search?.status && !Array.isArray(search?.status)) {
    search.status = [ search.status ];
  }
  if (search?.status && search?.status?.length > 0) {
    whereQuery += ` and t.status in ${ args.push(search.status) }`;
  }
  if (search?.usr_id && !Array.isArray(search?.usr_id)) {
    search.usr_id = [ search.usr_id ];
  }
  if (search?.usr_id && search?.usr_id.length > 0) {
    whereQuery += ` and usr_id_lbl.id in ${ args.push(search.usr_id) }`;
  }
  if (search?.usr_id === null) {
    whereQuery += ` and usr_id_lbl.id is null`;
  }
  if (search?.usr_id_is_null) {
    whereQuery += ` and usr_id_lbl.id is null`;
  }
  if (search?.card_id && !Array.isArray(search?.card_id)) {
    search.card_id = [ search.card_id ];
  }
  if (search?.card_id && search?.card_id.length > 0) {
    whereQuery += ` and card_id_lbl.id in ${ args.push(search.card_id) }`;
  }
  if (search?.card_id === null) {
    whereQuery += ` and card_id_lbl.id is null`;
  }
  if (search?.card_id_is_null) {
    whereQuery += ` and card_id_lbl.id is null`;
  }
  if (search?.price && search?.price?.length > 0) {
    if (search.price[0] != null) {
      whereQuery += ` and t.price >= ${ args.push(search.price[0]) }`;
    }
    if (search.price[1] != null) {
      whereQuery += ` and t.price <= ${ args.push(search.price[1]) }`;
    }
  }
  if (search?.type && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.amt && search?.amt?.length > 0) {
    if (search.amt[0] != null) {
      whereQuery += ` and t.amt >= ${ args.push(search.amt[0]) }`;
    }
    if (search.amt[1] != null) {
      whereQuery += ` and t.amt <= ${ args.push(search.amt[1]) }`;
    }
  }
  if (search?.give_amt && search?.give_amt?.length > 0) {
    if (search.give_amt[0] != null) {
      whereQuery += ` and t.give_amt >= ${ args.push(search.give_amt[0]) }`;
    }
    if (search.give_amt[1] != null) {
      whereQuery += ` and t.give_amt <= ${ args.push(search.give_amt[1]) }`;
    }
  }
  if (search?.integral && search?.integral?.length > 0) {
    if (search.integral[0] != null) {
      whereQuery += ` and t.integral >= ${ args.push(search.integral[0]) }`;
    }
    if (search.integral[1] != null) {
      whereQuery += ` and t.integral <= ${ args.push(search.integral[1]) }`;
    }
  }
  if (search?.balance && search?.balance?.length > 0) {
    if (search.balance[0] != null) {
      whereQuery += ` and t.balance >= ${ args.push(search.balance[0]) }`;
    }
    if (search.balance[1] != null) {
      whereQuery += ` and t.balance <= ${ args.push(search.balance[1]) }`;
    }
  }
  if (search?.give_balance && search?.give_balance?.length > 0) {
    if (search.give_balance[0] != null) {
      whereQuery += ` and t.give_balance >= ${ args.push(search.give_balance[0]) }`;
    }
    if (search.give_balance[1] != null) {
      whereQuery += ` and t.give_balance <= ${ args.push(search.give_balance[1]) }`;
    }
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
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
    esw_order t
    left join base_usr usr_id_lbl
      on usr_id_lbl.id = t.usr_id
    left join esw_card card_id_lbl
      on card_id_lbl.id = t.card_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
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
  },
): Promise<number> {
  const table = "esw_order";
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
 * 根据搜索条件和分页查找订单列表
 * @param {OrderSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: OrderSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<OrderModel[]> {
  const table = "esw_order";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,usr_id_lbl.lbl usr_id_lbl
      ,card_id_lbl.lbl card_id_lbl
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
  
  const result = await query<OrderModel>(
    sql,
    args,
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
    
    // 订单金额
    if (model.price != null) {
      model.price = new Decimal(model.price);
    }
    
    // 订单类别
    let type_lbl = model.type as string;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl;
    
    // 消费充值金额
    if (model.amt != null) {
      model.amt = new Decimal(model.amt);
    }
    
    // 消费赠送金额
    if (model.give_amt != null) {
      model.give_amt = new Decimal(model.give_amt);
    }
    
    // 消费后充值余额
    if (model.balance != null) {
      model.balance = new Decimal(model.balance);
    }
    
    // 消费后赠送余额
    if (model.give_balance != null) {
      model.give_balance = new Decimal(model.give_balance);
    }
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked !== undefined && model.is_locked !== null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled !== undefined && model.is_enabled !== null) {
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
  if (isNotEmpty(input.status_lbl) && input.status === undefined) {
    const val = statusDict.find((itemTmp) => itemTmp.lbl === input.status_lbl)?.val;
    if (val !== undefined) {
      input.status = val as OrderStatus;
    }
  }
  
  // 用户
  if (isNotEmpty(input.usr_id_lbl) && input.usr_id === undefined) {
    input.usr_id_lbl = String(input.usr_id_lbl).trim();
    const usrModel = await usrDao.findOne({ lbl: input.usr_id_lbl });
    if (usrModel) {
      input.usr_id = usrModel.id;
    }
  }
  
  // 会员卡
  if (isNotEmpty(input.card_id_lbl) && input.card_id === undefined) {
    input.card_id_lbl = String(input.card_id_lbl).trim();
    const cardModel = await cardDao.findOne({ lbl: input.card_id_lbl });
    if (cardModel) {
      input.card_id = cardModel.id;
    }
  }
  
  // 订单类别
  if (isNotEmpty(input.type_lbl) && input.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === input.type_lbl)?.val;
    if (val !== undefined) {
      input.type = val as OrderType;
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val !== undefined) {
      input.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val !== undefined) {
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
  },
): Promise<OrderModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
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
    });
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
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const id: OrderId = await updateById(
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
 * 根据条件查找第一个订单
 * @param {OrderSearch} search?
 */
export async function findOne(
  search?: OrderSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<OrderModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
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
  },
): Promise<OrderModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断订单是否存在
 * @param {OrderSearch} search?
 */
export async function exist(
  search?: OrderSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断订单是否存在
 * @param {OrderId} id
 */
export async function existById(
  id?: OrderId | null,
) {
  const table = "esw_order";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      esw_order t
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
    uniqueType?: UniqueType;
  },
): Promise<OrderId> {
  const table = "esw_order";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
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
      return id;
    }
  }
  
  while (true) {
    input.id = shortUuidV4<OrderId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into esw_order(
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
  if (input.lbl_seq !== undefined) {
    sql += `,lbl_seq`;
  }
  if (input.lbl_date_seq !== undefined) {
    sql += `,lbl_date_seq`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.company !== undefined) {
    sql += `,company`;
  }
  if (input.phone !== undefined) {
    sql += `,phone`;
  }
  if (input.status !== undefined) {
    sql += `,status`;
  }
  if (input.usr_id !== undefined) {
    sql += `,usr_id`;
  }
  if (input.card_id !== undefined) {
    sql += `,card_id`;
  }
  if (input.price !== undefined) {
    sql += `,price`;
  }
  if (input.type !== undefined) {
    sql += `,type`;
  }
  if (input.amt !== undefined) {
    sql += `,amt`;
  }
  if (input.give_amt !== undefined) {
    sql += `,give_amt`;
  }
  if (input.integral !== undefined) {
    sql += `,integral`;
  }
  if (input.balance !== undefined) {
    sql += `,balance`;
  }
  if (input.give_balance !== undefined) {
    sql += `,give_balance`;
  }
  if (input.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,is_enabled`;
  }
  if (input.rem !== undefined) {
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
  if (input.lbl_seq !== undefined) {
    sql += `,${ args.push(input.lbl_seq) }`;
  }
  if (input.lbl_date_seq !== undefined) {
    sql += `,${ args.push(input.lbl_date_seq) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.company !== undefined) {
    sql += `,${ args.push(input.company) }`;
  }
  if (input.phone !== undefined) {
    sql += `,${ args.push(input.phone) }`;
  }
  if (input.status !== undefined) {
    sql += `,${ args.push(input.status) }`;
  }
  if (input.usr_id !== undefined) {
    sql += `,${ args.push(input.usr_id) }`;
  }
  if (input.card_id !== undefined) {
    sql += `,${ args.push(input.card_id) }`;
  }
  if (input.price !== undefined) {
    sql += `,${ args.push(input.price) }`;
  }
  if (input.type !== undefined) {
    sql += `,${ args.push(input.type) }`;
  }
  if (input.amt !== undefined) {
    sql += `,${ args.push(input.amt) }`;
  }
  if (input.give_amt !== undefined) {
    sql += `,${ args.push(input.give_amt) }`;
  }
  if (input.integral !== undefined) {
    sql += `,${ args.push(input.integral) }`;
  }
  if (input.balance !== undefined) {
    sql += `,${ args.push(input.balance) }`;
  }
  if (input.give_balance !== undefined) {
    sql += `,${ args.push(input.give_balance) }`;
  }
  if (input.is_locked !== undefined) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,${ args.push(input.is_enabled) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  return input.id;
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
  },
): Promise<number> {
  const table = "esw_order";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      esw_order
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
  const table = "esw_order";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      esw_order
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
    uniqueType?: "ignore" | "throw";
  },
): Promise<OrderId> {
  const table = "esw_order";
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
    update esw_order set
  `;
  let updateFldNum = 0;
  if (input.lbl_seq !== undefined) {
    if (input.lbl_seq != oldModel.lbl_seq) {
      sql += `lbl_seq = ${ args.push(input.lbl_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl_date_seq !== undefined) {
    if (input.lbl_date_seq != oldModel.lbl_date_seq) {
      sql += `lbl_date_seq = ${ args.push(input.lbl_date_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.company !== undefined) {
    if (input.company != oldModel.company) {
      sql += `company = ${ args.push(input.company) },`;
      updateFldNum++;
    }
  }
  if (input.phone !== undefined) {
    if (input.phone != oldModel.phone) {
      sql += `phone = ${ args.push(input.phone) },`;
      updateFldNum++;
    }
  }
  if (input.status !== undefined) {
    if (input.status != oldModel.status) {
      sql += `status = ${ args.push(input.status) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id !== undefined) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id = ${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.card_id !== undefined) {
    if (input.card_id != oldModel.card_id) {
      sql += `card_id = ${ args.push(input.card_id) },`;
      updateFldNum++;
    }
  }
  if (input.price !== undefined) {
    if (input.price != oldModel.price) {
      sql += `price = ${ args.push(input.price) },`;
      updateFldNum++;
    }
  }
  if (input.type !== undefined) {
    if (input.type != oldModel.type) {
      sql += `type = ${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.amt !== undefined) {
    if (input.amt != oldModel.amt) {
      sql += `amt = ${ args.push(input.amt) },`;
      updateFldNum++;
    }
  }
  if (input.give_amt !== undefined) {
    if (input.give_amt != oldModel.give_amt) {
      sql += `give_amt = ${ args.push(input.give_amt) },`;
      updateFldNum++;
    }
  }
  if (input.integral !== undefined) {
    if (input.integral != oldModel.integral) {
      sql += `integral = ${ args.push(input.integral) },`;
      updateFldNum++;
    }
  }
  if (input.balance !== undefined) {
    if (input.balance != oldModel.balance) {
      sql += `balance = ${ args.push(input.balance) },`;
      updateFldNum++;
    }
  }
  if (input.give_balance !== undefined) {
    if (input.give_balance != oldModel.give_balance) {
      sql += `give_balance = ${ args.push(input.give_balance) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked !== undefined) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(input.is_locked) },`;
      updateFldNum++;
    }
  }
  if (input.is_enabled !== undefined) {
    if (input.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled = ${ args.push(input.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (input.rem !== undefined) {
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
 * 根据 ids 删除订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: OrderId[],
  options?: {
  },
): Promise<number> {
  const table = "esw_order";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: OrderId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        esw_order
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
  },
): Promise<number> {
  const table = "esw_order";
  const method = "enableByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      esw_order
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
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
  },
): Promise<number> {
  const table = "esw_order";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      esw_order
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
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
  },
): Promise<number> {
  const table = "esw_order";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: OrderId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        esw_order
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
 * 根据 ids 彻底删除订单
 * @param {OrderId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: OrderId[],
  options?: {
  },
): Promise<number> {
  const table = "esw_order";
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
          esw_order
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        esw_order
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
