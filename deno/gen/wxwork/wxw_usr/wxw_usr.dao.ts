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

import {
  findById as findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  route_path,
} from "./wxw_usr.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxwUsrSearch>,
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
  if (search?.corpid != null) {
    whereQuery += ` and t.corpid=${ args.push(search.corpid) }`;
  }
  if (isNotEmpty(search?.corpid_like)) {
    whereQuery += ` and t.corpid like ${ args.push("%" + sqlLike(search?.corpid_like) + "%") }`;
  }
  if (search?.agentid != null) {
    whereQuery += ` and t.agentid=${ args.push(search.agentid) }`;
  }
  if (isNotEmpty(search?.agentid_like)) {
    whereQuery += ` and t.agentid like ${ args.push("%" + sqlLike(search?.agentid_like) + "%") }`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.userid != null) {
    whereQuery += ` and t.userid=${ args.push(search.userid) }`;
  }
  if (isNotEmpty(search?.userid_like)) {
    whereQuery += ` and t.userid like ${ args.push("%" + sqlLike(search?.userid_like) + "%") }`;
  }
  if (search?.mobile != null) {
    whereQuery += ` and t.mobile=${ args.push(search.mobile) }`;
  }
  if (isNotEmpty(search?.mobile_like)) {
    whereQuery += ` and t.mobile like ${ args.push("%" + sqlLike(search?.mobile_like) + "%") }`;
  }
  if (search?.gender != null) {
    whereQuery += ` and t.gender=${ args.push(search.gender) }`;
  }
  if (isNotEmpty(search?.gender_like)) {
    whereQuery += ` and t.gender like ${ args.push("%" + sqlLike(search?.gender_like) + "%") }`;
  }
  if (search?.email != null) {
    whereQuery += ` and t.email=${ args.push(search.email) }`;
  }
  if (isNotEmpty(search?.email_like)) {
    whereQuery += ` and t.email like ${ args.push("%" + sqlLike(search?.email_like) + "%") }`;
  }
  if (search?.biz_email != null) {
    whereQuery += ` and t.biz_email=${ args.push(search.biz_email) }`;
  }
  if (isNotEmpty(search?.biz_email_like)) {
    whereQuery += ` and t.biz_email like ${ args.push("%" + sqlLike(search?.biz_email_like) + "%") }`;
  }
  if (search?.direct_leader != null) {
    whereQuery += ` and t.direct_leader=${ args.push(search.direct_leader) }`;
  }
  if (isNotEmpty(search?.direct_leader_like)) {
    whereQuery += ` and t.direct_leader like ${ args.push("%" + sqlLike(search?.direct_leader_like) + "%") }`;
  }
  if (search?.position != null) {
    whereQuery += ` and t.position=${ args.push(search.position) }`;
  }
  if (isNotEmpty(search?.position_like)) {
    whereQuery += ` and t.position like ${ args.push("%" + sqlLike(search?.position_like) + "%") }`;
  }
  if (search?.avatar != null) {
    whereQuery += ` and t.avatar=${ args.push(search.avatar) }`;
  }
  if (isNotEmpty(search?.avatar_like)) {
    whereQuery += ` and t.avatar like ${ args.push("%" + sqlLike(search?.avatar_like) + "%") }`;
  }
  if (search?.thumb_avatar != null) {
    whereQuery += ` and t.thumb_avatar=${ args.push(search.thumb_avatar) }`;
  }
  if (isNotEmpty(search?.thumb_avatar_like)) {
    whereQuery += ` and t.thumb_avatar like ${ args.push("%" + sqlLike(search?.thumb_avatar_like) + "%") }`;
  }
  if (search?.qr_code != null) {
    whereQuery += ` and t.qr_code=${ args.push(search.qr_code) }`;
  }
  if (isNotEmpty(search?.qr_code_like)) {
    whereQuery += ` and t.qr_code like ${ args.push("%" + sqlLike(search?.qr_code_like) + "%") }`;
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
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
  search?: Readonly<WxwUsrSearch>,
  options?: {
  },
) {
  let fromQuery = `wxwork_wxw_usr t
  left join wxwork_wxw_app wxw_app_id_lbl on wxw_app_id_lbl.id=t.wxw_app_id`;
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找企微用户总数 */
export async function findCount(
  search?: Readonly<WxwUsrSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_usr";
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
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAll
/** 根据搜索条件和分页查找企微用户列表 */
export async function findAll(
  search?: Readonly<WxwUsrSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxwUsrModel[]> {
  
  const table = "wxwork_wxw_usr";
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
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxwUsrModel>(
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
    
    // 企微应用
    model.wxw_app_id_lbl = model.wxw_app_id_lbl || "";
    
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

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwUsrInput,
) {
  
  const options = {
    is_debug: false,
  };
  
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
}

// MARK: getFieldComments
/** 获取企微用户字段注释 */
export async function getFieldComments(): Promise<WxwUsrFieldComment> {
  const fieldComments: WxwUsrFieldComment = {
    id: "ID",
    wxw_app_id: "企微应用",
    wxw_app_id_lbl: "企微应用",
    lbl: "姓名",
    userid: "用户ID",
    rem: "备注",
  };
  return fieldComments;
}

// MARK: findByUnique
/** 通过唯一约束获得企微用户列表 */
export async function findByUnique(
  search0: Readonly<WxwUsrInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwUsrModel[]> {
  
  const table = "wxwork_wxw_usr";
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
  const models: WxwUsrModel[] = [ ];
  {
    if (search0.corpid == null) {
      return [ ];
    }
    const corpid = search0.corpid;
    if (search0.userid == null) {
      return [ ];
    }
    const userid = search0.userid;
    const modelTmps = await findAll(
      {
        corpid,
        userid,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  {
    if (search0.corpid == null) {
      return [ ];
    }
    const corpid = search0.corpid;
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll(
      {
        corpid,
        lbl,
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
export function equalsByUnique(
  oldModel: Readonly<WxwUsrModel>,
  input: Readonly<WxwUsrInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.corpid === input.corpid &&
    oldModel.userid === input.userid
  ) {
    return true;
  }
  if (
    oldModel.corpid === input.corpid &&
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUnique
/** 通过唯一约束检查 企微用户 是否已经存在 */
export async function checkByUnique(
  input: Readonly<WxwUsrInput>,
  oldModel: Readonly<WxwUsrModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwUsrId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 企微用户 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwUsrId = await updateById(
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
/** 根据条件查找第一企微用户 */
export async function findOne(
  search?: Readonly<WxwUsrSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwUsrModel | undefined> {
  
  const table = "wxwork_wxw_usr";
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
/** 根据 id 查找企微用户 */
export async function findById(
  id?: WxwUsrId | null,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwUsrModel | undefined> {
  
  const table = "wxwork_wxw_usr";
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
/** 根据 ids 查找企微用户 */
export async function findByIds(
  ids: WxwUsrId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxwUsrModel[]> {
  
  const table = "wxwork_wxw_usr";
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
    const err_msg = "此 企微用户 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 企微用户 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: exist
/** 根据搜索条件判断企微用户是否存在 */
export async function exist(
  search?: Readonly<WxwUsrSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wxwork_wxw_usr";
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
/** 根据id判断企微用户是否存在 */
export async function existById(
  id?: Readonly<WxwUsrId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wxwork_wxw_usr";
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
  const sql = `select 1 e from wxwork_wxw_usr t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
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

// MARK: validateOption
/** 校验企微用户是否存在 */
export async function validateOption(
  model?: WxwUsrModel,
) {
  if (!model) {
    const err_msg = "企微用户 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** 企微用户增加和修改时校验输入 */
export async function validate(
  input: Readonly<WxwUsrInput>,
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
  
  // 姓名
  await validators.chars_max_length(
    input.lbl,
    44,
    fieldComments.lbl,
  );
  
  // 用户ID
  await validators.chars_max_length(
    input.userid,
    64,
    fieldComments.userid,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

// MARK: createReturn
/** 创建 企微用户 并返回 */
export async function createReturn(
  input: Readonly<WxwUsrInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwUsrModel> {
  
  const table = "wxwork_wxw_usr";
  const method = "createReturn";
  
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
  
  const model = await validateOption(
    await findOne(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: create
/** 创建 企微用户 */
export async function create(
  input: Readonly<WxwUsrInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwUsrId> {
  
  const table = "wxwork_wxw_usr";
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

// MARK: createsReturn
/** 批量创建 企微用户 并返回 */
export async function createsReturn(
  inputs: WxwUsrInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwUsrModel[]> {
  
  const table = "wxwork_wxw_usr";
  const method = "createsReturn";
  
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
  
  const models = await findByIds(ids, options);
  
  return models;
}

// MARK: creates
/** 批量创建 企微用户 */
export async function creates(
  inputs: WxwUsrInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwUsrId[]> {
  
  const table = "wxwork_wxw_usr";
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
  inputs: WxwUsrInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxwUsrId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wxwork_wxw_usr";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxwUsrId[] = [ ];
  const inputs2: WxwUsrInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: WxwUsrId | undefined = undefined;
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
    
    const id = shortUuidV4<WxwUsrId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCache();
  
  const args = new QueryArgs();
  let sql = "insert into wxwork_wxw_usr(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,wxw_app_id,corpid,agentid,lbl,userid,mobile,gender,email,biz_email,direct_leader,position,avatar,thumb_avatar,qr_code,rem)values";
  
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
      if (input.corpid != null) {
        sql += `,${ args.push(input.corpid) }`;
      } else {
        sql += ",default";
      }
      if (input.agentid != null) {
        sql += `,${ args.push(input.agentid) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.userid != null) {
        sql += `,${ args.push(input.userid) }`;
      } else {
        sql += ",default";
      }
      if (input.mobile != null) {
        sql += `,${ args.push(input.mobile) }`;
      } else {
        sql += ",default";
      }
      if (input.gender != null) {
        sql += `,${ args.push(input.gender) }`;
      } else {
        sql += ",default";
      }
      if (input.email != null) {
        sql += `,${ args.push(input.email) }`;
      } else {
        sql += ",default";
      }
      if (input.biz_email != null) {
        sql += `,${ args.push(input.biz_email) }`;
      } else {
        sql += ",default";
      }
      if (input.direct_leader != null) {
        sql += `,${ args.push(input.direct_leader) }`;
      } else {
        sql += ",default";
      }
      if (input.position != null) {
        sql += `,${ args.push(input.position) }`;
      } else {
        sql += ",default";
      }
      if (input.avatar != null) {
        sql += `,${ args.push(input.avatar) }`;
      } else {
        sql += ",default";
      }
      if (input.thumb_avatar != null) {
        sql += `,${ args.push(input.thumb_avatar) }`;
      } else {
        sql += ",default";
      }
      if (input.qr_code != null) {
        sql += `,${ args.push(input.qr_code) }`;
      } else {
        sql += ",default";
      }
      if (input.rem != null) {
        sql += `,${ args.push(input.rem) }`;
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
  
  await delCache();
  
  return ids2;
}

// MARK: delCache
/** 删除缓存 */
export async function delCache() {
  await delCacheCtx(`dao.sql.wxwork_wxw_usr`);
}

// MARK: updateTenantById
/** 企微用户 根据 id 修改 租户id */
export async function updateTenantById(
  id: WxwUsrId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_usr";
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
  const sql = `update wxwork_wxw_usr set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  await delCache();
  return affectedRows;
}

// MARK: updateById
/** 根据 id 修改 企微用户 */
export async function updateById(
  id: WxwUsrId,
  input: WxwUsrInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxwUsrId> {
  
  const table = "wxwork_wxw_usr";
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
        throw "此 企微用户 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 企微用户 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wxwork_wxw_usr set `;
  let updateFldNum = 0;
  if (input.wxw_app_id != null) {
    if (input.wxw_app_id != oldModel.wxw_app_id) {
      sql += `wxw_app_id=${ args.push(input.wxw_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.corpid != null) {
    if (input.corpid != oldModel.corpid) {
      sql += `corpid=${ args.push(input.corpid) },`;
      updateFldNum++;
    }
  }
  if (input.agentid != null) {
    if (input.agentid != oldModel.agentid) {
      sql += `agentid=${ args.push(input.agentid) },`;
      updateFldNum++;
    }
  }
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.userid != null) {
    if (input.userid != oldModel.userid) {
      sql += `userid=${ args.push(input.userid) },`;
      updateFldNum++;
    }
  }
  if (input.mobile != null) {
    if (input.mobile != oldModel.mobile) {
      sql += `mobile=${ args.push(input.mobile) },`;
      updateFldNum++;
    }
  }
  if (input.gender != null) {
    if (input.gender != oldModel.gender) {
      sql += `gender=${ args.push(input.gender) },`;
      updateFldNum++;
    }
  }
  if (input.email != null) {
    if (input.email != oldModel.email) {
      sql += `email=${ args.push(input.email) },`;
      updateFldNum++;
    }
  }
  if (input.biz_email != null) {
    if (input.biz_email != oldModel.biz_email) {
      sql += `biz_email=${ args.push(input.biz_email) },`;
      updateFldNum++;
    }
  }
  if (input.direct_leader != null) {
    if (input.direct_leader != oldModel.direct_leader) {
      sql += `direct_leader=${ args.push(input.direct_leader) },`;
      updateFldNum++;
    }
  }
  if (input.position != null) {
    if (input.position != oldModel.position) {
      sql += `position=${ args.push(input.position) },`;
      updateFldNum++;
    }
  }
  if (input.avatar != null) {
    if (input.avatar != oldModel.avatar) {
      sql += `avatar=${ args.push(input.avatar) },`;
      updateFldNum++;
    }
  }
  if (input.thumb_avatar != null) {
    if (input.thumb_avatar != oldModel.thumb_avatar) {
      sql += `thumb_avatar=${ args.push(input.thumb_avatar) },`;
      updateFldNum++;
    }
  }
  if (input.qr_code != null) {
    if (input.qr_code != oldModel.qr_code) {
      sql += `qr_code=${ args.push(input.qr_code) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
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
  if (input.create_time != null) {
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
    
    await delCache();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 企微用户 */
export async function deleteByIds(
  ids: WxwUsrId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_usr";
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
  
  await delCache();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wxwork_wxw_usr set is_deleted=1`;
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
  
  await delCache();
  
  return affectedRows;
}

// MARK: revertByIds
/** 根据 ids 还原 企微用户 */
export async function revertByIds(
  ids: WxwUsrId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_usr";
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
  
  await delCache();
  
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
      } as WxwUsrInput;
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 企微用户 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wxwork_wxw_usr set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 企微用户 */
export async function forceDeleteByIds(
  ids: WxwUsrId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wxwork_wxw_usr";
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
  
  await delCache();
  
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
    const sql = `delete from wxwork_wxw_usr where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
