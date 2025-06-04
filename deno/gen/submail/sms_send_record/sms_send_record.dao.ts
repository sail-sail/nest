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
  SmsSendRecordStatus,
} from "/gen/types.ts";

import {
  findOneSmsApp,
} from "/gen/submail/sms_app/sms_app.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./sms_send_record.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<SmsSendRecordSearch>,
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
  if (search?.sms_app_id != null) {
    whereQuery += ` and t.sms_app_id in (${ args.push(search.sms_app_id) })`;
  }
  if (search?.sms_app_id_is_null) {
    whereQuery += ` and t.sms_app_id is null`;
  }
  if (search?.sms_app_id_lbl != null) {
    whereQuery += ` and t.sms_app_id_lbl in (${ args.push(search.sms_app_id_lbl) })`;
  }
  if (isNotEmpty(search?.sms_app_id_lbl_like)) {
    whereQuery += ` and t.sms_app_id_lbl like ${ args.push("%" + sqlLike(search.sms_app_id_lbl_like) + "%") }`;
  }
  if (search?.send_to != null) {
    whereQuery += ` and t.send_to=${ args.push(search.send_to) }`;
  }
  if (isNotEmpty(search?.send_to_like)) {
    whereQuery += ` and t.send_to like ${ args.push("%" + sqlLike(search?.send_to_like) + "%") }`;
  }
  if (search?.content != null) {
    whereQuery += ` and t.content=${ args.push(search.content) }`;
  }
  if (isNotEmpty(search?.content_like)) {
    whereQuery += ` and t.content like ${ args.push("%" + sqlLike(search?.content_like) + "%") }`;
  }
  if (search?.status != null) {
    whereQuery += ` and t.status in (${ args.push(search.status) })`;
  }
  if (search?.send_time != null) {
    if (search.send_time[0] != null) {
      whereQuery += ` and t.send_time>=${ args.push(search.send_time[0]) }`;
    }
    if (search.send_time[1] != null) {
      whereQuery += ` and t.send_time<=${ args.push(search.send_time[1]) }`;
    }
  }
  if (search?.tag != null) {
    whereQuery += ` and t.tag=${ args.push(search.tag) }`;
  }
  if (isNotEmpty(search?.tag_like)) {
    whereQuery += ` and t.tag like ${ args.push("%" + sqlLike(search?.tag_like) + "%") }`;
  }
  if (search?.msg != null) {
    whereQuery += ` and t.msg=${ args.push(search.msg) }`;
  }
  if (isNotEmpty(search?.msg_like)) {
    whereQuery += ` and t.msg like ${ args.push("%" + sqlLike(search?.msg_like) + "%") }`;
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
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<SmsSendRecordSearch>,
  options?: {
  },
) {
  let fromQuery = `submail_sms_send_record t`;
  return fromQuery;
}

