// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

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
  findOne as findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

const route_path = "/wx/wxo_usr";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxoUsrSearch,
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
  
  if (search?.org_id == null) {
    const authModel = await getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery += ` and t.org_id = ${ args.push(org_id) }`;
    }
  } else if (search?.org_id != null && search?.org_id !== "-") {
    whereQuery += ` and t.org_id = ${ args.push(search.org_id) }`;
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
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
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
  if (search?.openid != null) {
    whereQuery += ` and t.openid = ${ args.push(search.openid) }`;
  }
  if (isNotEmpty(search?.openid_like)) {
    whereQuery += ` and t.openid like ${ args.push("%" + sqlLike(search?.openid_like) + "%") }`;
  }
  if (search?.unionid != null) {
    whereQuery += ` and t.unionid = ${ args.push(search.unionid) }`;
  }
  if (isNotEmpty(search?.unionid_like)) {
    whereQuery += ` and t.unionid like ${ args.push("%" + sqlLike(search?.unionid_like) + "%") }`;
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
  search?: WxoUsrSearch,
  options?: {
  },
) {
  let fromQuery = `wx_wxo_usr t
    left join base_usr usr_id_lbl
      on usr_id_lbl.id = t.usr_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找公众号用户总数
 * @param { WxoUsrSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxoUsrSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_usr";
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
 * 根据搜索条件和分页查找公众号用户列表
 * @param {WxoUsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxoUsrModel[]> {
  const table = "wx_wxo_usr";
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
  // 用户
  if (search && search.usr_id != null) {
    const len = search.usr_id.length;
    if (len === 0) {
      return [ ];
    }
    if (len > FIND_ALL_IDS_LIMIT) {
      throw new Error(`search.usr_id.length > ${ FIND_ALL_IDS_LIMIT }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    if (len > FIND_ALL_IDS_LIMIT) {
      throw new Error(`search.create_usr_id.length > ${ FIND_ALL_IDS_LIMIT }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    if (len > FIND_ALL_IDS_LIMIT) {
      throw new Error(`search.update_usr_id.length > ${ FIND_ALL_IDS_LIMIT }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
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
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxoUsrModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
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
  input: WxoUsrInput,
) {
  
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
 * 获取公众号用户字段注释
 */
export async function getFieldComments(): Promise<WxoUsrFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxoUsrFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    usr_id: await n("用户"),
    usr_id_lbl: await n("用户"),
    openid: await n("公众号用户唯一标识"),
    unionid: await n("公众号用户统一标识"),
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
 * 通过唯一约束获得公众号用户列表
 * @param {WxoUsrInput} search0
 */
export async function findByUnique(
  search0: WxoUsrInput,
  options?: {
    debug?: boolean;
  },
): Promise<WxoUsrModel[]> {
  
  const table = "wx_wxo_usr";
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
  const models: WxoUsrModel[] = [ ];
  {
    if (search0.openid == null) {
      return [ ];
    }
    const openid = search0.openid;
    const modelTmps = await findAll({
      openid,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxoUsrModel} oldModel
 * @param {WxoUsrInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxoUsrModel,
  input: WxoUsrInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.openid === input.openid
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查公众号用户是否已经存在
 * @param {WxoUsrInput} input
 * @param {WxoUsrModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxoUsrId | undefined>}
 */
export async function checkByUnique(
  input: WxoUsrInput,
  oldModel: WxoUsrModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxoUsrId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("公众号用户")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxoUsrId = await updateById(
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
 * 根据条件查找第一个公众号用户
 * @param {WxoUsrSearch} search?
 */
export async function findOne(
  search?: WxoUsrSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxoUsrModel | undefined> {
  const table = "wx_wxo_usr";
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
 * 根据 id 查找公众号用户
 * @param {WxoUsrId} id
 */
export async function findById(
  id?: WxoUsrId | null,
  options?: {
    debug?: boolean;
  },
): Promise<WxoUsrModel | undefined> {
  const table = "wx_wxo_usr";
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
 * 根据搜索条件判断公众号用户是否存在
 * @param {WxoUsrSearch} search?
 */
export async function exist(
  search?: WxoUsrSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wx_wxo_usr";
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
 * 根据id判断公众号用户是否存在
 * @param {WxoUsrId} id
 */
export async function existById(
  id?: WxoUsrId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wx_wxo_usr";
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
  const sql = `select 1 e from wx_wxo_usr t where t.id = ${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  const result = !!model?.e;
  
  return result;
}

/** 校验公众号用户是否存在 */
export async function validateOption(
  model?: WxoUsrModel,
) {
  if (!model) {
    throw `${ await ns("公众号用户") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 公众号用户增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxoUsrInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    100,
    fieldComments.lbl,
  );
  
  // 用户
  await validators.chars_max_length(
    input.usr_id,
    22,
    fieldComments.usr_id,
  );
  
  // 公众号用户唯一标识
  await validators.chars_max_length(
    input.openid,
    100,
    fieldComments.openid,
  );
  
  // 公众号用户统一标识
  await validators.chars_max_length(
    input.unionid,
    100,
    fieldComments.unionid,
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
 * 创建公众号用户
 * @param {WxoUsrInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxoUsrId>} 
 */
export async function create(
  input: WxoUsrInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxoUsrId> {
  const table = "wx_wxo_usr";
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
 * 批量创建公众号用户
 * @param {WxoUsrInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxoUsrId[]>} 
 */
export async function creates(
  inputs: WxoUsrInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxoUsrId[]> {
  const table = "wx_wxo_usr";
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
  inputs: WxoUsrInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxoUsrId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wx_wxo_usr";
  
  const ids2: WxoUsrId[] = [ ];
  const inputs2: WxoUsrInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: WxoUsrId | undefined = undefined;
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
    
    const id = shortUuidV4<WxoUsrId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wx_wxo_usr(id,create_time,tenant_id,org_id,create_usr_id,lbl,usr_id,openid,unionid,rem)values`;
  
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
      if (input.openid != null) {
        sql += `,${ args.push(input.openid) }`;
      } else {
        sql += ",default";
      }
      if (input.unionid != null) {
        sql += `,${ args.push(input.unionid) }`;
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
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
  }
  
  await delCache();
  
  return ids2;
}

/**
 * 删除缓存
 */
export async function delCache() {
  await delCacheCtx(`dao.sql.wx_wxo_usr`);
}

/**
 * 公众号用户根据id修改租户id
 * @param {WxoUsrId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxoUsrId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_usr";
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
      wx_wxo_usr
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
 * 公众号用户根据id修改组织id
 * @export
 * @param {WxoUsrId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: WxoUsrId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "wx_wxo_usr";
  const method = "updateOrgById";
  
  const orgExist = await existByIdOrg(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_wxo_usr
    set
      update_time = ${ args.push(reqDate()) },
      org_id = ${ args.push(org_id) }
    where
      id = ${ args.push(id) }
  `;
  
  await delCache();
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据 id 修改公众号用户
 * @param {WxoUsrId} id
 * @param {WxoUsrInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxoUsrId>}
 */
export async function updateById(
  id: WxoUsrId,
  input: WxoUsrInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxoUsrId> {
  
  const table = "wx_wxo_usr";
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
        throw await ns("此 {0} 已经存在", await ns("公众号用户"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("公众号用户"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wx_wxo_usr set
  `;
  let updateFldNum = 0;
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id != null) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id = ${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.openid != null) {
    if (input.openid != oldModel.openid) {
      sql += `openid = ${ args.push(input.openid) },`;
      updateFldNum++;
    }
  }
  if (input.unionid != null) {
    if (input.unionid != oldModel.unionid) {
      sql += `unionid = ${ args.push(input.unionid) },`;
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
    
    await delCache();
    
    await execute(sql, args);
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除公众号用户
 * @param {WxoUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxoUsrId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_usr";
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
    const sql = `update wx_wxo_usr set is_deleted=1,delete_time=${ args.push(reqDate()) } where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原公众号用户
 * @param {WxoUsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxoUsrId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_usr";
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
    const id: WxoUsrId = ids[i];
    const args = new QueryArgs();
    const sql = `update wx_wxo_usr set is_deleted = 0 where id = ${ args.push(id) } limit 1`;
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
        throw await ns("此 {0} 已经存在", await ns("公众号用户"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除公众号用户
 * @param {WxoUsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxoUsrId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wx_wxo_usr";
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
      const sql = `select * from wx_wxo_usr where id = ${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wx_wxo_usr where id = ${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
