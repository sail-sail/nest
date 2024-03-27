// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
} from "/lib/util/dao_util.ts";

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
  hash,
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
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
  DictbizType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  DictbizInput,
  DictbizModel,
  DictbizSearch,
  DictbizFieldComment,
  DictbizId,
} from "./dictbiz.model.ts";

import {
  findAll as findAllDictbizDetail,
  create as createDictbizDetail,
  deleteByIds as deleteByIdsDictbizDetail,
  revertByIds as revertByIdsDictbizDetail,
  updateById as updateByIdDictbizDetail,
  forceDeleteByIds as forceDeleteByIdsDictbizDetail,
} from "/gen/base/dictbiz_detail/dictbiz_detail.dao.ts";

const route_path = "/base/dictbiz";

async function getWhereQuery(
  args: QueryArgs,
  search?: DictbizSearch,
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
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.code != null) {
    whereQuery += ` and t.code = ${ args.push(search.code) }`;
  }
  if (isNotEmpty(search?.code_like)) {
    whereQuery += ` and t.code like ${ args.push("%" + sqlLike(search?.code_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.type != null && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type != null) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.is_locked != null && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked != null) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled != null && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled != null) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.order_by != null) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by >= ${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by <= ${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
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
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
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
      whereQuery += ` and t.update_time >= ${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time <= ${ args.push(search.update_time[1]) }`;
    }
  }
  return whereQuery;
}

async function getFromQuery(
  args: QueryArgs,
  search?: DictbizSearch,
  options?: {
  },
) {
  let fromQuery = `base_dictbiz t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找业务字典总数
 * @param { DictbizSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictbizSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
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
  let sql = `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

/**
 * 根据搜索条件和分页查找业务字典列表
 * @param {DictbizSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<DictbizModel[]> {
  const table = "base_dictbiz";
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
  // 数据类型
  if (search && search.type != null && search.type.length === 0) {
    return [ ];
  }
  // 锁定
  if (search && search.is_locked != null && search.is_locked.length === 0) {
    return [ ];
  }
  // 启用
  if (search && search.is_enabled != null && search.is_enabled.length === 0) {
    return [ ];
  }
  // 创建人
  if (search && search.create_usr_id != null && search.create_usr_id.length === 0) {
    return [ ];
  }
  // 更新人
  if (search && search.update_usr_id != null && search.update_usr_id.length === 0) {
    return [ ];
  }
  
  const args = new QueryArgs();
  let sql = `
    select f.* from (
    select t.*
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
        prop: "order_by",
        order: SortOrderEnum.Asc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "order_by",
    order: SortOrderEnum.Asc,
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
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<DictbizModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug,
    },
  );
  
  const [
    typeDict, // 数据类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "dict_type",
    "is_locked",
    "is_enabled",
  ]);
  
  // 业务字典明细
  const dictbiz_detail_models = await findAllDictbizDetail({
    dictbiz_id: result.map((item) => item.id),
    is_deleted: search?.is_deleted,
  });
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 数据类型
    let type_lbl = model.type as string;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl;
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked != null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
    if (model.is_enabled != null) {
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
    
    // 业务字典明细
    model.dictbiz_detail = dictbiz_detail_models
      .filter((item) => item.dictbiz_id === model.id);
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: DictbizInput,
) {
  
  const [
    typeDict, // 数据类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "dict_type",
    "is_locked",
    "is_enabled",
  ]);
  
  // 数据类型
  if (isNotEmpty(input.type_lbl) && input.type == null) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === input.type_lbl)?.val;
    if (val != null) {
      input.type = val as DictbizType;
    }
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked == null) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val != null) {
      input.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled == null) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val != null) {
      input.is_enabled = Number(val);
    }
  }
}

/**
 * 获取业务字典字段注释
 */
