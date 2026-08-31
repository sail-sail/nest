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

import { ServiceException } from "/lib/exceptions/service.exception.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {

  getAuthModel,
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
  findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findOneOrg,
} from "/gen/base/org/org.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  getPagePathMessage,
  getTableNameMessage,
} from "./message.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<MessageSearch>,
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
  if (isNotEmpty(search?.keyword)) {
    whereQuery += " and (";
    whereQuery += ` t.title like ${ args.push("%" + sqlLike(search?.keyword) + "%") }`;
    whereQuery += " or";
    whereQuery += ` t.content like ${ args.push("%" + sqlLike(search?.keyword) + "%") }`;
    whereQuery += ")";
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.category != null) {
    whereQuery += ` and t.category in (${ args.push(search.category) })`;
  }
  if (search?.channel != null) {
    whereQuery += ` and t.channel in (${ args.push(search.channel) })`;
  }
  if (search?.title != null) {
    whereQuery += ` and t.title=${ args.push(search.title) }`;
  }
  if (isNotEmpty(search?.title_like)) {
    whereQuery += ` and t.title like ${ args.push("%" + sqlLike(search?.title_like) + "%") }`;
  }
  if (search?.content != null) {
    whereQuery += ` and t.content=${ args.push(search.content) }`;
  }
  if (isNotEmpty(search?.content_like)) {
    whereQuery += ` and t.content like ${ args.push("%" + sqlLike(search?.content_like) + "%") }`;
  }
  if (search?.route_path != null) {
    whereQuery += ` and t.route_path=${ args.push(search.route_path) }`;
  }
  if (isNotEmpty(search?.route_path_like)) {
    whereQuery += ` and t.route_path like ${ args.push("%" + sqlLike(search?.route_path_like) + "%") }`;
  }
  if (search?.route_query != null) {
    whereQuery += ` and t.route_query=${ args.push(search.route_query) }`;
  }
  if (isNotEmpty(search?.route_query_like)) {
    whereQuery += ` and t.route_query like ${ args.push("%" + sqlLike(search?.route_query_like) + "%") }`;
  }
  if (search?.sender_usr_id != null) {
    whereQuery += ` and t.sender_usr_id in (${ args.push(search.sender_usr_id) })`;
  }
  if (search?.sender_usr_id_is_null) {
    whereQuery += ` and t.sender_usr_id is null`;
  }
  if (search?.sender_usr_id_lbl != null) {
    whereQuery += ` and t.sender_usr_id_lbl in (${ args.push(search.sender_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.sender_usr_id_lbl_like)) {
    whereQuery += ` and t.sender_usr_id_lbl like ${ args.push("%" + sqlLike(search.sender_usr_id_lbl_like) + "%") }`;
  }
  if (search?.is_sys_msg != null) {
    whereQuery += ` and t.is_sys_msg in (${ args.push(search.is_sys_msg) })`;
  }
  if (search?.is_pinned != null) {
    whereQuery += ` and t.is_pinned in (${ args.push(search.is_pinned) })`;
  }
  if (search?.org_id != null) {
    whereQuery += ` and t.org_id in (${ args.push(search.org_id) })`;
  }
  if (search?.org_id_is_null) {
    whereQuery += ` and t.org_id is null`;
  }
  if (search?.org_id_lbl != null) {
    whereQuery += ` and t.org_id_lbl in (${ args.push(search.org_id_lbl) })`;
  }
  if (isNotEmpty(search?.org_id_lbl_like)) {
    whereQuery += ` and t.org_id_lbl like ${ args.push("%" + sqlLike(search.org_id_lbl_like) + "%") }`;
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
  search?: Readonly<MessageSearch>,
  options?: {
  },
) {
  let fromQuery = `base_message t`;
  return fromQuery;
}

// MARK: findCountMessage
/** 根据条件查找消息总数 */
export async function findCountMessage(
  search?: Readonly<MessageSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameMessage();
  const method = "findCountMessage";
  
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
  // 分类
  if (search && search.category != null) {
    const len = search.category.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.category.length > ${ ids_limit }`);
    }
  }
  // 发送通道
  if (search && search.channel != null) {
    const len = search.channel.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.channel.length > ${ ids_limit }`);
    }
  }
  // 发送人
  if (search && search.sender_usr_id != null) {
    const len = search.sender_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.sender_usr_id.length > ${ ids_limit }`);
    }
  }
  // 系统消息
  if (search && search.is_sys_msg != null) {
    const len = search.is_sys_msg.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_sys_msg.length > ${ ids_limit }`);
    }
  }
  // 置顶
  if (search && search.is_pinned != null) {
    const len = search.is_pinned.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_pinned.length > ${ ids_limit }`);
    }
  }
  // 所属组织
  if (search && search.org_id != null) {
    const len = search.org_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.org_id.length > ${ ids_limit }`);
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

// MARK: findAllMessage
/** 根据搜索条件和分页查找消息列表 */
export async function findAllMessage(
  search?: Readonly<MessageSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<MessageModel[]> {
  
  const table = getTableNameMessage();
  const method = "findAllMessage";
  
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
  // 分类
  if (search && search.category != null) {
    const len = search.category.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.category.length > ${ ids_limit }`);
    }
  }
  // 发送通道
  if (search && search.channel != null) {
    const len = search.channel.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.channel.length > ${ ids_limit }`);
    }
  }
  // 发送人
  if (search && search.sender_usr_id != null) {
    const len = search.sender_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.sender_usr_id.length > ${ ids_limit }`);
    }
  }
  // 系统消息
  if (search && search.is_sys_msg != null) {
    const len = search.is_sys_msg.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_sys_msg.length > ${ ids_limit }`);
    }
  }
  // 置顶
  if (search && search.is_pinned != null) {
    const len = search.is_pinned.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_pinned.length > ${ ids_limit }`);
    }
  }
  // 所属组织
  if (search && search.org_id != null) {
    const len = search.org_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.org_id.length > ${ ids_limit }`);
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
  
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<MessageModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  if (page?.isResultLimit !== false) {
    let find_all_result_limit = Number(getParsedEnv("server_find_all_result_limit")) || 1000;
    const len = result.length;
    if (len > find_all_result_limit) {
      throw new Error(`结果集过大, 超过 ${ find_all_result_limit }`);
    }
  }
  
  const [
    categoryDict, // 分类
    channelDict, // 发送通道
    is_sys_msgDict, // 系统消息
    is_pinnedDict, // 置顶
  ] = await getDict([
    "message_category",
    "message_channel",
    "yes_no",
    "yes_no",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 分类
    let category_lbl = model.category as string;
    if (!isEmpty(model.category)) {
      const dictItem = categoryDict.find((dictItem) => dictItem.val === model.category);
      if (dictItem) {
        category_lbl = dictItem.lbl;
      }
    }
    model.category_lbl = category_lbl || "";
    
    // 发送通道
    let channel_lbl = model.channel as string;
    if (!isEmpty(model.channel)) {
      const dictItem = channelDict.find((dictItem) => dictItem.val === model.channel);
      if (dictItem) {
        channel_lbl = dictItem.lbl;
      }
    }
    model.channel_lbl = channel_lbl || "";
    
    // 系统消息
    let is_sys_msg_lbl = model.is_sys_msg?.toString() || "";
    if (model.is_sys_msg != null) {
      const dictItem = is_sys_msgDict.find((dictItem) => dictItem.val === String(model.is_sys_msg));
      if (dictItem) {
        is_sys_msg_lbl = dictItem.lbl;
      }
    }
    model.is_sys_msg_lbl = is_sys_msg_lbl || "";
    
    // 置顶
    let is_pinned_lbl = model.is_pinned?.toString() || "";
    if (model.is_pinned != null) {
      const dictItem = is_pinnedDict.find((dictItem) => dictItem.val === String(model.is_pinned));
      if (dictItem) {
        is_pinned_lbl = dictItem.lbl;
      }
    }
    model.is_pinned_lbl = is_pinned_lbl || "";
    
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

// MARK: setIdByLblMessage
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblMessage(
  input: MessageInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    categoryDict, // 分类
    channelDict, // 发送通道
    is_sys_msgDict, // 系统消息
    is_pinnedDict, // 置顶
  ] = await getDict([
    "message_category",
    "message_channel",
    "yes_no",
    "yes_no",
  ]);
  
  // 分类
  if (isNotEmpty(input.category_lbl) && input.category == null) {
    const val = categoryDict.find((itemTmp) => itemTmp.lbl === input.category_lbl)?.val;
    if (val != null) {
      input.category = val;
    }
  } else if (isEmpty(input.category_lbl) && input.category != null) {
    const lbl = categoryDict.find((itemTmp) => itemTmp.val === input.category)?.lbl || "";
    input.category_lbl = lbl;
  }
  
  // 发送通道
  if (isNotEmpty(input.channel_lbl) && input.channel == null) {
    const val = channelDict.find((itemTmp) => itemTmp.lbl === input.channel_lbl)?.val;
    if (val != null) {
      input.channel = val;
    }
  } else if (isEmpty(input.channel_lbl) && input.channel != null) {
    const lbl = channelDict.find((itemTmp) => itemTmp.val === input.channel)?.lbl || "";
    input.channel_lbl = lbl;
  }
  
  // 发送人
  if (isNotEmpty(input.sender_usr_id_lbl) && input.sender_usr_id == null) {
    input.sender_usr_id_lbl = String(input.sender_usr_id_lbl).trim();
    const usrModel = await findOneUsr(
      {
        lbl: input.sender_usr_id_lbl,
      },
      undefined,
      options,
    );
    if (usrModel) {
      input.sender_usr_id = usrModel.id;
    }
  } else if (isEmpty(input.sender_usr_id_lbl) && input.sender_usr_id != null) {
    const usr_model = await findOneUsr(
      {
        id: input.sender_usr_id,
      },
      undefined,
      options,
    );
    if (usr_model) {
      input.sender_usr_id_lbl = usr_model.lbl;
    }
  }
  
  // 系统消息
  if (isNotEmpty(input.is_sys_msg_lbl) && input.is_sys_msg == null) {
    const val = is_sys_msgDict.find((itemTmp) => itemTmp.lbl === input.is_sys_msg_lbl)?.val;
    if (val != null) {
      input.is_sys_msg = Number(val);
    }
  } else if (isEmpty(input.is_sys_msg_lbl) && input.is_sys_msg != null) {
    const lbl = is_sys_msgDict.find((itemTmp) => itemTmp.val === String(input.is_sys_msg))?.lbl || "";
    input.is_sys_msg_lbl = lbl;
  }
  
  // 置顶
  if (isNotEmpty(input.is_pinned_lbl) && input.is_pinned == null) {
    const val = is_pinnedDict.find((itemTmp) => itemTmp.lbl === input.is_pinned_lbl)?.val;
    if (val != null) {
      input.is_pinned = Number(val);
    }
  } else if (isEmpty(input.is_pinned_lbl) && input.is_pinned != null) {
    const lbl = is_pinnedDict.find((itemTmp) => itemTmp.val === String(input.is_pinned))?.lbl || "";
    input.is_pinned_lbl = lbl;
  }
  
  // 所属组织
  if (isNotEmpty(input.org_id_lbl) && input.org_id == null) {
    input.org_id_lbl = String(input.org_id_lbl).trim();
    const orgModel = await findOneOrg(
      {
        lbl: input.org_id_lbl,
      },
      undefined,
      options,
    );
    if (orgModel) {
      input.org_id = orgModel.id;
    }
  } else if (isEmpty(input.org_id_lbl) && input.org_id != null) {
    const org_model = await findOneOrg(
      {
        id: input.org_id,
      },
      undefined,
      options,
    );
    if (org_model) {
      input.org_id_lbl = org_model.lbl;
    }
  }
}

// MARK: getFieldCommentsMessage
/** 获取消息字段注释 */
export async function getFieldCommentsMessage(): Promise<MessageFieldComment> {
  const field_comments: MessageFieldComment = {
    id: "ID",
    category: "分类",
    category_lbl: "分类",
    channel: "发送通道",
    channel_lbl: "发送通道",
    title: "标题",
    content: "内容",
    route_path: "跳转路由",
    route_query: "跳转参数",
    sender_usr_id: "发送人",
    sender_usr_id_lbl: "发送人",
    is_sys_msg: "系统消息",
    is_sys_msg_lbl: "系统消息",
    is_pinned: "置顶",
    is_pinned_lbl: "置顶",
    org_id: "所属组织",
    org_id_lbl: "所属组织",
    create_usr_id: "创建人",
    create_usr_id_lbl: "创建人",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
    update_usr_id: "更新人",
    update_usr_id_lbl: "更新人",
    update_time: "更新时间",
    update_time_lbl: "更新时间",
  };
  
  return field_comments;
}

// MARK: findByUniqueMessage
/** 通过唯一约束获得消息列表 */
export async function findByUniqueMessage(
  search0: Readonly<MessageInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel[]> {
  
  const table = getTableNameMessage();
  const method = "findByUniqueMessage";
  
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
    const model = await findOneMessage(
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
  const models: MessageModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueMessage(
  oldModel: Readonly<MessageModel>,
  input: Readonly<MessageInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueMessage
/** 通过唯一约束检查 消息 是否已经存在 */
export async function checkByUniqueMessage(
  input: Readonly<MessageInput>,
  oldModel: Readonly<MessageModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueMessage(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("消息 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: MessageId = await updateByIdMessage(
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

// MARK: findOneMessage
/** 根据条件查找第一消息 */
export async function findOneMessage(
  search?: Readonly<MessageSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel | undefined> {
  
  const table = getTableNameMessage();
  const method = "findOneMessage";
  
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
  
  const message_models = await findAllMessage(
    search,
    page,
    sort,
    options,
  );
  
  const message_model = message_models[0];
  
  return message_model;
}

// MARK: findOneOkMessage
/** 根据条件查找第一消息, 如果不存在则抛错 */
export async function findOneOkMessage(
  search?: Readonly<MessageSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel> {
  
  const table = getTableNameMessage();
  const method = "findOneOkMessage";
  
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
  
  const message_models = await findAllMessage(
    search,
    page,
    sort,
    options,
  );
  
  const message_model = message_models[0];
  
  if (!message_model) {
    const err_msg = "此 消息 已被删除";
    throw new Error(err_msg);
  }
  
  return message_model;
}

// MARK: findByIdMessage
/** 根据 id 查找消息 */
export async function findByIdMessage(
  id: MessageId,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel | undefined> {
  
  const table = getTableNameMessage();
  const method = "findByIdMessage";
  
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
  
  const message_model = await findOneMessage(
    {
      id,
    },
    undefined,
    options,
  );
  
  return message_model;
}

// MARK: findByIdOkMessage
/** 根据 id 查找消息, 如果不存在则抛错 */
export async function findByIdOkMessage(
  id: MessageId,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel> {
  
  const table = getTableNameMessage();
  const method = "findByIdOkMessage";
  
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
  
  const message_model = await findByIdMessage(
    id,
    options,
  );
  
  if (!message_model) {
    const err_msg = "此 消息 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return message_model;
}

// MARK: findByIdsMessage
/** 根据 ids 查找消息 */
export async function findByIdsMessage(
  ids: MessageId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel[]> {
  
  const table = getTableNameMessage();
  const method = "findByIdsMessage";
  
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
  
  const models = await findAllMessage(
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

// MARK: findByIdsOkMessage
/** 根据 ids 查找消息, 出现查询不到的 id 则报错 */
export async function findByIdsOkMessage(
  ids: MessageId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageModel[]> {
  
  const table = getTableNameMessage();
  const method = "findByIdsOkMessage";
  
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
  
  const models = await findByIdsMessage(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 消息 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 消息 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existMessage
/** 根据搜索条件判断消息是否存在 */
export async function existMessage(
  search?: Readonly<MessageSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameMessage();
  const method = "existMessage";
  
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
  const model = await findOneMessage(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdMessage
/** 根据id判断消息是否存在 */
export async function existByIdMessage(
  id?: MessageId | null,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameMessage();
  const method = "existByIdMessage";
  
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
  const sql = `select 1 e from base_message t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionMessage
/** 校验消息是否存在 */
export async function validateOptionMessage(
  model?: MessageModel,
) {
  if (!model) {
    const err_msg = "消息 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateMessage
/** 消息增加和修改时校验输入 */
export async function validateMessage(
  input: Readonly<MessageInput>,
) {
  const fieldComments = await getFieldCommentsMessage();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 分类
  await validators.chars_max_length(
    input.category,
    20,
    fieldComments.category,
  );
  
  // 发送通道
  await validators.chars_max_length(
    input.channel,
    20,
    fieldComments.channel,
  );
  
  // 标题
  await validators.chars_max_length(
    input.title,
    100,
    fieldComments.title,
  );
  
  // 内容
  await validators.chars_max_length(
    input.content,
    2000,
    fieldComments.content,
  );
  
  // 跳转路由
  await validators.chars_max_length(
    input.route_path,
    200,
    fieldComments.route_path,
  );
  
  // 跳转参数
  await validators.chars_max_length(
    input.route_query,
    1000,
    fieldComments.route_query,
  );
  
  // 发送人
  await validators.chars_max_length(
    input.sender_usr_id,
    22,
    fieldComments.sender_usr_id,
  );
  
  // 所属组织
  await validators.chars_max_length(
    input.org_id,
    22,
    fieldComments.org_id,
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

// MARK: createReturnMessage
/** 创建 消息 并返回 */
export async function createReturnMessage(
  input: Readonly<MessageInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageModel> {
  
  const table = getTableNameMessage();
  const method = "createReturnMessage";
  
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
  
  const model = await validateOptionMessage(
    await findOneMessage(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createMessage
/** 创建 消息 */
export async function createMessage(
  input: Readonly<MessageInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageId> {
  
  const table = getTableNameMessage();
  const method = "createMessage";
  
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

// MARK: createsReturnMessage
/** 批量创建 消息 并返回 */
export async function createsReturnMessage(
  inputs: MessageInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageModel[]> {
  
  const table = getTableNameMessage();
  const method = "createsReturnMessage";
  
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
  
  const models = await findByIdsMessage(ids, options);
  
  return models;
}

// MARK: createsMessage
/** 批量创建 消息 */
export async function createsMessage(
  inputs: MessageInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageId[]> {
  
  const table = getTableNameMessage();
  const method = "createsMessage";
  
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
  inputs: MessageInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }

  const authModel = await getAuthModel();
  const auth_org_id = authModel?.org_id;
  for (const input of inputs) {
    if (!input.org_id || input.org_id as unknown as string === "-") {
      input.org_id = auth_org_id;
    }
  }
  
  const table = getTableNameMessage();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: MessageId[] = [ ];
  const inputs2: MessageInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }

    // 发送人
    if (isEmpty(input.sender_usr_id_lbl) && isNotEmpty(input.sender_usr_id)) {
      const usr_model = await findOneUsr(
        {
          id: input.sender_usr_id,
        },
        undefined,
        {
          is_debug: false,
        },
      );
      if (usr_model) {
        input.sender_usr_id_lbl = usr_model.lbl;
      }
    }

    // 所属组织
    if (isEmpty(input.org_id_lbl) && isNotEmpty(input.org_id)) {
      const org_model = await findOneOrg(
        {
          id: input.org_id,
        },
        undefined,
        {
          is_debug: false,
        },
      );
      if (org_model) {
        input.org_id_lbl = org_model.lbl;
      }
    }
    
    const oldModels = await findByUniqueMessage(input, options);
    if (oldModels.length > 0) {
      let id: MessageId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueMessage(
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
    
    const id = shortUuidV4<MessageId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into base_message(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,category,channel,title,content,route_path,route_query,sender_usr_id_lbl,sender_usr_id,is_sys_msg,is_pinned,org_id_lbl,org_id)values";
  
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
      if (input.category != null) {
        sql += `,${ args.push(input.category) }`;
      } else {
        sql += ",default";
      }
      if (input.channel != null) {
        sql += `,${ args.push(input.channel) }`;
      } else {
        sql += ",default";
      }
      if (input.title != null) {
        sql += `,${ args.push(input.title) }`;
      } else {
        sql += ",default";
      }
      if (input.content != null) {
        sql += `,${ args.push(input.content) }`;
      } else {
        sql += ",default";
      }
      if (input.route_path != null) {
        sql += `,${ args.push(input.route_path) }`;
      } else {
        sql += ",default";
      }
      if (input.route_query != null) {
        sql += `,${ args.push(input.route_query) }`;
      } else {
        sql += ",default";
      }
      if (input.sender_usr_id_lbl != null) {
        sql += `,${ args.push(input.sender_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.sender_usr_id != null) {
        sql += `,${ args.push(input.sender_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.is_sys_msg != null) {
        sql += `,${ args.push(input.is_sys_msg) }`;
      } else {
        sql += ",default";
      }
      if (input.is_pinned != null) {
        sql += `,${ args.push(input.is_pinned) }`;
      } else {
        sql += ",default";
      }
      if (input.org_id_lbl != null) {
        sql += `,${ args.push(input.org_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.org_id != null) {
        sql += `,${ args.push(input.org_id) }`;
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

// MARK: updateTenantByIdMessage
/** 消息 根据 id 修改 租户id */
export async function updateTenantByIdMessage(
  id: MessageId,
  tenant_id: TenantId,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessage();
  const method = "updateTenantByIdMessage";
  
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
  const sql = `update base_message set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: syncUsrLblByUsrIdMessage
/** 根据 usr_id 同步创建人/更新人/删除人标签 */
export async function syncUsrLblByUsrIdMessage(
  usr_id: UsrId,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessage();
  const method = "syncUsrLblByUsrIdMessage";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (usr_id) {
      msg += ` usr_id:${ usr_id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
  }
  
  if (!usr_id) {
    return 0;
  }
  
  const findOptions = {
    ...(options ?? { }),
    is_debug: false,
  };
  const usr_model = await findByIdUsr(usr_id, findOptions);
  if (!usr_model) {
    return 0;
  }
  
  const usr_lbl = usr_model.lbl;
  const sqlFields = [ ];
  const whereQuerys = [ ];
  const args = new QueryArgs();
  
  sqlFields.push(`create_usr_id_lbl=case when create_usr_id=${ args.push(usr_id) } then ${ args.push(usr_lbl) } else create_usr_id_lbl end`);
  whereQuerys.push(`create_usr_id=${ args.push(usr_id) }`);
  
  sqlFields.push(`update_usr_id_lbl=case when update_usr_id=${ args.push(usr_id) } then ${ args.push(usr_lbl) } else update_usr_id_lbl end`);
  whereQuerys.push(`update_usr_id=${ args.push(usr_id) }`);
  
  sqlFields.push(`delete_usr_id_lbl=case when delete_usr_id=${ args.push(usr_id) } then ${ args.push(usr_lbl) } else delete_usr_id_lbl end`);
  whereQuerys.push(`delete_usr_id=${ args.push(usr_id) }`);
  
  if (sqlFields.length === 0 || whereQuerys.length === 0) {
    return 0;
  }
  
  const sql = `update base_message set ${ sqlFields.join(",") } where ${ whereQuerys.join(" or ") }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  return affectedRows;
}

// MARK: updateByIdMessage
/** 根据 id 修改 消息 */
export async function updateByIdMessage(
  id: MessageId,
  input: MessageInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<MessageId> {
  
  const table = getTableNameMessage();
  const method = "updateByIdMessage";
  
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
    throw new Error("updateByIdMessage: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdMessage: input cannot be null");
  }

  // 发送人
  if (isEmpty(input.sender_usr_id_lbl) && isNotEmpty(input.sender_usr_id)) {
    const usr_model = await findOneUsr(
      {
        id: input.sender_usr_id,
      },
      undefined,
      {
        is_debug: false,
      },
    );
    if (usr_model) {
      input.sender_usr_id_lbl = usr_model.lbl;
    }
  }

  // 所属组织
  if (isEmpty(input.org_id_lbl) && isNotEmpty(input.org_id)) {
    const org_model = await findOneOrg(
      {
        id: input.org_id,
      },
      undefined,
      {
        is_debug: false,
      },
    );
    if (org_model) {
      input.org_id_lbl = org_model.lbl;
    }
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdMessage(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueMessage(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "消息 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdMessage(id, options);
  
  if (!oldModel) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = `update base_message set `;
  let updateFldNum = 0;
  if (input.category != null) {
    if (input.category != oldModel.category) {
      sql += `category=${ args.push(input.category) },`;
      updateFldNum++;
    }
  }
  if (input.channel != null) {
    if (input.channel != oldModel.channel) {
      sql += `channel=${ args.push(input.channel) },`;
      updateFldNum++;
    }
  }
  if (input.title != null) {
    if (input.title != oldModel.title) {
      sql += `title=${ args.push(input.title) },`;
      updateFldNum++;
    }
  }
  if (input.content != null) {
    if (input.content != oldModel.content) {
      sql += `content=${ args.push(input.content) },`;
      updateFldNum++;
    }
  }
  if (input.route_path != null) {
    if (input.route_path != oldModel.route_path) {
      sql += `route_path=${ args.push(input.route_path) },`;
      updateFldNum++;
    }
  }
  if (input.route_query != null) {
    if (input.route_query != oldModel.route_query) {
      sql += `route_query=${ args.push(input.route_query) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.sender_usr_id_lbl)) {
    sql += `sender_usr_id_lbl=?,`;
    args.push(input.sender_usr_id_lbl);
    updateFldNum++;
  }
  if (input.sender_usr_id != null) {
    if (input.sender_usr_id != oldModel.sender_usr_id) {
      sql += `sender_usr_id=${ args.push(input.sender_usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.is_sys_msg != null) {
    if (input.is_sys_msg != oldModel.is_sys_msg) {
      sql += `is_sys_msg=${ args.push(input.is_sys_msg) },`;
      updateFldNum++;
    }
  }
  if (input.is_pinned != null) {
    if (input.is_pinned != oldModel.is_pinned) {
      sql += `is_pinned=${ args.push(input.is_pinned) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.org_id_lbl)) {
    sql += `org_id_lbl=?,`;
    args.push(input.org_id_lbl);
    updateFldNum++;
  }
  if (input.org_id != null) {
    if (input.org_id != oldModel.org_id) {
      sql += `org_id=${ args.push(input.org_id) },`;
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

// MARK: updateByIdMessage
/** 根据 id 更新消息, 并返回更新后的数据 */
export async function updateByIdReturnMessage(
  id: MessageId,
  input: MessageInput,
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<MessageModel> {
  
  await updateByIdMessage(
    id,
    input,
    options,
  );
  
  const model = await findByIdMessage(
    id,
    options,
  );
  
  if (!model) {
    throw new Error(`消息 不存在`);
  }
  
  return model;
}

// MARK: deleteByIdsMessage
/** 根据 ids 删除 消息 */
export async function deleteByIdsMessage(
  ids: MessageId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessage();
  const method = "deleteByIdsMessage";
  
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
  
  const oldModels = await findByIdsOkMessage(ids, options);
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = oldModels[i];
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update base_message set is_deleted=1`;
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
  }
  
  return affectedRows;
}

// MARK: revertByIdsMessage
/** 根据 ids 还原 消息 */
export async function revertByIdsMessage(
  ids: MessageId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessage();
  const method = "revertByIdsMessage";
  
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
    let old_model = await findOneMessage(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdMessage(
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
      } as MessageInput;
      const models = await findByUniqueMessage(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "消息 重复";
      }
    }
    const args = new QueryArgs();
    const sql = `update base_message set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsMessage
/** 根据 ids 彻底删除 消息 */
export async function forceDeleteByIdsMessage(
  ids: MessageId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessage();
  const method = "forceDeleteByIdsMessage";
  
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
    const oldModel = await findOneMessage(
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
    const sql = `delete from base_message where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
