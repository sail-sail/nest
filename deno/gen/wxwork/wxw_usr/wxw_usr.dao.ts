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
  WxwUsrInput,
  WxwUsrModel,
  WxwUsrSearch,
  WxwUsrFieldComment,
  WxwUsrId,
} from "./wxw_usr.model.ts";

const route_path = "/wxwork/wxw_usr";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxwUsrSearch,
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
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.userid != null) {
    whereQuery += ` and t.userid = ${ args.push(search.userid) }`;
  }
  if (isNotEmpty(search?.userid_like)) {
    whereQuery += ` and t.userid like ${ args.push("%" + sqlLike(search?.userid_like) + "%") }`;
  }
  if (search?.mobile != null) {
    whereQuery += ` and t.mobile = ${ args.push(search.mobile) }`;
  }
  if (isNotEmpty(search?.mobile_like)) {
    whereQuery += ` and t.mobile like ${ args.push("%" + sqlLike(search?.mobile_like) + "%") }`;
  }
  if (search?.gender != null) {
    whereQuery += ` and t.gender = ${ args.push(search.gender) }`;
  }
  if (isNotEmpty(search?.gender_like)) {
    whereQuery += ` and t.gender like ${ args.push("%" + sqlLike(search?.gender_like) + "%") }`;
  }
  if (search?.email != null) {
    whereQuery += ` and t.email = ${ args.push(search.email) }`;
  }
  if (isNotEmpty(search?.email_like)) {
    whereQuery += ` and t.email like ${ args.push("%" + sqlLike(search?.email_like) + "%") }`;
  }
  if (search?.biz_email != null) {
    whereQuery += ` and t.biz_email = ${ args.push(search.biz_email) }`;
  }
  if (isNotEmpty(search?.biz_email_like)) {
    whereQuery += ` and t.biz_email like ${ args.push("%" + sqlLike(search?.biz_email_like) + "%") }`;
  }
  if (search?.direct_leader != null) {
    whereQuery += ` and t.direct_leader = ${ args.push(search.direct_leader) }`;
  }
  if (isNotEmpty(search?.direct_leader_like)) {
    whereQuery += ` and t.direct_leader like ${ args.push("%" + sqlLike(search?.direct_leader_like) + "%") }`;
  }
  if (search?.position != null) {
    whereQuery += ` and t.position = ${ args.push(search.position) }`;
  }
  if (isNotEmpty(search?.position_like)) {
    whereQuery += ` and t.position like ${ args.push("%" + sqlLike(search?.position_like) + "%") }`;
  }
  if (search?.avatar != null) {
    whereQuery += ` and t.avatar = ${ args.push(search.avatar) }`;
  }
  if (isNotEmpty(search?.avatar_like)) {
    whereQuery += ` and t.avatar like ${ args.push("%" + sqlLike(search?.avatar_like) + "%") }`;
  }
  if (search?.thumb_avatar != null) {
    whereQuery += ` and t.thumb_avatar = ${ args.push(search.thumb_avatar) }`;
  }
  if (isNotEmpty(search?.thumb_avatar_like)) {
    whereQuery += ` and t.thumb_avatar like ${ args.push("%" + sqlLike(search?.thumb_avatar_like) + "%") }`;
  }
  if (search?.qr_code != null) {
    whereQuery += ` and t.qr_code = ${ args.push(search.qr_code) }`;
  }
  if (isNotEmpty(search?.qr_code_like)) {
    whereQuery += ` and t.qr_code like ${ args.push("%" + sqlLike(search?.qr_code_like) + "%") }`;
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
  search?: WxwUsrSearch,
  options?: {
  },
) {
  let fromQuery = `wxwork_wxw_usr t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找企微用户总数
 * @param { WxwUsrSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwUsrSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_usr";
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
 * 根据搜索条件和分页查找企微用户列表
 * @param {WxwUsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxwUsrModel[]> {
  const table = "wxwork_wxw_usr";
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
  
  const result = await query<WxwUsrModel>(
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
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwUsrInput,
) {
}

/**
 * 获取企微用户字段注释
 */
export async function getFieldComments(): Promise<WxwUsrFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxwUsrFieldComment = {
    id: await n("ID"),
    lbl: await n("姓名"),
    userid: await n("用户ID"),
    rem: await n("备注"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得企微用户列表
 * @param {WxwUsrInput} search0
 */
export async function findByUnique(
  search0: WxwUsrInput,
  options?: {
    debug?: boolean;
  },
): Promise<WxwUsrModel[]> {
  
  const table = "wxwork_wxw_usr";
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
  const models: WxwUsrModel[] = [ ];
  {
    if (search0.userid == null) {
      return [ ];
    }
    const userid = search0.userid;
    const modelTmps = await findAll({
      userid,
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
 * @param {WxwUsrModel} oldModel
 * @param {WxwUsrInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxwUsrModel,
  input: WxwUsrInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.userid === input.userid
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
 * 通过唯一约束检查企微用户是否已经存在
 * @param {WxwUsrInput} input
 * @param {WxwUsrModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxwUsrId | undefined>}
 */
export async function checkByUnique(
  input: WxwUsrInput,
  oldModel: WxwUsrModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxwUsrId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("企微用户")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwUsrId = await updateById(
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
 * 根据条件查找第一个企微用户
 * @param {WxwUsrSearch} search?
 */
export async function findOne(
  search?: WxwUsrSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxwUsrModel | undefined> {
  const table = "wxwork_wxw_usr";
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
 * 根据 id 查找企微用户
 * @param {WxwUsrId} id
 */
export async function findById(
  id?: WxwUsrId | null,
  options?: {
    debug?: boolean;
  },
): Promise<WxwUsrModel | undefined> {
  const table = "wxwork_wxw_usr";
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
 * 根据搜索条件判断企微用户是否存在
 * @param {WxwUsrSearch} search?
 */
export async function exist(
  search?: WxwUsrSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wxwork_wxw_usr";
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
 * 根据id判断企微用户是否存在
 * @param {WxwUsrId} id
 */
export async function existById(
  id?: WxwUsrId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wxwork_wxw_usr";
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
      wxwork_wxw_usr t
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

/** 校验企微用户是否存在 */
export async function validateOption(
  model?: WxwUsrModel,
) {
  if (!model) {
    throw `${ await ns("企微用户") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 企微用户增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxwUsrInput,
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
    44,
    fieldComments.lbl,
  );
  
  // 用户ID
  await validators.chars_max_length(
    input.userid,
    64,
    fieldComments.userid,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

/**
 * 创建企微用户
 * @param {WxwUsrInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxwUsrId>} 
 */
export async function create(
  input: WxwUsrInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxwUsrId> {
  const table = "wxwork_wxw_usr";
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
    let id: WxwUsrId | undefined = undefined;
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
    input.id = shortUuidV4<WxwUsrId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wxwork_wxw_usr(
      id,create_time
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
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id != null) {
      sql += `,create_usr_id`;
    }
  }
  if (input.lbl != null) {
    sql += `,lbl`;
  }
  if (input.userid != null) {
    sql += `,userid`;
  }
  if (input.mobile != null) {
    sql += `,mobile`;
  }
  if (input.gender != null) {
    sql += `,gender`;
  }
  if (input.email != null) {
    sql += `,email`;
  }
  if (input.biz_email != null) {
    sql += `,biz_email`;
  }
  if (input.direct_leader != null) {
    sql += `,direct_leader`;
  }
  if (input.position != null) {
    sql += `,position`;
  }
  if (input.avatar != null) {
    sql += `,avatar`;
  }
  if (input.thumb_avatar != null) {
    sql += `,thumb_avatar`;
  }
  if (input.qr_code != null) {
    sql += `,qr_code`;
  }
  if (input.rem != null) {
    sql += `,rem`;
  }
  sql += `)values(${ args.push(input.id) },${ args.push(reqDate()) }`;
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
  if (input.lbl != null) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.userid != null) {
    sql += `,${ args.push(input.userid) }`;
  }
  if (input.mobile != null) {
    sql += `,${ args.push(input.mobile) }`;
  }
  if (input.gender != null) {
    sql += `,${ args.push(input.gender) }`;
  }
  if (input.email != null) {
    sql += `,${ args.push(input.email) }`;
  }
  if (input.biz_email != null) {
    sql += `,${ args.push(input.biz_email) }`;
  }
  if (input.direct_leader != null) {
    sql += `,${ args.push(input.direct_leader) }`;
  }
  if (input.position != null) {
    sql += `,${ args.push(input.position) }`;
  }
  if (input.avatar != null) {
    sql += `,${ args.push(input.avatar) }`;
  }
  if (input.thumb_avatar != null) {
    sql += `,${ args.push(input.thumb_avatar) }`;
  }
  if (input.qr_code != null) {
    sql += `,${ args.push(input.qr_code) }`;
  }
  if (input.rem != null) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  
  await delCache();
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  await delCacheCtx(`dao.sql.wxwork_wxw_usr`);
}

/**
 * 企微用户根据id修改租户id
 * @param {WxwUsrId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxwUsrId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_usr";
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
      wxwork_wxw_usr
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
 * 根据 id 修改企微用户
 * @param {WxwUsrId} id
 * @param {WxwUsrInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxwUsrId>}
 */
export async function updateById(
  id: WxwUsrId,
  input: WxwUsrInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxwUsrId> {
  
  const table = "wxwork_wxw_usr";
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
        throw await ns("此 {0} 已经存在", await ns("企微用户"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("企微用户"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wxwork_wxw_usr set
  `;
  let updateFldNum = 0;
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.userid != null) {
    if (input.userid != oldModel.userid) {
      sql += `userid = ${ args.push(input.userid) },`;
      updateFldNum++;
    }
  }
  if (input.mobile != null) {
    if (input.mobile != oldModel.mobile) {
      sql += `mobile = ${ args.push(input.mobile) },`;
      updateFldNum++;
    }
  }
  if (input.gender != null) {
    if (input.gender != oldModel.gender) {
      sql += `gender = ${ args.push(input.gender) },`;
      updateFldNum++;
    }
  }
  if (input.email != null) {
    if (input.email != oldModel.email) {
      sql += `email = ${ args.push(input.email) },`;
      updateFldNum++;
    }
  }
  if (input.biz_email != null) {
    if (input.biz_email != oldModel.biz_email) {
      sql += `biz_email = ${ args.push(input.biz_email) },`;
      updateFldNum++;
    }
  }
  if (input.direct_leader != null) {
    if (input.direct_leader != oldModel.direct_leader) {
      sql += `direct_leader = ${ args.push(input.direct_leader) },`;
      updateFldNum++;
    }
  }
  if (input.position != null) {
    if (input.position != oldModel.position) {
      sql += `position = ${ args.push(input.position) },`;
      updateFldNum++;
    }
  }
  if (input.avatar != null) {
    if (input.avatar != oldModel.avatar) {
      sql += `avatar = ${ args.push(input.avatar) },`;
      updateFldNum++;
    }
  }
  if (input.thumb_avatar != null) {
    if (input.thumb_avatar != oldModel.thumb_avatar) {
      sql += `thumb_avatar = ${ args.push(input.thumb_avatar) },`;
      updateFldNum++;
    }
  }
  if (input.qr_code != null) {
    if (input.qr_code != oldModel.qr_code) {
      sql += `qr_code = ${ args.push(input.qr_code) },`;
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
 * 根据 ids 删除企微用户
 * @param {WxwUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwUsrId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_usr";
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
        wxwork_wxw_usr
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
 * 根据 ids 还原企微用户
 * @param {WxwUsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwUsrId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_usr";
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
    const id: WxwUsrId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wxwork_wxw_usr
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
        throw await ns("此 {0} 已经存在", await ns("企微用户"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除企微用户
 * @param {WxwUsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwUsrId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_usr";
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
          wxwork_wxw_usr
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wxwork_wxw_usr
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
