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
} from "/gen/types.ts";

import {
  findOne as findOneCard,
} from "/gen/wshop/card/card.dao.ts";

import {
  findOne as findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

const route_path = "/wshop/card_recharge";

async function getWhereQuery(
  args: QueryArgs,
  search?: CardRechargeSearch,
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
  if (search?.transaction_id != null) {
    whereQuery += ` and t.transaction_id=${ args.push(search.transaction_id) }`;
  }
  if (isNotEmpty(search?.transaction_id_like)) {
    whereQuery += ` and t.transaction_id like ${ args.push("%" + sqlLike(search?.transaction_id_like) + "%") }`;
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
  if (search?.usr_id != null && !Array.isArray(search?.usr_id)) {
    search.usr_id = [ search.usr_id ];
  }
  if (search?.usr_id != null) {
    whereQuery += ` and usr_id_lbl.id in ${ args.push(search.usr_id) }`;
  }
  if (search?.usr_id_is_null) {
    whereQuery += ` and usr_id_lbl.id is null`;
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
  if (search?.integral != null) {
    if (search.integral[0] != null) {
      whereQuery += ` and t.integral>=${ args.push(search.integral[0]) }`;
    }
    if (search.integral[1] != null) {
      whereQuery += ` and t.integral<=${ args.push(search.integral[1]) }`;
    }
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
  search?: CardRechargeSearch,
  options?: {
  },
) {
  let fromQuery = `wshop_card_recharge t
    left join wshop_card card_id_lbl on card_id_lbl.id=t.card_id
    left join base_usr usr_id_lbl on usr_id_lbl.id=t.usr_id
    left join base_usr create_usr_id_lbl on create_usr_id_lbl.id=t.create_usr_id
    left join base_usr update_usr_id_lbl on update_usr_id_lbl.id=t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找会员卡充值记录总数
 * @param { CardRechargeSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CardRechargeSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_card_recharge";
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
 * 根据搜索条件和分页查找会员卡充值记录列表
 * @param {CardRechargeSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
    ids_limit?: number;
  },
): Promise<CardRechargeModel[]> {
  const table = "wshop_card_recharge";
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
      ,card_id_lbl.lbl card_id_lbl
      ,usr_id_lbl.lbl usr_id_lbl
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
  
  const result = await query<CardRechargeModel>(
    sql,
    args,
    {
      debug,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
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
  input: CardRechargeInput,
) {
  
  // 会员卡
  if (isNotEmpty(input.card_id_lbl) && input.card_id == null) {
    input.card_id_lbl = String(input.card_id_lbl).trim();
    const cardModel = await findOneCard({ lbl: input.card_id_lbl });
    if (cardModel) {
      input.card_id = cardModel.id;
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
}

/**
 * 获取会员卡充值记录字段注释
 */
export async function getFieldComments(): Promise<CardRechargeFieldComment> {
  const n = initN(route_path);
  const fieldComments: CardRechargeFieldComment = {
    id: await n("ID"),
    card_id: await n("会员卡"),
    card_id_lbl: await n("会员卡"),
    usr_id: await n("用户"),
    usr_id_lbl: await n("用户"),
    amt: await n("充值金额"),
    give_amt: await n("赠送金额"),
    balance: await n("充值后充值余额"),
    give_balance: await n("充值后赠送余额"),
    integral: await n("充值后积分"),
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
 * 通过唯一约束获得会员卡充值记录列表
 * @param {CardRechargeInput} search0
 */
export async function findByUnique(
  search0: CardRechargeInput,
  options?: {
    debug?: boolean;
  },
): Promise<CardRechargeModel[]> {
  
  const table = "wshop_card_recharge";
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
  const models: CardRechargeModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {CardRechargeModel} oldModel
 * @param {CardRechargeInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: CardRechargeModel,
  input: CardRechargeInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查会员卡充值记录是否已经存在
 * @param {CardRechargeInput} input
 * @param {CardRechargeModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<CardRechargeId | undefined>}
 */
export async function checkByUnique(
  input: CardRechargeInput,
  oldModel: CardRechargeModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<CardRechargeId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("会员卡充值记录")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: CardRechargeId = await updateById(
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
 * 根据条件查找第一个会员卡充值记录
 * @param {CardRechargeSearch} search?
 */
export async function findOne(
  search?: CardRechargeSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<CardRechargeModel | undefined> {
  const table = "wshop_card_recharge";
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
 * 根据 id 查找会员卡充值记录
 * @param {CardRechargeId} id
 */
export async function findById(
  id?: CardRechargeId | null,
  options?: {
    debug?: boolean;
  },
): Promise<CardRechargeModel | undefined> {
  const table = "wshop_card_recharge";
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
 * 根据搜索条件判断会员卡充值记录是否存在
 * @param {CardRechargeSearch} search?
 */
export async function exist(
  search?: CardRechargeSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wshop_card_recharge";
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
 * 根据id判断会员卡充值记录是否存在
 * @param {CardRechargeId} id
 */
export async function existById(
  id?: CardRechargeId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wshop_card_recharge";
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
  const sql = `select 1 e from wshop_card_recharge t where t.id = ${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

/** 校验会员卡充值记录是否存在 */
export async function validateOption(
  model?: CardRechargeModel,
) {
  if (!model) {
    throw `${ await ns("会员卡充值记录") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 会员卡充值记录增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CardRechargeInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 会员卡
  await validators.chars_max_length(
    input.card_id,
    22,
    fieldComments.card_id,
  );
  
  // 用户
  await validators.chars_max_length(
    input.usr_id,
    22,
    fieldComments.usr_id,
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
 * 创建会员卡充值记录
 * @param {CardRechargeInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<CardRechargeId>} 
 */
export async function create(
  input: CardRechargeInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CardRechargeId> {
  const table = "wshop_card_recharge";
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
 * 批量创建会员卡充值记录
 * @param {CardRechargeInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<CardRechargeId[]>} 
 */
export async function creates(
  inputs: CardRechargeInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CardRechargeId[]> {
  const table = "wshop_card_recharge";
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
  inputs: CardRechargeInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<CardRechargeId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wshop_card_recharge";
  
  const ids2: CardRechargeId[] = [ ];
  const inputs2: CardRechargeInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: CardRechargeId | undefined = undefined;
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
    
    const id = shortUuidV4<CardRechargeId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wshop_card_recharge(id,create_time,tenant_id,org_id,create_usr_id,transaction_id,card_id,usr_id,amt,give_amt,balance,give_balance,integral,rem)values`;
  
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
      if (input.transaction_id != null) {
        sql += `,${ args.push(input.transaction_id) }`;
      } else {
        sql += ",default";
      }
      if (input.card_id != null) {
        sql += `,${ args.push(input.card_id) }`;
      } else {
        sql += ",default";
      }
      if (input.usr_id != null) {
        sql += `,${ args.push(input.usr_id) }`;
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
      if (input.integral != null) {
        sql += `,${ args.push(input.integral) }`;
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
 * 会员卡充值记录根据id修改租户id
 * @param {CardRechargeId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: CardRechargeId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_card_recharge";
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
      wshop_card_recharge
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
 * 会员卡充值记录根据id修改组织id
 * @export
 * @param {CardRechargeId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: CardRechargeId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "wshop_card_recharge";
  const method = "updateOrgById";
  
  const orgExist = await existByIdOrg(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wshop_card_recharge
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
 * 根据 id 修改会员卡充值记录
 * @param {CardRechargeId} id
 * @param {CardRechargeInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<CardRechargeId>}
 */
export async function updateById(
  id: CardRechargeId,
  input: CardRechargeInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<CardRechargeId> {
  
  const table = "wshop_card_recharge";
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
        throw await ns("此 {0} 已经存在", await ns("会员卡充值记录"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("会员卡充值记录"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wshop_card_recharge set
  `;
  let updateFldNum = 0;
  if (input.transaction_id != null) {
    if (input.transaction_id != oldModel.transaction_id) {
      sql += `transaction_id = ${ args.push(input.transaction_id) },`;
      updateFldNum++;
    }
  }
  if (input.card_id != null) {
    if (input.card_id != oldModel.card_id) {
      sql += `card_id = ${ args.push(input.card_id) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id != null) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id = ${ args.push(input.usr_id) },`;
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
  if (input.integral != null) {
    if (input.integral != oldModel.integral) {
      sql += `integral = ${ args.push(input.integral) },`;
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
 * 根据 ids 删除会员卡充值记录
 * @param {CardRechargeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CardRechargeId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_card_recharge";
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
    const sql = `update wshop_card_recharge set is_deleted=1,delete_time=${ args.push(reqDate()) } where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

/**
 * 根据 ids 还原会员卡充值记录
 * @param {CardRechargeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CardRechargeId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_card_recharge";
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
    const id: CardRechargeId = ids[i];
    const args = new QueryArgs();
    const sql = `update wshop_card_recharge set is_deleted = 0 where id = ${ args.push(id) } limit 1`;
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
      } as CardRechargeInput;
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("会员卡充值记录"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 * @param {CardRechargeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CardRechargeId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wshop_card_recharge";
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
      const sql = `select * from wshop_card_recharge where id = ${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wshop_card_recharge where id = ${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
