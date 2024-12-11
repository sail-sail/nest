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
  get_lang_id,
} from "/lib/auth/auth.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOne as findOneMenu,
} from "/gen/base/menu/menu.dao.ts";

import {
  route_path,
} from "./field_permit.model.ts";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<FieldPermitSearch>,
  options?: {
  },
): Promise<string> {
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
  let whereQuery = "";
  whereQuery += " 1=1"
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.menu_id != null) {
    whereQuery += ` and t.menu_id in (${ args.push(search.menu_id) })`;
  }
  if (search?.menu_id_is_null) {
    whereQuery += ` and t.menu_id is null`;
  }
  if (search?.menu_id_lbl != null) {
    whereQuery += ` and menu_id_lbl.lbl in (${ args.push(search.menu_id_lbl) })`;
  }
  if (isNotEmpty(search?.menu_id_lbl_like)) {
    whereQuery += ` and menu_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.menu_id_lbl_like) + "%") }`;
  }
  if (search?.code != null) {
    whereQuery += ` and t.code=${ args.push(search.code) }`;
  }
  if (isNotEmpty(search?.code_like)) {
    whereQuery += ` and t.code like ${ args.push("%" + sqlLike(search?.code_like) + "%") }`;
  }
  if (search?.lbl != null) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.lbl=${ args.push(search.lbl) } or base_field_permit_lang.lbl=${ args.push(search.lbl) })`;
    } else {
      whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
    }
  }
  if (isNotEmpty(search?.lbl_like)) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") } or base_field_permit_lang.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") })`;
    } else {
      whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
    }
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
    if (server_i18n_enable) {
      whereQuery += ` and (t.rem=${ args.push(search.rem) } or base_field_permit_lang.rem=${ args.push(search.rem) })`;
    } else {
      whereQuery += ` and t.rem=${ args.push(search.rem) }`;
    }
  }
  if (isNotEmpty(search?.rem_like)) {
    if (server_i18n_enable) {
      whereQuery += ` and (t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") } or base_field_permit_lang.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") })`;
    } else {
      whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
    }
  }
  return whereQuery;
}

