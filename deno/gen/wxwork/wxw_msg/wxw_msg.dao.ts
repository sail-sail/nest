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

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

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
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./wxw_msg.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxwMsgSearch>,
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
  if (search?.wxw_app_id != null) {
    whereQuery += ` and t.wxw_app_id in (${ args.push(search.wxw_app_id) })`;
  }
  if (search?.wxw_app_id_is_null) {
    whereQuery += ` and t.wxw_app_id is null`;
  }
  if (search?.wxw_app_id_lbl != null) {
    whereQuery += ` and wxw_app_id_lbl.lbl in (${ args.push(search.wxw_app_id_lbl) })`;
  }
  if (isNotEmpty(search?.wxw_app_id_lbl_like)) {
    whereQuery += ` and wxw_app_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.wxw_app_id_lbl_like) + "%") }`;
  }
  if (search?.errcode != null) {
    whereQuery += ` and t.errcode in (${ args.push(search.errcode) })`;
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
  search?: Readonly<WxwMsgSearch>,
  options?: {
  },
) {
  let fromQuery = `wxwork_wxw_msg t
  left join wxwork_wxw_app wxw_app_id_lbl on wxw_app_id_lbl.id=t.wxw_app_id`;
  return fromQuery;
}

// MARK: findCountWxwMsg
/** 根据条件查找企微消息总数 */
export async function findCountWxwMsg(
  search?: Readonly<WxwMsgSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_msg";
  const method = "findCountWxwMsg";
  
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
  // 企微应用
  if (search && search.wxw_app_id != null) {
    const len = search.wxw_app_id.length;
    if (len === 0) {
      return 0;
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
      return 0;
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

// MARK: findAllWxwMsg
/** 根据搜索条件和分页查找企微消息列表 */
export async function findAllWxwMsg(
  search?: Readonly<WxwMsgSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxwMsgModel[]> {
  
  const table = "wxwork_wxw_msg";
  const method = "findAllWxwMsg";
  
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
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxwMsgModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
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

// MARK: setIdByLblWxwMsg
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblWxwMsg(
  input: WxwMsgInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    errcodeDict, // 发送状态
  ] = await getDict([
    "wxw_msg_errcode",
  ]);
  
  // 企微应用
  if (isNotEmpty(input.wxw_app_id_lbl) && input.wxw_app_id == null) {
    input.wxw_app_id_lbl = String(input.wxw_app_id_lbl).trim();
    const wxw_appModel = await findOneWxwApp(
      {
        lbl: input.wxw_app_id_lbl,
      },
      undefined,
      options,
    );
    if (wxw_appModel) {
      input.wxw_app_id = wxw_appModel.id;
    }
  } else if (isEmpty(input.wxw_app_id_lbl) && input.wxw_app_id != null) {
    const wxw_app_model = await findOneWxwApp(
      {
        id: input.wxw_app_id,
      },
      undefined,
      options,
    );
    if (wxw_app_model) {
      input.wxw_app_id_lbl = wxw_app_model.lbl;
    }
  }
  
  // 发送状态
  if (isNotEmpty(input.errcode_lbl) && input.errcode == null) {
    const val = errcodeDict.find((itemTmp) => itemTmp.lbl === input.errcode_lbl)?.val;
    if (val != null) {
      input.errcode = val;
    }
  } else if (isEmpty(input.errcode_lbl) && input.errcode != null) {
    const lbl = errcodeDict.find((itemTmp) => itemTmp.val === input.errcode)?.lbl || "";
    input.errcode_lbl = lbl;
  }
}

// MARK: getFieldCommentsWxwMsg
/** 获取企微消息字段注释 */
export async function getFieldCommentsWxwMsg(): Promise<WxwMsgFieldComment> {
  const fieldComments: WxwMsgFieldComment = {
    id: "ID",
    wxw_app_id: "企微应用",
    wxw_app_id_lbl: "企微应用",
    errcode: "发送状态",
    errcode_lbl: "发送状态",
    touser: "成员ID",
    title: "标题",
    description: "描述",
    btntxt: "按钮文字",
    create_time: "发送时间",
    create_time_lbl: "发送时间",
    errmsg: "错误信息",
  };
  return fieldComments;
}

// MARK: findByUniqueWxwMsg
/** 通过唯一约束获得企微消息列表 */
export async function findByUniqueWxwMsg(
  search0: Readonly<WxwMsgInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel[]> {
  
  const table = "wxwork_wxw_msg";
  const method = "findByUniqueWxwMsg";
  
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
    const model = await findOneWxwMsg(
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
  const models: WxwMsgModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueWxwMsg(
  oldModel: Readonly<WxwMsgModel>,
  input: Readonly<WxwMsgInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueWxwMsg
/** 通过唯一约束检查 企微消息 是否已经存在 */
export async function checkByUniqueWxwMsg(
  input: Readonly<WxwMsgInput>,
  oldModel: Readonly<WxwMsgModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueWxwMsg(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 企微消息 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwMsgId = await updateByIdWxwMsg(
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

// MARK: findOneWxwMsg
/** 根据条件查找第一企微消息 */
export async function findOneWxwMsg(
  search?: Readonly<WxwMsgSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel | undefined> {
  
  const table = "wxwork_wxw_msg";
  const method = "findOneWxwMsg";
  
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
  
  const wxw_msg_models = await findAllWxwMsg(
    search,
    page,
    sort,
    options,
  );
  
  const wxw_msg_model = wxw_msg_models[0];
  
  return wxw_msg_model;
}

// MARK: findOneOkWxwMsg
/** 根据条件查找第一企微消息, 如果不存在则抛错 */
export async function findOneOkWxwMsg(
  search?: Readonly<WxwMsgSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel> {
  
  const table = "wxwork_wxw_msg";
  const method = "findOneOkWxwMsg";
  
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
  
  const wxw_msg_models = await findAllWxwMsg(
    search,
    page,
    sort,
    options,
  );
  
  const wxw_msg_model = wxw_msg_models[0];
  
  if (!wxw_msg_model) {
    const err_msg = "此 企微消息 已被删除";
    throw new Error(err_msg);
  }
  
  return wxw_msg_model;
}

// MARK: findByIdWxwMsg
/** 根据 id 查找企微消息 */
export async function findByIdWxwMsg(
  id: WxwMsgId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel | undefined> {
  
  const table = "wxwork_wxw_msg";
  const method = "findByIdWxwMsg";
  
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
  
  const wxw_msg_model = await findOneWxwMsg(
    {
      id,
    },
    undefined,
    options,
  );
  
  return wxw_msg_model;
}

// MARK: findByIdOkWxwMsg
/** 根据 id 查找企微消息, 如果不存在则抛错 */
export async function findByIdOkWxwMsg(
  id: WxwMsgId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel> {
  
  const table = "wxwork_wxw_msg";
  const method = "findByIdOkWxwMsg";
  
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
  
  const wxw_msg_model = await findByIdWxwMsg(
    id,
    options,
  );
  
  if (!wxw_msg_model) {
    const err_msg = "此 企微消息 已被删除";
    throw new Error(err_msg);
  }
  
  return wxw_msg_model;
}

// MARK: findByIdsWxwMsg
/** 根据 ids 查找企微消息 */
export async function findByIdsWxwMsg(
  ids: WxwMsgId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel[]> {
  
  const table = "wxwork_wxw_msg";
  const method = "findByIdsWxwMsg";
  
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
  
  const models = await findAllWxwMsg(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  return models;
}

// MARK: findByIdsOkWxwMsg
/** 根据 ids 查找企微消息, 出现查询不到的 id 则报错 */
export async function findByIdsOkWxwMsg(
  ids: WxwMsgId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwMsgModel[]> {
  
  const table = "wxwork_wxw_msg";
  const method = "findByIdsOkWxwMsg";
  
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
  
  const models = await findByIdsWxwMsg(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 企微消息 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 企微消息 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existWxwMsg
/** 根据搜索条件判断企微消息是否存在 */
export async function existWxwMsg(
  search?: Readonly<WxwMsgSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wxwork_wxw_msg";
  const method = "existWxwMsg";
  
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
  const model = await findOneWxwMsg(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdWxwMsg
/** 根据id判断企微消息是否存在 */
export async function existByIdWxwMsg(
  id?: Readonly<WxwMsgId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wxwork_wxw_msg";
  const method = "existByIdWxwMsg";
  
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
  const sql = `select 1 e from wxwork_wxw_msg t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionWxwMsg
/** 校验企微消息是否存在 */
export async function validateOptionWxwMsg(
  model?: WxwMsgModel,
) {
  if (!model) {
    const err_msg = "企微消息 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateWxwMsg
/** 企微消息增加和修改时校验输入 */
export async function validateWxwMsg(
  input: Readonly<WxwMsgInput>,
) {
  const fieldComments = await getFieldCommentsWxwMsg();
  
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

// MARK: createReturnWxwMsg
/** 创建 企微消息 并返回 */
export async function createReturnWxwMsg(
  input: Readonly<WxwMsgInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwMsgModel> {
  
  const table = "wxwork_wxw_msg";
  const method = "createReturnWxwMsg";
  
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
  
  const model = await validateOptionWxwMsg(
    await findOneWxwMsg(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createWxwMsg
/** 创建 企微消息 */
export async function createWxwMsg(
  input: Readonly<WxwMsgInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwMsgId> {
  
  const table = "wxwork_wxw_msg";
  const method = "createWxwMsg";
  
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

// MARK: createsReturnWxwMsg
/** 批量创建 企微消息 并返回 */
export async function createsReturnWxwMsg(
  inputs: WxwMsgInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwMsgModel[]> {
  
  const table = "wxwork_wxw_msg";
  const method = "createsReturnWxwMsg";
  
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
  
  const models = await findByIdsWxwMsg(ids, options);
  
  return models;
}

// MARK: createsWxwMsg
/** 批量创建 企微消息 */
export async function createsWxwMsg(
  inputs: WxwMsgInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwMsgId[]> {
  
  const table = "wxwork_wxw_msg";
  const method = "createsWxwMsg";
  
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
  inputs: WxwMsgInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwMsgId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wxwork_wxw_msg";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxwMsgId[] = [ ];
  const inputs2: WxwMsgInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueWxwMsg(input, options);
    if (oldModels.length > 0) {
      let id: WxwMsgId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueWxwMsg(
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into wxwork_wxw_msg(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,wxw_app_id,errcode,touser,title,description,url,btntxt,errmsg,msgid)values";
  
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
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  return ids2;
}

// MARK: updateTenantByIdWxwMsg
/** 企微消息 根据 id 修改 租户id */
export async function updateTenantByIdWxwMsg(
  id: WxwMsgId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_msg";
  const method = "updateTenantByIdWxwMsg";
  
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
  const sql = `update wxwork_wxw_msg set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdWxwMsg
/** 根据 id 修改 企微消息 */
export async function updateByIdWxwMsg(
  id: WxwMsgId,
  input: WxwMsgInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxwMsgId> {
  
  const table = "wxwork_wxw_msg";
  const method = "updateByIdWxwMsg";
  
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
    throw new Error("updateByIdWxwMsg: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdWxwMsg: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdWxwMsg(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueWxwMsg(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 企微消息 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdWxwMsg(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 企微消息 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wxwork_wxw_msg set `;
  let updateFldNum = 0;
  if (input.wxw_app_id != null) {
    if (input.wxw_app_id != oldModel.wxw_app_id) {
      sql += `wxw_app_id=${ args.push(input.wxw_app_id) },`;
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
  if (input.create_time != null || input.create_time_save_null) {
    if (input.create_time != oldModel.create_time) {
      sql += `create_time=${ args.push(input.create_time) },`;
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
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsWxwMsg
/** 根据 ids 删除 企微消息 */
export async function deleteByIdsWxwMsg(
  ids: WxwMsgId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_msg";
  const method = "deleteByIdsWxwMsg";
  
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
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdWxwMsg(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wxwork_wxw_msg set is_deleted=1`;
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
  
  return affectedRows;
}

// MARK: revertByIdsWxwMsg
/** 根据 ids 还原 企微消息 */
export async function revertByIdsWxwMsg(
  ids: WxwMsgId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_msg";
  const method = "revertByIdsWxwMsg";
  
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
    let old_model = await findOneWxwMsg(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdWxwMsg(
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
      } as WxwMsgInput;
      const models = await findByUniqueWxwMsg(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 企微消息 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wxwork_wxw_msg set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsWxwMsg
/** 根据 ids 彻底删除 企微消息 */
export async function forceDeleteByIdsWxwMsg(
  ids: WxwMsgId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_msg";
  const method = "forceDeleteByIdsWxwMsg";
  
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
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneWxwMsg(
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
    const sql = `delete from wxwork_wxw_msg where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
