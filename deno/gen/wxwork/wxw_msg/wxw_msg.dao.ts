// deno-lint-ignore-file prefer-const no-unused-vars ban-types
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

import {
  findOne as findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

const route_path = "/wxwork/wxw_msg";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxwMsgSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id=${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id=${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.wxw_app_id != null && !Array.isArray(search?.wxw_app_id)) {
    search.wxw_app_id = [ search.wxw_app_id ];
  }
  if (search?.wxw_app_id != null) {
    whereQuery += ` and t.wxw_app_id in ${ args.push(search.wxw_app_id) }`;
  }
  if (search?.wxw_app_id_is_null) {
    whereQuery += ` and t.wxw_app_id is null`;
  }
  if (search?.errcode != null && !Array.isArray(search?.errcode)) {
    search.errcode = [ search.errcode ];
  }
  if (search?.errcode != null) {
    whereQuery += ` and t.errcode in ${ args.push(search.errcode) }`;
  }
  if (search?.touser != null) {
    whereQuery += ` and t.touser=${ args.push(search.touser) }`;
  }
  if (isNotEmpty(search?.touser_like)) {
    whereQuery += ` and t.touser like ${ args.push("%" + sqlLike(search?.touser_like) + "%") }`;
  }
  if (search?.title != null) {
    whereQuery += ` and t.title=${ args.push(search.title) }`;
  }
  if (isNotEmpty(search?.title_like)) {
    whereQuery += ` and t.title like ${ args.push("%" + sqlLike(search?.title_like) + "%") }`;
  }
  if (search?.description != null) {
    whereQuery += ` and t.description=${ args.push(search.description) }`;
  }
  if (isNotEmpty(search?.description_like)) {
    whereQuery += ` and t.description like ${ args.push("%" + sqlLike(search?.description_like) + "%") }`;
  }
  if (search?.url != null) {
    whereQuery += ` and t.url=${ args.push(search.url) }`;
  }
  if (isNotEmpty(search?.url_like)) {
    whereQuery += ` and t.url like ${ args.push("%" + sqlLike(search?.url_like) + "%") }`;
  }
  if (search?.btntxt != null) {
    whereQuery += ` and t.btntxt=${ args.push(search.btntxt) }`;
  }
  if (isNotEmpty(search?.btntxt_like)) {
    whereQuery += ` and t.btntxt like ${ args.push("%" + sqlLike(search?.btntxt_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.errmsg != null) {
    whereQuery += ` and t.errmsg=${ args.push(search.errmsg) }`;
  }
  if (isNotEmpty(search?.errmsg_like)) {
    whereQuery += ` and t.errmsg like ${ args.push("%" + sqlLike(search?.errmsg_like) + "%") }`;
  }
  if (search?.msgid != null) {
    whereQuery += ` and t.msgid=${ args.push(search.msgid) }`;
  }
  if (isNotEmpty(search?.msgid_like)) {
    whereQuery += ` and t.msgid like ${ args.push("%" + sqlLike(search?.msgid_like) + "%") }`;
  }
  if (search?.create_usr_id != null && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.update_usr_id != null && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and t.update_usr_id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
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
  search?: WxwMsgSearch,
  options?: {
  },
) {
  let fromQuery = `wxwork_wxw_msg t
    left join wxwork_wxw_app wxw_app_id_lbl on wxw_app_id_lbl.id=t.wxw_app_id
    left join base_usr create_usr_id_lbl on create_usr_id_lbl.id=t.create_usr_id
    left join base_usr update_usr_id_lbl on update_usr_id_lbl.id=t.update_usr_id`;
  return fromQuery;
}

/**
 * 根据条件查找企微消息总数
 * @param { WxwMsgSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwMsgSearch,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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

/**
 * 根据搜索条件和分页查找企微消息列表
 * @param {WxwMsgSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxwMsgModel[]> {
  const table = "wxwork_wxw_msg";
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
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 企微应用
  if (search && search.wxw_app_id != null) {
    const len = search.wxw_app_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.wxw_app_id.length > ${ ids_limit }`);
    }
  }
  // 发送状态
  if (search && search.errcode != null) {
    const len = search.errcode.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.errcode.length > ${ ids_limit }`);
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
      ,wxw_app_id_lbl.lbl wxw_app_id_lbl
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
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxwMsgModel>(
    sql,
    args,
    {
      debug,
    },
  );
  
  const [
    errcodeDict, // 发送状态
  ] = await getDict([
    "wxw_msg_errcode",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 企微应用
    model.wxw_app_id_lbl = model.wxw_app_id_lbl || "";
    
    // 发送状态
    let errcode_lbl = model.errcode as string;
    if (!isEmpty(model.errcode)) {
      const dictItem = errcodeDict.find((dictItem) => dictItem.val === model.errcode);
      if (dictItem) {
        errcode_lbl = dictItem.lbl;
      }
    }
    model.errcode_lbl = errcode_lbl || "";
    
    // 发送时间
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
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwMsgInput,
) {
  
  const [
    errcodeDict, // 发送状态
  ] = await getDict([
    "wxw_msg_errcode",
  ]);
  
  // 企微应用
  if (isNotEmpty(input.wxw_app_id_lbl) && input.wxw_app_id == null) {
    input.wxw_app_id_lbl = String(input.wxw_app_id_lbl).trim();
    const wxw_appModel = await findOneWxwApp({ lbl: input.wxw_app_id_lbl });
    if (wxw_appModel) {
      input.wxw_app_id = wxw_appModel.id;
    }
  }
  
  // 发送状态
  if (isNotEmpty(input.errcode_lbl) && input.errcode == null) {
    const val = errcodeDict.find((itemTmp) => itemTmp.lbl === input.errcode_lbl)?.val;
    if (val != null) {
      input.errcode = val;
    }
  }
}

/**
 * 获取企微消息字段注释
 */
export async function getFieldComments(): Promise<WxwMsgFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxwMsgFieldComment = {
    id: await n("ID"),
    wxw_app_id: await n("企微应用"),
    wxw_app_id_lbl: await n("企微应用"),
    errcode: await n("发送状态"),
    errcode_lbl: await n("发送状态"),
    touser: await n("成员ID"),
    title: await n("标题"),
    description: await n("描述"),
    btntxt: await n("按钮文字"),
    create_time: await n("发送时间"),
    create_time_lbl: await n("发送时间"),
    errmsg: await n("错误信息"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得企微消息列表
 * @param {WxwMsgInput} search0
 */
export async function findByUnique(
  search0: WxwMsgInput,
  options?: {
    debug?: boolean;
  },
): Promise<WxwMsgModel[]> {
  
  const table = "wxwork_wxw_msg";
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
  const models: WxwMsgModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxwMsgModel} oldModel
 * @param {WxwMsgInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxwMsgModel,
  input: WxwMsgInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查企微消息是否已经存在
 * @param {WxwMsgInput} input
 * @param {WxwMsgModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxwMsgId | undefined>}
 */
export async function checkByUnique(
  input: WxwMsgInput,
  oldModel: WxwMsgModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxwMsgId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("企微消息")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwMsgId = await updateById(
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
 * 根据条件查找第一个企微消息
 * @param {WxwMsgSearch} search?
 */
export async function findOne(
  search?: WxwMsgSearch,
  sort?: SortInput | SortInput[],
  options?: {
    debug?: boolean;
  },
): Promise<WxwMsgModel | undefined> {
  const table = "wxwork_wxw_msg";
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
  
  if (search && search.ids && search.ids.length === 0) {
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
 * 根据 id 查找企微消息
 * @param {WxwMsgId} id
 */
export async function findById(
  id?: WxwMsgId | null,
  options?: {
    debug?: boolean;
  },
): Promise<WxwMsgModel | undefined> {
  const table = "wxwork_wxw_msg";
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

/** 根据 ids 查找企微消息 */
export async function findByIds(
  ids: WxwMsgId[],
  options?: {
    debug?: boolean;
  },
): Promise<WxwMsgModel[]> {
  const table = "wxwork_wxw_msg";
  const method = "findByIds";
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options || { };
    options.debug = false;
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

/**
 * 根据搜索条件判断企微消息是否存在
 * @param {WxwMsgSearch} search?
 */
export async function exist(
  search?: WxwMsgSearch,
  options?: {
    debug?: boolean;
  },
): Promise<boolean> {
  const table = "wxwork_wxw_msg";
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
 * 根据id判断企微消息是否存在
 * @param {WxwMsgId} id
 */
export async function existById(
  id?: WxwMsgId | null,
  options?: {
    debug?: boolean;
  },
) {
  const table = "wxwork_wxw_msg";
  const method = "existById";
  
  if (options?.debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from wxwork_wxw_msg t where t.id = ${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

/** 校验企微消息是否存在 */
export async function validateOption(
  model?: WxwMsgModel,
) {
  if (!model) {
    throw `${ await ns("企微消息") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 企微消息增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxwMsgInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 企微应用
  await validators.chars_max_length(
    input.wxw_app_id,
    22,
    fieldComments.wxw_app_id,
  );
  
  // 发送状态
  await validators.chars_max_length(
    input.errcode,
    5,
    fieldComments.errcode,
  );
  
  // 成员ID
  await validators.chars_max_length(
    input.touser,
    256,
    fieldComments.touser,
  );
  
  // 标题
  await validators.chars_max_length(
    input.title,
    64,
    fieldComments.title,
  );
  
  // 描述
  await validators.chars_max_length(
    input.description,
    256,
    fieldComments.description,
  );
  
  // 按钮文字
  await validators.chars_max_length(
    input.btntxt,
    4,
    fieldComments.btntxt,
  );
  
  // 错误信息
  await validators.chars_max_length(
    input.errmsg,
    256,
    fieldComments.errmsg,
  );
  
}

/**
 * 创建企微消息
 * @param {WxwMsgInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxwMsgId>} 
 */
export async function create(
  input: WxwMsgInput,
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxwMsgId> {
  const table = "wxwork_wxw_msg";
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
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

/**
 * 批量创建企微消息
 * @param {WxwMsgInput[]} inputs
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxwMsgId[]>} 
 */
export async function creates(
  inputs: WxwMsgInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxwMsgId[]> {
  const table = "wxwork_wxw_msg";
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
  inputs: WxwMsgInput[],
  options?: {
    debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
  },
): Promise<WxwMsgId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wxwork_wxw_msg";
  
  const ids2: WxwMsgId[] = [ ];
  const inputs2: WxwMsgInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: WxwMsgId | undefined = undefined;
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
    
    const id = shortUuidV4<WxwMsgId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const args = new QueryArgs();
  let sql = `insert into wxwork_wxw_msg(id,create_time,tenant_id,create_usr_id,wxw_app_id,errcode,touser,title,description,url,btntxt,errmsg,msgid)values`;
  
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
      if (input.tenant_id == null) {
        const authModel = await getAuthModel();
        const tenant_id = await getTenant_id(authModel?.id);
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
      if (input.create_usr_id == null) {
        const authModel = await getAuthModel();
        if (authModel?.id != null) {
          sql += `,${ args.push(authModel.id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.create_usr_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.create_usr_id) }`;
      }
      if (input.wxw_app_id != null) {
        sql += `,${ args.push(input.wxw_app_id) }`;
      } else {
        sql += ",default";
      }
      if (input.errcode != null) {
        sql += `,${ args.push(input.errcode) }`;
      } else {
        sql += ",default";
      }
      if (input.touser != null) {
        sql += `,${ args.push(input.touser) }`;
      } else {
        sql += ",default";
      }
      if (input.title != null) {
        sql += `,${ args.push(input.title) }`;
      } else {
        sql += ",default";
      }
      if (input.description != null) {
        sql += `,${ args.push(input.description) }`;
      } else {
        sql += ",default";
      }
      if (input.url != null) {
        sql += `,${ args.push(input.url) }`;
      } else {
        sql += ",default";
      }
      if (input.btntxt != null) {
        sql += `,${ args.push(input.btntxt) }`;
      } else {
        sql += ",default";
      }
      if (input.errmsg != null) {
        sql += `,${ args.push(input.errmsg) }`;
      } else {
        sql += ",default";
      }
      if (input.msgid != null) {
        sql += `,${ args.push(input.msgid) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  const debug = getParsedEnv("database_debug_sql") === "true";
  
  await execute(sql, args, {
    debug,
  });
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];
  }
  
  return ids2;
}

/**
 * 企微消息根据id修改租户id
 * @param {WxwMsgId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxwMsgId,
  tenant_id: TenantId,
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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
  const sql = `update wxwork_wxw_msg set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 根据 id 修改企微消息
 * @param {WxwMsgId} id
 * @param {WxwMsgInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxwMsgId>}
 */
export async function updateById(
  id: WxwMsgId,
  input: WxwMsgInput,
  options?: {
    debug?: boolean;
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxwMsgId> {
  
  const table = "wxwork_wxw_msg";
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
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("企微消息"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("企微消息"));
  }
  
  const args = new QueryArgs();
  let sql = `update wxwork_wxw_msg set `;
  let updateFldNum = 0;
  if (input.wxw_app_id != null) {
    if (input.wxw_app_id != oldModel.wxw_app_id) {
      sql += `wxw_app_id = ${ args.push(input.wxw_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.errcode != null) {
    if (input.errcode != oldModel.errcode) {
      sql += `errcode=${ args.push(input.errcode) },`;
      updateFldNum++;
    }
  }
  if (input.touser != null) {
    if (input.touser != oldModel.touser) {
      sql += `touser=${ args.push(input.touser) },`;
      updateFldNum++;
    }
  }
  if (input.title != null) {
    if (input.title != oldModel.title) {
      sql += `title=${ args.push(input.title) },`;
      updateFldNum++;
    }
  }
  if (input.description != null) {
    if (input.description != oldModel.description) {
      sql += `description=${ args.push(input.description) },`;
      updateFldNum++;
    }
  }
  if (input.url != null) {
    if (input.url != oldModel.url) {
      sql += `url=${ args.push(input.url) },`;
      updateFldNum++;
    }
  }
  if (input.btntxt != null) {
    if (input.btntxt != oldModel.btntxt) {
      sql += `btntxt=${ args.push(input.btntxt) },`;
      updateFldNum++;
    }
  }
  if (input.errmsg != null) {
    if (input.errmsg != oldModel.errmsg) {
      sql += `errmsg=${ args.push(input.errmsg) },`;
      updateFldNum++;
    }
  }
  if (input.msgid != null) {
    if (input.msgid != oldModel.msgid) {
      sql += `msgid=${ args.push(input.msgid) },`;
      updateFldNum++;
    }
  }
  
  if (updateFldNum > 0) {
    if (input.update_usr_id == null) {
      const authModel = await getAuthModel();
      if (authModel?.id != null) {
        sql += `update_usr_id=${ args.push(authModel.id) },`;
      }
    } else if (input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
    }
    if (input.update_time) {
      sql += `update_time = ${ args.push(input.update_time) }`;
    } else {
      sql += `update_time = ${ args.push(reqDate()) }`;
    }
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await execute(sql, args);
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除企微消息
 * @param {WxwMsgId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwMsgId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id);
    if (!oldModel) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `update wxwork_wxw_msg set is_deleted=1,delete_time=${ args.push(reqDate()) } where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

/**
 * 根据 ids 还原企微消息
 * @param {WxwMsgId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwMsgId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxwMsgId = ids[i];
    const args = new QueryArgs();
    const sql = `update wxwork_wxw_msg set is_deleted = 0 where id = ${ args.push(id) } limit 1`;
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
      } as WxwMsgInput;
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("企微消息"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除企微消息
 * @param {WxwMsgId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwMsgId[],
  options?: {
    debug?: boolean;
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `select * from wxwork_wxw_msg where id = ${ args.push(id) }`;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `delete from wxwork_wxw_msg where id = ${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}