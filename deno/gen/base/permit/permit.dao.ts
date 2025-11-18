// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import sqlstring from "sqlstring";

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
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  InputMaybe,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOneMenu,
} from "/gen/base/menu/menu.dao.ts";

// deno-lint-ignore require-await
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<PermitSearch>,
  options?: {
  },
): Promise<string> {
  
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
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
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
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<PermitSearch>,
  options?: {
  },
) {
  let fromQuery = `base_permit t
  left join base_menu menu_id_lbl on menu_id_lbl.id=t.menu_id`;
  return fromQuery;
}

// MARK: findCountPermit
/** 根据条件查找按钮权限总数 */
export async function findCountPermit(
  search?: Readonly<PermitSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNamePermit();
  const method = "findCountPermit";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ method }:`;
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
  
  if (search?.id === "") {
    return 0;
  }
  if (search && search.ids && search.ids.length === 0) {
    return 0;
  }
  // 菜单
  if (search && search.menu_id != null) {
    const len = search.menu_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.menu_id.length > ${ ids_limit }`);
    }
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

// MARK: getPagePathPermit
export function getPagePathPermit() {
  return "/base/permit";
}

// MARK: getTableNamePermit
export function getTableNamePermit() {
  return "base_permit";
}

// MARK: findAllPermit
/** 根据搜索条件和分页查找按钮权限列表 */
export async function findAllPermit(
  search?: Readonly<PermitSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<PermitModel[]> {
  
  const table = getTableNamePermit();
  const method = "findAllPermit";
  
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
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,menu_id_lbl.lbl menu_id_lbl
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
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
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
  
  const result = await query<PermitModel>(
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
    
    // 菜单
    model.menu_id_lbl = model.menu_id_lbl || "";
  }
  
  return result;
}

// MARK: setIdByLblPermit
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblPermit(
  input: PermitInput,
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

// MARK: getFieldCommentsPermit
/** 获取按钮权限字段注释 */
export async function getFieldCommentsPermit(): Promise<PermitFieldComment> {
  const fieldComments: PermitFieldComment = {
    id: "ID",
    menu_id: "菜单",
    menu_id_lbl: "菜单",
    code: "编码",
    lbl: "名称",
    order_by: "排序",
    rem: "备注",
  };
  return fieldComments;
}

// MARK: findByUniquePermit
/** 通过唯一约束获得按钮权限列表 */
export async function findByUniquePermit(
  search0: Readonly<PermitInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel[]> {
  
  const table = getTableNamePermit();
  const method = "findByUniquePermit";
  
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
    const model = await findOnePermit(
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
  const models: PermitModel[] = [ ];
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
    const modelTmps = await findAllPermit(
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
export function equalsByUniquePermit(
  oldModel: Readonly<PermitModel>,
  input: Readonly<PermitInput>,
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

// MARK: checkByUniquePermit
/** 通过唯一约束检查 按钮权限 是否已经存在 */
export async function checkByUniquePermit(
  input: Readonly<PermitInput>,
  oldModel: Readonly<PermitModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniquePermit(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("按钮权限 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: PermitId = await updateByIdPermit(
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

// MARK: findOnePermit
/** 根据条件查找第一按钮权限 */
export async function findOnePermit(
  search?: Readonly<PermitSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel | undefined> {
  
  const table = getTableNamePermit();
  const method = "findOnePermit";
  
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
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const permit_models = await findAllPermit(
    search,
    page,
    sort,
    options,
  );
  
  const permit_model = permit_models[0];
  
  return permit_model;
}

// MARK: findOneOkPermit
/** 根据条件查找第一按钮权限, 如果不存在则抛错 */
export async function findOneOkPermit(
  search?: Readonly<PermitSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel> {
  
  const table = getTableNamePermit();
  const method = "findOneOkPermit";
  
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
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const permit_models = await findAllPermit(
    search,
    page,
    sort,
    options,
  );
  
  const permit_model = permit_models[0];
  
  if (!permit_model) {
    const err_msg = "此 按钮权限 已被删除";
    throw new Error(err_msg);
  }
  
  return permit_model;
}

// MARK: findByIdPermit
/** 根据 id 查找按钮权限 */
export async function findByIdPermit(
  id: PermitId,
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel | undefined> {
  
  const table = getTableNamePermit();
  const method = "findByIdPermit";
  
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
  
  const permit_model = await findOnePermit(
    {
      id,
    },
    undefined,
    options,
  );
  
  return permit_model;
}

// MARK: findByIdOkPermit
/** 根据 id 查找按钮权限, 如果不存在则抛错 */
export async function findByIdOkPermit(
  id: PermitId,
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel> {
  
  const table = getTableNamePermit();
  const method = "findByIdOkPermit";
  
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
  
  const permit_model = await findByIdPermit(
    id,
    options,
  );
  
  if (!permit_model) {
    const err_msg = "此 按钮权限 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return permit_model;
}

// MARK: findByIdsPermit
/** 根据 ids 查找按钮权限 */
export async function findByIdsPermit(
  ids: PermitId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel[]> {
  
  const table = getTableNamePermit();
  const method = "findByIdsPermit";
  
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
  
  const models = await findAllPermit(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  const models2 = ids
    .map((id) => models.find((item) => item.id === id))
    .filter((item) => !!item);
  
  return models2;
}

// MARK: findByIdsOkPermit
/** 根据 ids 查找按钮权限, 出现查询不到的 id 则报错 */
export async function findByIdsOkPermit(
  ids: PermitId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<PermitModel[]> {
  
  const table = getTableNamePermit();
  const method = "findByIdsOkPermit";
  
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
  
  const models = await findByIdsPermit(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 按钮权限 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 按钮权限 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existPermit
/** 根据搜索条件判断按钮权限是否存在 */
export async function existPermit(
  search?: Readonly<PermitSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNamePermit();
  const method = "existPermit";
  
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
  const model = await findOnePermit(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdPermit
/** 根据id判断按钮权限是否存在 */
export async function existByIdPermit(
  id?: Readonly<PermitId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNamePermit();
  const method = "existByIdPermit";
  
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
  const sql = `select 1 e from base_permit t where t.id=${ args.push(id) } limit 1`;
  
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

// MARK: validateOptionPermit
/** 校验按钮权限是否存在 */
export async function validateOptionPermit(
  model?: PermitModel,
) {
  if (!model) {
    const err_msg = "按钮权限 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validatePermit
/** 按钮权限增加和修改时校验输入 */
export async function validatePermit(
  input: Readonly<PermitInput>,
) {
  const fieldComments = await getFieldCommentsPermit();
  
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
    45,
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

// MARK: createReturnPermit
/** 创建 按钮权限 并返回 */
export async function createReturnPermit(
  input: Readonly<PermitInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PermitModel> {
  
  const table = getTableNamePermit();
  const method = "createReturnPermit";
  
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
  
  const model = await validateOptionPermit(
    await findOnePermit(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createPermit
/** 创建 按钮权限 */
export async function createPermit(
  input: Readonly<PermitInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PermitId> {
  
  const table = getTableNamePermit();
  const method = "createPermit";
  
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

// MARK: createsReturnPermit
/** 批量创建 按钮权限 并返回 */
export async function createsReturnPermit(
  inputs: PermitInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PermitModel[]> {
  
  const table = getTableNamePermit();
  const method = "createsReturnPermit";
  
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
  
  const models = await findByIdsPermit(ids, options);
  
  return models;
}

// MARK: createsPermit
/** 批量创建 按钮权限 */
export async function createsPermit(
  inputs: PermitInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PermitId[]> {
  
  const table = getTableNamePermit();
  const method = "createsPermit";
  
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
  inputs: PermitInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<PermitId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNamePermit();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: PermitId[] = [ ];
  const inputs2: PermitInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniquePermit(input, options);
    if (oldModels.length > 0) {
      let id: PermitId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniquePermit(
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
    
    const id = shortUuidV4<PermitId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCachePermit();
  
  const args = new QueryArgs();
  let sql = "insert into base_permit(id,menu_id,code,lbl,order_by,rem,is_sys)values";
  
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
  
  await delCachePermit();
  
  return ids2;
}

// MARK: delCachePermit
/** 删除缓存 */
export async function delCachePermit() {
  await delCacheCtx(`dao.sql.base_permit`);
}

// MARK: updateByIdPermit
/** 根据 id 修改 按钮权限 */
export async function updateByIdPermit(
  id: PermitId,
  input: PermitInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<PermitId> {
  
  const table = getTableNamePermit();
  const method = "updateByIdPermit";
  
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
    throw new Error("updateByIdPermit: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdPermit: input cannot be null");
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniquePermit(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "按钮权限 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdPermit(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 按钮权限 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update base_permit set `;
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
      sql += `lbl=${ args.push(input.lbl) },`;
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
    
    await delCachePermit();
    
    if (sqlSetFldNum > 0) {
      const is_debug = getParsedEnv("database_debug_sql") === "true";
      await execute(
        sql,
        args,
        {
          debug: is_debug,
        },
      );
    }
  }
  
  if (updateFldNum > 0) {
    await delCachePermit();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsPermit
/** 根据 ids 删除 按钮权限 */
export async function deleteByIdsPermit(
  ids: PermitId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNamePermit();
  const method = "deleteByIdsPermit";
  
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCachePermit();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdPermit(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from base_permit where id=${ args.push(id) } limit 1`;
    const res = await execute(
      sql,
      args,
      {
        debug: is_debug_sql,
      },
    );
    affectedRows += res.affectedRows;
    {
      const args = new QueryArgs();
      const sql = `update base_role_permit set is_deleted=1 where permit_id=${ args.push(id) } and is_deleted=0`;
      await execute(
        sql,
        args,
        {
          debug: is_debug_sql,
        },
      );
    }
  }
  
  await delCachePermit();
  
  return affectedRows;
}

// MARK: findLastOrderByPermit
/** 查找 按钮权限 order_by 字段的最大值 */
export async function findLastOrderByPermit(
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNamePermit();
  const method = "findLastOrderByPermit";
  
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let sql = `select t.order_by order_by from base_permit t`;
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
  let model = await queryOne<Result>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  let result = model?.order_by ?? 0;
  
  return result;
}
