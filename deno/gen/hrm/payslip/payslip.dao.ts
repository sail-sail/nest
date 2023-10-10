// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
  escape,
} from "sqlstring";

import dayjs from "dayjs";

import {
  log,
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

import type {
  PartialNull,
} from "/typings/types.ts";

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

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";

import {
  encrypt,
  decrypt,
} from "/lib/util/dao_util.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  PayslipInput,
  PayslipModel,
  PayslipSearch,
  PayslipFieldComment,
} from "./payslip.model.ts";

const route_path = "/hrm/payslip";

async function getWhereQuery(
  args: QueryArgs,
  search?: PayslipSearch,
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
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.pay_month && search?.pay_month?.length > 0) {
    if (search.pay_month[0] != null) {
      whereQuery += ` and t.pay_month >= ${ args.push(search.pay_month[0]) }`;
    }
    if (search.pay_month[1] != null) {
      whereQuery += ` and t.pay_month <= ${ args.push(search.pay_month[1]) }`;
    }
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.job_num !== undefined) {
    whereQuery += ` and t.job_num = ${ args.push(search.job_num) }`;
  }
  if (search?.job_num === null) {
    whereQuery += ` and t.job_num is null`;
  }
  if (isNotEmpty(search?.job_num_like)) {
    whereQuery += ` and t.job_num like ${ args.push(sqlLike(search?.job_num_like) + "%") }`;
  }
  if (search?.company !== undefined) {
    whereQuery += ` and t.company = ${ args.push(search.company) }`;
  }
  if (search?.company === null) {
    whereQuery += ` and t.company is null`;
  }
  if (isNotEmpty(search?.company_like)) {
    whereQuery += ` and t.company like ${ args.push(sqlLike(search?.company_like) + "%") }`;
  }
  if (search?.is_send && !Array.isArray(search?.is_send)) {
    search.is_send = [ search.is_send ];
  }
  if (search?.is_send && search?.is_send?.length > 0) {
    whereQuery += ` and t.is_send in ${ args.push(search.is_send) }`;
  }
  if (search?.is_confirm && !Array.isArray(search?.is_confirm)) {
    search.is_confirm = [ search.is_confirm ];
  }
  if (search?.is_confirm && search?.is_confirm?.length > 0) {
    whereQuery += ` and t.is_confirm in ${ args.push(search.is_confirm) }`;
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (search?.rem === null) {
    whereQuery += ` and t.rem is null`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.rem_like) + "%") }`;
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
    hrm_payslip t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { PayslipSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PayslipSearch,
  options?: {
  },
): Promise<number> {
  const table = "hrm_payslip";
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
 * @param {PayslipSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: PayslipSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<PayslipModel[]> {
  const table = "hrm_payslip";
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
        prop: "pay_month",
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
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const result = await query<PayslipModel>(
    sql,
    args,
  );
  
  const [
    is_sendDict, // 已发送
    is_confirmDict, // 已确认
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "yes_no",
    "yes_no",
    "is_locked",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 发放月份
    if (model.pay_month) {
      const pay_month = dayjs(model.pay_month);
      if (isNaN(pay_month.toDate().getTime())) {
        model.pay_month_lbl = (model.pay_month || "").toString();
      } else {
        model.pay_month_lbl = pay_month.format("YYYY-MM");
      }
    } else {
      model.pay_month_lbl = "";
    }
    // 应发工资(元)
    model.gross_pay = await decrypt(model.gross_pay);
    // 代缴社保(元)
    model.social_security = await decrypt(model.social_security);
    // 代缴个税(元)
    model.individual_tax = await decrypt(model.individual_tax);
    // 个人自付(元)
    model.self_pay = await decrypt(model.self_pay);
    // 实发工资(元)
    model.net_pay = await decrypt(model.net_pay);
    
    // 已发送
    let is_send_lbl = model.is_send?.toString() || "";
    if (model.is_send !== undefined && model.is_send !== null) {
      const dictItem = is_sendDict.find((dictItem) => dictItem.val === model.is_send.toString());
      if (dictItem) {
        is_send_lbl = dictItem.lbl;
      }
    }
    model.is_send_lbl = is_send_lbl;
    
    // 已确认
    let is_confirm_lbl = model.is_confirm?.toString() || "";
    if (model.is_confirm !== undefined && model.is_confirm !== null) {
      const dictItem = is_confirmDict.find((dictItem) => dictItem.val === model.is_confirm.toString());
      if (dictItem) {
        is_confirm_lbl = dictItem.lbl;
      }
    }
    model.is_confirm_lbl = is_confirm_lbl;
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked !== undefined && model.is_locked !== null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
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

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<PayslipFieldComment> {
  const n = initN(route_path);
  const fieldComments: PayslipFieldComment = {
    id: await n("ID"),
    pay_month: await n("发放月份"),
    pay_month_lbl: await n("发放月份"),
    lbl: await n("姓名"),
    job_num: await n("工号"),
    company: await n("公司"),
    gross_pay: await n("应发工资(元)"),
    social_security: await n("代缴社保(元)"),
    individual_tax: await n("代缴个税(元)"),
    self_pay: await n("个人自付(元)"),
    net_pay: await n("实发工资(元)"),
    is_send: await n("已发送"),
    is_send_lbl: await n("已发送"),
    is_confirm: await n("已确认"),
    is_confirm_lbl: await n("已确认"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
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
 * 通过唯一约束获得数据列表
 * @param {PayslipSearch | PartialNull<PayslipModel>} search0
 */
export async function findByUnique(
  search0: PayslipSearch | PartialNull<PayslipModel>,
  options?: {
  },
): Promise<PayslipModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: PayslipModel[] = [ ];
  {
    if (search0.pay_month == null) {
      return [ ];
    }
    let pay_month: string[] = [ ];
    if (!Array.isArray(search0.pay_month)) {
      pay_month.push(search0.pay_month, search0.pay_month);
    } else {
      pay_month = search0.pay_month;
    }
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      pay_month,
      lbl,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {PayslipModel} oldModel
 * @param {PartialNull<PayslipModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: PayslipModel,
  model: PartialNull<PayslipModel>,
): boolean {
  if (!oldModel || !model) {
    return false;
  }
  if (
    dayjs(oldModel.pay_month).isSame(model.pay_month, "month") &&
    oldModel.lbl === model.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {PayslipInput} input
 * @param {PayslipModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  input: PayslipInput,
  oldModel: PayslipModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
    isEncrypt?: boolean;
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
          isEncrypt: false,
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
 * @param {PayslipSearch} search?
 */
export async function findOne(
  search?: PayslipSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<PayslipModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(search, page, sort);
  if (result && result.length > 0) {
    return result[0];
  }
  return;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
  options?: {
  },
): Promise<PayslipModel | undefined> {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {PayslipSearch} search?
 */
export async function exist(
  search?: PayslipSearch,
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
  const table = "hrm_payslip";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      hrm_payslip t
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
  model?: PayslipModel,
) {
  if (!model) {
    throw `${ await ns("工资条") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: PayslipInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 姓名
  await validators.chars_max_length(
    input.lbl,
    22,
    fieldComments.lbl,
  );
  
  // 工号
  await validators.chars_max_length(
    input.job_num,
    22,
    fieldComments.job_num,
  );
  
  // 公司
  await validators.chars_max_length(
    input.company,
    22,
    fieldComments.company,
  );
  
  // 应发工资(元)
  await validators.chars_max_length(
    input.gross_pay,
    66,
    fieldComments.gross_pay,
  );
  
  // 代缴社保(元)
  await validators.chars_max_length(
    input.social_security,
    66,
    fieldComments.social_security,
  );
  
  // 代缴个税(元)
  await validators.chars_max_length(
    input.individual_tax,
    66,
    fieldComments.individual_tax,
  );
  
  // 个人自付(元)
  await validators.chars_max_length(
    input.self_pay,
    66,
    fieldComments.self_pay,
  );
  
  // 实发工资(元)
  await validators.chars_max_length(
    input.net_pay,
    66,
    fieldComments.net_pay,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    88,
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
 * 创建数据
 * @param {PayslipInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  input: PayslipInput,
  options?: {
    uniqueType?: UniqueType;
    isEncrypt?: boolean;
  },
): Promise<string> {
  const table = "hrm_payslip";
  const method = "create";
  if (options?.isEncrypt !== false) {
    // 应发工资(元)
    if (input.gross_pay != null) {
      input.gross_pay = await encrypt(input.gross_pay);
    }
    // 代缴社保(元)
    if (input.social_security != null) {
      input.social_security = await encrypt(input.social_security);
    }
    // 代缴个税(元)
    if (input.individual_tax != null) {
      input.individual_tax = await encrypt(input.individual_tax);
    }
    // 个人自付(元)
    if (input.self_pay != null) {
      input.self_pay = await encrypt(input.self_pay);
    }
    // 实发工资(元)
    if (input.net_pay != null) {
      input.net_pay = await encrypt(input.net_pay);
    }
  }
  
  const [
    is_sendDict, // 已发送
    is_confirmDict, // 已确认
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "yes_no",
    "yes_no",
    "is_locked",
  ]);
  
  // 发放月份
  if (isNotEmpty(input.pay_month_lbl) && input.pay_month === undefined) {
    input.pay_month_lbl = String(input.pay_month_lbl).trim();
    input.pay_month = input.pay_month_lbl;
    if (input.pay_month) {
      input.pay_month = dayjs(input.pay_month).startOf("month").format("YYYY-MM-DD HH:mm:ss");
    }
  }
  
  // 已发送
  if (isNotEmpty(input.is_send_lbl) && input.is_send === undefined) {
    const val = is_sendDict.find((itemTmp) => itemTmp.lbl === input.is_send_lbl)?.val;
    if (val !== undefined) {
      input.is_send = Number(val);
    }
  }
  
  // 已确认
  if (isNotEmpty(input.is_confirm_lbl) && input.is_confirm === undefined) {
    const val = is_confirmDict.find((itemTmp) => itemTmp.lbl === input.is_confirm_lbl)?.val;
    if (val !== undefined) {
      input.is_confirm = Number(val);
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val !== undefined) {
      input.is_locked = Number(val);
    }
  }
  
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
  
  if (!input.id) {
    input.id = shortUuidV4();
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into hrm_payslip(
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
  if (input.pay_month !== undefined) {
    sql += `,pay_month`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.job_num !== undefined) {
    sql += `,job_num`;
  }
  if (input.company !== undefined) {
    sql += `,company`;
  }
  if (input.gross_pay !== undefined) {
    sql += `,gross_pay`;
  }
  if (input.social_security !== undefined) {
    sql += `,social_security`;
  }
  if (input.individual_tax !== undefined) {
    sql += `,individual_tax`;
  }
  if (input.self_pay !== undefined) {
    sql += `,self_pay`;
  }
  if (input.net_pay !== undefined) {
    sql += `,net_pay`;
  }
  if (input.is_send !== undefined) {
    sql += `,is_send`;
  }
  if (input.is_confirm !== undefined) {
    sql += `,is_confirm`;
  }
  if (input.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
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
  if (input.pay_month !== undefined) {
    sql += `,${ args.push(input.pay_month) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.job_num !== undefined) {
    sql += `,${ args.push(input.job_num) }`;
  }
  if (input.company !== undefined) {
    sql += `,${ args.push(input.company) }`;
  }
  if (input.gross_pay !== undefined) {
    sql += `,${ args.push(input.gross_pay) }`;
  }
  if (input.social_security !== undefined) {
    sql += `,${ args.push(input.social_security) }`;
  }
  if (input.individual_tax !== undefined) {
    sql += `,${ args.push(input.individual_tax) }`;
  }
  if (input.self_pay !== undefined) {
    sql += `,${ args.push(input.self_pay) }`;
  }
  if (input.net_pay !== undefined) {
    sql += `,${ args.push(input.net_pay) }`;
  }
  if (input.is_send !== undefined) {
    sql += `,${ args.push(input.is_send) }`;
  }
  if (input.is_confirm !== undefined) {
    sql += `,${ args.push(input.is_confirm) }`;
  }
  if (input.is_locked !== undefined) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  
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
  const table = "hrm_payslip";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      hrm_payslip
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
 * 根据id修改一行数据
 * @param {string} id
 * @param {PayslipInput} input
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
  input: PayslipInput,
  options?: {
    uniqueType?: "ignore" | "throw";
    isEncrypt?: boolean;
  },
): Promise<string> {
  const table = "hrm_payslip";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  if (options?.isEncrypt !== false) {
    // 应发工资(元)
    if (input.gross_pay != null) {
      input.gross_pay = await encrypt(input.gross_pay);
    }
    // 代缴社保(元)
    if (input.social_security != null) {
      input.social_security = await encrypt(input.social_security);
    }
    // 代缴个税(元)
    if (input.individual_tax != null) {
      input.individual_tax = await encrypt(input.individual_tax);
    }
    // 个人自付(元)
    if (input.self_pay != null) {
      input.self_pay = await encrypt(input.self_pay);
    }
    // 实发工资(元)
    if (input.net_pay != null) {
      input.net_pay = await encrypt(input.net_pay);
    }
  }
  
  const [
    is_sendDict, // 已发送
    is_confirmDict, // 已确认
    is_lockedDict, // 锁定
  ] = await dictSrcDao.getDict([
    "yes_no",
    "yes_no",
    "is_locked",
  ]);
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id);
  }
  
  // 已发送
  if (isNotEmpty(input.is_send_lbl) && input.is_send === undefined) {
    const val = is_sendDict.find((itemTmp) => itemTmp.lbl === input.is_send_lbl)?.val;
    if (val !== undefined) {
      input.is_send = Number(val);
    }
  }
  
  // 已确认
  if (isNotEmpty(input.is_confirm_lbl) && input.is_confirm === undefined) {
    const val = is_confirmDict.find((itemTmp) => itemTmp.lbl === input.is_confirm_lbl)?.val;
    if (val !== undefined) {
      input.is_confirm = Number(val);
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val !== undefined) {
      input.is_locked = Number(val);
    }
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
    update hrm_payslip set
  `;
  let updateFldNum = 0;
  if (input.pay_month !== undefined) {
    if (input.pay_month != oldModel.pay_month) {
      sql += `pay_month = ${ args.push(input.pay_month) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.job_num !== undefined) {
    if (input.job_num != oldModel.job_num) {
      sql += `job_num = ${ args.push(input.job_num) },`;
      updateFldNum++;
    }
  }
  if (input.company !== undefined) {
    if (input.company != oldModel.company) {
      sql += `company = ${ args.push(input.company) },`;
      updateFldNum++;
    }
  }
  if (input.gross_pay !== undefined) {
    if (input.gross_pay != oldModel.gross_pay) {
      sql += `gross_pay = ${ args.push(input.gross_pay) },`;
      updateFldNum++;
    }
  }
  if (input.social_security !== undefined) {
    if (input.social_security != oldModel.social_security) {
      sql += `social_security = ${ args.push(input.social_security) },`;
      updateFldNum++;
    }
  }
  if (input.individual_tax !== undefined) {
    if (input.individual_tax != oldModel.individual_tax) {
      sql += `individual_tax = ${ args.push(input.individual_tax) },`;
      updateFldNum++;
    }
  }
  if (input.self_pay !== undefined) {
    if (input.self_pay != oldModel.self_pay) {
      sql += `self_pay = ${ args.push(input.self_pay) },`;
      updateFldNum++;
    }
  }
  if (input.net_pay !== undefined) {
    if (input.net_pay != oldModel.net_pay) {
      sql += `net_pay = ${ args.push(input.net_pay) },`;
      updateFldNum++;
    }
  }
  if (input.is_send !== undefined) {
    if (input.is_send != oldModel.is_send) {
      sql += `is_send = ${ args.push(input.is_send) },`;
      updateFldNum++;
    }
  }
  if (input.is_confirm !== undefined) {
    if (input.is_confirm != oldModel.is_confirm) {
      sql += `is_confirm = ${ args.push(input.is_confirm) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked !== undefined) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(input.is_locked) },`;
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
    
    const result = await execute(sql, args);
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
  const table = "hrm_payslip";
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
        hrm_payslip
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
 * 根据 ID 查找是否已锁定
 * 已锁定的记录不能修改和删除
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: string,
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
 * 根据 ids 锁定或者解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "hrm_payslip";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      hrm_payslip
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
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
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "hrm_payslip";
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
        hrm_payslip
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
  const table = "hrm_payslip";
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
          hrm_payslip
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        hrm_payslip
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