async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<FieldPermitSearch>,
  options?: {
  },
) {
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  let fromQuery = `base_field_permit t
  left join base_menu menu_id_lbl on menu_id_lbl.id=t.menu_id`;
  
  if (server_i18n_enable) {
    fromQuery += ` left join base_field_permit_lang on base_field_permit_lang.field_permit_id=t.id and base_field_permit_lang.lang_id=${ args.push(await get_lang_id()) }`;
  }
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找字段权限总数 */
export async function findCount(
  search?: Readonly<FieldPermitSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_field_permit";
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
/** 根据搜索条件和分页查找字段权限列表 */
export async function findAll(
  search?: Readonly<FieldPermitSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<FieldPermitModel[]> {
  
  const table = "base_field_permit";
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
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  // 菜单
  if (search && search.menu_id != null) {
    const len = search.menu_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.menu_id.length > ${ ids_limit }`);
    }
  }
  
  let lang_sql = "";
  
  if (server_i18n_enable) {
    lang_sql += ",max(base_field_permit_lang.lbl) lbl_lang";
    lang_sql += ",max(base_field_permit_lang.rem) rem_lang";
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,menu_id_lbl.lbl menu_id_lbl
      ${ lang_sql }
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
  
  const result = await query<FieldPermitModel>(
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
    
    if (server_i18n_enable) {
      
      // deno-lint-ignore no-explicit-any
      if ((model as any).lbl_lang) {
        // deno-lint-ignore no-explicit-any
        model.lbl = (model as any).lbl_lang;
        // deno-lint-ignore no-explicit-any
        (model as any).lbl_lang = undefined;
      }
      
      // deno-lint-ignore no-explicit-any
      if ((model as any).rem_lang) {
        // deno-lint-ignore no-explicit-any
        model.rem = (model as any).rem_lang;
        // deno-lint-ignore no-explicit-any
        (model as any).rem_lang = undefined;
      }
    }
    
    // 菜单
    model.menu_id_lbl = model.menu_id_lbl || "";
  }
  
  return result;
}

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: FieldPermitInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  // 菜单
  if (isNotEmpty(input.menu_id_lbl) && input.menu_id == null) {
    input.menu_id_lbl = String(input.menu_id_lbl).trim();
    const menuModel = await findOneMenu(
      {
        lbl: input.menu_id_lbl,
      },
      undefined,
      options,
    );
    if (menuModel) {
      input.menu_id = menuModel.id;
    }
  } else if (isEmpty(input.menu_id_lbl) && input.menu_id != null) {
    const menu_model = await findOneMenu(
      {
        id: input.menu_id,
      },
      undefined,
      options,
    );
    if (menu_model) {
      input.menu_id_lbl = menu_model.lbl;
    }
  }
}

// MARK: getFieldComments
/** 获取字段权限字段注释 */
export async function getFieldComments(): Promise<FieldPermitFieldComment> {
  const n = initN(route_path);
  const fieldComments: FieldPermitFieldComment = {
    id: await n("ID"),
    menu_id: await n("菜单"),
    menu_id_lbl: await n("菜单"),
    code: await n("编码"),
    lbl: await n("名称"),
    order_by: await n("排序"),
    rem: await n("备注"),
  };
  return fieldComments;
}

// MARK: findByUnique
/** 通过唯一约束获得字段权限列表 */
export async function findByUnique(
  search0: Readonly<FieldPermitInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<FieldPermitModel[]> {
  
  const table = "base_field_permit";
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
  const models: FieldPermitModel[] = [ ];
  {
    if (search0.menu_id == null) {
      return [ ];
    }
    let menu_id: MenuId[] = [ ];
    if (!Array.isArray(search0.menu_id) && search0.menu_id != null) {
      menu_id = [ search0.menu_id, search0.menu_id ];
    } else {
      menu_id = search0.menu_id || [ ];
    }
    if (search0.code == null) {
      return [ ];
    }
    const code = search0.code;
    const modelTmps = await findAll(
      {
        menu_id,
        code,
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
  oldModel: Readonly<FieldPermitModel>,
  input: Readonly<FieldPermitInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.menu_id === input.menu_id &&
    oldModel.code === input.code
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUnique
/** 通过唯一约束检查 字段权限 是否已经存在 */
export async function checkByUnique(
  input: Readonly<FieldPermitInput>,
  oldModel: Readonly<FieldPermitModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<FieldPermitId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("字段权限")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: FieldPermitId = await updateById(
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
/** 根据条件查找第一字段权限 */
export async function findOne(
  search?: Readonly<FieldPermitSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<FieldPermitModel | undefined> {
  
  const table = "base_field_permit";
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
/** 根据 id 查找字段权限 */
export async function findById(
  id?: FieldPermitId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<FieldPermitModel | undefined> {
  
  const table = "base_field_permit";
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
/** 根据 ids 查找字段权限 */
export async function findByIds(
  ids: FieldPermitId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<FieldPermitModel[]> {
  
  const table = "base_field_permit";
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
/** 根据搜索条件判断字段权限是否存在 */
export async function exist(
  search?: Readonly<FieldPermitSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "base_field_permit";
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
/** 根据id判断字段权限是否存在 */
export async function existById(
  id?: Readonly<FieldPermitId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "base_field_permit";
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
  const sql = `select 1 e from base_field_permit t where t.id=${ args.push(id) } limit 1`;
  
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
/** 校验字段权限是否存在 */
export async function validateOption(
  model?: FieldPermitModel,
) {
  if (!model) {
    const err_msg = `${ await ns("字段权限") } ${ await ns("不存在") }`;
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 字段权限增加和修改时校验输入 */
export async function validate(
  input: Readonly<FieldPermitInput>,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 菜单
  await validators.chars_max_length(
    input.menu_id,
    22,
    fieldComments.menu_id,
  );
  
  // 编码
  await validators.chars_max_length(
    input.code,
    64,
    fieldComments.code,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    100,
    fieldComments.lbl,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

// MARK: createReturn
/** 创建 字段权限 并返回 */
export async function createReturn(
  input: Readonly<FieldPermitInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<FieldPermitModel> {
  
  const table = "base_field_permit";
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
/** 创建 字段权限 */
export async function create(
  input: Readonly<FieldPermitInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<FieldPermitId> {
  
  const table = "base_field_permit";
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
/** 批量创建 字段权限 并返回 */
export async function createsReturn(
  inputs: FieldPermitInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<FieldPermitModel[]> {
  
  const table = "base_field_permit";
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
/** 批量创建 字段权限 */
export async function creates(
  inputs: FieldPermitInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<FieldPermitId[]> {
  
  const table = "base_field_permit";
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
  inputs: FieldPermitInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<FieldPermitId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "base_field_permit";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: FieldPermitId[] = [ ];
  const inputs2: FieldPermitInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: FieldPermitId | undefined = undefined;
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
    
    const id = shortUuidV4<FieldPermitId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = "insert into base_field_permit(id,menu_id,code,lbl,order_by,rem,is_sys)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (input.menu_id != null) {
        sql += `,${ args.push(input.menu_id) }`;
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
      if (input.is_sys != null) {
        sql += `,${ args.push(input.is_sys) }`;
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
  
  for (const input of inputs) {
    await refreshLangByInput(input);
  }
  
  await delCache();
  
  return ids2;
}

// MARK: delCache
/** 删除缓存 */
export async function delCache() {
  await delCacheCtx(`dao.sql.base_field_permit`);
}

async function refreshLangByInput(
  input: Readonly<FieldPermitInput>,
) {
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  if (!server_i18n_enable) {
    return;
  }
  const lang_sql = "select id from base_field_permit_lang where lang_id=? and field_permit_id=?";
  const lang_args = new QueryArgs();
  lang_args.push(await get_lang_id());
  lang_args.push(input.id);
  const model = await queryOne<{ id: string }>(
    lang_sql,
    lang_args,
  );
  const lang_id = model?.id;
  if (lang_id) {
    let lang_sql = "update base_field_permit_lang set ";
    const lang_args = new QueryArgs();
    // 名称
    if (input.lbl != null) {
      lang_sql += "lbl=?,";
      lang_args.push(input.lbl);
    }
    // 备注
    if (input.rem != null) {
      lang_sql += "rem=?,";
      lang_args.push(input.rem);
    }
    if (lang_sql.endsWith(",")) {
      lang_sql = lang_sql.substring(0, lang_sql.length - 1);
    }
    lang_sql += " where id=?";
    lang_args.push(lang_id);
    await execute(lang_sql, lang_args);
  } else {
    const sql_fields: string[] = [ ];
    const lang_args = new QueryArgs();
    lang_args.push(shortUuidV4());
    lang_args.push(await get_lang_id());
    lang_args.push(input.id);
    // 名称
    if (input.lbl != null) {
      sql_fields.push("lbl");
      lang_args.push(input.lbl);
    }
    // 备注
    if (input.rem != null) {
      sql_fields.push("rem");
      lang_args.push(input.rem);
    }
    let lang_sql = "insert into base_field_permit_lang(id,lang_id,field_permit_id";
    for (const sql_field of sql_fields) {
      lang_sql += "," + sql_field;
    }
    lang_sql += ")values(?,?,?";
    for (let i = 0; i < sql_fields.length; i++) {
      lang_sql += ",?";
    }
    lang_sql += ")";
    await execute(lang_sql, lang_args);
  }
}

// MARK: updateById
/** 根据 id 修改 字段权限 */
export async function updateById(
  id: FieldPermitId,
  input: FieldPermitInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<FieldPermitId> {
  
  const table = "base_field_permit";
  const method = "updateById";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
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
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("字段权限"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("字段权限"));
  }
  
  const args = new QueryArgs();
  let sql = `update base_field_permit set `;
  let updateFldNum = 0;
  if (input.menu_id != null) {
    if (input.menu_id != oldModel.menu_id) {
      sql += `menu_id=${ args.push(input.menu_id) },`;
      updateFldNum++;
    }
  }
  if (input.code != null) {
    if (input.code != oldModel.code) {
      sql += `code=${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      if (!server_i18n_enable) {
        sql += `lbl=${ args.push(input.lbl) },`;
      }
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
      if (!server_i18n_enable) {
        sql += `rem=${ args.push(input.rem) },`;
      }
      updateFldNum++;
    }
  }
  if (input.is_sys != null) {
    if (input.is_sys != oldModel.is_sys) {
      sql += `is_sys=${ args.push(input.is_sys) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    await delCache();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
      if (server_i18n_enable) {
        await refreshLangByInput({
          ...input,
          id,
        });
      }
    }
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 字段权限 */
export async function deleteByIds(
  ids: FieldPermitId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "base_field_permit";
  const method = "deleteByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  
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
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from base_field_permit where id=${ args.push(id) } limit 1`;
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
    if (server_i18n_enable) {
      const sql = "delete from base_field_permit_lang where field_permit_id=?";
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }
    {
      const args = new QueryArgs();
      const sql = `update base_role_field_permit set is_deleted=1 where field_permit_id=${ args.push(id) } and is_deleted=0`;
      await execute(sql, args);
    }
  }
  
  await delCache();
  
  return affectedRows;
}

// MARK: findLastOrderBy
/** 查找 字段权限 order_by 字段的最大值 */
export async function findLastOrderBy(
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "base_field_permit";
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
  
  let sql = `select t.order_by order_by from base_field_permit t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);
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
