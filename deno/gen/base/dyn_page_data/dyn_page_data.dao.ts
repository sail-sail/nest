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

import {
  findOneDynPage,
} from "/gen/base/dyn_page/dyn_page.dao.ts";

import {
  findAllDynPageVal,
  updateByIdDynPageVal,
  createDynPageVal,
} from "/gen/base/dyn_page_val/dyn_page_val.dao.ts";

import * as validators from "/lib/validators/mod.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

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
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<DynPageDataSearch>,
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
  if (search?.ref_code != null) {
    whereQuery += ` and t.ref_code=${ args.push(search.ref_code) }`;
  }
  if (isNotEmpty(search?.ref_code_like)) {
    whereQuery += ` and t.ref_code like ${ args.push("%" + sqlLike(search?.ref_code_like) + "%") }`;
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
  
  if (search?.dyn_page_data != null) {
    
    const pagePath = getPagePathDynPageData(search.ref_code);
    
    const dyn_page_model = await findOneDynPage(
      {
        code: pagePath,
        is_enabled: [ 1 ],
      },
      undefined,
      options,
    );
    
    const dyn_page_field_models = dyn_page_model?.dyn_page_field;
    
    if (dyn_page_field_models && dyn_page_field_models.length > 0) {
      whereQuery += ` and t.id in (select v.ref_id from base_dyn_page_val v where
        v.ref_code=${ args.push(pagePath) }`;
      for (let i = 0; i < dyn_page_field_models.length; i++) {
        const field = dyn_page_field_models[i];
        const field_code = field.code;
        const field_type = field.type;
        const val = (search.dyn_page_data as any)[field_code];
        if (
          [
            "CustomCheckbox",
            "CustomInputNumber",
            "CustomSwitch",
            "CustomDatePicker",
          ].includes(field_type)
        ) {
          if (val != null) {
            if (val[0] != null) {
              whereQuery += ` and v.code=${ args.push(field_code) } and v.lbl<=${ args.push(val[0]) }`;
            }
            if (val[1] != null) {
              whereQuery += ` and v.code=${ args.push(field_code) } and v.lbl>=${ args.push(val[1]) }`;
            }
          }
        } else {
          if (val != null) {
            whereQuery += ` and v.code=${ args.push(field_code) } and v.lbl=${ args.push(val) }`;
          }
          const field_code_like = field.code + "_like";
          const val_like = (search.dyn_page_data as any)[field_code_like];
          if (isNotEmpty(val_like)) {
            whereQuery += ` and v.code=${ args.push(field_code) } and v.lbl like ${ args.push("%" + sqlLike(val_like) + "%") }`;
          }
        }
      }
      whereQuery += `)`;
    }
    
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<DynPageDataSearch>,
  options?: {
  },
) {
  let fromQuery = `base_dyn_page_data t`;
  return fromQuery;
}

// MARK: findCountDynPageData
/** 根据条件查找动态页面数据总数 */
export async function findCountDynPageData(
  search?: Readonly<DynPageDataSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameDynPageData();
  const method = "findCountDynPageData";
  
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
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return 0;
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
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
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

// MARK: setDynPageDataDynPageData
/** 设置动态页面数据 */
export async function setDynPageDataDynPageData(
  models: DynPageDataModel[],
  is_deleted?: InputMaybe<number>,
  options?: {
    is_debug?: boolean;
  },
): Promise<void> {
  
  if (models.length === 0) {
    return;
  }
  
  const pagePath = getPagePathDynPageData(models[0]?.ref_code);
  
  const dyn_page_model = await findOneDynPage(
    {
      code: pagePath,
      is_enabled: [ 1 ],
    },
    undefined,
    options,
  );
  
  const dyn_page_field_models = dyn_page_model?.dyn_page_field ?? [ ];
  
  const ids = models.map((item) => item.id);
  
  const dyn_page_val_models = await findAllDynPageVal(
    {
      ref_code: pagePath,
      ref_ids: ids as string[],
      is_deleted,
    },
    undefined,
    undefined,
    options,
  );
  
  for (const model of models) {
    
    model.dyn_page_data = model.dyn_page_data ?? { };
    
    for (const field of dyn_page_field_models) {
      
      const val_model = dyn_page_val_models.find((item) => item.ref_id === model.id && item.code === field.code);
      
      let val: any = null;
      if (val_model) {
        val = val_model.lbl;
      }
      if (
        [
          "CustomCheckbox",
          "CustomInputNumber",
          "CustomSwitch",
        ].includes(field.type)
      ) {
        if (val != null) {
          val = Number(val);
        }
      }
      if (val == null) {
        val = "";
      }
      
      model.dyn_page_data[field.code] = val;
    }
    
  }
  
}

// MARK: getPagePathDynPageData
export function getPagePathDynPageData(
  ref_code?: string | null,
) {
  if (ref_code) {
    return ref_code;
  }
  return "/base/dyn_page_data";
}

// MARK: getTableNameDynPageData
export function getTableNameDynPageData() {
  return "base_dyn_page_data";
}

// MARK: findAllDynPageData
/** 根据搜索条件和分页查找动态页面数据列表 */
export async function findAllDynPageData(
  search?: Readonly<DynPageDataSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<DynPageDataModel[]> {
  
  const table = getTableNameDynPageData();
  const method = "findAllDynPageData";
  
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
    sql += ` ${ sqlstring.escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<DynPageDataModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  await setDynPageDataDynPageData(
    result,
    search?.is_deleted,
    options,
  );
  
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
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
  }
  
  return result;
}

// MARK: setIdByLblDynPageData
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblDynPageData(
  input: DynPageDataInput,
) {
  
  const options = {
    is_debug: false,
  };
}

// MARK: getFieldCommentsDynPageData
/** 获取动态页面数据字段注释 */
export async function getFieldCommentsDynPageData(): Promise<DynPageDataFieldComment> {
  const fieldComments: DynPageDataFieldComment = {
    id: "ID",
    ref_code: "关联页面路由",
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

// MARK: findByUniqueDynPageData
/** 通过唯一约束获得动态页面数据列表 */
export async function findByUniqueDynPageData(
  search0: Readonly<DynPageDataInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel[]> {
  
  const table = getTableNameDynPageData();
  const method = "findByUniqueDynPageData";
  
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
    const model = await findOneDynPageData(
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
  const models: DynPageDataModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueDynPageData(
  oldModel: Readonly<DynPageDataModel>,
  input: Readonly<DynPageDataInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueDynPageData
/** 通过唯一约束检查 动态页面数据 是否已经存在 */
export async function checkByUniqueDynPageData(
  input: Readonly<DynPageDataInput>,
  oldModel: Readonly<DynPageDataModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueDynPageData(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("动态页面数据 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: DynPageDataId = await updateByIdDynPageData(
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

// MARK: findOneDynPageData
/** 根据条件查找第一动态页面数据 */
export async function findOneDynPageData(
  search?: Readonly<DynPageDataSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel | undefined> {
  
  const table = getTableNameDynPageData();
  const method = "findOneDynPageData";
  
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
  
  const dyn_page_data_models = await findAllDynPageData(
    search,
    page,
    sort,
    options,
  );
  
  const dyn_page_data_model = dyn_page_data_models[0];
  
  return dyn_page_data_model;
}

// MARK: findOneOkDynPageData
/** 根据条件查找第一动态页面数据, 如果不存在则抛错 */
export async function findOneOkDynPageData(
  search?: Readonly<DynPageDataSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel> {
  
  const table = getTableNameDynPageData();
  const method = "findOneOkDynPageData";
  
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
  
  const dyn_page_data_models = await findAllDynPageData(
    search,
    page,
    sort,
    options,
  );
  
  const dyn_page_data_model = dyn_page_data_models[0];
  
  if (!dyn_page_data_model) {
    const err_msg = "此 动态页面数据 已被删除";
    throw new Error(err_msg);
  }
  
  return dyn_page_data_model;
}

// MARK: findByIdDynPageData
/** 根据 id 查找动态页面数据 */
export async function findByIdDynPageData(
  id: DynPageDataId,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel | undefined> {
  
  const table = getTableNameDynPageData();
  const method = "findByIdDynPageData";
  
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
  
  const dyn_page_data_model = await findOneDynPageData(
    {
      id,
    },
    undefined,
    options,
  );
  
  return dyn_page_data_model;
}

// MARK: findByIdOkDynPageData
/** 根据 id 查找动态页面数据, 如果不存在则抛错 */
export async function findByIdOkDynPageData(
  id: DynPageDataId,
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel> {
  
  const table = getTableNameDynPageData();
  const method = "findByIdOkDynPageData";
  
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
  
  const dyn_page_data_model = await findByIdDynPageData(
    id,
    options,
  );
  
  if (!dyn_page_data_model) {
    const err_msg = "此 动态页面数据 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return dyn_page_data_model;
}

// MARK: findByIdsDynPageData
/** 根据 ids 查找动态页面数据 */
export async function findByIdsDynPageData(
  ids: DynPageDataId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel[]> {
  
  const table = getTableNameDynPageData();
  const method = "findByIdsDynPageData";
  
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
  
  const models = await findAllDynPageData(
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

// MARK: findByIdsOkDynPageData
/** 根据 ids 查找动态页面数据, 出现查询不到的 id 则报错 */
export async function findByIdsOkDynPageData(
  ids: DynPageDataId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<DynPageDataModel[]> {
  
  const table = getTableNameDynPageData();
  const method = "findByIdsOkDynPageData";
  
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
  
  const models = await findByIdsDynPageData(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 动态页面数据 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 动态页面数据 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existDynPageData
/** 根据搜索条件判断动态页面数据是否存在 */
export async function existDynPageData(
  search?: Readonly<DynPageDataSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameDynPageData();
  const method = "existDynPageData";
  
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
  const model = await findOneDynPageData(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdDynPageData
/** 根据id判断动态页面数据是否存在 */
export async function existByIdDynPageData(
  id?: Readonly<DynPageDataId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameDynPageData();
  const method = "existByIdDynPageData";
  
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
  const sql = `select 1 e from base_dyn_page_data t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionDynPageData
/** 校验动态页面数据是否存在 */
export async function validateOptionDynPageData(
  model?: DynPageDataModel,
) {
  if (!model) {
    const err_msg = "动态页面数据 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateDynPageData
/** 动态页面数据增加和修改时校验输入 */
export async function validateDynPageData(
  input: Readonly<DynPageDataInput>,
) {
  const fieldComments = await getFieldCommentsDynPageData();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 关联页面路由
  await validators.chars_max_length(
    input.ref_code,
    100,
    fieldComments.ref_code,
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

// MARK: createReturnDynPageData
/** 创建 动态页面数据 并返回 */
export async function createReturnDynPageData(
  input: Readonly<DynPageDataInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageDataModel> {
  
  const table = getTableNameDynPageData();
  const method = "createReturnDynPageData";
  
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
  
  const model = await validateOptionDynPageData(
    await findOneDynPageData(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createDynPageData
/** 创建 动态页面数据 */
export async function createDynPageData(
  input: Readonly<DynPageDataInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageDataId> {
  
  const table = getTableNameDynPageData();
  const method = "createDynPageData";
  
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

// MARK: createsReturnDynPageData
/** 批量创建 动态页面数据 并返回 */
export async function createsReturnDynPageData(
  inputs: DynPageDataInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageDataModel[]> {
  
  const table = getTableNameDynPageData();
  const method = "createsReturnDynPageData";
  
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
  
  const models = await findByIdsDynPageData(ids, options);
  
  return models;
}

// MARK: createsDynPageData
/** 批量创建 动态页面数据 */
export async function createsDynPageData(
  inputs: DynPageDataInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageDataId[]> {
  
  const table = getTableNameDynPageData();
  const method = "createsDynPageData";
  
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
  inputs: DynPageDataInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<DynPageDataId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNameDynPageData();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: DynPageDataId[] = [ ];
  const inputs2: DynPageDataInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueDynPageData(input, options);
    if (oldModels.length > 0) {
      let id: DynPageDataId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueDynPageData(
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
    
    const id = shortUuidV4<DynPageDataId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into base_dyn_page_data(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,ref_code)values";
  
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
      if (input.ref_code != null) {
        sql += `,${ args.push(input.ref_code) }`;
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
  
  // 更新动态字段
  const pagePath = getPagePathDynPageData(inputs2[0]?.ref_code);
  
  const dyn_page_model = await findOneDynPage(
    {
      code: pagePath,
      is_enabled: [ 1 ],
    },
    undefined,
    options,
  );
  
  if (dyn_page_model) {
    
    const dyn_page_field_models = dyn_page_model.dyn_page_field;
    
    const dyn_page_val_models = await findAllDynPageVal(
      {
        ref_code: pagePath,
        ref_ids: ids2 as string[],
      },
      undefined,
      undefined,
      options,
    );
    
    for (let i = 0; i < inputs2.length; i++) {
      const id = ids2[i];
      const input = inputs2[i];
      const dyn_page_data = input.dyn_page_data;
      
      if (!dyn_page_data) {
        continue;
      }
      
      for (const dyn_page_field_model of dyn_page_field_models) {
        const field_code = dyn_page_field_model.code;
        const field_type = dyn_page_field_model.type;
        const newValue0 = dyn_page_data[field_code];
        let newValue: any = undefined;
        if (
          [
            "CustomCheckbox",
            "CustomInputNumber",
            "CustomSwitch",
          ].includes(field_type)
        ) {
          if (newValue0 != null) {
            newValue = Number(newValue0);
          }
        }
        if (newValue0 != null) {
          newValue = newValue0;
        } else {
          newValue = "";
        }
        const oldValueModel = dyn_page_val_models.find((m) => m.code === field_code);
        if (oldValueModel) {
          const oldValue = oldValueModel?.lbl;
          if (newValue !== oldValue) {
            await updateByIdDynPageVal(
              oldValueModel.id,
              {
                lbl: newValue,
              },
              {
                is_debug: options?.is_debug,
                is_silent_mode: options?.is_silent_mode,
              },
            );
          }
        } else {
          await createDynPageVal(
            {
              ref_code: pagePath,
              ref_id: id as unknown as string,
              code: field_code,
              lbl: newValue,
            },
            options,
          );
        }
      }
    }
    
  }
  
  return ids2;
}

// MARK: updateTenantByIdDynPageData
/** 动态页面数据 根据 id 修改 租户id */
export async function updateTenantByIdDynPageData(
  id: DynPageDataId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageData();
  const method = "updateTenantByIdDynPageData";
  
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
  const sql = `update base_dyn_page_data set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdDynPageData
/** 根据 id 修改 动态页面数据 */
export async function updateByIdDynPageData(
  id: DynPageDataId,
  input: DynPageDataInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<DynPageDataId> {
  
  const table = getTableNameDynPageData();
  const method = "updateByIdDynPageData";
  
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
    throw new Error("updateByIdDynPageData: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdDynPageData: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdDynPageData(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueDynPageData(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "动态页面数据 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdDynPageData(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 动态页面数据 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update base_dyn_page_data set `;
  let updateFldNum = 0;
  if (input.ref_code != null) {
    if (input.ref_code != oldModel.ref_code) {
      sql += `ref_code=${ args.push(input.ref_code) },`;
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
  
  // 更新动态字段
  const dyn_page_data = input.dyn_page_data;
  if (dyn_page_data) {
    
    const pagePath = getPagePathDynPageData(input.ref_code);
  
    const dyn_page_model = await findOneDynPage(
      {
        code: pagePath,
        is_enabled: [ 1 ],
      },
      undefined,
      options,
    );
    
    if (dyn_page_model) {
      
      const dyn_page_field_models = dyn_page_model.dyn_page_field;
      
      const dyn_page_val_models = await findAllDynPageVal(
        {
          ref_code: pagePath,
          ref_ids: [ id ] as string[],
        },
        undefined,
        undefined,
        options,
      );
      
      for (const dyn_page_field_model of dyn_page_field_models) {
        const field_code = dyn_page_field_model.code;
        const field_type = dyn_page_field_model.type;
        const newValue0 = dyn_page_data[field_code];
        let newValue: any = undefined;
        if (
          [
            "CustomCheckbox",
            "CustomInputNumber",
            "CustomSwitch",
          ].includes(field_type)
        ) {
          if (newValue0 != null) {
            newValue = Number(newValue0);
          }
        }
        if (newValue0 != null) {
          newValue = newValue0;
        } else {
          newValue = "";
        }
        const oldValueModel = dyn_page_val_models.find((m) => m.code === field_code);
        if (oldValueModel) {
          const oldValue = oldValueModel?.lbl;
          if (newValue !== oldValue) {
            await updateByIdDynPageVal(
              oldValueModel.id,
              {
                lbl: newValue,
              },
              options,
            );
            updateFldNum++;
            sqlSetFldNum++;
          }
        } else {
          await createDynPageVal(
            {
              ref_code: pagePath,
              ref_id: id as unknown as string,
              code: field_code,
              lbl: newValue,
            },
            options,
          );
          updateFldNum++;
          sqlSetFldNum++;
        }
      }
      
    }
    
  }
  
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
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsDynPageData
/** 根据 ids 删除 动态页面数据 */
export async function deleteByIdsDynPageData(
  ids: DynPageDataId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageData();
  const method = "deleteByIdsDynPageData";
  
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
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdDynPageData(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const ref_code = oldModel.ref_code;
    const args = new QueryArgs();
    let sql = `update base_dyn_page_data set is_deleted=1`;
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
    const res = await execute(
      sql,
      args,
      {
        debug: is_debug_sql,
      },
    );
    affectedRows += res.affectedRows;
    // 删除动态页面值
    {
      const args = new QueryArgs();
      const sql = `update base_dyn_page_val set is_deleted=1 where ref_id=${ args.push(id) } and is_deleted=0`;
      await execute(sql, args);
    }
  }
  
  return affectedRows;
}

// MARK: revertByIdsDynPageData
/** 根据 ids 还原 动态页面数据 */
export async function revertByIdsDynPageData(
  ids: DynPageDataId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageData();
  const method = "revertByIdsDynPageData";
  
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
    let old_model = await findOneDynPageData(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdDynPageData(
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
      } as DynPageDataInput;
      const models = await findByUniqueDynPageData(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "动态页面数据 重复";
      }
    }
    const args = new QueryArgs();
    const sql = `update base_dyn_page_data set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 还原动态页面值
    {
      const args = new QueryArgs();
      const sql = `update base_dyn_page_val set is_deleted=0 where ref_id=${ args.push(id) } and is_deleted=1`;
      await execute(sql, args);
    }
  }
  
  return num;
}

// MARK: forceDeleteByIdsDynPageData
/** 根据 ids 彻底删除 动态页面数据 */
export async function forceDeleteByIdsDynPageData(
  ids: DynPageDataId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameDynPageData();
  const method = "forceDeleteByIdsDynPageData";
  
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneDynPageData(
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
    const sql = `delete from base_dyn_page_data where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 彻底删除动态页面值
    {
      const args = new QueryArgs();
      const sql = `delete from base_dyn_page_val where ref_id=${ args.push(id) }`;
      await execute(
        sql,
        args,
        {
          debug: is_debug_sql,
        },
      );
    }
  }
  
  return num;
}
