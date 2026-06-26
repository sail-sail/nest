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
  findOneMessage,
} from "/gen/base/message/message.dao.ts";

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
  getPagePathMessageReceiver,
  getTableNameMessageReceiver,
} from "./message_receiver.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<MessageReceiverSearch>,
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
  if (search?.message_id != null) {
    whereQuery += ` and t.message_id in (${ args.push(search.message_id) })`;
  }
  if (search?.message_id_is_null) {
    whereQuery += ` and t.message_id is null`;
  }
  if (search?.message_id_content != null) {
    whereQuery += ` and message_id_lbl.content in (${ args.push(search.message_id_content) })`;
  }
  if (isNotEmpty(search?.message_id_content_like)) {
    whereQuery += ` and message_id_lbl.content like ${ args.push("%" + sqlLike(search?.message_id_content_like) + "%") }`;
  }
  if (search?.receiver_usr_id != null) {
    whereQuery += ` and t.receiver_usr_id in (${ args.push(search.receiver_usr_id) })`;
  }
  if (search?.receiver_usr_id_is_null) {
    whereQuery += ` and t.receiver_usr_id is null`;
  }
  if (search?.receiver_usr_id_lbl != null) {
    whereQuery += ` and t.receiver_usr_id_lbl in (${ args.push(search.receiver_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.receiver_usr_id_lbl_like)) {
    whereQuery += ` and t.receiver_usr_id_lbl like ${ args.push("%" + sqlLike(search.receiver_usr_id_lbl_like) + "%") }`;
  }
  if (search?.is_read != null) {
    whereQuery += ` and t.is_read in (${ args.push(search.is_read) })`;
  }
  if (search?.read_time != null) {
    if (search.read_time[0] != null) {
      whereQuery += ` and t.read_time>=${ args.push(search.read_time[0]) }`;
    }
    if (search.read_time[1] != null) {
      whereQuery += ` and t.read_time<=${ args.push(search.read_time[1]) }`;
    }
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
  search?: Readonly<MessageReceiverSearch>,
  options?: {
  },
) {
  let fromQuery = `base_message_receiver t
  left join base_message message_id_lbl on message_id_lbl.id=t.message_id`;
  return fromQuery;
}

// MARK: findCountMessageReceiver
/** 根据条件查找消息接收人总数 */
export async function findCountMessageReceiver(
  search?: Readonly<MessageReceiverSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = getTableNameMessageReceiver();
  const method = "findCountMessageReceiver";
  
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
  // 消息
  if (search && search.message_id != null) {
    const len = search.message_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.message_id.length > ${ ids_limit }`);
    }
  }
  // 接收人
  if (search && search.receiver_usr_id != null) {
    const len = search.receiver_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.receiver_usr_id.length > ${ ids_limit }`);
    }
  }
  // 已读
  if (search && search.is_read != null) {
    const len = search.is_read.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_read.length > ${ ids_limit }`);
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

