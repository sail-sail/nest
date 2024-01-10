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
  WxAppId,
} from "/gen/wx/wx_app/wx_app.model.ts";

import type {
  WxAppTokenInput,
  WxAppTokenModel,
  WxAppTokenSearch,
  WxAppTokenFieldComment,
  WxAppTokenId,
} from "./wx_app_token.model.ts";

import * as wx_appDao from "/gen/wx/wx_app/wx_app.dao.ts";

const route_path = "/wx/wx_app_token";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxAppTokenSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.wx_app_id && !Array.isArray(search?.wx_app_id)) {
    search.wx_app_id = [ search.wx_app_id ];
  }
  if (search?.wx_app_id && search?.wx_app_id.length > 0) {
    whereQuery += ` and wx_app_id_lbl.id in ${ args.push(search.wx_app_id) }`;
  }
  if (search?.wx_app_id === null) {
    whereQuery += ` and wx_app_id_lbl.id is null`;
  }
  if (search?.wx_app_id_is_null) {
    whereQuery += ` and wx_app_id_lbl.id is null`;
  }
  if (search?.access_token !== undefined) {
    whereQuery += ` and t.access_token = ${ args.push(search.access_token) }`;
  }
  if (search?.access_token === null) {
    whereQuery += ` and t.access_token is null`;
  }
  if (isNotEmpty(search?.access_token_like)) {
    whereQuery += ` and t.access_token like ${ args.push("%" + sqlLike(search?.access_token_like) + "%") }`;
  }
  if (search?.token_time && search?.token_time?.length > 0) {
    if (search.token_time[0] != null) {
      whereQuery += ` and t.token_time >= ${ args.push(search.token_time[0]) }`;
    }
    if (search.token_time[1] != null) {
      whereQuery += ` and t.token_time <= ${ args.push(search.token_time[1]) }`;
    }
  }
  if (search?.expires_in && search?.expires_in?.length > 0) {
    if (search.expires_in[0] != null) {
      whereQuery += ` and t.expires_in >= ${ args.push(search.expires_in[0]) }`;
    }
    if (search.expires_in[1] != null) {
      whereQuery += ` and t.expires_in <= ${ args.push(search.expires_in[1]) }`;
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
    wx_wx_app_token t
    left join wx_wx_app wx_app_id_lbl
      on wx_app_id_lbl.id = t.wx_app_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找小程序接口凭据总数
 * @param { WxAppTokenSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxAppTokenSearch,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_app_token";
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
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += `
        where
          ${ whereQuery }
    `;
  }
  sql += `
        group by t.id
      ) t
  `;
  
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
 * 根据搜索条件和分页查找小程序接口凭据列表
 * @param {WxAppTokenSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxAppTokenSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxAppTokenModel[]> {
  const table = "wx_wx_app_token";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,wx_app_id_lbl.lbl wx_app_id_lbl
    from
      ${ await getFromQuery() }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += `
    where
      ${ whereQuery }
    `;
  }
  sql += `
    group by t.id
  `;
  
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
  
  const result = await query<WxAppTokenModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 令牌创建时间
    if (model.token_time) {
      const token_time = dayjs(model.token_time);
      if (isNaN(token_time.toDate().getTime())) {
        model.token_time_lbl = (model.token_time || "").toString();
      } else {
        model.token_time_lbl = token_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.token_time_lbl = "";
    }
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxAppTokenInput,
) {
  // 令牌创建时间
  if (!input.token_time && input.token_time_lbl) {
    const token_time_lbl = dayjs(input.token_time_lbl);
    if (token_time_lbl.isValid()) {
      input.token_time = token_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.token_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.token_time) {
    const token_time = dayjs(input.token_time);
    if (!token_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.token_time } ${ await ns("日期格式错误") }`;
    }
    input.token_time = dayjs(input.token_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  // 小程序设置
  if (isNotEmpty(input.wx_app_id_lbl) && input.wx_app_id === undefined) {
    input.wx_app_id_lbl = String(input.wx_app_id_lbl).trim();
    const wx_appModel = await wx_appDao.findOne({ lbl: input.wx_app_id_lbl });
    if (wx_appModel) {
      input.wx_app_id = wx_appModel.id;
    }
  }
  
  // 令牌创建时间
  if (isNotEmpty(input.token_time_lbl) && input.token_time === undefined) {
    input.token_time_lbl = String(input.token_time_lbl).trim();
    input.token_time = input.token_time_lbl;
  }
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldComments(): Promise<WxAppTokenFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxAppTokenFieldComment = {
    id: await n("ID"),
    wx_app_id: await n("小程序设置"),
    wx_app_id_lbl: await n("小程序设置"),
    access_token: await n("令牌"),
    token_time: await n("令牌创建时间"),
    token_time_lbl: await n("令牌创建时间"),
    expires_in: await n("令牌超时时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得小程序接口凭据列表
 * @param {WxAppTokenInput} search0
 */
export async function findByUnique(
  search0: WxAppTokenInput,
  options?: {
  },
): Promise<WxAppTokenModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: WxAppTokenModel[] = [ ];
  {
    if (search0.wx_app_id == null) {
      return [ ];
    }
    let wx_app_id: WxAppId[] = [ ];
    if (!Array.isArray(search0.wx_app_id)) {
      wx_app_id.push(search0.wx_app_id, search0.wx_app_id);
    } else {
      wx_app_id = search0.wx_app_id;
    }
    const modelTmps = await findAll({
      wx_app_id,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxAppTokenModel} oldModel
 * @param {WxAppTokenInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxAppTokenModel,
  input: WxAppTokenInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.wx_app_id === input.wx_app_id
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查小程序接口凭据是否已经存在
 * @param {WxAppTokenInput} input
 * @param {WxAppTokenModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxAppTokenId | undefined>}
 */
export async function checkByUnique(
  input: WxAppTokenInput,
  oldModel: WxAppTokenModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxAppTokenId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxAppTokenId = await updateById(
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
 * 根据条件查找第一个小程序接口凭据
 * @param {WxAppTokenSearch} search?
 */
export async function findOne(
  search?: WxAppTokenSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxAppTokenModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 * @param {WxAppTokenId} id
 */
export async function findById(
  id?: WxAppTokenId | null,
  options?: {
  },
): Promise<WxAppTokenModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断小程序接口凭据是否存在
 * @param {WxAppTokenSearch} search?
 */
export async function exist(
  search?: WxAppTokenSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断小程序接口凭据是否存在
 * @param {WxAppTokenId} id
 */
export async function existById(
  id?: WxAppTokenId | null,
) {
  const table = "wx_wx_app_token";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wx_wx_app_token t
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

/** 校验小程序接口凭据是否存在 */
export async function validateOption(
  model?: WxAppTokenModel,
) {
  if (!model) {
    throw `${ await ns("小程序接口凭据") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 小程序接口凭据增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxAppTokenInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 小程序设置
  await validators.chars_max_length(
    input.wx_app_id,
    22,
    fieldComments.wx_app_id,
  );
  
  // 令牌
  await validators.chars_max_length(
    input.access_token,
    600,
    fieldComments.access_token,
  );
  
}

/**
 * 创建小程序接口凭据
 * @param {WxAppTokenInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxAppTokenId>} 
 */
export async function create(
  input: WxAppTokenInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppTokenId> {
  const table = "wx_wx_app_token";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: WxAppTokenId | undefined = undefined;
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
    input.id = shortUuidV4<WxAppTokenId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wx_wx_app_token(
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
  if (input.wx_app_id !== undefined) {
    sql += `,wx_app_id`;
  }
  if (input.access_token !== undefined) {
    sql += `,access_token`;
  }
  if (input.token_time !== undefined) {
    sql += `,token_time`;
  }
  if (input.expires_in !== undefined) {
    sql += `,expires_in`;
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
  if (input.wx_app_id !== undefined) {
    sql += `,${ args.push(input.wx_app_id) }`;
  }
  if (input.access_token !== undefined) {
    sql += `,${ args.push(input.access_token) }`;
  }
  if (input.token_time !== undefined) {
    sql += `,${ args.push(input.token_time) }`;
  }
  if (input.expires_in !== undefined) {
    sql += `,${ args.push(input.expires_in) }`;
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
  const table = "wx_wx_app_token";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "wx_wx_app",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 根据 id 修改小程序接口凭据
 * @param {WxAppTokenId} id
 * @param {WxAppTokenInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxAppTokenId>}
 */
export async function updateById(
  id: WxAppTokenId,
  input: WxAppTokenInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxAppTokenId> {
  const table = "wx_wx_app_token";
  const method = "updateById";
  
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
    update wx_wx_app_token set
  `;
  let updateFldNum = 0;
  if (input.wx_app_id !== undefined) {
    if (input.wx_app_id != oldModel.wx_app_id) {
      sql += `wx_app_id = ${ args.push(input.wx_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.access_token !== undefined) {
    if (input.access_token != oldModel.access_token) {
      sql += `access_token = ${ args.push(input.access_token) },`;
      updateFldNum++;
    }
  }
  if (input.token_time !== undefined) {
    if (input.token_time != oldModel.token_time) {
      sql += `token_time = ${ args.push(input.token_time) },`;
      updateFldNum++;
    }
  }
  if (input.expires_in !== undefined) {
    if (input.expires_in != oldModel.expires_in) {
      sql += `expires_in = ${ args.push(input.expires_in) },`;
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
 * 根据 ids 删除小程序接口凭据
 * @param {WxAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxAppTokenId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_app_token";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxAppTokenId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_app_token
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
 * 根据 ids 还原小程序接口凭据
 * @param {WxAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxAppTokenId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_app_token";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxAppTokenId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_app_token
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
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 * @param {WxAppTokenId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxAppTokenId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_app_token";
  const method = "forceDeleteByIds";
  
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
          wx_wx_app_token
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wx_wx_app_token
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
