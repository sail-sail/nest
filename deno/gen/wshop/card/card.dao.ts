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
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
  CardGrade,
} from "/gen/types.ts";

import {
  findOne as findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findOne as findOneOrg,
} from "/gen/base/org/org.dao.ts";

import {
  route_path,
} from "./card.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<CardSearch>,
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
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
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
  if (search?.grade != null) {
    whereQuery += ` and t.grade in (${ args.push(search.grade) })`;
  }
  if (search?.name != null) {
    whereQuery += ` and t.name=${ args.push(search.name) }`;
  }
  if (isNotEmpty(search?.name_like)) {
    whereQuery += ` and t.name like ${ args.push("%" + sqlLike(search?.name_like) + "%") }`;
  }
  if (search?.mobile != null) {
    whereQuery += ` and t.mobile=${ args.push(search.mobile) }`;
  }
  if (isNotEmpty(search?.mobile_like)) {
    whereQuery += ` and t.mobile like ${ args.push("%" + sqlLike(search?.mobile_like) + "%") }`;
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
  if (search?.growth_amt != null) {
    if (search.growth_amt[0] != null) {
      whereQuery += ` and t.growth_amt>=${ args.push(search.growth_amt[0]) }`;
    }
    if (search.growth_amt[1] != null) {
      whereQuery += ` and t.growth_amt<=${ args.push(search.growth_amt[1]) }`;
    }
  }
  if (search?.is_default_card != null) {
    whereQuery += ` and t.is_default_card in (${ args.push(search.is_default_card) })`;
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
  search?: Readonly<CardSearch>,
  options?: {
  },
) {
  let fromQuery = `wshop_card t
  left join base_usr usr_id_lbl on usr_id_lbl.id=t.usr_id
  left join base_usr create_usr_id_lbl on create_usr_id_lbl.id=t.create_usr_id
  left join base_usr update_usr_id_lbl on update_usr_id_lbl.id=t.update_usr_id
  left join base_org org_id_lbl on org_id_lbl.id=t.org_id`;
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找会员卡总数 */
export async function findCount(
  search?: Readonly<CardSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "findCount";
  
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

// MARK: findAll
/** 根据搜索条件和分页查找会员卡列表 */
export async function findAll(
  search?: Readonly<CardSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<CardModel[]> {
  
  const table = "wshop_card";
  const method = "findAll";
  
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
  // 绑定用户
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
  // 会员等级
  if (search && search.grade != null) {
    const len = search.grade.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.grade.length > ${ ids_limit }`);
    }
  }
  // 默认
  if (search && search.is_default_card != null) {
    const len = search.is_default_card.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_default_card.length > ${ ids_limit }`);
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
  
  const result = await query<CardModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  const [
    is_default_cardDict, // 默认
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_default",
    "is_locked",
    "is_enabled",
  ]);
  
  const [
    gradeDict, // 会员等级
  ] = await getDictbiz([
    "card_grade",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 绑定用户
    model.usr_id_lbl = model.usr_id_lbl || "";
    
    // 会员等级
    let grade_lbl = model.grade as string;
    if (!isEmpty(model.grade)) {
      const dictItem = gradeDict.find((dictItem) => dictItem.val === model.grade);
      if (dictItem) {
        grade_lbl = dictItem.lbl;
      }
    }
    model.grade_lbl = grade_lbl || "";
    
    // 充值余额
    model.balance = new Decimal(model.balance ?? 0);
    
    // 赠送余额
    model.give_balance = new Decimal(model.give_balance ?? 0);
    
    // 累计消费
    model.growth_amt = new Decimal(model.growth_amt ?? 0);
    
    // 默认
    let is_default_card_lbl = model.is_default_card?.toString() || "";
    if (model.is_default_card != null) {
      const dictItem = is_default_cardDict.find((dictItem) => dictItem.val === String(model.is_default_card));
      if (dictItem) {
        is_default_card_lbl = dictItem.lbl;
      }
    }
    model.is_default_card_lbl = is_default_card_lbl || "";
    
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

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CardInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    is_default_cardDict, // 默认
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_default",
    "is_locked",
    "is_enabled",
  ]);
  
  const [
    gradeDict, // 会员等级
  ] = await getDictbiz([
    "card_grade",
  ]);
  
  // 绑定用户
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
  
  // 会员等级
  if (isNotEmpty(input.grade_lbl) && input.grade == null) {
    const val = gradeDict.find((itemTmp) => itemTmp.lbl === input.grade_lbl)?.val;
    if (val != null) {
      input.grade = val as CardGrade;
    }
  } else if (isEmpty(input.grade_lbl) && input.grade != null) {
    const lbl = gradeDict.find((itemTmp) => itemTmp.val === input.grade)?.lbl || "";
    input.grade_lbl = lbl;
  }
  
  // 默认
  if (isNotEmpty(input.is_default_card_lbl) && input.is_default_card == null) {
    const val = is_default_cardDict.find((itemTmp) => itemTmp.lbl === input.is_default_card_lbl)?.val;
    if (val != null) {
      input.is_default_card = Number(val);
    }
  } else if (isEmpty(input.is_default_card_lbl) && input.is_default_card != null) {
    const lbl = is_default_cardDict.find((itemTmp) => itemTmp.val === String(input.is_default_card))?.lbl || "";
    input.is_default_card_lbl = lbl;
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

// MARK: getFieldComments
/** 获取会员卡字段注释 */
export async function getFieldComments(): Promise<CardFieldComment> {
  const fieldComments: CardFieldComment = {
    id: "ID",
    lbl: "卡号",
    usr_id: "绑定用户",
    usr_id_lbl: "绑定用户",
    grade: "会员等级",
    grade_lbl: "会员等级",
    name: "姓名",
    mobile: "电话",
    balance: "充值余额",
    give_balance: "赠送余额",
    integral: "积分",
    growth_amt: "累计消费",
    is_default_card: "默认",
    is_default_card_lbl: "默认",
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

// MARK: findByUnique
/** 通过唯一约束获得会员卡列表 */
export async function findByUnique(
  search0: Readonly<CardInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<CardModel[]> {
  
  const table = "wshop_card";
  const method = "findByUnique";
  
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
    const model = await findOne(
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
  const models: CardModel[] = [ ];
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll(
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
export function equalsByUnique(
  oldModel: Readonly<CardModel>,
  input: Readonly<CardInput>,
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

// MARK: checkByUnique
/** 通过唯一约束检查 会员卡 是否已经存在 */
export async function checkByUnique(
  input: Readonly<CardInput>,
  oldModel: Readonly<CardModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<CardId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 会员卡 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: CardId = await updateById(
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

// MARK: findOne
/** 根据条件查找第一会员卡 */
export async function findOne(
  search?: Readonly<CardSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<CardModel | undefined> {
  
  const table = "wshop_card";
  const method = "findOne";
  
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
  const models = await findAll(
    search,
    page,
    sort,
    options,
  );
  const model = models[0];
  return model;
}

// MARK: findById
/** 根据 id 查找会员卡 */
export async function findById(
  id?: CardId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<CardModel | undefined> {
  
  const table = "wshop_card";
  const method = "findById";
  
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
  
  const model = await findOne(
    {
      id,
    },
    undefined,
    options,
  );
  
  return model;
}

// MARK: findByIds
/** 根据 ids 查找会员卡 */
export async function findByIds(
  ids: CardId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<CardModel[]> {
  
  const table = "wshop_card";
  const method = "findByIds";
  
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

// MARK: exist
/** 根据搜索条件判断会员卡是否存在 */
export async function exist(
  search?: Readonly<CardSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wshop_card";
  const method = "exist";
  
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
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existById
/** 根据id判断会员卡是否存在 */
export async function existById(
  id?: Readonly<CardId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wshop_card";
  const method = "existById";
  
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
  const sql = `select 1 e from wshop_card t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateIsEnabled
/** 校验会员卡是否启用 */
export async function validateIsEnabled(
  model: Readonly<CardModel>,
) {
  if (model.is_enabled == 0) {
    throw "会员卡 已禁用";
  }
}

// MARK: validateOption
/** 校验会员卡是否存在 */
export async function validateOption(
  model?: CardModel,
) {
  if (!model) {
    const err_msg = "会员卡 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 会员卡增加和修改时校验输入 */
export async function validate(
  input: Readonly<CardInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 卡号
  await validators.chars_max_length(
    input.lbl,
    22,
    fieldComments.lbl,
  );
  
  // 绑定用户
  await validators.chars_max_length(
    input.usr_id,
    22,
    fieldComments.usr_id,
  );
  
  // 姓名
  await validators.chars_max_length(
    input.name,
    10,
    fieldComments.name,
  );
  
  // 电话
  await validators.chars_max_length(
    input.mobile,
    22,
    fieldComments.mobile,
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

// MARK: createReturn
/** 创建 会员卡 并返回 */
export async function createReturn(
  input: Readonly<CardInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CardModel> {
  
  const table = "wshop_card";
  const method = "createReturn";
  
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
  
  const model = await validateOption(
    await findOne(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: create
/** 创建 会员卡 */
export async function create(
  input: Readonly<CardInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CardId> {
  
  const table = "wshop_card";
  const method = "create";
  
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

// MARK: createsReturn
/** 批量创建 会员卡 并返回 */
export async function createsReturn(
  inputs: CardInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CardModel[]> {
  
  const table = "wshop_card";
  const method = "createsReturn";
  
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
  
  const models = await findByIds(ids, options);
  
  return models;
}

// MARK: creates
/** 批量创建 会员卡 */
export async function creates(
  inputs: CardInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CardId[]> {
  
  const table = "wshop_card";
  const method = "creates";
  
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
  inputs: CardInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<CardId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wshop_card";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: CardId[] = [ ];
  const inputs2: CardInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: CardId | undefined = undefined;
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
    
    const id = shortUuidV4<CardId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into wshop_card(id,create_time,update_time,tenant_id,create_usr_id,update_usr_id,lbl_seq,lbl,usr_id,grade,name,mobile,balance,give_balance,integral,growth_amt,is_default_card,is_locked,is_enabled,rem,org_id)values";
  
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
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.usr_id != null) {
        sql += `,${ args.push(input.usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.grade != null) {
        sql += `,${ args.push(input.grade) }`;
      } else {
        sql += ",default";
      }
      if (input.name != null) {
        sql += `,${ args.push(input.name) }`;
      } else {
        sql += ",default";
      }
      if (input.mobile != null) {
        sql += `,${ args.push(input.mobile) }`;
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
      if (input.growth_amt != null) {
        sql += `,${ args.push(input.growth_amt) }`;
      } else {
        sql += ",default";
      }
      if (input.is_default_card != null) {
        sql += `,${ args.push(input.is_default_card) }`;
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

// MARK: updateTenantById
/** 会员卡 根据 id 修改 租户id */
export async function updateTenantById(
  id: CardId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "updateTenantById";
  
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
  const sql = `update wshop_card set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateById
/** 根据 id 修改 会员卡 */
export async function updateById(
  id: CardId,
  input: CardInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<CardId> {
  
  const table = "wshop_card";
  const method = "updateById";
  
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
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 会员卡 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 会员卡 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wshop_card set `;
  let updateFldNum = 0;
  if (input.lbl_seq != null) {
    if (input.lbl_seq != oldModel.lbl_seq) {
      sql += `lbl_seq=${ args.push(input.lbl_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id != null) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id=${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.grade != null) {
    if (input.grade != oldModel.grade) {
      sql += `grade=${ args.push(input.grade) },`;
      updateFldNum++;
    }
  }
  if (input.name != null) {
    if (input.name != oldModel.name) {
      sql += `name=${ args.push(input.name) },`;
      updateFldNum++;
    }
  }
  if (input.mobile != null) {
    if (input.mobile != oldModel.mobile) {
      sql += `mobile=${ args.push(input.mobile) },`;
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
  if (input.integral != null) {
    if (input.integral != oldModel.integral) {
      sql += `integral=${ args.push(input.integral) },`;
      updateFldNum++;
    }
  }
  if (input.growth_amt != null) {
    if (input.growth_amt != oldModel.growth_amt) {
      sql += `growth_amt=${ args.push(input.growth_amt) },`;
      updateFldNum++;
    }
  }
  if (input.is_default_card != null) {
    if (input.is_default_card != oldModel.is_default_card) {
      sql += `is_default_card=${ args.push(input.is_default_card) },`;
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

// MARK: deleteByIds
/** 根据 ids 删除 会员卡 */
export async function deleteByIds(
  ids: CardId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "deleteByIds";
  
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
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wshop_card set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
  }
  
  return affectedRows;
}

// MARK: getIsEnabledById
/** 根据 id 查找 会员卡 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledById(
  id: CardId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIds
/** 根据 ids 启用或者禁用 会员卡 */
export async function enableByIds(
  ids: CardId[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "enableByIds";
  
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
  const sql = `update wshop_card set is_enabled=${ args.push(is_enabled) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

// MARK: getIsLockedById
/** 根据 id 查找 会员卡 是否已锁定, 不存在则返回 undefined, 已锁定的不能修改和删除 */
export async function getIsLockedById(
  id: CardId,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  
  return is_locked;
}

// MARK: lockByIds
/** 根据 ids 锁定或者解锁 会员卡 */
export async function lockByIds(
  ids: CardId[],
  is_locked: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "lockByIds";
  
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
  let sql = `update wshop_card set is_locked=${ args.push(is_locked) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  return num;
}

// MARK: revertByIds
/** 根据 ids 还原 会员卡 */
export async function revertByIds(
  ids: CardId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "revertByIds";
  
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
    let old_model = await findOne(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findById(
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
      } as CardInput;
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 会员卡 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wshop_card set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 会员卡 */
export async function forceDeleteByIds(
  ids: CardId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wshop_card";
  const method = "forceDeleteByIds";
  
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
    const oldModel = await findOne(
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
    const sql = `delete from wshop_card where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