// MARK: findCountSmsSendRecord
/** 根据条件查找短信发送记录总数 */
export async function findCountSmsSendRecord(
  search?: Readonly<SmsSendRecordSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "findCountSmsSendRecord";
  
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
  // 短信应用
  if (search && search.sms_app_id != null) {
    const len = search.sms_app_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.sms_app_id.length > ${ ids_limit }`);
    }
  }
  // 状态
  if (search && search.status != null) {
    const len = search.status.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.status.length > ${ ids_limit }`);
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

// MARK: findAllSmsSendRecord
/** 根据搜索条件和分页查找短信发送记录列表 */
export async function findAllSmsSendRecord(
  search?: Readonly<SmsSendRecordSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
  const method = "findAllSmsSendRecord";
  
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
  // 短信应用
  if (search && search.sms_app_id != null) {
    const len = search.sms_app_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.sms_app_id.length > ${ ids_limit }`);
    }
  }
  // 状态
  if (search && search.status != null) {
    const len = search.status.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.status.length > ${ ids_limit }`);
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
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<SmsSendRecordModel>(
    sql,
    args,
    {
      debug: is_debug_sql,
    },
  );
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 发送时间
    if (model.send_time) {
      const send_time = dayjs(model.send_time);
      if (send_time.isValid()) {
        model.send_time = send_time.format("YYYY-MM-DDTHH:mm:ss");
        model.send_time_lbl = send_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.send_time_lbl = (model.send_time || "").toString();
      }
    } else {
      model.send_time_lbl = "";
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
  }
  
  return result;
}

// MARK: setIdByLblSmsSendRecord
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblSmsSendRecord(
  input: SmsSendRecordInput,
) {
  
  const options = {
    is_debug: false,
  };
  // 发送时间
  if (!input.send_time && input.send_time_lbl) {
    const send_time_lbl = dayjs(input.send_time_lbl);
    if (send_time_lbl.isValid()) {
      input.send_time = send_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldCommentsSmsSendRecord();
      throw `${ fieldComments.send_time } 日期格式错误`;
    }
  }
  if (input.send_time) {
    const send_time = dayjs(input.send_time);
    if (!send_time.isValid()) {
      const fieldComments = await getFieldCommentsSmsSendRecord();
      throw `${ fieldComments.send_time } 日期格式错误`;
    }
    input.send_time = dayjs(input.send_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    statusDict, // 状态
  ] = await getDict([
    "submail_sms_send_record_status",
  ]);
  
  // 短信应用
  if (isNotEmpty(input.sms_app_id_lbl) && input.sms_app_id == null) {
    input.sms_app_id_lbl = String(input.sms_app_id_lbl).trim();
    const sms_appModel = await findOneSmsApp(
      {
        lbl: input.sms_app_id_lbl,
      },
      undefined,
      options,
    );
    if (sms_appModel) {
      input.sms_app_id = sms_appModel.id;
    }
  } else if (isEmpty(input.sms_app_id_lbl) && input.sms_app_id != null) {
    const sms_app_model = await findOneSmsApp(
      {
        id: input.sms_app_id,
      },
      undefined,
      options,
    );
    if (sms_app_model) {
      input.sms_app_id_lbl = sms_app_model.lbl;
    }
  }
  
  // 状态
  if (isNotEmpty(input.status_lbl) && input.status == null) {
    const val = statusDict.find((itemTmp) => itemTmp.lbl === input.status_lbl)?.val;
    if (val != null) {
      input.status = val as SmsSendRecordStatus;
    }
  } else if (isEmpty(input.status_lbl) && input.status != null) {
    const lbl = statusDict.find((itemTmp) => itemTmp.val === input.status)?.lbl || "";
    input.status_lbl = lbl;
  }
  
  // 发送时间
  if (isNotEmpty(input.send_time_lbl) && input.send_time == null) {
    input.send_time_lbl = String(input.send_time_lbl).trim();
    input.send_time = input.send_time_lbl;
  }
}

// MARK: getFieldCommentsSmsSendRecord
/** 获取短信发送记录字段注释 */
export async function getFieldCommentsSmsSendRecord(): Promise<SmsSendRecordFieldComment> {
  const fieldComments: SmsSendRecordFieldComment = {
    id: "ID",
    sms_app_id: "短信应用",
    sms_app_id_lbl: "短信应用",
    send_to: "接收人",
    content: "内容",
    status: "状态",
    status_lbl: "状态",
    send_time: "发送时间",
    send_time_lbl: "发送时间",
    tag: "标签",
    msg: "消息",
    create_usr_id: "创建人",
    create_usr_id_lbl: "创建人",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
  };
  return fieldComments;
}

// MARK: findByUniqueSmsSendRecord
/** 通过唯一约束获得短信发送记录列表 */
export async function findByUniqueSmsSendRecord(
  search0: Readonly<SmsSendRecordInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
  const method = "findByUniqueSmsSendRecord";
  
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
    const model = await findOneSmsSendRecord(
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
  const models: SmsSendRecordModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueSmsSendRecord(
  oldModel: Readonly<SmsSendRecordModel>,
  input: Readonly<SmsSendRecordInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUniqueSmsSendRecord
/** 通过唯一约束检查 短信发送记录 是否已经存在 */
export async function checkByUniqueSmsSendRecord(
  input: Readonly<SmsSendRecordInput>,
  oldModel: Readonly<SmsSendRecordModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueSmsSendRecord(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 短信发送记录 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: SmsSendRecordId = await updateByIdSmsSendRecord(
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

// MARK: findOneSmsSendRecord
/** 根据条件查找第一短信发送记录 */
export async function findOneSmsSendRecord(
  search?: Readonly<SmsSendRecordSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel | undefined> {
  
  const table = "submail_sms_send_record";
  const method = "findOneSmsSendRecord";
  
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
  
  const sms_send_record_models = await findAllSmsSendRecord(
    search,
    page,
    sort,
    options,
  );
  
  const sms_send_record_model = sms_send_record_models[0];
  
  return sms_send_record_model;
}

// MARK: findOneOkSmsSendRecord
/** 根据条件查找第一短信发送记录, 如果不存在则抛错 */
export async function findOneOkSmsSendRecord(
  search?: Readonly<SmsSendRecordSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel> {
  
  const table = "submail_sms_send_record";
  const method = "findOneOkSmsSendRecord";
  
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
  
  const sms_send_record_models = await findAllSmsSendRecord(
    search,
    page,
    sort,
    options,
  );
  
  const sms_send_record_model = sms_send_record_models[0];
  
  if (!sms_send_record_model) {
    const err_msg = "此 短信发送记录 已被删除";
    throw new Error(err_msg);
  }
  
  return sms_send_record_model;
}

// MARK: findByIdSmsSendRecord
/** 根据 id 查找短信发送记录 */
export async function findByIdSmsSendRecord(
  id: SmsSendRecordId,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel | undefined> {
  
  const table = "submail_sms_send_record";
  const method = "findByIdSmsSendRecord";
  
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
  
  const sms_send_record_model = await findOneSmsSendRecord(
    {
      id,
    },
    undefined,
    options,
  );
  
  return sms_send_record_model;
}

// MARK: findByIdOkSmsSendRecord
/** 根据 id 查找短信发送记录, 如果不存在则抛错 */
export async function findByIdOkSmsSendRecord(
  id: SmsSendRecordId,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel> {
  
  const table = "submail_sms_send_record";
  const method = "findByIdOkSmsSendRecord";
  
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
  
  const sms_send_record_model = await findByIdSmsSendRecord(
    id,
    options,
  );
  
  if (!sms_send_record_model) {
    const err_msg = "此 短信发送记录 已被删除";
    throw new Error(err_msg);
  }
  
  return sms_send_record_model;
}

// MARK: findByIdsSmsSendRecord
/** 根据 ids 查找短信发送记录 */
export async function findByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
  const method = "findByIdsSmsSendRecord";
  
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
  
  const models = await findAllSmsSendRecord(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  return models;
}

// MARK: findByIdsOkSmsSendRecord
/** 根据 ids 查找短信发送记录, 出现查询不到的 id 则报错 */
export async function findByIdsOkSmsSendRecord(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
  const method = "findByIdsOkSmsSendRecord";
  
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
  
  const models = await findByIdsSmsSendRecord(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 短信发送记录 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 短信发送记录 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existSmsSendRecord
/** 根据搜索条件判断短信发送记录是否存在 */
export async function existSmsSendRecord(
  search?: Readonly<SmsSendRecordSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "submail_sms_send_record";
  const method = "existSmsSendRecord";
  
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
  const model = await findOneSmsSendRecord(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdSmsSendRecord
/** 根据id判断短信发送记录是否存在 */
export async function existByIdSmsSendRecord(
  id?: Readonly<SmsSendRecordId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "submail_sms_send_record";
  const method = "existByIdSmsSendRecord";
  
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
  const sql = `select 1 e from submail_sms_send_record t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOptionSmsSendRecord
/** 校验短信发送记录是否存在 */
export async function validateOptionSmsSendRecord(
  model?: SmsSendRecordModel,
) {
  if (!model) {
    const err_msg = "短信发送记录 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateSmsSendRecord
/** 短信发送记录增加和修改时校验输入 */
export async function validateSmsSendRecord(
  input: Readonly<SmsSendRecordInput>,
) {
  const fieldComments = await getFieldCommentsSmsSendRecord();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 短信应用
  await validators.chars_max_length(
    input.sms_app_id,
    22,
    fieldComments.sms_app_id,
  );
  
  // 接收人
  await validators.chars_max_length(
    input.send_to,
    20,
    fieldComments.send_to,
  );
  
  // 内容
  await validators.chars_max_length(
    input.content,
    1000,
    fieldComments.content,
  );
  
  // 标签
  await validators.chars_max_length(
    input.tag,
    45,
    fieldComments.tag,
  );
  
  // 消息
  await validators.chars_max_length(
    input.msg,
    1000,
    fieldComments.msg,
  );
  
  // 创建人
  await validators.chars_max_length(
    input.create_usr_id,
    22,
    fieldComments.create_usr_id,
  );
  
}

// MARK: createReturnSmsSendRecord
/** 创建 短信发送记录 并返回 */
export async function createReturnSmsSendRecord(
  input: Readonly<SmsSendRecordInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordModel> {
  
  const table = "submail_sms_send_record";
  const method = "createReturnSmsSendRecord";
  
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
  
  const model = await validateOptionSmsSendRecord(
    await findOneSmsSendRecord(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createSmsSendRecord
/** 创建 短信发送记录 */
export async function createSmsSendRecord(
  input: Readonly<SmsSendRecordInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordId> {
  
  const table = "submail_sms_send_record";
  const method = "createSmsSendRecord";
  
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

// MARK: createsReturnSmsSendRecord
/** 批量创建 短信发送记录 并返回 */
export async function createsReturnSmsSendRecord(
  inputs: SmsSendRecordInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
  const method = "createsReturnSmsSendRecord";
  
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
  
  const models = await findByIdsSmsSendRecord(ids, options);
  
  return models;
}

// MARK: createsSmsSendRecord
/** 批量创建 短信发送记录 */
export async function createsSmsSendRecord(
  inputs: SmsSendRecordInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordId[]> {
  
  const table = "submail_sms_send_record";
  const method = "createsSmsSendRecord";
  
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
  inputs: SmsSendRecordInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "submail_sms_send_record";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: SmsSendRecordId[] = [ ];
  const inputs2: SmsSendRecordInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueSmsSendRecord(input, options);
    if (oldModels.length > 0) {
      let id: SmsSendRecordId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueSmsSendRecord(
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
    
    const id = shortUuidV4<SmsSendRecordId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into submail_sms_send_record(id,create_time,tenant_id,create_usr_id,create_usr_id_lbl,sms_app_id_lbl,sms_app_id,send_to,content,status_lbl,status,send_time,tag,msg)values";
  
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
      if (input.sms_app_id_lbl != null) {
        sql += `,${ args.push(input.sms_app_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.sms_app_id != null) {
        sql += `,${ args.push(input.sms_app_id) }`;
      } else {
        sql += ",default";
      }
      if (input.send_to != null) {
        sql += `,${ args.push(input.send_to) }`;
      } else {
        sql += ",default";
      }
      if (input.content != null) {
        sql += `,${ args.push(input.content) }`;
      } else {
        sql += ",default";
      }
      if (input.status_lbl != null) {
        sql += `,${ args.push(input.status_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.status != null) {
        sql += `,${ args.push(input.status) }`;
      } else {
        sql += ",default";
      }
      if (input.send_time != null || input.send_time_save_null) {
        sql += `,${ args.push(input.send_time) }`;
      } else {
        sql += ",default";
      }
      if (input.tag != null) {
        sql += `,${ args.push(input.tag) }`;
      } else {
        sql += ",default";
      }
      if (input.msg != null) {
        sql += `,${ args.push(input.msg) }`;
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

// MARK: updateTenantByIdSmsSendRecord
/** 短信发送记录 根据 id 修改 租户id */
export async function updateTenantByIdSmsSendRecord(
  id: SmsSendRecordId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "updateTenantByIdSmsSendRecord";
  
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
  const sql = `update submail_sms_send_record set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  return affectedRows;
}

// MARK: updateByIdSmsSendRecord
/** 根据 id 修改 短信发送记录 */
export async function updateByIdSmsSendRecord(
  id: SmsSendRecordId,
  input: SmsSendRecordInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<SmsSendRecordId> {
  
  const table = "submail_sms_send_record";
  const method = "updateByIdSmsSendRecord";
  
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
    throw new Error("updateByIdSmsSendRecord: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdSmsSendRecord: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdSmsSendRecord(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueSmsSendRecord(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 短信发送记录 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdSmsSendRecord(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 短信发送记录 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update submail_sms_send_record set `;
  let updateFldNum = 0;
  if (isNotEmpty(input.sms_app_id_lbl)) {
    sql += `sms_app_id_lbl=?,`;
    args.push(input.sms_app_id_lbl);
    updateFldNum++;
  }
  if (input.sms_app_id != null) {
    if (input.sms_app_id != oldModel.sms_app_id) {
      sql += `sms_app_id=${ args.push(input.sms_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.send_to != null) {
    if (input.send_to != oldModel.send_to) {
      sql += `send_to=${ args.push(input.send_to) },`;
      updateFldNum++;
    }
  }
  if (input.content != null) {
    if (input.content != oldModel.content) {
      sql += `content=${ args.push(input.content) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.status_lbl)) {
    sql += `status_lbl=?,`;
    args.push(input.status_lbl);
    updateFldNum++;
  }
  if (input.status != null) {
    if (input.status != oldModel.status) {
      sql += `status=${ args.push(input.status) },`;
      updateFldNum++;
    }
  }
  if (input.send_time != null || input.send_time_save_null) {
    if (input.send_time != oldModel.send_time) {
      sql += `send_time=${ args.push(input.send_time) },`;
      updateFldNum++;
    }
  }
  if (input.tag != null) {
    if (input.tag != oldModel.tag) {
      sql += `tag=${ args.push(input.tag) },`;
      updateFldNum++;
    }
  }
  if (input.msg != null) {
    if (input.msg != oldModel.msg) {
      sql += `msg=${ args.push(input.msg) },`;
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

// MARK: deleteByIdsSmsSendRecord
/** 根据 ids 删除 短信发送记录 */
export async function deleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "deleteByIdsSmsSendRecord";
  
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
    const oldModel = await findByIdSmsSendRecord(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update submail_sms_send_record set is_deleted=1`;
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

// MARK: revertByIdsSmsSendRecord
/** 根据 ids 还原 短信发送记录 */
export async function revertByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "revertByIdsSmsSendRecord";
  
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
    let old_model = await findOneSmsSendRecord(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdSmsSendRecord(
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
      } as SmsSendRecordInput;
      const models = await findByUniqueSmsSendRecord(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 短信发送记录 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update submail_sms_send_record set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIdsSmsSendRecord
/** 根据 ids 彻底删除 短信发送记录 */
export async function forceDeleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "forceDeleteByIdsSmsSendRecord";
  
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
    const oldModel = await findOneSmsSendRecord(
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
    const sql = `delete from submail_sms_send_record where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
