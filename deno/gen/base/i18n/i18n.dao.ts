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

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  LangId,
} from "/gen/base/lang/lang.model.ts";

import type {
  MenuId,
} from "/gen/base/menu/menu.model.ts";

import type {
  I18nInput,
  I18nModel,
  I18nSearch,
  I18nFieldComment,
  I18nId,
} from "./i18n.model.ts";

import * as langDao from "/gen/base/lang/lang.dao.ts";

import * as menuDao from "/gen/base/menu/menu.dao.ts";

const route_path = "/base/i18n";

async function getWhereQuery(
  args: QueryArgs,
  search?: I18nSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.id != null) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.lang_id != null && !Array.isArray(search?.lang_id)) {
    search.lang_id = [ search.lang_id ];
  }
  if (search?.lang_id != null) {
    whereQuery += ` and lang_id_lbl.id in ${ args.push(search.lang_id) }`;
  }
  if (search?.lang_id_is_null) {
    whereQuery += ` and lang_id_lbl.id is null`;
  }
  if (search?.menu_id != null && !Array.isArray(search?.menu_id)) {
    search.menu_id = [ search.menu_id ];
  }
  if (search?.menu_id != null) {
    whereQuery += ` and menu_id_lbl.id in ${ args.push(search.menu_id) }`;
  }
  if (search?.menu_id_is_null) {
    whereQuery += ` and menu_id_lbl.id is null`;
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
  search?: I18nSearch,
  options?: {
  },
) {
  const is_deleted = search?.is_deleted ?? 0;
  let fromQuery = `base_i18n t
    left join base_lang lang_id_lbl
      on lang_id_lbl.id = t.lang_id
    left join base_menu menu_id_lbl
      on menu_id_lbl.id = t.menu_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找国际化总数
 * @param { I18nSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: I18nSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_i18n";
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
 * 根据搜索条件和分页查找国际化列表
 * @param {I18nSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: I18nSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<I18nModel[]> {
  const table = "base_i18n";
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
      ,lang_id_lbl.lbl lang_id_lbl
      ,menu_id_lbl.lbl menu_id_lbl
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
  
  const result = await query<I18nModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
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
  input: I18nInput,
) {
  
  // 语言
  if (isNotEmpty(input.lang_id_lbl) && input.lang_id === undefined) {
    input.lang_id_lbl = String(input.lang_id_lbl).trim();
    const langModel = await langDao.findOne({ lbl: input.lang_id_lbl });
    if (langModel) {
      input.lang_id = langModel.id;
    }
  }
  
  // 菜单
  if (isNotEmpty(input.menu_id_lbl) && input.menu_id === undefined) {
    input.menu_id_lbl = String(input.menu_id_lbl).trim();
    const menuModel = await menuDao.findOne({ lbl: input.menu_id_lbl });
    if (menuModel) {
      input.menu_id = menuModel.id;
    }
  }
}

/**
 * 获取国际化字段注释
 */
export async function getFieldComments(): Promise<I18nFieldComment> {
  const n = initN(route_path);
  const fieldComments: I18nFieldComment = {
    id: await n("ID"),
    lang_id: await n("语言"),
    lang_id_lbl: await n("语言"),
    menu_id: await n("菜单"),
    menu_id_lbl: await n("菜单"),
    code: await n("编码"),
    lbl: await n("名称"),
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
 * 通过唯一约束获得国际化列表
 * @param {I18nInput} search0
 */
export async function findByUnique(
  search0: I18nInput,
  options?: {
  },
): Promise<I18nModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    }, undefined, options);
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: I18nModel[] = [ ];
  {
    if (search0.lang_id == null) {
      return [ ];
    }
    let lang_id: LangId[] = [ ];
    if (!Array.isArray(search0.lang_id) && search0.lang_id != null) {
      lang_id = [ search0.lang_id, search0.lang_id ];
    } else {
      lang_id = search0.lang_id || [ ];
    }
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
    const modelTmps = await findAll({
      lang_id,
      menu_id,
      code,
    }, undefined, undefined, options);
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {I18nModel} oldModel
 * @param {I18nInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: I18nModel,
  input: I18nInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.lang_id === input.lang_id &&
    oldModel.menu_id === input.menu_id &&
    oldModel.code === input.code
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查国际化是否已经存在
 * @param {I18nInput} input
 * @param {I18nModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<I18nId | undefined>}
 */
export async function checkByUnique(
  input: I18nInput,
  oldModel: I18nModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<I18nId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("国际化")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: I18nId = await updateById(
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
 * 根据条件查找第一个国际化
 * @param {I18nSearch} search?
 */
export async function findOne(
  search?: I18nSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<I18nModel | undefined> {
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
 * 根据 id 查找国际化
 * @param {I18nId} id
 */
export async function findById(
  id?: I18nId | null,
  options?: {
  },
): Promise<I18nModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id }, undefined, options);
  return model;
}

/**
 * 根据搜索条件判断国际化是否存在
 * @param {I18nSearch} search?
 */
export async function exist(
  search?: I18nSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断国际化是否存在
 * @param {I18nId} id
 */
export async function existById(
  id?: I18nId | null,
  options?: {
  },
) {
  const table = "base_i18n";
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
      base_i18n t
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

/** 校验国际化是否存在 */
export async function validateOption(
  model?: I18nModel,
) {
  if (!model) {
    throw `${ await ns("国际化") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 国际化增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: I18nInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 语言
  await validators.chars_max_length(
    input.lang_id,
    22,
    fieldComments.lang_id,
  );
  
  // 菜单
  await validators.chars_max_length(
    input.menu_id,
    45,
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
    45,
    fieldComments.lbl,
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
 * 创建国际化
 * @param {I18nInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<I18nId>} 
 */
export async function create(
  input: I18nInput,
  options?: {
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<I18nId> {
  const table = "base_i18n";
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
    let id: I18nId | undefined = undefined;
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
    input.id = shortUuidV4<I18nId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_i18n(
      id
      ,create_time
      ,update_time
  `;
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
  if (input.lang_id !== undefined) {
    sql += `,lang_id`;
  }
  if (input.menu_id !== undefined) {
    sql += `,menu_id`;
  }
  if (input.code !== undefined) {
    sql += `,code`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
  }
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;
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
  if (input.lang_id !== undefined) {
    sql += `,${ args.push(input.lang_id) }`;
  }
  if (input.menu_id !== undefined) {
    sql += `,${ args.push(input.menu_id) }`;
  }
  if (input.code !== undefined) {
    sql += `,${ args.push(input.code) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
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
  const table = "base_i18n";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_lang",
    "base_menu",
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 根据 id 修改国际化
 * @param {I18nId} id
 * @param {I18nInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<I18nId>}
 */
export async function updateById(
  id: I18nId,
  input: I18nInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<I18nId> {
  const table = "base_i18n";
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
        throw await ns("此 {0} 已经存在", await ns("国际化"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("国际化"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_i18n set
  `;
  let updateFldNum = 0;
  if (input.lang_id !== undefined) {
    if (input.lang_id != oldModel.lang_id) {
      sql += `lang_id = ${ args.push(input.lang_id) },`;
      updateFldNum++;
    }
  }
  if (input.menu_id !== undefined) {
    if (input.menu_id != oldModel.menu_id) {
      sql += `menu_id = ${ args.push(input.menu_id) },`;
      updateFldNum++;
    }
  }
  if (input.code !== undefined) {
    if (input.code != oldModel.code) {
      sql += `code = ${ args.push(input.code) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
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
 * 根据 ids 删除国际化
 * @param {I18nId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: I18nId[],
  options?: {
  },
): Promise<number> {
  const table = "base_i18n";
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
    const id: I18nId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_i18n
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
 * 根据 ids 还原国际化
 * @param {I18nId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: I18nId[],
  options?: {
  },
): Promise<number> {
  const table = "base_i18n";
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
    const id: I18nId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_i18n
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
        throw await ns("此 {0} 已经存在", await ns("国际化"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除国际化
 * @param {I18nId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: I18nId[],
  options?: {
  },
): Promise<number> {
  const table = "base_i18n";
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
          base_i18n
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_i18n
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
