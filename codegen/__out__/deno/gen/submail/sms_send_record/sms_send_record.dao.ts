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
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";

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
  existById as existByIdTenant,
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
  findOne as findOneSmsApp,
} from "/gen/submail/sms_app/sms_app.dao.ts";

import {
  findById as findByIdUsr,
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
  if (search?.to != null) {
    whereQuery += ` and t.to=${ args.push(search.to) }`;
  }
  if (isNotEmpty(search?.to_like)) {
    whereQuery += ` and t.to like ${ args.push("%" + sqlLike(search?.to_like) + "%") }`;
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

// MARK: findCount
/** 根据条件查找短信发送记录总数 */
export async function findCount(
  search?: Readonly<SmsSendRecordSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
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
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAll
/** 根据搜索条件和分页查找短信发送记录列表 */
export async function findAll(
  search?: Readonly<SmsSendRecordSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
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
      if (isNaN(send_time.toDate().getTime())) {
        model.send_time_lbl = (model.send_time || "").toString();
      } else {
        model.send_time_lbl = send_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.send_time_lbl = "";
    }
    
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
  }
  
  return result;
}

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
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
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.send_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.send_time) {
    const send_time = dayjs(input.send_time);
    if (!send_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.send_time } ${ await ns("日期格式错误") }`;
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

// MARK: getFieldComments
/** 获取短信发送记录字段注释 */
export async function getFieldComments(): Promise<SmsSendRecordFieldComment> {
  const n = initN(route_path);
  const fieldComments: SmsSendRecordFieldComment = {
    id: await n("ID"),
    sms_app_id: await n("短信应用"),
    sms_app_id_lbl: await n("短信应用"),
    to: await n("接收人"),
    content: await n("内容"),
    status: await n("状态"),
    status_lbl: await n("状态"),
    send_time: await n("发送时间"),
    send_time_lbl: await n("发送时间"),
    tag: await n("标签"),
    msg: await n("消息"),
    create_usr_id: await n("创建人"),
    create_usr_id_lbl: await n("创建人"),
    create_time: await n("创建时间"),
    create_time_lbl: await n("创建时间"),
  };
  return fieldComments;
}

// MARK: findByUnique
/** 通过唯一约束获得短信发送记录列表 */
export async function findByUnique(
  search0: Readonly<SmsSendRecordInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
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
  const models: SmsSendRecordModel[] = [ ];
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUnique(
  oldModel: Readonly<SmsSendRecordModel>,
  input: Readonly<SmsSendRecordInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

// MARK: checkByUnique
/** 通过唯一约束检查 短信发送记录 是否已经存在 */
export async function checkByUnique(
  input: Readonly<SmsSendRecordInput>,
  oldModel: Readonly<SmsSendRecordModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("短信发送记录")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: SmsSendRecordId = await updateById(
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
/** 根据条件查找第一短信发送记录 */
export async function findOne(
  search?: Readonly<SmsSendRecordSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel | undefined> {
  
  const table = "submail_sms_send_record";
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
/** 根据 id 查找短信发送记录 */
export async function findById(
  id?: SmsSendRecordId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel | undefined> {
  
  const table = "submail_sms_send_record";
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
/** 根据 ids 查找短信发送记录 */
export async function findByIds(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<SmsSendRecordModel[]> {
  
  const table = "submail_sms_send_record";
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
/** 根据搜索条件判断短信发送记录是否存在 */
export async function exist(
  search?: Readonly<SmsSendRecordSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "submail_sms_send_record";
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
/** 根据id判断短信发送记录是否存在 */
export async function existById(
  id?: Readonly<SmsSendRecordId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "submail_sms_send_record";
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

// MARK: validateOption
/** 校验短信发送记录是否存在 */
export async function validateOption(
  model?: SmsSendRecordModel,
) {
  if (!model) {
    const err_msg = `${ await ns("短信发送记录") } ${ await ns("不存在") }`;
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 短信发送记录增加和修改时校验输入 */
export async function validate(
  input: Readonly<SmsSendRecordInput>,
) {
  const fieldComments = await getFieldComments();
  
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
    input.to,
    20,
    fieldComments.to,
  );
  
  // 内容
  await validators.chars_max_length(
    input.content,
    1000,
    fieldComments.content,
  );
  
  // 状态
  await validators.chars_max_length(
    input.status,
    10,
    fieldComments.status,
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

// MARK: create
/** 创建 短信发送记录 */
export async function create(
  input: Readonly<SmsSendRecordInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordId> {
  
  const table = "submail_sms_send_record";
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

// MARK: creates
/** 批量创建 短信发送记录 */
export async function creates(
  inputs: SmsSendRecordInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<SmsSendRecordId[]> {
  
  const table = "submail_sms_send_record";
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
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: SmsSendRecordId | undefined = undefined;
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
    
    const id = shortUuidV4<SmsSendRecordId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const args = new QueryArgs();
  let sql = "insert into submail_sms_send_record(id,create_time,tenant_id,create_usr_id,create_usr_id_lbl,sms_app_id_lbl,sms_app_id,to,content,status_lbl,status,send_time,tag,msg)values";
  
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
      if (input.to != null) {
        sql += `,${ args.push(input.to) }`;
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

// MARK: updateTenantById
/** 短信发送记录 根据 id 修改 租户id */
export async function updateTenantById(
  id: SmsSendRecordId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "updateTenantById";
  
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

// MARK: updateById
/** 根据 id 修改 短信发送记录 */
export async function updateById(
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
  const method = "updateById";
  
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
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id, options);
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
        throw await ns("此 {0} 已经存在", await ns("短信发送记录"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("短信发送记录"));
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
  if (input.to != null) {
    if (input.to != oldModel.to) {
      sql += `to=${ args.push(input.to) },`;
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
    log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 短信发送记录 */
export async function deleteByIds(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "deleteByIds";
  
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
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
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

// MARK: revertByIds
/** 根据 ids 还原 短信发送记录 */
export async function revertByIds(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "revertByIds";
  
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
    let old_model = await findOne(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findById(
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
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw await ns("此 {0} 已经存在", await ns("短信发送记录"));
      }
    }
    const args = new QueryArgs();
    const sql = `update submail_sms_send_record set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 短信发送记录 */
export async function forceDeleteByIds(
  ids: SmsSendRecordId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "submail_sms_send_record";
  const method = "forceDeleteByIds";
  
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
    const oldModel = await findOne(
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
