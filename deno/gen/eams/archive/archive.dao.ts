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

import * as validators from "/lib/validators/mod.ts";

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
} from "/gen/types.ts";

import {
  findOne as findOneCompany,
} from "/gen/eams/company/company.dao.ts";

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./archive.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<ArchiveSearch>,
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
  if (search?.code != null) {
    whereQuery += ` and t.code=${ args.push(search.code) }`;
  }
  if (isNotEmpty(search?.code_like)) {
    whereQuery += ` and t.code like ${ args.push("%" + sqlLike(search?.code_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.company_id != null) {
    whereQuery += ` and t.company_id in (${ args.push(search.company_id) })`;
  }
  if (search?.company_id_is_null) {
    whereQuery += ` and t.company_id is null`;
  }
  if (search?.company_id_lbl != null) {
    whereQuery += ` and company_id_lbl.lbl in (${ args.push(search.company_id_lbl) })`;
  }
  if (isNotEmpty(search?.company_id_lbl_like)) {
    whereQuery += ` and company_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.company_id_lbl_like) + "%") }`;
  }
  if (search?.order_by != null) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by>=${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by<=${ args.push(search.order_by[1]) }`;
    }
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
    whereQuery += ` and t.create_usr_id_lbl in (${ args.push(search.create_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.create_usr_id_lbl_like)) {
    whereQuery += ` and t.create_usr_id_lbl like ${ args.push("%" + sqlLike(search.create_usr_id_lbl_like) + "%") }`;
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
    whereQuery += ` and t.update_usr_id_lbl in (${ args.push(search.update_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.update_usr_id_lbl_like)) {
    whereQuery += ` and t.update_usr_id_lbl like ${ args.push("%" + sqlLike(search.update_usr_id_lbl_like) + "%") }`;
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
  search?: Readonly<ArchiveSearch>,
  options?: {
  },
) {
  let fromQuery = `eams_archive t
  left join eams_company company_id_lbl on company_id_lbl.id=t.company_id`;
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找全宗设置总数 */
export async function findCount(
  search?: Readonly<ArchiveSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "eams_archive";
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
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAll
/** 根据搜索条件和分页查找全宗设置列表 */
export async function findAll(
  search?: Readonly<ArchiveSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<ArchiveModel[]> {
  
  const table = "eams_archive";
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
  // 关联单位
  if (search && search.company_id != null) {
    const len = search.company_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.company_id.length > ${ ids_limit }`);
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
      ,company_id_lbl.lbl company_id_lbl
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<ArchiveModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 关联单位
    model.company_id_lbl = model.company_id_lbl || "";
    
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

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: ArchiveInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  // 关联单位
  if (isNotEmpty(input.company_id_lbl) && input.company_id == null) {
    input.company_id_lbl = String(input.company_id_lbl).trim();
    const companyModel = await findOneCompany(
      {
        lbl: input.company_id_lbl,
      },
      undefined,
      options,
    );
    if (companyModel) {
      input.company_id = companyModel.id;
    }
  } else if (isEmpty(input.company_id_lbl) && input.company_id != null) {
    const company_model = await findOneCompany(
      {
        id: input.company_id,
      },
      undefined,
      options,
    );
    if (company_model) {
      input.company_id_lbl = company_model.lbl;
    }
  }
}

// MARK: getFieldComments
/** 获取全宗设置字段注释 */
export async function getFieldComments(): Promise<ArchiveFieldComment> {
  const n = initN(route_path);
  const fieldComments: ArchiveFieldComment = {
    id: await n("ID"),
    code: await n("编号"),
    lbl: await n("名称"),
    company_id: await n("关联单位"),
    company_id_lbl: await n("关联单位"),
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

// MARK: findByUnique
/** 通过唯一约束获得全宗设置列表 */
export async function findByUnique(
  search0: Readonly<ArchiveInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<ArchiveModel[]> {
  
  const table = "eams_archive";
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
  const models: ArchiveModel[] = [ ];
  {
    if (search0.code == null) {
      return [ ];
    }
    const code = search0.code;
    const modelTmps = await findAll(
      {
        code,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
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
  oldModel: Readonly<ArchiveModel>,
  input: Readonly<ArchiveInput>,
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

// MARK: checkByUnique
/** 通过唯一约束检查 全宗设置 是否已经存在 */
export async function checkByUnique(
  input: Readonly<ArchiveInput>,
  oldModel: Readonly<ArchiveModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<ArchiveId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("全宗设置")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: ArchiveId = await updateById(
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
/** 根据条件查找第一全宗设置 */
export async function findOne(
  search?: Readonly<ArchiveSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<ArchiveModel | undefined> {
  
  const table = "eams_archive";
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
/** 根据 id 查找全宗设置 */
export async function findById(
  id?: ArchiveId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<ArchiveModel | undefined> {
  
  const table = "eams_archive";
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
/** 根据 ids 查找全宗设置 */
export async function findByIds(
  ids: ArchiveId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<ArchiveModel[]> {
  
  const table = "eams_archive";
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
/** 根据搜索条件判断全宗设置是否存在 */
export async function exist(
  search?: Readonly<ArchiveSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "eams_archive";
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
/** 根据id判断全宗设置是否存在 */
export async function existById(
  id?: Readonly<ArchiveId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "eams_archive";
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
  const sql = `select 1 e from eams_archive t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const queryOptions = {
    cacheKey1,
    cacheKey2,
  };
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,
    queryOptions,
  );
  const result = !!model?.e;
  
  return result;
}

// MARK: validateOption
/** 校验全宗设置是否存在 */
export async function validateOption(
  model?: ArchiveModel,
) {
  if (!model) {
    const err_msg = `${ await ns("全宗设置") } ${ await ns("不存在") }`;
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 全宗设置增加和修改时校验输入 */
export async function validate(
  input: Readonly<ArchiveInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 编号
  await validators.chars_max_length(
    input.code,
    22,
    fieldComments.code,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    100,
    fieldComments.lbl,
  );
  
  // 关联单位
  await validators.chars_max_length(
    input.company_id,
    22,
    fieldComments.company_id,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    255,
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

// MARK: create
/** 创建 全宗设置 */
export async function create(
  input: Readonly<ArchiveInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ArchiveId> {
  
  const table = "eams_archive";
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

// MARK: creates
/** 批量创建 全宗设置 */
export async function creates(
  inputs: ArchiveInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ArchiveId[]> {
  
  const table = "eams_archive";
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
  inputs: ArchiveInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<ArchiveId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "eams_archive";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: ArchiveId[] = [ ];
  const inputs2: ArchiveInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: ArchiveId | undefined = undefined;
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
    
    const id = shortUuidV4<ArchiveId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = "insert into eams_archive(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,code,lbl,company_id,order_by,rem)values";
  
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
          let usr_id = await get_usr_id();
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id, options);
            if (!usr_model) {
              usr_id = undefined;
            } else {
              usr_lbl = usr_model.lbl;
            }
          }
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
          sql += ",default";
        } else {
          let usr_id: UsrId | undefined = input.create_usr_id;
          let usr_lbl = "";
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
            usr_lbl = "";
          } else {
            usr_lbl = usr_model.lbl;
          }
          if (usr_id) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
        if (input.create_usr_id_lbl == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id_lbl) }`;
        }
      }
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.update_usr_id_lbl != null) {
        sql += `,${ args.push(input.update_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.code != null) {
        sql += `,${ args.push(input.code) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.company_id != null) {
        sql += `,${ args.push(input.company_id) }`;
      } else {
        sql += ",default";
      }
      if (input.order_by != null) {
        sql += `,${ args.push(input.order_by) }`;
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
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  await delCache();
  
  return ids2;
}

// MARK: delCache
/** 删除缓存 */
export async function delCache() {
  await delCacheCtx(`dao.sql.eams_archive`);
}

// MARK: updateTenantById
/** 全宗设置 根据 id 修改 租户id */
export async function updateTenantById(
  id: ArchiveId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "eams_archive";
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
  const sql = `update eams_archive set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  await delCache();
  return affectedRows;
}

// MARK: updateById
/** 根据 id 修改 全宗设置 */
export async function updateById(
  id: ArchiveId,
  input: ArchiveInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<ArchiveId> {
  
  const table = "eams_archive";
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
        throw await ns("此 {0} 已经存在", await ns("全宗设置"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("全宗设置"));
  }
  
  const args = new QueryArgs();
  let sql = `update eams_archive set `;
  let updateFldNum = 0;
  if (input.code != null) {
    if (input.code != oldModel.code) {
      sql += `code=${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.company_id != null) {
    if (input.company_id != oldModel.company_id) {
      sql += `company_id=${ args.push(input.company_id) },`;
      updateFldNum++;
    }
  }
  if (input.order_by != null) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by=${ args.push(input.order_by) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.create_usr_id_lbl)) {
    sql += `create_usr_id_lbl=?,`;
    args.push(input.create_usr_id_lbl);
    updateFldNum++;
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
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        let usr_id = await get_usr_id();
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
        if (usr_lbl) {
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      } else if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
        let usr_id: UsrId | undefined = input.update_usr_id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      }
    } else {
      if (input.update_usr_id != null) {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
      if (input.update_usr_id_lbl != null) {
        sql += `update_usr_id_lbl=${ args.push(input.update_usr_id_lbl) },`;
      }
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
    
    await delCache();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 全宗设置 */
export async function deleteByIds(
  ids: ArchiveId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "eams_archive";
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
  
  await delCache();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update eams_archive set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      let usr_id = await get_usr_id();
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }
      let usr_lbl = "";
      if (usr_id) {
        const usr_model = await findByIdUsr(usr_id, options);
        if (!usr_model) {
          usr_id = undefined;
        } else {
          usr_lbl = usr_model.lbl;
        }
      }
      if (usr_lbl) {
        sql += `,delete_usr_id_lbl=${ args.push(usr_lbl) }`;
      }
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
  }
  
  await delCache();
  
  return affectedRows;
}

// MARK: revertByIds
/** 根据 ids 还原 全宗设置 */
export async function revertByIds(
  ids: ArchiveId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "eams_archive";
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
  
  await delCache();
  
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
      } as ArchiveInput;
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw await ns("此 {0} 已经存在", await ns("全宗设置"));
      }
    }
    const args = new QueryArgs();
    const sql = `update eams_archive set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 全宗设置 */
export async function forceDeleteByIds(
  ids: ArchiveId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "eams_archive";
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
  
  await delCache();
  
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
    const sql = `delete from eams_archive where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

// MARK: findLastOrderBy
/** 查找 全宗设置 order_by 字段的最大值 */
export async function findLastOrderBy(
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "eams_archive";
  const method = "findLastOrderBy";
  
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
  
  let sql = `select t.order_by order_by from eams_archive t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);
  {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    whereQuery.push(` t.tenant_id=${ args.push(tenant_id) }`);
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