export async function getFieldComments(): Promise<DictbizFieldComment> {
  const n = initN(route_path);
  const fieldComments: DictbizFieldComment = {
    id: await n("ID"),
    code: await n("编码"),
    lbl: await n("名称"),
    type: await n("数据类型"),
    type_lbl: await n("数据类型"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
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
 * 通过唯一约束获得业务字典列表
 * @param {DictbizInput} search0
 */
export async function findByUnique(
  search0: DictbizInput,
  options?: {
    debug?: boolean;
  },
): Promise<DictbizModel[]> {
  
  const table = "base_dictbiz";
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
  const models: DictbizModel[] = [ ];
  {
    if (search0.code == null) {
      return [ ];
    }
    const code = search0.code;
    const modelTmps = await findAll({
      code,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      lbl,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {DictbizModel} oldModel
 * @param {DictbizInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: DictbizModel,
  input: DictbizInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.code === input.code
  ) {
    return true;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查业务字典是否已经存在
 * @param {DictbizInput} input
 * @param {DictbizModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<DictbizId | undefined>}
 */
export async function checkByUnique(
  input: DictbizInput,
  oldModel: DictbizModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<DictbizId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("业务字典")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: DictbizId = await updateById(
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
 * 根据条件查找第一个业务字典
 * @param {DictbizSearch} search?
 */
export async function findOne(
  search?: DictbizSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<DictbizModel | undefined> {
  const table = "base_dictbiz";
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
 * 根据 id 查找业务字典
 * @param {DictbizId} id
 */
export async function findById(
  id?: DictbizId | null,
  options?: {
    debug?: boolean;
  },
): Promise<DictbizModel | undefined> {
  const table = "base_dictbiz";
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
 * 根据搜索条件判断业务字典是否存在
 * @param {DictbizSearch} search?
 */
export async function exist(
  search?: DictbizSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "base_dictbiz";
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
 * 根据id判断业务字典是否存在
 * @param {DictbizId} id
 */
export async function existById(
  id?: DictbizId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "base_dictbiz";
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
  const sql = `
    select
      1 e
    from
      base_dictbiz t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  let result = !!model?.e;
  
  return result;
}

/** 校验业务字典是否启用 */
export async function validateIsEnabled(
  model: DictbizModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("业务字典") } ${ await ns("已禁用") }`;
  }
}

/** 校验业务字典是否存在 */
export async function validateOption(
  model?: DictbizModel,
) {
  if (!model) {
    throw `${ await ns("业务字典") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 业务字典增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: DictbizInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 编码
  await validators.chars_max_length(
    input.code,
    50,
    fieldComments.code,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    200,
    fieldComments.lbl,
  );
  
  // 数据类型
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
 * 创建业务字典
 * @param {DictbizInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<DictbizId>} 
 */
export async function create(
  input: DictbizInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<DictbizId> {
  const table = "base_dictbiz";
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
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: DictbizId | undefined = undefined;
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
    input.id = shortUuidV4<DictbizId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_dictbiz(
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
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,update_usr_id`;
    }
  }
  if (input.code != null) {
    sql += `,code`;
  }
  if (input.lbl != null) {
    sql += `,lbl`;
  }
  if (input.type != null) {
    sql += `,type`;
  }
  if (input.is_locked != null) {
    sql += `,is_locked`;
  }
  if (input.is_enabled != null) {
    sql += `,is_enabled`;
  }
  if (input.order_by != null) {
    sql += `,order_by`;
  }
  if (input.rem != null) {
    sql += `,rem`;
  }
  if (input.is_sys != null) {
    sql += `,is_sys`;
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
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.code != null) {
    sql += `,${ args.push(input.code) }`;
  }
  if (input.lbl != null) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.type != null) {
    sql += `,${ args.push(input.type) }`;
  }
  if (input.is_locked != null) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.is_enabled != null) {
    sql += `,${ args.push(input.is_enabled) }`;
  }
  if (input.order_by != null) {
    sql += `,${ args.push(input.order_by) }`;
  }
  if (input.rem != null) {
    sql += `,${ args.push(input.rem) }`;
  }
  if (input.is_sys != null) {
    sql += `,${ args.push(input.is_sys) }`;
  }
  sql += `)`;
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  // 业务字典明细
  const dictbiz_detail_input = input.dictbiz_detail;
  if (dictbiz_detail_input && dictbiz_detail_input.length > 0) {
    for (let i = 0; i < dictbiz_detail_input.length; i++) {
      const model = dictbiz_detail_input[i];
      model.dictbiz_id = input.id;
      await createDictbizDetail(model);
    }
  }
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  await delCacheCtx(`dao.sql.base_dictbiz`);
}

/**
 * 业务字典根据id修改租户id
 * @param {DictbizId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: DictbizId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
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
      base_dictbiz
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据 id 修改业务字典
 * @param {DictbizId} id
 * @param {DictbizInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<DictbizId>}
 */
export async function updateById(
  id: DictbizId,
  input: DictbizInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<DictbizId> {
  const table = "base_dictbiz";
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
        throw await ns("此 {0} 已经存在", await ns("业务字典"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("业务字典"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_dictbiz set
  `;
  let updateFldNum = 0;
  if (input.code != null) {
    if (input.code != oldModel.code) {
      sql += `code = ${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.type != null) {
    if (input.type != oldModel.type) {
      sql += `type = ${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked != null) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(input.is_locked) },`;
      updateFldNum++;
    }
  }
  if (input.is_enabled != null) {
    if (input.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled = ${ args.push(input.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (input.order_by != null) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by = ${ args.push(input.order_by) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem = ${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (input.is_sys != null) {
    if (input.is_sys != oldModel.is_sys) {
      sql += `is_sys = ${ args.push(input.is_sys) },`;
      updateFldNum++;
    }
  }
  
  // 业务字典明细
  const dictbiz_detail_input = input.dictbiz_detail;
  if (dictbiz_detail_input) {
    const dictbiz_detail_models = await findAllDictbizDetail({
      dictbiz_id: [ id ],
    });
    if (dictbiz_detail_models.length > 0 && dictbiz_detail_input.length > 0) {
      updateFldNum++;
    }
    for (let i = 0; i < dictbiz_detail_models.length; i++) {
      const model = dictbiz_detail_models[i];
      if (dictbiz_detail_input.some((item) => item.id === model.id)) {
        continue;
      }
      await deleteByIdsDictbizDetail([ model.id ]);
    }
    for (let i = 0; i < dictbiz_detail_input.length; i++) {
      const model = dictbiz_detail_input[i];
      if (!model.id) {
        model.dictbiz_id = id;
        await createDictbizDetail(model);
        continue;
      }
      if (dictbiz_detail_models.some((item) => item.id === model.id)) {
        await revertByIdsDictbizDetail([ model.id ]);
      }
      await updateByIdDictbizDetail(model.id, { ...model, id: undefined });
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
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await delCache();
    
    await execute(sql, args);
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除业务字典
 * @param {DictbizId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: DictbizId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
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
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_dictbiz
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
  
  // 业务字典明细
  const dictbiz_detail = await findAllDictbizDetail({
    dictbiz_id: ids,
  });
  await deleteByIdsDictbizDetail(dictbiz_detail.map((item) => item.id));
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找业务字典是否已启用
 * 不存在则返回 undefined
 * @param {DictbizId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: DictbizId,
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
 * 根据 ids 启用或者禁用业务字典
 * @param {DictbizId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: DictbizId[],
  is_enabled: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
  const method = "enableByIds";
  
  if (options?.debug !== false) {
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
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      base_dictbiz
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找业务字典是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {DictbizId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: DictbizId,
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
 * 根据 ids 锁定或者解锁业务字典
 * @param {DictbizId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: DictbizId[],
  is_locked: 0 | 1,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
  const method = "lockByIds";
  
  if (options?.debug !== false) {
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
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      base_dictbiz
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原业务字典
 * @param {DictbizId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: DictbizId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
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
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: DictbizId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_dictbiz
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
        throw await ns("此 {0} 已经存在", await ns("业务字典"));
      }
    }
  }
  
  // 业务字典明细
  const dictbiz_detail_models = await findAllDictbizDetail({
    dictbiz_id: ids,
    is_deleted: 1,
  });
  await revertByIdsDictbizDetail(dictbiz_detail_models.map((item) => item.id));
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除业务字典
 * @param {DictbizId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: DictbizId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
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
  
  if (ids.length > 0) {
    await delCache();
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
          base_dictbiz
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_dictbiz
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  // 业务字典明细
  const dictbiz_detail_models = await findAllDictbizDetail({
    dictbiz_id: ids,
    is_deleted: 1,
  });
  await forceDeleteByIdsDictbizDetail(dictbiz_detail_models.map((item) => item.id));
  
  await delCache();
  
  return num;
}
  
/**
 * 查找 业务字典 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "base_dictbiz";
  const method = "findLastOrderBy";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  let sql = `
    select
      t.order_by order_by
    from
      base_dictbiz t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);
  {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    whereQuery.push(`t.tenant_id = ${ args.push(tenant_id) }`);
  }
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += ` order by t.order_by desc limit 1`;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(sql, args);
  let result = model?.order_by ?? 0;
  
  return result;
}