// MARK: findAllMessageReceiver
/** 根据搜索条件和分页查找消息接收人列表 */
export async function findAllMessageReceiver(
  search?: Readonly<MessageReceiverSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<MessageReceiverModel[]> {
  
  const table = getTableNameMessageReceiver();
  const method = "findAllMessageReceiver";
  
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
  // 消息
  if (search && search.message_id != null) {
    const len = search.message_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.message_id.length > ${ ids_limit }`);
    }
  }
  // 接收人
  if (search && search.receiver_usr_id != null) {
    const len = search.receiver_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.receiver_usr_id.length > ${ ids_limit }`);
    }
  }
  // 已读
  if (search && search.is_read != null) {
    const len = search.is_read.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.is_read.length > ${ ids_limit }`);
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
      ,message_id_lbl.content message_id_lbl
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
  
  const result = await query<MessageReceiverModel>(
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
    is_readDict, // 已读
  ] = await getDict([
    "yes_no",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 消息
    model.message_id_lbl = model.message_id_lbl || "";
    model.message_id_content = model.message_id_lbl;
    
    // 已读
    let is_read_lbl = model.is_read?.toString() || "";
    if (model.is_read != null) {
      const dictItem = is_readDict.find((dictItem) => dictItem.val === String(model.is_read));
      if (dictItem) {
        is_read_lbl = dictItem.lbl;
      }
    }
    model.is_read_lbl = is_read_lbl || "";
    
    // 阅读时间
    if (model.read_time) {
      const read_time = dayjs(model.read_time);
      if (read_time.isValid()) {
        model.read_time = read_time.format("YYYY-MM-DDTHH:mm:ss");
        model.read_time_lbl = read_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.read_time_lbl = (model.read_time || "").toString();
      }
    } else {
      model.read_time_lbl = "";
    }
    
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

// MARK: setIdByLblMessageReceiver
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblMessageReceiver(
  input: MessageReceiverInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 阅读时间
  if (!input.read_time && input.read_time_lbl) {
    const read_time_lbl = dayjs(input.read_time_lbl);
    if (read_time_lbl.isValid()) {
      input.read_time = read_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsMessageReceiver();
      throw `${ fieldComments.read_time } 日期格式错误`;
    }
  }
  if (input.read_time) {
    const read_time = dayjs(input.read_time);
    if (!read_time.isValid()) {
      const fieldComments = await getFieldCommentsMessageReceiver();
      throw `${ fieldComments.read_time } 日期格式错误`;
    }
    input.read_time = dayjs(input.read_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    is_readDict, // 已读
  ] = await getDict([
    "yes_no",
  ]);
  
  // 消息
  if (isNotEmpty(input.message_id_content) && input.message_id == null) {
    input.message_id_content = String(input.message_id_content).trim();
    const messageModel = await findOneMessage(
      {
        content: input.message_id_content,
      },
      undefined,
      options,
    );
    if (messageModel) {
      input.message_id = messageModel.id;
    }
  } else if (isEmpty(input.message_id_content) && input.message_id != null) {
    const message_model = await findOneMessage(
      {
        id: input.message_id,
      },
      undefined,
      options,
    );
    if (message_model) {
      input.message_id_content = message_model.content;
    }
  }
  
  // 接收人
  if (isNotEmpty(input.receiver_usr_id_lbl) && input.receiver_usr_id == null) {
    input.receiver_usr_id_lbl = String(input.receiver_usr_id_lbl).trim();
    const usrModel = await findOneUsr(
      {
        lbl: input.receiver_usr_id_lbl,
      },
      undefined,
      options,
    );
    if (usrModel) {
      input.receiver_usr_id = usrModel.id;
    }
  } else if (isEmpty(input.receiver_usr_id_lbl) && input.receiver_usr_id != null) {
    const usr_model = await findOneUsr(
      {
        id: input.receiver_usr_id,
      },
      undefined,
      options,
    );
    if (usr_model) {
      input.receiver_usr_id_lbl = usr_model.lbl;
    }
  }
  
  // 已读
  if (isNotEmpty(input.is_read_lbl) && input.is_read == null) {
    const val = is_readDict.find((itemTmp) => itemTmp.lbl === input.is_read_lbl)?.val;
    if (val != null) {
      input.is_read = Number(val);
    }
  } else if (isEmpty(input.is_read_lbl) && input.is_read != null) {
    const lbl = is_readDict.find((itemTmp) => itemTmp.val === String(input.is_read))?.lbl || "";
    input.is_read_lbl = lbl;
  }
  
  // 阅读时间
  if (isNotEmpty(input.read_time_lbl) && input.read_time == null) {
    input.read_time_lbl = String(input.read_time_lbl).trim();
    input.read_time = input.read_time_lbl;
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

// MARK: getFieldCommentsMessageReceiver
/** 获取消息接收人字段注释 */
export async function getFieldCommentsMessageReceiver(): Promise<MessageReceiverFieldComment> {
  const field_comments: MessageReceiverFieldComment = {
    id: "ID",
    message_id: "消息",
    message_id_lbl: "消息",
    receiver_usr_id: "接收人",
    receiver_usr_id_lbl: "接收人",
    is_read: "已读",
    is_read_lbl: "已读",
    read_time: "阅读时间",
    read_time_lbl: "阅读时间",
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

// MARK: findByUniqueMessageReceiver
/** 通过唯一约束获得消息接收人列表 */
export async function findByUniqueMessageReceiver(
  search0: Readonly<MessageReceiverInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel[]> {
  
  const table = getTableNameMessageReceiver();
  const method = "findByUniqueMessageReceiver";
  
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
    const model = await findOneMessageReceiver(
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
  const models: MessageReceiverModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueMessageReceiver(
  oldModel: Readonly<MessageReceiverModel>,
  input: Readonly<MessageReceiverInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueMessageReceiver
/** 通过唯一约束检查 消息接收人 是否已经存在 */
export async function checkByUniqueMessageReceiver(
  input: Readonly<MessageReceiverInput>,
  oldModel: Readonly<MessageReceiverModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueMessageReceiver(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("消息接收人 重复");
    }
    if (uniqueType === UniqueType.Update) {
      const id: MessageReceiverId = await updateByIdMessageReceiver(
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

// MARK: findOneMessageReceiver
/** 根据条件查找第一消息接收人 */
export async function findOneMessageReceiver(
  search?: Readonly<MessageReceiverSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel | undefined> {
  
  const table = getTableNameMessageReceiver();
  const method = "findOneMessageReceiver";
  
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
  
  const message_receiver_models = await findAllMessageReceiver(
    search,
    page,
    sort,
    options,
  );
  
  const message_receiver_model = message_receiver_models[0];
  
  return message_receiver_model;
}

// MARK: findOneOkMessageReceiver
/** 根据条件查找第一消息接收人, 如果不存在则抛错 */
export async function findOneOkMessageReceiver(
  search?: Readonly<MessageReceiverSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel> {
  
  const table = getTableNameMessageReceiver();
  const method = "findOneOkMessageReceiver";
  
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
  
  const message_receiver_models = await findAllMessageReceiver(
    search,
    page,
    sort,
    options,
  );
  
  const message_receiver_model = message_receiver_models[0];
  
  if (!message_receiver_model) {
    const err_msg = "此 消息接收人 已被删除";
    throw new Error(err_msg);
  }
  
  return message_receiver_model;
}

// MARK: findByIdMessageReceiver
/** 根据 id 查找消息接收人 */
export async function findByIdMessageReceiver(
  id: MessageReceiverId,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel | undefined> {
  
  const table = getTableNameMessageReceiver();
  const method = "findByIdMessageReceiver";
  
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
  
  const message_receiver_model = await findOneMessageReceiver(
    {
      id,
    },
    undefined,
    options,
  );
  
  return message_receiver_model;
}

// MARK: findByIdOkMessageReceiver
/** 根据 id 查找消息接收人, 如果不存在则抛错 */
export async function findByIdOkMessageReceiver(
  id: MessageReceiverId,
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel> {
  
  const table = getTableNameMessageReceiver();
  const method = "findByIdOkMessageReceiver";
  
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
  
  const message_receiver_model = await findByIdMessageReceiver(
    id,
    options,
  );
  
  if (!message_receiver_model) {
    const err_msg = "此 消息接收人 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return message_receiver_model;
}

// MARK: findByIdsMessageReceiver
/** 根据 ids 查找消息接收人 */
export async function findByIdsMessageReceiver(
  ids: MessageReceiverId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel[]> {
  
  const table = getTableNameMessageReceiver();
  const method = "findByIdsMessageReceiver";
  
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
  
  const models = await findAllMessageReceiver(
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

// MARK: findByIdsOkMessageReceiver
/** 根据 ids 查找消息接收人, 出现查询不到的 id 则报错 */
export async function findByIdsOkMessageReceiver(
  ids: MessageReceiverId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<MessageReceiverModel[]> {
  
  const table = getTableNameMessageReceiver();
  const method = "findByIdsOkMessageReceiver";
  
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
  
  const models = await findByIdsMessageReceiver(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 消息接收人 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 消息接收人 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existMessageReceiver
/** 根据搜索条件判断消息接收人是否存在 */
export async function existMessageReceiver(
  search?: Readonly<MessageReceiverSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = getTableNameMessageReceiver();
  const method = "existMessageReceiver";
  
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
  const model = await findOneMessageReceiver(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdMessageReceiver
/** 根据id判断消息接收人是否存在 */
export async function existByIdMessageReceiver(
  id?: MessageReceiverId | null,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = getTableNameMessageReceiver();
  const method = "existByIdMessageReceiver";
  
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
  const sql = `select 1 e from base_message_receiver t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionMessageReceiver
/** 校验消息接收人是否存在 */
export async function validateOptionMessageReceiver(
  model?: MessageReceiverModel,
) {
  if (!model) {
    const err_msg = "消息接收人 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateMessageReceiver
/** 消息接收人增加和修改时校验输入 */
export async function validateMessageReceiver(
  input: Readonly<MessageReceiverInput>,
) {
  const fieldComments = await getFieldCommentsMessageReceiver();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 消息
  await validators.chars_max_length(
    input.message_id,
    22,
    fieldComments.message_id,
  );
  
  // 接收人
  await validators.chars_max_length(
    input.receiver_usr_id,
    22,
    fieldComments.receiver_usr_id,
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

// MARK: createReturnMessageReceiver
/** 创建 消息接收人 并返回 */
export async function createReturnMessageReceiver(
  input: Readonly<MessageReceiverInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageReceiverModel> {
  
  const table = getTableNameMessageReceiver();
  const method = "createReturnMessageReceiver";
  
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
  
  const model = await validateOptionMessageReceiver(
    await findOneMessageReceiver(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createMessageReceiver
/** 创建 消息接收人 */
export async function createMessageReceiver(
  input: Readonly<MessageReceiverInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageReceiverId> {
  
  const table = getTableNameMessageReceiver();
  const method = "createMessageReceiver";
  
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

// MARK: createsReturnMessageReceiver
/** 批量创建 消息接收人 并返回 */
export async function createsReturnMessageReceiver(
  inputs: MessageReceiverInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageReceiverModel[]> {
  
  const table = getTableNameMessageReceiver();
  const method = "createsReturnMessageReceiver";
  
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
  
  const models = await findByIdsMessageReceiver(ids, options);
  
  return models;
}

// MARK: createsMessageReceiver
/** 批量创建 消息接收人 */
export async function createsMessageReceiver(
  inputs: MessageReceiverInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageReceiverId[]> {
  
  const table = getTableNameMessageReceiver();
  const method = "createsMessageReceiver";
  
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
  inputs: MessageReceiverInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<MessageReceiverId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = getTableNameMessageReceiver();
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: MessageReceiverId[] = [ ];
  const inputs2: MessageReceiverInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }

    // 接收人
    if (isEmpty(input.receiver_usr_id_lbl) && isNotEmpty(input.receiver_usr_id)) {
      const usr_model = await findOneUsr(
        {
          id: input.receiver_usr_id,
        },
        undefined,
        {
          is_debug: false,
        },
      );
      if (usr_model) {
        input.receiver_usr_id_lbl = usr_model.lbl;
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
    
    const oldModels = await findByUniqueMessageReceiver(input, options);
    if (oldModels.length > 0) {
      let id: MessageReceiverId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueMessageReceiver(
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
    
    const id = shortUuidV4<MessageReceiverId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into base_message_receiver(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,message_id,receiver_usr_id_lbl,receiver_usr_id,is_read,read_time,org_id_lbl,org_id)values";
  
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
      if (input.message_id != null) {
        sql += `,${ args.push(input.message_id) }`;
      } else {
        sql += ",default";
      }
      if (input.receiver_usr_id_lbl != null) {
        sql += `,${ args.push(input.receiver_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.receiver_usr_id != null) {
        sql += `,${ args.push(input.receiver_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.is_read != null) {
        sql += `,${ args.push(input.is_read) }`;
      } else {
        sql += ",default";
      }
      if (input.read_time != null || input.read_time_save_null) {
        sql += `,${ args.push(input.read_time) }`;
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

// MARK: updateTenantByIdMessageReceiver
/** 消息接收人 根据 id 修改 租户id */
export async function updateTenantByIdMessageReceiver(
  id: MessageReceiverId,
  tenant_id: TenantId,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessageReceiver();
  const method = "updateTenantByIdMessageReceiver";
  
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
  const sql = `update base_message_receiver set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: syncUsrLblByUsrIdMessageReceiver
/** 根据 usr_id 同步创建人/更新人/删除人标签 */
export async function syncUsrLblByUsrIdMessageReceiver(
  usr_id: UsrId,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessageReceiver();
  const method = "syncUsrLblByUsrIdMessageReceiver";
  
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
  
  const sql = `update base_message_receiver set ${ sqlFields.join(",") } where ${ whereQuerys.join(" or ") }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  return affectedRows;
}

// MARK: updateByIdMessageReceiver
/** 根据 id 修改 消息接收人 */
export async function updateByIdMessageReceiver(
  id: MessageReceiverId,
  input: MessageReceiverInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<MessageReceiverId> {
  
  const table = getTableNameMessageReceiver();
  const method = "updateByIdMessageReceiver";
  
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
    throw new Error("updateByIdMessageReceiver: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdMessageReceiver: input cannot be null");
  }

  // 接收人
  if (isEmpty(input.receiver_usr_id_lbl) && isNotEmpty(input.receiver_usr_id)) {
    const usr_model = await findOneUsr(
      {
        id: input.receiver_usr_id,
      },
      undefined,
      {
        is_debug: false,
      },
    );
    if (usr_model) {
      input.receiver_usr_id_lbl = usr_model.lbl;
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
    await updateTenantByIdMessageReceiver(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueMessageReceiver(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "消息接收人 重复";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdMessageReceiver(id, options);
  
  if (!oldModel) {
    throw new ServiceException(
      "编辑失败, 此 消息接收人 已被删除",
      "500",
      true,
      true,
    );
  }
  
  const args = new QueryArgs();
  let sql = `update base_message_receiver set `;
  let updateFldNum = 0;
  if (input.message_id != null) {
    if (input.message_id != oldModel.message_id) {
      sql += `message_id=${ args.push(input.message_id) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.receiver_usr_id_lbl)) {
    sql += `receiver_usr_id_lbl=?,`;
    args.push(input.receiver_usr_id_lbl);
    updateFldNum++;
  }
  if (input.receiver_usr_id != null) {
    if (input.receiver_usr_id != oldModel.receiver_usr_id) {
      sql += `receiver_usr_id=${ args.push(input.receiver_usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.is_read != null) {
    if (input.is_read != oldModel.is_read) {
      sql += `is_read=${ args.push(input.is_read) },`;
      updateFldNum++;
    }
  }
  if (input.read_time != null || input.read_time_save_null) {
    if (input.read_time != oldModel.read_time) {
      sql += `read_time=${ args.push(input.read_time) },`;
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

// MARK: updateByIdMessageReceiver
/** 根据 id 更新消息接收人, 并返回更新后的数据 */
export async function updateByIdReturnMessageReceiver(
  id: MessageReceiverId,
  input: MessageReceiverInput,
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<MessageReceiverModel> {
  
  await updateByIdMessageReceiver(
    id,
    input,
    options,
  );
  
  const model = await findByIdMessageReceiver(
    id,
    options,
  );
  
  if (!model) {
    throw new Error(`消息接收人 不存在`);
  }
  
  return model;
}

// MARK: deleteByIdsMessageReceiver
/** 根据 ids 删除 消息接收人 */
export async function deleteByIdsMessageReceiver(
  ids: MessageReceiverId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessageReceiver();
  const method = "deleteByIdsMessageReceiver";
  
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
  
  const oldModels = await findByIdsOkMessageReceiver(ids, options);
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
    let sql = `update base_message_receiver set is_deleted=1`;
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

// MARK: revertByIdsMessageReceiver
/** 根据 ids 还原 消息接收人 */
export async function revertByIdsMessageReceiver(
  ids: MessageReceiverId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessageReceiver();
  const method = "revertByIdsMessageReceiver";
  
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
    let old_model = await findOneMessageReceiver(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdMessageReceiver(
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
      } as MessageReceiverInput;
      const models = await findByUniqueMessageReceiver(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "消息接收人 重复";
      }
    }
    const args = new QueryArgs();
    const sql = `update base_message_receiver set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsMessageReceiver
/** 根据 ids 彻底删除 消息接收人 */
export async function forceDeleteByIdsMessageReceiver(
  ids: MessageReceiverId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = getTableNameMessageReceiver();
  const method = "forceDeleteByIdsMessageReceiver";
  
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
    const oldModel = await findOneMessageReceiver(
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
    const sql = `delete from base_message_receiver where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
