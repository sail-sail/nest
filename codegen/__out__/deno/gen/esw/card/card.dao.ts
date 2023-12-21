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
  CardGrade,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  CardInput,
  CardModel,
  CardSearch,
  CardFieldComment,
  CardId,
} from "./card.model.ts";

import * as usrDao from "/gen/base/usr/usr.dao.ts";

const route_path = "/esw/card";

async function getWhereQuery(
  args: QueryArgs,
  search?: CardSearch,
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
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
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
  if (search?.grade && !Array.isArray(search?.grade)) {
    search.grade = [ search.grade ];
  }
  if (search?.grade && search?.grade?.length > 0) {
    whereQuery += ` and t.grade in ${ args.push(search.grade) }`;
  }
  if (search?.name !== undefined) {
    whereQuery += ` and t.name = ${ args.push(search.name) }`;
  }
  if (search?.name === null) {
    whereQuery += ` and t.name is null`;
  }
  if (isNotEmpty(search?.name_like)) {
    whereQuery += ` and t.name like ${ args.push("%" + sqlLike(search?.name_like) + "%") }`;
  }
  if (search?.mobile !== undefined) {
    whereQuery += ` and t.mobile = ${ args.push(search.mobile) }`;
  }
  if (search?.mobile === null) {
    whereQuery += ` and t.mobile is null`;
  }
  if (isNotEmpty(search?.mobile_like)) {
    whereQuery += ` and t.mobile like ${ args.push("%" + sqlLike(search?.mobile_like) + "%") }`;
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
  if (search?.integral && search?.integral?.length > 0) {
    if (search.integral[0] != null) {
      whereQuery += ` and t.integral >= ${ args.push(search.integral[0]) }`;
    }
    if (search.integral[1] != null) {
      whereQuery += ` and t.integral <= ${ args.push(search.integral[1]) }`;
    }
  }
  if (search?.growth_amt && search?.growth_amt?.length > 0) {
    if (search.growth_amt[0] != null) {
      whereQuery += ` and t.growth_amt >= ${ args.push(search.growth_amt[0]) }`;
    }
    if (search.growth_amt[1] != null) {
      whereQuery += ` and t.growth_amt <= ${ args.push(search.growth_amt[1]) }`;
    }
  }
  if (search?.is_default_card && !Array.isArray(search?.is_default_card)) {
    search.is_default_card = [ search.is_default_card ];
  }
  if (search?.is_default_card && search?.is_default_card?.length > 0) {
    whereQuery += ` and t.is_default_card in ${ args.push(search.is_default_card) }`;
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
    esw_card t
    left join base_usr usr_id_lbl
      on usr_id_lbl.id = t.usr_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_org org_id_lbl
      on org_id_lbl.id = t.org_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找会员卡总数
 * @param { CardSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CardSearch,
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
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
 * 根据搜索条件和分页查找会员卡列表
 * @param {CardSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: CardSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<CardModel[]> {
  const table = "esw_card";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,usr_id_lbl.lbl usr_id_lbl
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,org_id_lbl.lbl org_id_lbl
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
  
  const result = await query<CardModel>(
    sql,
    args,
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
    
    // 会员等级
    let grade_lbl = model.grade as string;
    if (!isEmpty(model.grade)) {
      const dictItem = gradeDict.find((dictItem) => dictItem.val === model.grade);
      if (dictItem) {
        grade_lbl = dictItem.lbl;
      }
    }
    model.grade_lbl = grade_lbl;
    
    // 充值余额
    if (model.balance != null) {
      model.balance = new Decimal(model.balance);
    }
    
    // 赠送余额
    if (model.give_balance != null) {
      model.give_balance = new Decimal(model.give_balance);
    }
    
    // 累计消费
    if (model.growth_amt != null) {
      model.growth_amt = new Decimal(model.growth_amt);
    }
    
    // 默认
    let is_default_card_lbl = model.is_default_card?.toString() || "";
    if (model.is_default_card !== undefined && model.is_default_card !== null) {
      const dictItem = is_default_cardDict.find((dictItem) => dictItem.val === model.is_default_card.toString());
      if (dictItem) {
        is_default_card_lbl = dictItem.lbl;
      }
    }
    model.is_default_card_lbl = is_default_card_lbl;
    
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
  input: CardInput,
) {
  
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
  if (isNotEmpty(input.usr_id_lbl) && input.usr_id === undefined) {
    input.usr_id_lbl = String(input.usr_id_lbl).trim();
    const usrModel = await usrDao.findOne({ lbl: input.usr_id_lbl });
    if (usrModel) {
      input.usr_id = usrModel.id;
    }
  }
  
  // 会员等级
  if (isNotEmpty(input.grade_lbl) && input.grade === undefined) {
    const val = gradeDict.find((itemTmp) => itemTmp.lbl === input.grade_lbl)?.val;
    if (val !== undefined) {
      input.grade = val as CardGrade;
    }
  }
  
  // 默认
  if (isNotEmpty(input.is_default_card_lbl) && input.is_default_card === undefined) {
    const val = is_default_cardDict.find((itemTmp) => itemTmp.lbl === input.is_default_card_lbl)?.val;
    if (val !== undefined) {
      input.is_default_card = Number(val);
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
 * 获取会员卡字段注释
 */
export async function getFieldComments(): Promise<CardFieldComment> {
  const n = initN(route_path);
  const fieldComments: CardFieldComment = {
    id: await n("ID"),
    lbl: await n("卡号"),
    usr_id: await n("绑定用户"),
    usr_id_lbl: await n("绑定用户"),
    grade: await n("会员等级"),
    grade_lbl: await n("会员等级"),
    name: await n("姓名"),
    mobile: await n("电话"),
    balance: await n("充值余额"),
    give_balance: await n("赠送余额"),
    integral: await n("积分"),
    growth_amt: await n("累计消费"),
    is_default_card: await n("默认"),
    is_default_card_lbl: await n("默认"),
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
 * 通过唯一约束获得会员卡列表
 * @param {CardInput} search0
 */
export async function findByUnique(
  search0: CardInput,
  options?: {
  },
): Promise<CardModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
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
    const modelTmps = await findAll({
      lbl,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {CardModel} oldModel
 * @param {CardInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: CardModel,
  input: CardInput,
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
 * 通过唯一约束检查会员卡是否已经存在
 * @param {CardInput} input
 * @param {CardModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<CardId | undefined>}
 */
export async function checkByUnique(
  input: CardInput,
  oldModel: CardModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<CardId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const id: CardId = await updateById(
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
 * 根据条件查找第一个会员卡
 * @param {CardSearch} search?
 */
export async function findOne(
  search?: CardSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<CardModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找会员卡
 * @param {CardId} id
 */
export async function findById(
  id?: CardId | null,
  options?: {
  },
): Promise<CardModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断会员卡是否存在
 * @param {CardSearch} search?
 */
export async function exist(
  search?: CardSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断会员卡是否存在
 * @param {CardId} id
 */
export async function existById(
  id?: CardId | null,
) {
  const table = "esw_card";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      esw_card t
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

/** 校验会员卡是否启用 */
export async function validateIsEnabled(
  model: CardModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("会员卡") } ${ await ns("已禁用") }`;
  }
}

/** 校验会员卡是否存在 */
export async function validateOption(
  model?: CardModel,
) {
  if (!model) {
    throw `${ await ns("会员卡") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 会员卡增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CardInput,
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
  
  // 会员等级
  await validators.chars_max_length(
    input.grade,
    10,
    fieldComments.grade,
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

/**
 * 创建会员卡
 * @param {CardInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<CardId>} 
 */
export async function create(
  input: CardInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardId> {
  const table = "esw_card";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
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
      return id;
    }
  }
  
  while (true) {
    input.id = shortUuidV4<CardId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into esw_card(
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
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.usr_id !== undefined) {
    sql += `,usr_id`;
  }
  if (input.grade !== undefined) {
    sql += `,grade`;
  }
  if (input.name !== undefined) {
    sql += `,name`;
  }
  if (input.mobile !== undefined) {
    sql += `,mobile`;
  }
  if (input.balance !== undefined) {
    sql += `,balance`;
  }
  if (input.give_balance !== undefined) {
    sql += `,give_balance`;
  }
  if (input.integral !== undefined) {
    sql += `,integral`;
  }
  if (input.growth_amt !== undefined) {
    sql += `,growth_amt`;
  }
  if (input.is_default_card !== undefined) {
    sql += `,is_default_card`;
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
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.usr_id !== undefined) {
    sql += `,${ args.push(input.usr_id) }`;
  }
  if (input.grade !== undefined) {
    sql += `,${ args.push(input.grade) }`;
  }
  if (input.name !== undefined) {
    sql += `,${ args.push(input.name) }`;
  }
  if (input.mobile !== undefined) {
    sql += `,${ args.push(input.mobile) }`;
  }
  if (input.balance !== undefined) {
    sql += `,${ args.push(input.balance) }`;
  }
  if (input.give_balance !== undefined) {
    sql += `,${ args.push(input.give_balance) }`;
  }
  if (input.integral !== undefined) {
    sql += `,${ args.push(input.integral) }`;
  }
  if (input.growth_amt !== undefined) {
    sql += `,${ args.push(input.growth_amt) }`;
  }
  if (input.is_default_card !== undefined) {
    sql += `,${ args.push(input.is_default_card) }`;
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
 * 会员卡根据id修改租户id
 * @param {CardId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: CardId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      esw_card
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
 * 会员卡根据id修改组织id
 * @export
 * @param {CardId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: CardId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      esw_card
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
 * 根据 id 修改会员卡
 * @param {CardId} id
 * @param {CardInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<CardId>}
 */
export async function updateById(
  id: CardId,
  input: CardInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<CardId> {
  const table = "esw_card";
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
    update esw_card set
  `;
  let updateFldNum = 0;
  if (input.lbl_seq !== undefined) {
    if (input.lbl_seq != oldModel.lbl_seq) {
      sql += `lbl_seq = ${ args.push(input.lbl_seq) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id !== undefined) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id = ${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.grade !== undefined) {
    if (input.grade != oldModel.grade) {
      sql += `grade = ${ args.push(input.grade) },`;
      updateFldNum++;
    }
  }
  if (input.name !== undefined) {
    if (input.name != oldModel.name) {
      sql += `name = ${ args.push(input.name) },`;
      updateFldNum++;
    }
  }
  if (input.mobile !== undefined) {
    if (input.mobile != oldModel.mobile) {
      sql += `mobile = ${ args.push(input.mobile) },`;
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
  if (input.integral !== undefined) {
    if (input.integral != oldModel.integral) {
      sql += `integral = ${ args.push(input.integral) },`;
      updateFldNum++;
    }
  }
  if (input.growth_amt !== undefined) {
    if (input.growth_amt != oldModel.growth_amt) {
      sql += `growth_amt = ${ args.push(input.growth_amt) },`;
      updateFldNum++;
    }
  }
  if (input.is_default_card !== undefined) {
    if (input.is_default_card != oldModel.is_default_card) {
      sql += `is_default_card = ${ args.push(input.is_default_card) },`;
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
 * 根据 ids 删除会员卡
 * @param {CardId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CardId[],
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: CardId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        esw_card
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
 * 根据 ID 查找会员卡是否已启用
 * 不存在则返回 undefined
 * @param {CardId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: CardId,
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
 * 根据 ids 启用或者禁用会员卡
 * @param {CardId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: CardId[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
  const method = "enableByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      esw_card
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
 * 根据 ID 查找会员卡是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {CardId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: CardId,
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
 * 根据 ids 锁定或者解锁会员卡
 * @param {CardId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: CardId[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      esw_card
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
 * 根据 ids 还原会员卡
 * @param {CardId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CardId[],
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: CardId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        esw_card
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
 * 根据 ids 彻底删除会员卡
 * @param {CardId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CardId[],
  options?: {
  },
): Promise<number> {
  const table = "esw_card";
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
          esw_card
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        esw_card
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
