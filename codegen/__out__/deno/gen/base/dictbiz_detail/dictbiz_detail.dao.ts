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
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  DictbizId,
} from "/gen/base/dictbiz/dictbiz.model.ts";

import type {
  DictbizDetailInput,
  DictbizDetailModel,
  DictbizDetailSearch,
  DictbizDetailFieldComment,
  DictbizDetailId,
} from "./dictbiz_detail.model.ts";

import * as dictbizDao from "/gen/base/dictbiz/dictbiz.dao.ts";

const route_path = "/base/dictbiz_detail";

async function getWhereQuery(
  args: QueryArgs,
  search?: DictbizDetailSearch,
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
  if (search?.dictbiz_id != null && !Array.isArray(search?.dictbiz_id)) {
    search.dictbiz_id = [ search.dictbiz_id ];
  }
  if (search?.dictbiz_id != null) {
    whereQuery += ` and dictbiz_id_lbl.id in ${ args.push(search.dictbiz_id) }`;
  }
  if (search?.dictbiz_id_is_null) {
    whereQuery += ` and dictbiz_id_lbl.id is null`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.val != null) {
    whereQuery += ` and t.val = ${ args.push(search.val) }`;
  }
  if (isNotEmpty(search?.val_like)) {
    whereQuery += ` and t.val like ${ args.push("%" + sqlLike(search?.val_like) + "%") }`;
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
  search?: DictbizDetailSearch,
  options?: {
  },
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `base_dictbiz_detail t
    left join base_dictbiz dictbiz_id_lbl
      on dictbiz_id_lbl.id = t.dictbiz_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找业务字典明细总数
 * @param { DictbizDetailSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictbizDetailSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "findCount";
  
  let msg = `${ table }.${ method }: `;
  if (search && Object.keys(search).length > 0) {
    msg += `search:${ JSON.stringify(search) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
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
 * 根据搜索条件和分页查找业务字典明细列表
 * @param {DictbizDetailSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<DictbizDetailModel[]> {
  const table = "base_dictbiz_detail";
  const method = "findAll";
  
  let msg = `${ table }.${ method }: `;
  if (search && Object.keys(search).length > 0) {
    msg += `search:${ JSON.stringify(search) } `;
  }
  if (page && Object.keys(page).length > 0) {
    msg += `page:${ JSON.stringify(page) } `;
  }
  if (sort && Object.keys(sort).length > 0) {
    msg += `sort:${ JSON.stringify(sort) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (search?.id === "") {
    return [ ];
  }
  if (search?.ids?.length === 0) {
    return [ ];
  }
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,dictbiz_id_lbl.lbl dictbiz_id_lbl
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
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const result = await query<DictbizDetailModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
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
  input: DictbizDetailInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 业务字典
  if (isNotEmpty(input.dictbiz_id_lbl) && input.dictbiz_id === undefined) {
    input.dictbiz_id_lbl = String(input.dictbiz_id_lbl).trim();
    const dictbizModel = await dictbizDao.findOne({ lbl: input.dictbiz_id_lbl });
    if (dictbizModel) {
      input.dictbiz_id = dictbizModel.id;
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
 * 获取业务字典明细字段注释
 */
export async function getFieldComments(): Promise<DictbizDetailFieldComment> {
  const n = initN(route_path);
  const fieldComments: DictbizDetailFieldComment = {
    id: await n("ID"),
    dictbiz_id: await n("业务字典"),
    dictbiz_id_lbl: await n("业务字典"),
    lbl: await n("名称"),
    val: await n("值"),
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
 * 通过唯一约束获得业务字典明细列表
 * @param {DictbizDetailInput} search0
 */
export async function findByUnique(
  search0: DictbizDetailInput,
  options?: {
  },
): Promise<DictbizDetailModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: DictbizDetailModel[] = [ ];
  {
    if (search0.dictbiz_id == null) {
      return [ ];
    }
    let dictbiz_id: DictbizId[] = [ ];
    if (!Array.isArray(search0.dictbiz_id) && search0.dictbiz_id != null) {
      dictbiz_id = [ search0.dictbiz_id, search0.dictbiz_id ];
    } else {
      dictbiz_id = search0.dictbiz_id || [ ];
    }
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      dictbiz_id,
      lbl,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {DictbizDetailModel} oldModel
 * @param {DictbizDetailInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: DictbizDetailModel,
  input: DictbizDetailInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.dictbiz_id === input.dictbiz_id &&
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查业务字典明细是否已经存在
 * @param {DictbizDetailInput} input
 * @param {DictbizDetailModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<DictbizDetailId | undefined>}
 */
export async function checkByUnique(
  input: DictbizDetailInput,
  oldModel: DictbizDetailModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<DictbizDetailId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("业务字典明细")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: DictbizDetailId = await updateById(
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
 * 根据条件查找第一个业务字典明细
 * @param {DictbizDetailSearch} search?
 */
export async function findOne(
  search?: DictbizDetailSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<DictbizDetailModel | undefined> {
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
 * 根据 id 查找业务字典明细
 * @param {DictbizDetailId} id
 */
export async function findById(
  id?: DictbizDetailId | null,
  options?: {
  },
): Promise<DictbizDetailModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id }, undefined, options);
  return model;
}

/**
 * 根据搜索条件判断业务字典明细是否存在
 * @param {DictbizDetailSearch} search?
 */
export async function exist(
  search?: DictbizDetailSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断业务字典明细是否存在
 * @param {DictbizDetailId} id
 */
export async function existById(
  id?: DictbizDetailId | null,
  options?: {
  },
) {
  const table = "base_dictbiz_detail";
  const method = "existById";
  
  let msg = `${ table }.${ method }: `;
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      base_dictbiz_detail t
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

/** 校验业务字典明细是否启用 */
export async function validateIsEnabled(
  model: DictbizDetailModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("业务字典明细") } ${ await ns("已禁用") }`;
  }
}

/** 校验业务字典明细是否存在 */
export async function validateOption(
  model?: DictbizDetailModel,
) {
  if (!model) {
    throw `${ await ns("业务字典明细") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 业务字典明细增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: DictbizDetailInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 业务字典
  await validators.chars_max_length(
    input.dictbiz_id,
    22,
    fieldComments.dictbiz_id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    100,
    fieldComments.lbl,
  );
  
  // 值
  await validators.chars_max_length(
    input.val,
    100,
    fieldComments.val,
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
 * 创建业务字典明细
 * @param {DictbizDetailInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<DictbizDetailId>} 
 */
export async function create(
  input: DictbizDetailInput,
  options?: {
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<DictbizDetailId> {
  const table = "base_dictbiz_detail";
  const method = "create";
  
  let msg = `${ table }.${ method }: `;
  if (input) {
    msg += `input:${ JSON.stringify(input) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: DictbizDetailId | undefined = undefined;
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
    input.id = shortUuidV4<DictbizDetailId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_dictbiz_detail(
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
  if (input.dictbiz_id !== undefined) {
    sql += `,dictbiz_id`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.val !== undefined) {
    sql += `,val`;
  }
  if (input.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,is_enabled`;
  }
  if (input.order_by !== undefined) {
    sql += `,order_by`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
  }
  if (input.is_sys !== undefined) {
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
  if (input.dictbiz_id !== undefined) {
    sql += `,${ args.push(input.dictbiz_id) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.val !== undefined) {
    sql += `,${ args.push(input.val) }`;
  }
  if (input.is_locked !== undefined) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,${ args.push(input.is_enabled) }`;
  }
  if (input.order_by !== undefined) {
    sql += `,${ args.push(input.order_by) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  if (input.is_sys !== undefined) {
    sql += `,${ args.push(input.is_sys) }`;
  }
  sql += `)`;
  
  await delCache();
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "base_dictbiz_detail";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_dictbiz",
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 业务字典明细根据id修改租户id
 * @param {DictbizDetailId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: DictbizDetailId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "updateTenantById";
  
  let msg = `${ table }.${ method }: `;
  if (id) {
    msg += `id:${ id } `;
  }
  if (tenant_id) {
    msg += `tenant_id:${ tenant_id } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_dictbiz_detail
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
 * 根据 id 修改业务字典明细
 * @param {DictbizDetailId} id
 * @param {DictbizDetailInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<DictbizDetailId>}
 */
export async function updateById(
  id: DictbizDetailId,
  input: DictbizDetailInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<DictbizDetailId> {
  const table = "base_dictbiz_detail";
  const method = "updateById";
  
  let msg = `${ table }.${ method }: `;
  if (id) {
    msg += `id:${ id } `;
  }
  if (input) {
    msg += `input:${ JSON.stringify(input) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
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
        throw await ns("此 {0} 已经存在", await ns("业务字典明细"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("业务字典明细"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_dictbiz_detail set
  `;
  let updateFldNum = 0;
  if (input.dictbiz_id !== undefined) {
    if (input.dictbiz_id != oldModel.dictbiz_id) {
      sql += `dictbiz_id = ${ args.push(input.dictbiz_id) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.val !== undefined) {
    if (input.val != oldModel.val) {
      sql += `val = ${ args.push(input.val) },`;
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
  if (input.order_by !== undefined) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by = ${ args.push(input.order_by) },`;
      updateFldNum++;
    }
  }
  if (input.rem !== undefined) {
    if (input.rem != oldModel.rem) {
      sql += `rem = ${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (input.is_sys !== undefined) {
    if (input.is_sys != oldModel.is_sys) {
      sql += `is_sys = ${ args.push(input.is_sys) },`;
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
    
    await delCache();
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
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
 * 根据 ids 删除业务字典明细
 * @param {DictbizDetailId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: DictbizDetailId[],
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "deleteByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: DictbizDetailId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_dictbiz_detail
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
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找业务字典明细是否已启用
 * 不存在则返回 undefined
 * @param {DictbizDetailId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: DictbizDetailId,
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
 * 根据 ids 启用或者禁用业务字典明细
 * @param {DictbizDetailId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "enableByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (is_enabled !== undefined) {
    msg += `is_enabled:${ is_enabled } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      base_dictbiz_detail
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
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找业务字典明细是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {DictbizDetailId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: DictbizDetailId,
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
 * 根据 ids 锁定或者解锁业务字典明细
 * @param {DictbizDetailId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: DictbizDetailId[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "lockByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (is_locked !== undefined) {
    msg += `is_locked:${ is_locked } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      base_dictbiz_detail
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
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原业务字典明细
 * @param {DictbizDetailId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: DictbizDetailId[],
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "revertByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: DictbizDetailId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_dictbiz_detail
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
        throw await ns("此 {0} 已经存在", await ns("业务字典明细"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除业务字典明细
 * @param {DictbizDetailId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: DictbizDetailId[],
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "forceDeleteByIds";
  
  let msg = `${ table }.${ method }: `;
  if (ids) {
    msg += `ids:${ JSON.stringify(ids) } `;
  }
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
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
          base_dictbiz_detail
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_dictbiz_detail
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
  
/**
 * 查找 业务字典明细 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "base_dictbiz_detail";
  const method = "findLastOrderBy";
  
  let msg = `${ table }.${ method }: `;
  if (options && Object.keys(options).length > 0){
    msg += `options:${ JSON.stringify(options) } `;
  }
  log(msg);
  
  let sql = `
    select
      t.order_by order_by
    from
      base_dictbiz_detail t`;
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
